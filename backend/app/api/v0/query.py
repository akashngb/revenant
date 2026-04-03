"""POST /v0/query -- RAG endpoint with identity-scoped retrieval."""
from fastapi import APIRouter, Depends

from app.core.dependencies import get_access_filter, get_current_user, get_memory_store
from app.models.user import User
from app.schemas.query import QueryRequest, QueryResponse, SourceRef
from app.services.embedding import get_embedding_provider
from app.storage.interface import AccessFilter
from app.storage.pgvector_store import PgVectorMemoryStore

router = APIRouter(prefix="/query", tags=["query"])


@router.post("", response_model=QueryResponse)
async def query_memories(
    body: QueryRequest,
    user: User = Depends(get_current_user),
    access: AccessFilter = Depends(get_access_filter),
    store: PgVectorMemoryStore = Depends(get_memory_store),
):
    embedder = get_embedding_provider()
    query_embedding = await embedder.embed_single(body.query_text)

    results = await store.search(
        access=access,
        query_embedding=query_embedding,
        top_k=body.top_k,
    )

    if not results:
        return QueryResponse(
            answer_text="No relevant memories found for your query.",
            sources=[],
        )

    memory_ids = [m.memory_id for m, _ in results]
    await store.update_usage(memory_ids)

    sources = [
        SourceRef(
            memory_id=m.memory_id,
            content_text=m.content_text[:500],
            source_tool=m.source_tool.value,
            similarity=round(score, 4),
        )
        for m, score in results
    ]

    context_block = "\n\n---\n\n".join(
        f"[{m.source_tool.value}/{m.content_type.value}] {m.content_text}"
        for m, _ in results
    )

    from anthropic import AsyncAnthropic
    from app.core.config import settings

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=(
            "You are Omniate, an organizational memory assistant. "
            "Answer the user's question using ONLY the provided context. "
            "Cite specific sources when possible. If the context doesn't "
            "contain enough information, say so clearly."
        ),
        messages=[
            {
                "role": "user",
                "content": (
                    f"Context from organizational memory:\n\n{context_block}\n\n"
                    f"Question: {body.query_text}"
                ),
            }
        ],
    )

    return QueryResponse(
        answer_text=response.content[0].text,
        sources=sources,
    )
