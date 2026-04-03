"""
Abstract storage interface for memory operations.

All implementations enforce access control at the storage layer.
The RAG pipeline and services MUST go through this interface --
they cannot bypass access filtering.
"""
import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from app.models.base import ContentType, Namespace
from app.models.memory import MemoryUnit


class AccessFilter:
    """Resolved identity context used to scope every storage operation."""

    def __init__(
        self,
        org_id: uuid.UUID,
        user_id: uuid.UUID,
        team_id: uuid.UUID | None = None,
        allowed_namespaces: list[Namespace] | None = None,
        access_tags: list[str] | None = None,
    ):
        self.org_id = org_id
        self.user_id = user_id
        self.team_id = team_id
        self.allowed_namespaces = allowed_namespaces or list(Namespace)
        self.access_tags = access_tags or []


class MemoryStore(ABC):

    @abstractmethod
    async def upsert(self, memory: MemoryUnit) -> None:
        """Insert or update a memory unit (dedup by source_tool_id + org_id)."""

    @abstractmethod
    async def search(
        self,
        access: AccessFilter,
        query_embedding: list[float],
        top_k: int = 10,
        content_types: list[ContentType] | None = None,
    ) -> list[tuple[MemoryUnit, float]]:
        """
        Vector similarity search within allowed namespaces.
        Returns (memory, similarity_score) pairs ordered by relevance.
        Access control is enforced by RLS / storage-level filters.
        """

    @abstractmethod
    async def update_usage(self, memory_ids: list[uuid.UUID]) -> None:
        """Bump ref_count and last_accessed_at for retrieved memories."""

    @abstractmethod
    async def list_recent(
        self,
        org_id: uuid.UUID,
        since: datetime,
        namespace: Namespace | None = None,
    ) -> list[MemoryUnit]:
        """List memories created since a timestamp (for lifecycle engine)."""

    @abstractmethod
    async def delete_expired(self, org_id: uuid.UUID) -> int:
        """Remove memories past their TTL. Returns count deleted."""

    @abstractmethod
    async def count_unique_owners(
        self,
        org_id: uuid.UUID,
        similar_to: list[float],
        threshold: float = 0.7,
        team_id: uuid.UUID | None = None,
    ) -> tuple[int, int, float]:
        """
        For a given embedding, find similar memories and return:
        (unique_owner_count, unique_team_count, avg_similarity)
        Used by the promotion engine.
        """
