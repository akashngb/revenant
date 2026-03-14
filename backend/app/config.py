"""App configuration using pydantic-settings."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    moorcheh_api_key: str = ""
    tavus_api_key: str = ""
    tavus_replica_id: str = "rf4e9d9790f0"
    tavus_persona_id: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
