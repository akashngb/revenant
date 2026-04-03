import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, Enum as PgEnum, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, Namespace


class PromotionEvent(Base):
    __tablename__ = "promotion_events"

    promotion_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    memory_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("memory_units.memory_id", ondelete="CASCADE")
    )
    from_namespace: Mapped[Namespace] = mapped_column(
        PgEnum(Namespace, name="memory_namespace", create_constraint=False, create_type=False),
    )
    to_namespace: Mapped[Namespace] = mapped_column(
        PgEnum(Namespace, name="memory_namespace", create_constraint=False, create_type=False),
    )
    reason: Mapped[str] = mapped_column(Text)
    promoted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
