import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.base import ContentType, Namespace, SourceTool


class MemoryUnitResponse(BaseModel):
    memory_id: uuid.UUID
    org_id: uuid.UUID
    owner_user_id: uuid.UUID | None
    team_id: uuid.UUID | None
    namespace: Namespace
    source_tool: SourceTool
    source_tool_id: str
    content_text: str
    content_type: ContentType
    created_at: datetime
    last_accessed_at: datetime | None
    relevance_score: float
    ref_count: int
    access_tags: list[str] | None

    model_config = {"from_attributes": True}


class MemoryListResponse(BaseModel):
    memories: list[MemoryUnitResponse]
    total: int


class PromotionEventResponse(BaseModel):
    promotion_id: uuid.UUID
    memory_id: uuid.UUID
    from_namespace: Namespace
    to_namespace: Namespace
    reason: str
    promoted_at: datetime

    model_config = {"from_attributes": True}
