#!/bin/bash
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting Omniate API..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${FASTAPI_PORT:-8000}
