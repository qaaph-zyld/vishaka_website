"""
CRUD operations for users.
"""
from typing import Any, Dict, Optional, Union, List

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, UserUpdate, UserRole

class CRUDUser(CRUDBase[UserModel, UserCreate, UserUpdate]):
    """CRUD operations for users with additional authentication methods."""
    
    def get_by_email(self, db: Session, *, email: str) -> Optional[UserModel]:
        """Get a user by email."""
        return db.query(UserModel).filter(UserModel.email == email).first()
    
    def get_by_username(self, db: Session, *, username: str) -> Optional[UserModel]:
        """Get a user by username."""
        return db.query(UserModel).filter(UserModel.username == username).first()
    
    def create(self, db: Session, *, obj_in: UserCreate) -> UserModel:
        """Create a new user with hashed password."""
        db_obj = UserModel(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role=obj_in.role if hasattr(obj_in, 'role') else UserRole.USER,
            is_active=True,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self, db: Session, *, db_obj: UserModel, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> UserModel:
        """Update a user, handling password hashing if password is being updated."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        # Handle password update
        if "password" in update_data and update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def authenticate(
        self, db: Session, *, email: str, password: str
    ) -> Optional[UserModel]:
        """Authenticate a user by email and password."""
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def is_active(self, user: UserModel) -> bool:
        """Check if a user is active."""
        return user.is_active
    
    def is_superuser(self, user: UserModel) -> bool:
        """Check if a user is a superuser (admin)."""
        return user.role == UserRole.ADMIN
    
    def get_multi_by_role(
        self, db: Session, *, role: UserRole, skip: int = 0, limit: int = 100
    ) -> List[UserModel]:
        """Get multiple users by role."""
        return (
            db.query(self.model)
            .filter(UserModel.role == role)
            .offset(skip)
            .limit(limit)
            .all()
        )

# Create a singleton instance
user = CRUDUser(UserModel)
