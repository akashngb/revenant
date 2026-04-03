from fastapi import APIRouter

from app.api.v0.auth import router as auth_router
from app.api.v0.admin import router as admin_router
from app.api.v0.query import router as query_router
from app.api.v0.memories import router as memories_router
from app.api.v0.actions import router as actions_router
from app.api.v0.webhooks import router as webhooks_router

router = APIRouter(prefix="/api/v0")
router.include_router(auth_router)
router.include_router(admin_router)
router.include_router(query_router)
router.include_router(memories_router)
router.include_router(actions_router)
router.include_router(webhooks_router)
