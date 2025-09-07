"""
Main FastAPI application module for the Vedic Astrology API.
"""
import os
import logging
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from typing import List, Optional

from .core.config import settings
from .api.api_v1.api import api_router
from .core.security import get_current_active_user
from .models.user import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Determine if running on Netlify
IS_NETLIFY = os.environ.get('NETLIFY') == 'true'

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path="/.netlify/functions/api" if IS_NETLIFY else "",
    description="Vedic Astrology API - Accurate astrological calculations and predictions",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add middleware to handle root path for Netlify
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    # Add CORS headers
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Handle 404 Not Found
def not_found(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Not Found"},
    )

exception_handlers = {
    404: not_found,
}

# Add exception handlers
for status_code, handler in exception_handlers.items():
    app.add_exception_handler(status_code, handler)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}

# Example protected route
@app.get("/api/v1/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Example protected route that requires authentication."""
    return current_user

# Application startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application services on startup."""
    logger.info("Starting Vedic Astrology API...")
    # Initialize database, cache, etc.

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
