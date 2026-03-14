"""Health check router."""
from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """Quick liveness check for the Revenant backend."""
    return {
        "status": "ok",
        "service": "Revenant API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }
