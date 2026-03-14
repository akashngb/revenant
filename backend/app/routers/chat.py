"""Chat router — Anthropic Claude via FastAPI.
Proxies chat completions and integrates Moorcheh context retrieval.
"""
import os
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import anthropic
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
_client: Optional[anthropic.Anthropic] = None


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


# ── Schemas ────────────────────────────────────────────────────────────────────

class Message(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    system: str = (
        "You are Anna — a senior autonomous developer clone built by Revenant. "
        "You are a knowledgeable 5th teammate for any software project. "
        "Be concise, precise, and technical. Prefer code examples over prose when relevant."
    )
    model: str = "claude-sonnet-4-5"
    max_tokens: int = 2048


class ChatResponse(BaseModel):
    content: str
    model: str
    input_tokens: int
    output_tokens: int


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("", response_model=ChatResponse)
async def chat_completion(req: ChatRequest) -> ChatResponse:
    """Send messages to Claude and return Anna's response."""
    client = get_client()

    response = client.messages.create(
        model=req.model,
        max_tokens=req.max_tokens,
        system=req.system,
        messages=[{"role": m.role, "content": m.content} for m in req.messages],
    )

    content = response.content[0].text if response.content else ""
    return ChatResponse(
        content=content,
        model=response.model,
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens,
    )


@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """Streaming endpoint for real-time token delivery."""
    from fastapi.responses import StreamingResponse
    client = get_client()

    def generate():
        with client.messages.stream(
            model=req.model,
            max_tokens=req.max_tokens,
            system=req.system,
            messages=[{"role": m.role, "content": m.content} for m in req.messages],
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {text}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
