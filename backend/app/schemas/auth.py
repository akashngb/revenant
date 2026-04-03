import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.base import UserRole


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    org_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id: uuid.UUID
    email: str
    name: str
    role: UserRole
    org_id: uuid.UUID
    team_id: uuid.UUID | None
    org_name: str | None = None
    team_name: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class CreateTeamRequest(BaseModel):
    name: str


class TeamResponse(BaseModel):
    team_id: uuid.UUID
    org_id: uuid.UUID
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AddUserToTeamRequest(BaseModel):
    user_id: uuid.UUID
    team_id: uuid.UUID
