from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "omniate"
    app_env: str = "development"

    # Postgres (pgvector)
    database_url: str = "postgresql+asyncpg://omniate:omniate@localhost:5432/omniate"

    # Redis (queues + cache)
    redis_url: str = "redis://localhost:6379/0"

    # Auth
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 1440

    # LLM
    anthropic_api_key: str = ""
    openai_api_key: str = ""

    # Embeddings
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # Composio
    composio_api_key: str = ""
    composio_webhook_secret: str = ""

    # Moorcheh (Tier 2/3 vector store -- future)
    moorcheh_api_key: str = ""
    moorcheh_endpoint: str = ""

    # CORS
    allowed_origins: str = '["http://localhost:3000","http://127.0.0.1:3000"]'

    # Public URLs
    public_app_url: str = "http://localhost:3000"
    fastapi_base_url: str = "http://127.0.0.1:8000"
    fastapi_port: int = 8000
    fastapi_debug: bool = True

    @property
    def cors_origins(self) -> list[str]:
        import json
        try:
            return json.loads(self.allowed_origins)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:3000"]

    @property
    def sync_database_url(self) -> str:
        return self.database_url.replace("+asyncpg", "")


settings = Settings()
