import uuid
from datetime import datetime

from pydantic import BaseModel


class OkResponse(BaseModel):
    ok: bool = True


class PaginatedParams(BaseModel):
    offset: int = 0
    limit: int = 50


class HealthResponse(BaseModel):
    service: str = "omniate"
    status: str = "healthy"
    version: str = "0.1.0"
