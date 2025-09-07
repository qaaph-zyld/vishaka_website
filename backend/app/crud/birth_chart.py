"""
CRUD operations for birth charts.
"""
from typing import List, Optional, Dict, Any, Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.birth_chart import BirthChart as BirthChartModel
from app.schemas.birth_chart import BirthChartCreate, BirthChartUpdate, ChartType
from app.models.user import User as UserModel

class CRUDBirthChart(CRUDBase[BirthChartModel, BirthChartCreate, BirthChartUpdate]):
    """CRUD operations for birth charts with additional methods."""
    
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[BirthChartModel]:
        """Get all birth charts for a specific user."""
        return (
            db.query(self.model)
            .filter(BirthChartModel.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_primary_chart(
        self, db: Session, *, owner_id: int
    ) -> Optional[BirthChartModel]:
        """Get the primary birth chart for a user."""
        return (
            db.query(self.model)
            .filter(
                BirthChartModel.owner_id == owner_id,
                BirthChartModel.is_primary == True  # noqa: E712
            )
            .first()
        )
    
    def get_by_chart_type(
        self, 
        db: Session, 
        *, 
        owner_id: int, 
        chart_type: ChartType,
        skip: int = 0, 
        limit: int = 100
    ) -> List[BirthChartModel]:
        """Get all charts of a specific type for a user."""
        return (
            db.query(self.model)
            .filter(
                BirthChartModel.owner_id == owner_id,
                BirthChartModel.chart_type == chart_type
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def create_with_owner(
        self, db: Session, *, obj_in: BirthChartCreate, owner_id: int
    ) -> BirthChartModel:
        """Create a new birth chart for a specific user."""
        # If this is set as primary, unset any existing primary chart
        if obj_in.is_primary:
            self._unset_primary_chart(db, owner_id=owner_id)
        
        # Create the new chart
        db_obj = BirthChartModel(**obj_in.dict(), owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self, 
        db: Session, 
        *, 
        db_obj: BirthChartModel, 
        obj_in: Union[BirthChartUpdate, Dict[str, Any]]
    ) -> BirthChartModel:
        """Update a birth chart, handling primary chart logic."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        # If this chart is being set as primary, unset any existing primary chart
        if update_data.get('is_primary', False):
            self._unset_primary_chart(db, owner_id=db_obj.owner_id, exclude_id=db_obj.id)
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def _unset_primary_chart(
        self, 
        db: Session, 
        *, 
        owner_id: int, 
        exclude_id: Optional[int] = None
    ) -> None:
        """Unset any existing primary chart for a user."""
        query = db.query(self.model).filter(
            BirthChartModel.owner_id == owner_id,
            BirthChartModel.is_primary == True  # noqa: E712
        )
        
        if exclude_id is not None:
            query = query.filter(BirthChartModel.id != exclude_id)
        
        # Update all matching charts to not be primary
        query.update({BirthChartModel.is_primary: False})
        db.commit()
    
    def get_by_name(
        self, db: Session, *, owner_id: int, name: str
    ) -> Optional[BirthChartModel]:
        """Get a birth chart by name for a specific user."""
        return (
            db.query(self.model)
            .filter(
                BirthChartModel.owner_id == owner_id,
                BirthChartModel.name == name
            )
            .first()
        )
    
    def search(
        self, 
        db: Session, 
        *, 
        owner_id: int, 
        query: str, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[BirthChartModel]:
        """Search birth charts by name or notes."""
        search = f"%{query}%"
        return (
            db.query(self.model)
            .filter(
                BirthChartModel.owner_id == owner_id,
                (BirthChartModel.name.ilike(search)) | 
                (BirthChartModel.notes.ilike(search) if BirthChartModel.notes is not None else False)
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

# Create a singleton instance
birth_chart = CRUDBirthChart(BirthChartModel)
