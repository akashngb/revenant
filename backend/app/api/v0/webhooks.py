"""
Webhook receiver for Composio events.

Phase 1: validates signature and logs the event.
Phase 2 (ingestion): will enqueue events for async processing.
"""
import hashlib
import hmac
import structlog

from fastapi import APIRouter, Header, HTTPException, Request

from app.core.config import settings

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
logger = structlog.get_logger()


def _verify_composio_signature(payload: bytes, signature: str | None) -> bool:
    if not settings.composio_webhook_secret:
        return True
    if not signature:
        return False
    expected = hmac.new(
        settings.composio_webhook_secret.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


@router.post("/composio")
async def composio_webhook(
    request: Request,
    x_composio_signature: str | None = Header(None),
):
    body = await request.body()

    if not _verify_composio_signature(body, x_composio_signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    payload = await request.json()
    event_type = payload.get("type", "unknown")
    trigger_slug = payload.get("metadata", {}).get("trigger_slug", "unknown")

    logger.info(
        "composio_webhook_received",
        event_type=event_type,
        trigger_slug=trigger_slug,
    )

    # Phase 2: enqueue to ARQ for async processing
    # await arq_pool.enqueue_job("process_ingestion_event", payload)

    return {"status": "accepted", "trigger_slug": trigger_slug}
