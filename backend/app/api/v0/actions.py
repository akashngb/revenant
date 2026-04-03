"""Action log inspection endpoints."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.action_log import ActionLog
from app.models.user import User

router = APIRouter(prefix="/actions", tags=["actions"])


@router.get("")
async def list_actions(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
):
    result = await db.execute(
        select(ActionLog)
        .where(ActionLog.org_id == user.org_id)
        .order_by(ActionLog.created_at.desc())
        .limit(limit)
    )
    actions = result.scalars().all()
    return [
        {
            "action_id": str(a.action_id),
            "action_type": a.action_type.value,
            "trigger_source": a.trigger_source.value,
            "status": a.status.value,
            "created_at": a.created_at.isoformat(),
            "completed_at": a.completed_at.isoformat() if a.completed_at else None,
        }
        for a in actions
    ]
