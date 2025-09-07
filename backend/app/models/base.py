"""
Base SQLAlchemy model with common functionality.
"""
from datetime import datetime
from typing import Any, Dict, Optional

from sqlalchemy import Column, DateTime, Integer
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.sql import func

@as_declarative()
class Base:
    """Base model with default columns and methods."""
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    @declared_attr
    def __tablename__(cls) -> str:
        ""
        Generate __tablename__ automatically.
        Converts CamelCase class name to snake_case table name.
        """
        return ''.join(
            ['_'+i.lower() if i.isupper() else i for i in cls.__name__]
        ).lstrip('_')
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary."""
        return {
            c.name: getattr(self, c.name)
            for c in self.__table__.columns
        }
    
    def update(self, **kwargs) -> None:
        """Update model attributes."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
