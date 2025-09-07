"""
Configuration settings for the Vedic Astrology API.
"""
import secrets
from typing import List, Optional, Union
from pydantic import AnyHttpUrl, BaseSettings, validator

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Vishaka Vedic Astrology API"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # Frontend URL
        "http://localhost:8000",  # Backend URL
    ]
    
    # Database Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "vishaka"
    POSTGRES_PASSWORD: str = "your-secure-password"
    POSTGRES_DB: str = "vishaka"
    DATABASE_URI: Optional[str] = None
    
    @validator("DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict) -> str:
        if isinstance(v, str):
            return v
        return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    # Security
    ALGORITHM: str = "HS256"
    
    # Email Configuration
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = "noreply@vishaka.astrology"
    EMAILS_FROM_NAME: Optional[str] = "Vishaka Astrology"
    
    # Swiss Ephemeris Configuration
    SWISS_EPHEMERIS_PATH: str = "/usr/share/libswe"
    
    # Feature Flags
    ENABLE_EMAIL_VERIFICATION: bool = True
    ENABLE_RATE_LIMITING: bool = True
    
    class Config:
        case_sensitive = True
        env_file = ".env"

# Create settings instance
settings = Settings()
