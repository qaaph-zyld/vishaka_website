"""
Main API router that includes all versioned API endpoints.
"""
from fastapi import APIRouter

from ..deps import get_current_active_user
from ...models.user import User
from .endpoints import auth, users, charts

# Create main API router
api_router = APIRouter()

# Include all API endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(charts.router, prefix="/charts", tags=["charts"])

# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
