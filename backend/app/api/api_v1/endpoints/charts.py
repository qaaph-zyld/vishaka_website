"""
API endpoints for Vedic astrology chart calculations and analysis.
"""
from datetime import datetime, time
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.services.astrology.calculation_engine import VedicCalculator

router = APIRouter()
calculator = VedicCalculator()

class ChartRequest(BaseModel):
    """Request model for chart generation."""
    name: str = Field(..., description="Name for the chart")
    birth_date: str = Field(..., description="Date of birth (YYYY-MM-DD)")
    birth_time: str = Field(..., description="Time of birth (HH:MM:SS)")
    latitude: float = Field(..., description="Birth latitude")
    longitude: float = Field(..., description="Birth longitude")
    timezone: str = Field("UTC", description="Timezone for birth time")
    ayanamsa: Optional[float] = Field(None, description="Ayanamsa value (if not provided, will be calculated)")
    house_system: str = Field("P", description="House system (P=Placidus, K=Koch, etc.)")
    is_primary: bool = Field(False, description="Set as primary chart for the user")

class ChartResponse(schemas.BirthChart):
    """Response model for chart with calculations."""
    planetary_positions: Dict[str, Any] = Field(..., description="Planetary positions")
    houses: List[Dict[str, Any]] = Field(..., description="House cusps")
    aspects: List[Dict[str, Any]] = Field(..., description="Planetary aspects")
    dasha_periods: List[Dict[str, Any]] = Field(..., description="Dasha periods")

@router.post("/generate", response_model=ChartResponse)
def generate_chart(
    *,
    db: Session = Depends(deps.get_db),
    chart_in: ChartRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Generate a new Vedic astrology birth chart.
    """
    try:
        # Parse date and time
        birth_date = datetime.strptime(chart_in.birth_date, "%Y-%m-%d").date()
        birth_time = datetime.strptime(chart_in.birth_time, "%H:%M:%S").time()
        
        # Calculate planetary positions
        positions = calculator.calculate_planetary_positions(
            birth_date=birth_date,
            birth_time=birth_time,
            latitude=chart_in.latitude,
            longitude=chart_in.longitude,
            ayanamsa=chart_in.ayanamsa
        )
        
        # Calculate houses
        houses = calculator.calculate_houses(
            birth_date=birth_date,
            birth_time=birth_time,
            latitude=chart_in.latitude,
            longitude=chart_in.longitude,
            house_system=chart_in.house_system
        )
        
        # Calculate aspects
        aspects = calculator.calculate_aspects(positions)
        
        # Calculate dasha periods
        dasha_periods = calculator.calculate_dasha_periods(
            birth_date=birth_date,
            birth_time=birth_time,
            latitude=chart_in.latitude,
            longitude=chart_in.longitude,
            years=100
        )
        
        # Create chart in database
        chart_data = {
            "name": chart_in.name,
            "birth_date": birth_date,
            "birth_time": birth_time,
            "timezone": chart_in.timezone,
            "latitude": chart_in.latitude,
            "longitude": chart_in.longitude,
            "ayanamsa": calculator.AYANAMSA,
            "house_system": chart_in.house_system,
            "is_primary": chart_in.is_primary,
            "user_id": current_user.id,
            "planetary_positions": {
                planet.value: pos for planet, pos in positions.items()
            },
            "houses": houses,
            "aspects": aspects,
            "dasha_periods": dasha_periods
        }
        
        chart = crud.birth_chart.create_with_owner(
            db=db, 
            obj_in=schemas.BirthChartCreate(**chart_data),
            owner_id=current_user.id
        )
        
        # If this is set as primary, update other charts
        if chart_in.is_primary:
            crud.birth_chart.set_primary_chart(db, chart_id=chart.id, user_id=current_user.id)
        
        # Prepare response
        response = ChartResponse(
            **chart.to_dict(),
            planetary_positions=chart.planetary_positions,
            houses=chart.houses,
            aspects=chart.aspects,
            dasha_periods=chart.dasha_periods
        )
        
        return response
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating chart: {str(e)}"
        )

@router.get("/{chart_id}", response_model=ChartResponse)
def get_chart(
    *,
    db: Session = Depends(deps.get_db),
    chart_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get a chart by ID.
    """
    chart = crud.birth_chart.get(db, id=chart_id)
    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    # Check if user has permission to access this chart
    if chart.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return ChartResponse(
        **chart.to_dict(),
        planetary_positions=chart.planetary_positions,
        houses=chart.houses,
        aspects=chart.aspects,
        dasha_periods=chart.dasha_periods
    )

@router.get("/user/{user_id}", response_model=List[schemas.BirthChart])
def get_user_charts(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all charts for a user.
    """
    # Only allow admins to access other users' charts
    if user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    charts = crud.birth_chart.get_multi_by_owner(
        db, owner_id=user_id, skip=skip, limit=limit
    )
    return charts

@router.delete("/{chart_id}", response_model=schemas.BirthChart)
def delete_chart(
    *,
    db: Session = Depends(deps.get_db),
    chart_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a chart.
    """
    chart = crud.birth_chart.get(db, id=chart_id)
    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    # Check if user has permission to delete this chart
    if chart.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return crud.birth_chart.remove(db, id=chart_id)

@router.post("/{chart_id}/set-primary", response_model=schemas.BirthChart)
def set_primary_chart(
    *,
    db: Session = Depends(deps.get_db),
    chart_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Set a chart as the primary chart for the user.
    """
    chart = crud.birth_chart.get(db, id=chart_id)
    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )
    
    # Check if user has permission to update this chart
    if chart.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Set as primary
    return crud.birth_chart.set_primary_chart(db, chart_id=chart_id, user_id=current_user.id)
