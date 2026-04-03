"""
Embedding service abstraction.

Default: OpenAI text-embedding-3-small (1536 dims).
Swappable to local models or other providers via the interface.
"""
from abc import ABC, abstractmethod

import httpx
from openai import AsyncOpenAI

from app.core.config import settings


class EmbeddingProvider(ABC):
    @abstractmethod
    async def embed(self, texts: list[str]) -> list[list[float]]:
        """Return one embedding vector per input text."""

    async def embed_single(self, text: str) -> list[float]:
        results = await self.embed([text])
        return results[0]


class OpenAIEmbedding(EmbeddingProvider):
    def __init__(self):
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = settings.embedding_model

    async def embed(self, texts: list[str]) -> list[list[float]]:
        response = await self._client.embeddings.create(
            model=self._model,
            input=texts,
        )
        return [item.embedding for item in response.data]


def get_embedding_provider() -> EmbeddingProvider:
    return OpenAIEmbedding()
