import uuid

from fastapi import APIRouter, Depends, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.dependencies import get_current_user
from app.core.exceptions import ConflictError, UnauthorizedError
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.base import UserRole
from app.models.user import Organization, Team, User
from app.schemas.auth import (
    AddUserToTeamRequest,
    CreateTeamRequest,
    LoginRequest,
    SignupRequest,
    TeamResponse,
    TokenResponse,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="omniate_session",
        value=token,
        httponly=True,
        secure=settings.app_env == "production",
        samesite="lax",
        max_age=settings.jwt_expiration_minutes * 60,
    )


@router.post("/signup", response_model=TokenResponse)
async def signup(
    body: SignupRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(
        select(User).where(User.email == body.email)
    )
    if existing.scalar_one_or_none():
        raise ConflictError("Email already registered")

    org = Organization(name=body.org_name)
    db.add(org)
    await db.flush()

    user = User(
        org_id=org.org_id,
        email=body.email,
        name=body.name,
        password_hash=hash_password(body.password),
        role=UserRole.ADMIN,
    )
    db.add(user)
    await db.flush()

    token = create_access_token(user.user_id, org.org_id)
    _set_session_cookie(response, token)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise UnauthorizedError("Invalid email or password")

    token = create_access_token(user.user_id, user.org_id)
    _set_session_cookie(response, token)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def me(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    org = await db.get(Organization, user.org_id)
    team = await db.get(Team, user.team_id) if user.team_id else None
    return UserResponse(
        user_id=user.user_id,
        email=user.email,
        name=user.name,
        role=user.role,
        org_id=user.org_id,
        team_id=user.team_id,
        org_name=org.name if org else None,
        team_name=team.name if team else None,
        created_at=user.created_at,
    )


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("omniate_session")
    return {"ok": True}


@router.post("/teams", response_model=TeamResponse)
async def create_team(
    body: CreateTeamRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    team = Team(org_id=user.org_id, name=body.name)
    db.add(team)
    await db.flush()
    return team


@router.post("/teams/assign")
async def assign_user_to_team(
    body: AddUserToTeamRequest,
    admin: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.core.exceptions import ForbiddenError, NotFoundError

    if admin.role != UserRole.ADMIN:
        raise ForbiddenError("Only admins can assign teams")

    target = await db.get(User, body.user_id)
    if not target or target.org_id != admin.org_id:
        raise NotFoundError("User not found in your organization")

    team = await db.get(Team, body.team_id)
    if not team or team.org_id != admin.org_id:
        raise NotFoundError("Team not found in your organization")

    target.team_id = body.team_id
    return {"ok": True}
