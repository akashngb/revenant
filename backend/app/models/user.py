import uuid

from sqlalchemy import ForeignKey, Index, String, Enum as PgEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UserRole, DeploymentTier


class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"

    org_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255))
    deployment_tier: Mapped[DeploymentTier] = mapped_column(
        PgEnum(DeploymentTier, name="deployment_tier", create_constraint=False),
        default=DeploymentTier.OMNIATE_CLOUD,
    )

    teams: Mapped[list["Team"]] = relationship(back_populates="organization", cascade="all, delete-orphan")
    users: Mapped[list["User"]] = relationship(back_populates="organization", cascade="all, delete-orphan")


class Team(Base, TimestampMixin):
    __tablename__ = "teams"

    team_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.org_id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))

    organization: Mapped["Organization"] = relationship(back_populates="teams")
    users: Mapped[list["User"]] = relationship(back_populates="team")


class User(Base, TimestampMixin):
    __tablename__ = "users"
    __table_args__ = (
        Index("ix_users_org_team", "org_id", "team_id"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.org_id", ondelete="CASCADE"))
    team_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("teams.team_id", ondelete="SET NULL"))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(
        PgEnum(UserRole, name="user_role", create_constraint=False),
        default=UserRole.ENGINEER,
    )
    auth_provider_id: Mapped[str | None] = mapped_column(String(255))

    organization: Mapped["Organization"] = relationship(back_populates="users")
    team: Mapped["Team | None"] = relationship(back_populates="users")
