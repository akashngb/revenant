import uuid

from pydantic import BaseModel


class QueryRequest(BaseModel):
    query_text: str
    top_k: int = 10


class SourceRef(BaseModel):
    memory_id: uuid.UUID
    content_text: str
    source_tool: str
    similarity: float


class QueryResponse(BaseModel):
    answer_text: str
    sources: list[SourceRef]
