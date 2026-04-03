"""
ARQ worker configuration.

Phase 1: basic scaffold.
Phase 2+: ingestion processing, lifecycle promotion, decay jobs.
"""
from arq.connections import RedisSettings

from app.core.config import settings


async def startup(ctx: dict) -> None:
    """Called once when the worker boots."""
    pass


async def shutdown(ctx: dict) -> None:
    """Called once when the worker shuts down."""
    pass


# Phase 2+: import and register task functions here
# from app.workers.ingest_task import process_ingestion_event
# from app.workers.lifecycle_task import run_lifecycle_promotion
# from app.workers.decay_task import run_decay_sweep


class WorkerSettings:
    functions = [
        # process_ingestion_event,
        # run_lifecycle_promotion,
        # run_decay_sweep,
    ]
    cron_jobs = [
        # cron(run_lifecycle_promotion, minute={0, 10, 20, 30, 40, 50}),
        # cron(run_decay_sweep, hour={3}, minute={0}),
    ]
    on_startup = startup
    on_shutdown = shutdown
    redis_settings = RedisSettings.from_dsn(settings.redis_url)
