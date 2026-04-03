import uuid
from datetime import datetime, timezone

from sqlalchemy import and_, delete, func, select, text, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.rls import set_rls_context
from app.models.base import ContentType, Namespace
from app.models.memory import MemoryUnit
from app.storage.interface import AccessFilter, MemoryStore


class PgVectorMemoryStore(MemoryStore):
    """
    PostgreSQL + pgvector implementation.

    Access control is enforced in two layers:
      1. SET LOCAL GUC variables per transaction (app.org_id, etc.)
      2. RLS policies on memory_units filter rows the session can't see

    Even if application code has a bug, the DB will not return unauthorized rows.
    """

    def __init__(self, session: AsyncSession):
        self._session = session

    async def _set_context(self, access: AccessFilter) -> None:
        await set_rls_context(
            self._session,
            org_id=access.org_id,
            user_id=access.user_id,
            team_id=access.team_id,
            access_tags=access.access_tags,
        )

    async def upsert(self, memory: MemoryUnit) -> None:
        stmt = pg_insert(MemoryUnit).values(
            memory_id=memory.memory_id,
            org_id=memory.org_id,
            owner_user_id=memory.owner_user_id,
            team_id=memory.team_id,
            namespace=memory.namespace,
            source_tool=memory.source_tool,
            source_tool_id=memory.source_tool_id,
            content_text=memory.content_text,
            content_type=memory.content_type,
            relevance_score=memory.relevance_score,
            ref_count=memory.ref_count,
            access_tags=memory.access_tags,
            ttl=memory.ttl,
            embedding=memory.embedding,
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=["org_id", "source_tool_id"],
            set_={
                "content_text": stmt.excluded.content_text,
                "embedding": stmt.excluded.embedding,
                "relevance_score": stmt.excluded.relevance_score,
            },
        )
        await self._session.execute(stmt)

    async def search(
        self,
        access: AccessFilter,
        query_embedding: list[float],
        top_k: int = 10,
        content_types: list[ContentType] | None = None,
    ) -> list[tuple[MemoryUnit, float]]:
        await self._set_context(access)

        distance = MemoryUnit.embedding.cosine_distance(query_embedding).label("distance")

        stmt = (
            select(MemoryUnit, distance)
            .where(MemoryUnit.embedding.isnot(None))
        )

        if content_types:
            stmt = stmt.where(MemoryUnit.content_type.in_(content_types))

        stmt = stmt.order_by(distance).limit(top_k)

        result = await self._session.execute(stmt)
        rows = result.all()

        return [(row[0], 1.0 - row[1]) for row in rows]

    async def update_usage(self, memory_ids: list[uuid.UUID]) -> None:
        if not memory_ids:
            return
        stmt = (
            update(MemoryUnit)
            .where(MemoryUnit.memory_id.in_(memory_ids))
            .values(
                ref_count=MemoryUnit.ref_count + 1,
                last_accessed_at=func.now(),
            )
        )
        await self._session.execute(stmt)

    async def list_recent(
        self,
        org_id: uuid.UUID,
        since: datetime,
        namespace: Namespace | None = None,
    ) -> list[MemoryUnit]:
        stmt = (
            select(MemoryUnit)
            .where(
                MemoryUnit.org_id == org_id,
                MemoryUnit.created_at >= since,
            )
        )
        if namespace:
            stmt = stmt.where(MemoryUnit.namespace == namespace)

        stmt = stmt.order_by(MemoryUnit.created_at.desc())
        result = await self._session.execute(stmt)
        return list(result.scalars().all())

    async def delete_expired(self, org_id: uuid.UUID) -> int:
        now = datetime.now(timezone.utc)
        stmt = (
            delete(MemoryUnit)
            .where(
                MemoryUnit.org_id == org_id,
                MemoryUnit.ttl.isnot(None),
                MemoryUnit.ttl < now,
            )
            .returning(MemoryUnit.memory_id)
        )
        result = await self._session.execute(stmt)
        return len(result.all())

    async def count_unique_owners(
        self,
        org_id: uuid.UUID,
        similar_to: list[float],
        threshold: float = 0.7,
        team_id: uuid.UUID | None = None,
    ) -> tuple[int, int, float]:
        distance = MemoryUnit.embedding.cosine_distance(similar_to).label("distance")

        stmt = (
            select(
                func.count(func.distinct(MemoryUnit.owner_user_id)).label("unique_owners"),
                func.count(func.distinct(MemoryUnit.team_id)).label("unique_teams"),
                func.avg(1.0 - distance).label("avg_similarity"),
            )
            .where(
                MemoryUnit.org_id == org_id,
                MemoryUnit.embedding.isnot(None),
                distance <= (1.0 - threshold),
            )
        )

        if team_id:
            stmt = stmt.where(MemoryUnit.team_id == team_id)

        result = await self._session.execute(stmt)
        row = result.one()
        return (
            row.unique_owners or 0,
            row.unique_teams or 0,
            float(row.avg_similarity or 0.0),
        )
