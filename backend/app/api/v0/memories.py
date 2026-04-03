"""Memory CRUD endpoints for inspection and debugging."""
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_access_filter, get_current_user, get_memory_store
from app.db.rls import set_rls_context
from app.db.session import get_db
from app.models.base import Namespace
from app.models.memory import MemoryUnit
from app.models.user import User
from app.schemas.memory import MemoryListResponse, MemoryUnitResponse
from app.storage.interface import AccessFilter
from app.storage.pgvector_store import PgVectorMemoryStore

router = APIRouter(prefix="/memories", tags=["memories"])


@router.get("", response_model=MemoryListResponse)
async def list_memories(
    user: User = Depends(get_current_user),
    access: AccessFilter = Depends(get_access_filter),
    db: AsyncSession = Depends(get_db),
    namespace: Namespace | None = None,
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    await set_rls_context(
        db,
        org_id=access.org_id,
        user_id=access.user_id,
        team_id=access.team_id,
        access_tags=access.access_tags,
    )

    stmt = select(MemoryUnit)
    if namespace:
        stmt = stmt.where(MemoryUnit.namespace == namespace)
    stmt = stmt.order_by(MemoryUnit.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(stmt)
    memories = result.scalars().all()

    count_stmt = select(func.count()).select_from(MemoryUnit)
    if namespace:
        count_stmt = count_stmt.where(MemoryUnit.namespace == namespace)
    total = await db.scalar(count_stmt)

    return MemoryListResponse(
        memories=[MemoryUnitResponse.model_validate(m) for m in memories],
        total=total or 0,
    )


@router.get("/stats")
async def memory_stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Namespace-level counts for the dashboard."""
    result = await db.execute(
        select(
            MemoryUnit.namespace,
            func.count().label("count"),
        )
        .where(MemoryUnit.org_id == user.org_id)
        .group_by(MemoryUnit.namespace)
    )
    counts = {row.namespace.value: row.count for row in result.all()}
    return {
        "individual": counts.get("INDIVIDUAL", 0),
        "team": counts.get("TEAM", 0),
        "company": counts.get("COMPANY", 0),
        "total": sum(counts.values()),
    }


@router.get("/{memory_id}", response_model=MemoryUnitResponse)
async def get_memory(
    memory_id: uuid.UUID,
    user: User = Depends(get_current_user),
    access: AccessFilter = Depends(get_access_filter),
    db: AsyncSession = Depends(get_db),
):
    await set_rls_context(
        db,
        org_id=access.org_id,
        user_id=access.user_id,
        team_id=access.team_id,
        access_tags=access.access_tags,
    )

    result = await db.execute(
        select(MemoryUnit).where(MemoryUnit.memory_id == memory_id)
    )
    memory = result.scalar_one_or_none()
    if not memory:
        from app.core.exceptions import NotFoundError
        raise NotFoundError("Memory not found or access denied")

    return MemoryUnitResponse.model_validate(memory)
