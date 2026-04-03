from contextlib import asynccontextmanager

import structlog
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v0 import router as v0_router
from app.api.v0 import auth as auth_mod, admin as admin_mod, webhooks as webhooks_mod
from app.core.config import settings
from app.schemas.common import HealthResponse

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("omniate_starting", env=settings.app_env)
    yield
    logger.info("omniate_shutting_down")


app = FastAPI(
    title="Omniate API",
    version="0.1.0",
    docs_url="/docs" if settings.fastapi_debug else None,
    redoc_url="/redoc" if settings.fastapi_debug else None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Primary versioned API ────────────────────────────────────
app.include_router(v0_router)

# ── Backward compat for current frontend (remove after frontend refactor) ──
# The Next.js rewrites proxy /api/auth/* etc. to the backend at the same path.
compat_router = APIRouter(prefix="/api")
compat_router.include_router(auth_mod.router)
compat_router.include_router(admin_mod.router)
compat_router.include_router(webhooks_mod.router)
app.include_router(compat_router)


@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse()


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse()
