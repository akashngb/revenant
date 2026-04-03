import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    Enum as PgEnum,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.config import settings
from app.models.base import Base, Namespace, SourceTool, ContentType


class MemoryUnit(Base):
    __tablename__ = "memory_units"
    __table_args__ = (
        Index("ix_memory_org_ns_team", "org_id", "namespace", "team_id"),
        Index("ix_memory_source_dedup", "org_id", "source_tool_id", unique=True),
        Index("ix_memory_created", "org_id", "created_at"),
    )

    memory_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.org_id", ondelete="CASCADE"))
    owner_user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.user_id", ondelete="SET NULL")
    )
    team_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("teams.team_id", ondelete="SET NULL")
    )

    namespace: Mapped[Namespace] = mapped_column(
        PgEnum(Namespace, name="memory_namespace", create_constraint=False),
        default=Namespace.INDIVIDUAL,
    )
    source_tool: Mapped[SourceTool] = mapped_column(
        PgEnum(SourceTool, name="source_tool", create_constraint=False),
    )
    source_tool_id: Mapped[str] = mapped_column(String(512))
    content_text: Mapped[str] = mapped_column(Text)
    content_type: Mapped[ContentType] = mapped_column(
        PgEnum(ContentType, name="content_type", create_constraint=False),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    last_accessed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    relevance_score: Mapped[float] = mapped_column(Float, default=1.0)
    ref_count: Mapped[int] = mapped_column(Integer, default=0)
    similarity_cluster_id: Mapped[uuid.UUID | None] = mapped_column()
    access_tags: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    ttl: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(settings.embedding_dimensions)
    )
