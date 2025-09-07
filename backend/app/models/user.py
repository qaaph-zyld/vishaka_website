"""
User model and related schemas.
"""
from datetime import datetime
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, validator
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB

from .base import Base

class UserRole(str, Enum):
    """User roles for authorization."""
    ADMIN = "admin"
    ASTROLOGER = "astrologer"
    USER = "user"
    GUEST = "guest"

class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: bool = True
    role: UserRole = UserRole.USER
    preferences: dict = {}

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        # Add more password strength requirements as needed
        return v

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    preferences: Optional[dict] = None
    
    class Config:
        orm_mode = True

class UserInDB(UserBase):
    """User schema for database operations."""
    id: int
    hashed_password: str
    created_at: datetime
    updated_at: datetime

class User(UserBase):
    """User schema for API responses."""
    id: int
    created_at: datetime
    updated_at: datetime

class UserInDBBase(UserBase):
    """Base user schema for database operations."""
    id: int
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class UserTable(Base):
    """SQLAlchemy model for users table."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean(), default=True)
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    preferences = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<User {self.username}>"
    
    def set_password(self, password: str):
        """Hash and set the user's password."""
        from ..core.security import get_password_hash
        self.hashed_password = get_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        """Check if the provided password matches the stored hash."""
        from ..core.security import verify_password
        return verify_password(password, self.hashed_password)

# Token models
class Token(BaseModel):
    """Schema for JWT token."""
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: Optional[int] = None
    exp: Optional[datetime] = None
    iat: Optional[datetime] = None
    jti: Optional[str] = None
