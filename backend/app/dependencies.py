"""Shared FastAPI dependencies for authentication and database access."""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Engineer
from app.utils.security import decode_access_token


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_engineer(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Engineer:
    token = credentials.credentials if credentials is not None else request.cookies.get("symbiote_session")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    payload = decode_access_token(token)
    subject = payload.get("sub")
    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

    engineer = await db.get(Engineer, int(subject))
    if engineer is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Engineer not found",
        )
    return engineer


async def get_current_admin(current_engineer: Engineer = Depends(get_current_engineer)) -> Engineer:
    if not current_engineer.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_engineer
