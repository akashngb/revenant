import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


# ── Domain enums ──────────────────────────────────────────────


class UserRole(str, enum.Enum):
    ENGINEER = "ENGINEER"
    MANAGER = "MANAGER"
    ADMIN = "ADMIN"


class Namespace(str, enum.Enum):
    INDIVIDUAL = "INDIVIDUAL"
    TEAM = "TEAM"
    COMPANY = "COMPANY"


class SourceTool(str, enum.Enum):
    SLACK = "SLACK"
    JIRA = "JIRA"
    GITHUB = "GITHUB"


class ContentType(str, enum.Enum):
    MESSAGE = "MESSAGE"
    TICKET = "TICKET"
    COMMIT = "COMMIT"
    PR = "PR"
    COMMENT = "COMMENT"
    DOC = "DOC"
    INCIDENT = "INCIDENT"
    SUMMARY = "SUMMARY"


class DeploymentTier(str, enum.Enum):
    ON_PREM = "ON_PREM"
    CUSTOMER_CLOUD = "CUSTOMER_CLOUD"
    OMNIATE_CLOUD = "OMNIATE_CLOUD"


class ActionType(str, enum.Enum):
    JIRA_ATTACH_CONTEXT = "JIRA_ATTACH_CONTEXT"


class TriggerSource(str, enum.Enum):
    JIRA_WEBHOOK = "JIRA_WEBHOOK"
    MANUAL = "MANUAL"


class ActionStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
