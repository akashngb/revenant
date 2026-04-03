import uuid
from collections.abc import AsyncGenerator

from fastapi import Cookie, Depends, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import UnauthorizedError
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.services.access import resolve_access
from app.storage.interface import AccessFilter
from app.storage.pgvector_store import PgVectorMemoryStore


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    authorization: str | None = Header(None),
    omniate_session: str | None = Cookie(None),
) -> User:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    elif omniate_session:
        token = omniate_session

    if not token:
        raise UnauthorizedError()

    try:
        payload = decode_access_token(token)
        user_id = uuid.UUID(payload["sub"])
    except Exception:
        raise UnauthorizedError("Invalid token")

    result = await db.execute(
        select(User).where(User.user_id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedError("User not found")
    return user


async def get_current_admin(
    user: User = Depends(get_current_user),
) -> User:
    from app.core.exceptions import ForbiddenError
    from app.models.base import UserRole

    if user.role != UserRole.ADMIN:
        raise ForbiddenError("Admin access required")
    return user


def get_access_filter(
    user: User = Depends(get_current_user),
) -> AccessFilter:
    return resolve_access(user)


async def get_memory_store(
    db: AsyncSession = Depends(get_db),
) -> PgVectorMemoryStore:
    return PgVectorMemoryStore(db)
