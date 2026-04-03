from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_admin
from app.db.session import get_db
from app.models.action_log import ActionLog
from app.models.memory import MemoryUnit
from app.models.promotion import PromotionEvent
from app.models.user import Organization, Team, User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def org_stats(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    memory_count = await db.scalar(
        select(func.count()).select_from(MemoryUnit).where(
            MemoryUnit.org_id == admin.org_id
        )
    )
    promotion_count = await db.scalar(
        select(func.count()).select_from(PromotionEvent)
        .join(MemoryUnit, PromotionEvent.memory_id == MemoryUnit.memory_id)
        .where(MemoryUnit.org_id == admin.org_id)
    )
    user_count = await db.scalar(
        select(func.count()).select_from(User).where(
            User.org_id == admin.org_id
        )
    )
    team_count = await db.scalar(
        select(func.count()).select_from(Team).where(
            Team.org_id == admin.org_id
        )
    )
    action_count = await db.scalar(
        select(func.count()).select_from(ActionLog).where(
            ActionLog.org_id == admin.org_id
        )
    )

    return {
        "org_id": str(admin.org_id),
        "memories": memory_count or 0,
        "promotions": promotion_count or 0,
        "users": user_count or 0,
        "teams": team_count or 0,
        "actions": action_count or 0,
    }


@router.get("/users")
async def list_users(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.org_id == admin.org_id).order_by(User.created_at)
    )
    users = result.scalars().all()
    return [
        {
            "user_id": str(u.user_id),
            "email": u.email,
            "name": u.name,
            "role": u.role.value,
            "team_id": str(u.team_id) if u.team_id else None,
            "created_at": u.created_at.isoformat(),
        }
        for u in users
    ]


@router.get("/teams")
async def list_teams(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Team).where(Team.org_id == admin.org_id).order_by(Team.created_at)
    )
    teams = result.scalars().all()
    return [
        {
            "team_id": str(t.team_id),
            "name": t.name,
            "created_at": t.created_at.isoformat(),
        }
        for t in teams
    ]


@router.get("/promotions")
async def list_promotions(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PromotionEvent)
        .join(MemoryUnit, PromotionEvent.memory_id == MemoryUnit.memory_id)
        .where(MemoryUnit.org_id == admin.org_id)
        .order_by(PromotionEvent.promoted_at.desc())
        .limit(100)
    )
    promos = result.scalars().all()
    return [
        {
            "promotion_id": str(p.promotion_id),
            "memory_id": str(p.memory_id),
            "from_namespace": p.from_namespace.value,
            "to_namespace": p.to_namespace.value,
            "reason": p.reason,
            "promoted_at": p.promoted_at.isoformat(),
        }
        for p in promos
    ]
