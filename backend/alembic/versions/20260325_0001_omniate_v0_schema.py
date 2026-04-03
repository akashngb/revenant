"""Omniate v0 schema: orgs, teams, users, memory_units, promotion_events, action_logs + RLS

Revision ID: 0001
Revises:
Create Date: 2026-03-25
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Extensions ──────────────────────────────────────────
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")

    # ── Enum types ──────────────────────────────────────────
    deployment_tier = postgresql.ENUM(
        "ON_PREM", "CUSTOMER_CLOUD", "OMNIATE_CLOUD",
        name="deployment_tier", create_type=True,
    )
    user_role = postgresql.ENUM(
        "ENGINEER", "MANAGER", "ADMIN",
        name="user_role", create_type=True,
    )
    memory_namespace = postgresql.ENUM(
        "INDIVIDUAL", "TEAM", "COMPANY",
        name="memory_namespace", create_type=True,
    )
    source_tool = postgresql.ENUM(
        "SLACK", "JIRA", "GITHUB",
        name="source_tool", create_type=True,
    )
    content_type = postgresql.ENUM(
        "MESSAGE", "TICKET", "COMMIT", "PR", "COMMENT", "DOC", "INCIDENT", "SUMMARY",
        name="content_type", create_type=True,
    )
    action_type = postgresql.ENUM(
        "JIRA_ATTACH_CONTEXT",
        name="action_type", create_type=True,
    )
    trigger_source = postgresql.ENUM(
        "JIRA_WEBHOOK", "MANUAL",
        name="trigger_source", create_type=True,
    )
    action_status = postgresql.ENUM(
        "PENDING", "COMPLETED", "FAILED",
        name="action_status", create_type=True,
    )

    deployment_tier.create(op.get_bind(), checkfirst=True)
    user_role.create(op.get_bind(), checkfirst=True)
    memory_namespace.create(op.get_bind(), checkfirst=True)
    source_tool.create(op.get_bind(), checkfirst=True)
    content_type.create(op.get_bind(), checkfirst=True)
    action_type.create(op.get_bind(), checkfirst=True)
    trigger_source.create(op.get_bind(), checkfirst=True)
    action_status.create(op.get_bind(), checkfirst=True)

    # ── Organizations ───────────────────────────────────────
    op.create_table(
        "organizations",
        sa.Column("org_id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("deployment_tier", deployment_tier, server_default="OMNIATE_CLOUD", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ── Teams ───────────────────────────────────────────────
    op.create_table(
        "teams",
        sa.Column("team_id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("org_id", sa.Uuid(), sa.ForeignKey("organizations.org_id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ── Users ───────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("user_id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("org_id", sa.Uuid(), sa.ForeignKey("organizations.org_id", ondelete="CASCADE"), nullable=False),
        sa.Column("team_id", sa.Uuid(), sa.ForeignKey("teams.team_id", ondelete="SET NULL"), nullable=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", user_role, server_default="ENGINEER", nullable=False),
        sa.Column("auth_provider_id", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_org_team", "users", ["org_id", "team_id"])

    # ── Memory Units ────────────────────────────────────────
    op.create_table(
        "memory_units",
        sa.Column("memory_id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("org_id", sa.Uuid(), sa.ForeignKey("organizations.org_id", ondelete="CASCADE"), nullable=False),
        sa.Column("owner_user_id", sa.Uuid(), sa.ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True),
        sa.Column("team_id", sa.Uuid(), sa.ForeignKey("teams.team_id", ondelete="SET NULL"), nullable=True),
        sa.Column("namespace", memory_namespace, server_default="INDIVIDUAL", nullable=False),
        sa.Column("source_tool", source_tool, nullable=False),
        sa.Column("source_tool_id", sa.String(512), nullable=False),
        sa.Column("content_text", sa.Text(), nullable=False),
        sa.Column("content_type", content_type, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("last_accessed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("relevance_score", sa.Float(), server_default="1.0", nullable=False),
        sa.Column("ref_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("similarity_cluster_id", sa.Uuid(), nullable=True),
        sa.Column("access_tags", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("ttl", sa.DateTime(timezone=True), nullable=True),
    )

    # pgvector vector column via raw SQL (not expressible through SQLAlchemy column types in Alembic)
    op.execute("ALTER TABLE memory_units ADD COLUMN embedding vector(1536)")

    op.create_index("ix_memory_org_ns_team", "memory_units", ["org_id", "namespace", "team_id"])
    op.create_index("ix_memory_source_dedup", "memory_units", ["org_id", "source_tool_id"], unique=True)
    op.create_index("ix_memory_created", "memory_units", ["org_id", "created_at"])

    # HNSW index for vector similarity search
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_memory_embedding_hnsw "
        "ON memory_units USING hnsw (embedding vector_cosine_ops) "
        "WITH (m = 16, ef_construction = 64)"
    )

    # ── Promotion Events ────────────────────────────────────
    op.create_table(
        "promotion_events",
        sa.Column("promotion_id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("memory_id", sa.Uuid(), sa.ForeignKey("memory_units.memory_id", ondelete="CASCADE"), nullable=False),
        sa.Column("from_namespace", memory_namespace, nullable=False),
        sa.Column("to_namespace", memory_namespace, nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("promoted_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ── Action Logs ─────────────────────────────────────────
    op.create_table(
        "action_logs",
        sa.Column("action_id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("org_id", sa.Uuid(), sa.ForeignKey("organizations.org_id", ondelete="CASCADE"), nullable=False),
        sa.Column("action_type", action_type, nullable=False),
        sa.Column("trigger_source", trigger_source, nullable=False),
        sa.Column("trigger_payload", postgresql.JSONB(), nullable=True),
        sa.Column("status", action_status, server_default="PENDING", nullable=False),
        sa.Column("llm_call_trace_id", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )

    # ── Row-Level Security on memory_units ──────────────────
    op.execute("ALTER TABLE memory_units ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE memory_units FORCE ROW LEVEL SECURITY")

    op.execute("""
        CREATE POLICY memory_select_policy ON memory_units
        FOR SELECT USING (
            org_id::text = current_setting('app.org_id', true)
            AND (
                (namespace = 'INDIVIDUAL' AND owner_user_id::text = current_setting('app.user_id', true))
                OR (namespace = 'TEAM' AND team_id::text = current_setting('app.team_id', true))
                OR (namespace = 'COMPANY')
            )
            AND (
                access_tags IS NULL
                OR access_tags = '{}'
                OR access_tags && string_to_array(current_setting('app.access_tags', true), ',')
            )
        )
    """)

    op.execute("""
        CREATE POLICY memory_insert_policy ON memory_units
        FOR INSERT WITH CHECK (
            org_id::text = current_setting('app.org_id', true)
        )
    """)

    op.execute("""
        CREATE POLICY memory_update_policy ON memory_units
        FOR UPDATE USING (
            org_id::text = current_setting('app.org_id', true)
            AND (
                (namespace = 'INDIVIDUAL' AND owner_user_id::text = current_setting('app.user_id', true))
                OR (namespace = 'TEAM' AND team_id::text = current_setting('app.team_id', true))
                OR (namespace = 'COMPANY')
            )
        )
    """)

    op.execute("""
        CREATE POLICY memory_delete_policy ON memory_units
        FOR DELETE USING (
            org_id::text = current_setting('app.org_id', true)
            AND namespace = 'INDIVIDUAL'
            AND owner_user_id::text = current_setting('app.user_id', true)
        )
    """)


def downgrade() -> None:
    op.execute("DROP POLICY IF EXISTS memory_delete_policy ON memory_units")
    op.execute("DROP POLICY IF EXISTS memory_update_policy ON memory_units")
    op.execute("DROP POLICY IF EXISTS memory_insert_policy ON memory_units")
    op.execute("DROP POLICY IF EXISTS memory_select_policy ON memory_units")
    op.execute("ALTER TABLE memory_units DISABLE ROW LEVEL SECURITY")

    op.drop_table("action_logs")
    op.drop_table("promotion_events")
    op.drop_index("ix_memory_embedding_hnsw", table_name="memory_units")
    op.drop_table("memory_units")
    op.drop_table("users")
    op.drop_table("teams")
    op.drop_table("organizations")

    for name in [
        "action_status", "trigger_source", "action_type",
        "content_type", "source_tool", "memory_namespace",
        "user_role", "deployment_tier",
    ]:
        op.execute(f"DROP TYPE IF EXISTS {name}")

    op.execute("DROP EXTENSION IF EXISTS vector")
    op.execute("DROP EXTENSION IF EXISTS pgcrypto")
