"""
Revenant Backend — FastAPI Server
Handles AI orchestration, Moorcheh memory storage, 
and reasoning pipelines separate from the Next.js layer.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chat, memory, health

app = FastAPI(
    title="Revenant API",
    description="Backend orchestration layer for Revenant AI Developer Clone",
    version="1.0.0",
    docs_url="/docs",          # Swagger UI at /docs
    redoc_url="/redoc",        # ReDoc at /redoc
)

# ── CORS (allow Next.js dev server) ────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router,   prefix="/api/chat",   tags=["Chat"])
app.include_router(memory.router, prefix="/api/memory", tags=["Memory"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
