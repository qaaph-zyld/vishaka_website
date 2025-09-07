"""
Base class for SQLAlchemy models.
"""
from typing import Any, Dict, Optional

from sqlalchemy.ext.declarative import as_declarable, declared_attr
from sqlalchemy import Column, DateTime, Integer, func

@as_declarable()
class Base:
    """Base class for all SQLAlchemy models."""
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    @declared_attr
    def __tablename__(cls) -> str:
        """
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
                
    def __repr__(self) -> str:
        """String representation of the model."""
        return f"<{self.__class__.__name__} {self.id}>"
