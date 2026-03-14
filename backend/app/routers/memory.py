"""Memory router — Moorcheh AI integration.
Handles storing and retrieving semantic memories.
"""
import os
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

MOORCHEH_BASE = "https://api.moorcheh.ai"
MOORCHEH_API_KEY = os.getenv("MOORCHEH_API_KEY")


def get_headers() -> dict:
    if not MOORCHEH_API_KEY:
        raise HTTPException(status_code=500, detail="MOORCHEH_API_KEY not configured")
    return {
        "Authorization": f"Bearer {MOORCHEH_API_KEY}",
        "Content-Type": "application/json",
    }


# ── Schemas ────────────────────────────────────────────────────────────────────

class StoreRequest(BaseModel):
    content: str
    type: str = "general"   # e.g. "preference", "code", "decision", "general"
    tags: list[str] = []
    metadata: dict = {}


class QueryRequest(BaseModel):
    query: str
    top_k: int = 5
    filter_type: Optional[str] = None


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/store")
async def store_memory(req: StoreRequest):
    """Store a semantic memory fragment in Moorcheh."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{MOORCHEH_BASE}/v1/memories",
            headers=get_headers(),
            json={
                "content": req.content,
                "type": req.type,
                "tags": req.tags,
                "metadata": req.metadata,
            },
            timeout=15.0,
        )
        if not response.is_success:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


@router.post("/query")
async def query_memory(req: QueryRequest):
    """Retrieve semantically relevant memories from Moorcheh."""
    async with httpx.AsyncClient() as client:
        params = {"query": req.query, "top_k": req.top_k}
        if req.filter_type:
            params["type"] = req.filter_type

        response = await client.get(
            f"{MOORCHEH_BASE}/v1/memories/search",
            headers=get_headers(),
            params=params,
            timeout=15.0,
        )
        if not response.is_success:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


@router.get("/list")
async def list_memories(limit: int = 20, type: Optional[str] = None):
    """List stored memories, optionally filtered by type."""
    async with httpx.AsyncClient() as client:
        params: dict = {"limit": limit}
        if type:
            params["type"] = type

        response = await client.get(
            f"{MOORCHEH_BASE}/v1/memories",
            headers=get_headers(),
            params=params,
            timeout=15.0,
        )
        if not response.is_success:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


@router.delete("/{memory_id}")
async def delete_memory(memory_id: str):
    """Delete a specific memory by ID."""
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{MOORCHEH_BASE}/v1/memories/{memory_id}",
            headers=get_headers(),
            timeout=10.0,
        )
        if not response.is_success:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return {"deleted": memory_id}
