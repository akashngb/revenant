"""
Row-Level Security helpers.

Before every query touching RLS-protected tables, we SET LOCAL the
session-scoped GUC variables so Postgres policies can read them.
These expire at the end of the transaction -- no cleanup needed.
"""
import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def set_rls_context(
    session: AsyncSession,
    *,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    team_id: uuid.UUID | None = None,
    access_tags: list[str] | None = None,
) -> None:
    await session.execute(text(f"SET LOCAL app.org_id = '{org_id}'"))
    await session.execute(text(f"SET LOCAL app.user_id = '{user_id}'"))
    await session.execute(
        text(f"SET LOCAL app.team_id = '{team_id or ''}'")
    )
    tags_csv = ",".join(access_tags) if access_tags else ""
    await session.execute(text(f"SET LOCAL app.access_tags = '{tags_csv}'"))


RLS_POLICIES_SQL = """
-- Enable RLS on memory_units (idempotent)
ALTER TABLE memory_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_units FORCE ROW LEVEL SECURITY;

-- Drop existing policies so migration is re-runnable
DROP POLICY IF EXISTS memory_select_policy ON memory_units;
DROP POLICY IF EXISTS memory_insert_policy ON memory_units;
DROP POLICY IF EXISTS memory_update_policy ON memory_units;
DROP POLICY IF EXISTS memory_delete_policy ON memory_units;

-- SELECT: user sees own individual memories, team memories for their team, and all company memories within org
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
    );

-- INSERT: users can only insert into their own org
CREATE POLICY memory_insert_policy ON memory_units
    FOR INSERT WITH CHECK (
        org_id::text = current_setting('app.org_id', true)
    );

-- UPDATE: same visibility as SELECT
CREATE POLICY memory_update_policy ON memory_units
    FOR UPDATE USING (
        org_id::text = current_setting('app.org_id', true)
        AND (
            (namespace = 'INDIVIDUAL' AND owner_user_id::text = current_setting('app.user_id', true))
            OR (namespace = 'TEAM' AND team_id::text = current_setting('app.team_id', true))
            OR (namespace = 'COMPANY')
        )
    );

-- DELETE: only individual memories by their owner
CREATE POLICY memory_delete_policy ON memory_units
    FOR DELETE USING (
        org_id::text = current_setting('app.org_id', true)
        AND namespace = 'INDIVIDUAL'
        AND owner_user_id::text = current_setting('app.user_id', true)
    );
"""
