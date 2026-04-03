import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Enum as PgEnum, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, ActionType, TriggerSource, ActionStatus


class ActionLog(Base):
    __tablename__ = "action_logs"

    action_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.org_id", ondelete="CASCADE")
    )
    action_type: Mapped[ActionType] = mapped_column(
        PgEnum(ActionType, name="action_type", create_constraint=False),
    )
    trigger_source: Mapped[TriggerSource] = mapped_column(
        PgEnum(TriggerSource, name="trigger_source", create_constraint=False),
    )
    trigger_payload: Mapped[dict | None] = mapped_column(JSONB)
    status: Mapped[ActionStatus] = mapped_column(
        PgEnum(ActionStatus, name="action_status", create_constraint=False),
        default=ActionStatus.PENDING,
    )
    llm_call_trace_id: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
