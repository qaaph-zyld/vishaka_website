"""
Astrology models for the Vedic Astrology platform.
"""
from datetime import datetime, date, time
from enum import Enum
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field, validator
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Date, Time, 
    ForeignKey, JSON, Boolean, Enum as SQLEnum, Text
)
from sqlalchemy.orm import relationship

from .base import Base
from .user import UserTable

# Enums for astrological entities
class Planet(str, Enum):
    SUN = "sun"
    MOON = "moon"
    MARS = "mars"
    MERCURY = "mercury"
    JUPITER = "jupiter"
    VENUS = "venus"
    SATURN = "saturn"
    RAHU = "rahu"  # North Node
    KETU = "ketu"  # South Node
    URANUS = "uranus"
    NEPTUNE = "neptune"
    PLUTO = "pluto"

class ZodiacSign(str, Enum):
    ARIES = "aries"
    TAURUS = "taurus"
    GEMINI = "gemini"
    CANCER = "cancer"
    LEO = "leo"
    VIRGO = "virgo"
    LIBRA = "libra"
    SCORPIO = "scorpio"
    SAGITTARIUS = "sagittarius"
    CAPRICORN = "capricorn"
    AQUARIUS = "aquarius"
    PISCES = "pisces"

class HouseNumber(int, Enum):
    FIRST = 1
    SECOND = 2
    THIRD = 3
    FOURTH = 4
    FIFTH = 5
    SIXTH = 6
    SEVENTH = 7
    EIGHTH = 8
    NINTH = 9
    TENTH = 10
    ELEVENTH = 11
    TWELFTH = 12

class DashaSystem(str, Enum):
    VIMSHOTTARI = "vimshottari"
    ASHTOTTARI = "ashtottari"
    YOGINI = "yogini"
    CHARA = "chara"

class ChartType(str, Enum):
    BIRTH = "birth"
    MOON = "moon"
    NAVAMSA = "navamsa"
    HORARY = "horary"
    PRASHNA = "prashna"
    TRANSIT = "transit"
    SOLAR_RETURN = "solar_return"
    LUNAR_RETURN = "lunar_return"

# Base models for astrological data
class BirthChartBase(BaseModel):
    """Base schema for birth chart."""
    name: str
    birth_date: date
    birth_time: time
    timezone: str
    latitude: float
    longitude: float
    ayanamsa: float
    house_system: str = "placidus"
    chart_type: ChartType = ChartType.BIRTH
    notes: Optional[str] = None
    is_primary: bool = False
    is_public: bool = False

class BirthChartCreate(BirthChartBase):
    """Schema for creating a new birth chart."""
    pass

class BirthChartUpdate(BaseModel):
    """Schema for updating a birth chart."""
    name: Optional[str] = None
    notes: Optional[str] = None
    is_primary: Optional[bool] = None
    is_public: Optional[bool] = None

class BirthChartInDB(BirthChartBase):
    """Schema for birth chart in database."""
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# SQLAlchemy models
class BirthChartTable(Base):
    """SQLAlchemy model for birth charts."""
    __tablename__ = "birth_charts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    birth_time = Column(Time, nullable=False)
    timezone = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    ayanamsa = Column(Float, nullable=False)
    house_system = Column(String, default="placidus")
    chart_type = Column(SQLEnum(ChartType), default=ChartType.BIRTH)
    notes = Column(Text, nullable=True)
    is_primary = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("UserTable", back_populates="birth_charts")
    planet_positions = relationship("PlanetPositionTable", back_populates="chart", cascade="all, delete-orphan")
    houses = relationship("HouseTable", back_populates="chart", cascade="all, delete-orphan")
    aspects = relationship("AspectTable", back_populates="chart", cascade="all, delete-orphan")
    dasha_periods = relationship("DashaPeriodTable", back_populates="chart", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<BirthChart {self.name} ({self.chart_type})>"

class PlanetPositionTable(Base):
    """SQLAlchemy model for planet positions in a chart."""
    __tablename__ = "planet_positions"
    
    id = Column(Integer, primary_key=True, index=True)
    chart_id = Column(Integer, ForeignKey("birth_charts.id"), nullable=False)
    planet = Column(SQLEnum(Planet), nullable=False)
    sign = Column(SQLEnum(ZodiacSign), nullable=False)
    degree = Column(Float, nullable=False)
    nakshatra = Column(String, nullable=False)
    nakshatra_pada = Column(Integer, nullable=False)
    house = Column(Integer, nullable=False)
    is_retrograde = Column(Boolean, default=False)
    
    # Relationships
    chart = relationship("BirthChartTable", back_populates="planet_positions")
    
    def __repr__(self):
        return f"<PlanetPosition {self.planet} in {self.sign} ({self.degree}°)>"

class HouseTable(Base):
    """SQLAlchemy model for house cusps in a chart."""
    __tablename__ = "houses"
    
    id = Column(Integer, primary_key=True, index=True)
    chart_id = Column(Integer, ForeignKey("birth_charts.id"), nullable=False)
    house_number = Column(Integer, nullable=False)
    sign = Column(SQLEnum(ZodiacSign), nullable=False)
    start_degree = Column(Float, nullable=False)
    end_degree = Column(Float, nullable=False)
    
    # Relationships
    chart = relationship("BirthChartTable", back_populates="houses")
    
    def __repr__(self):
        return f"<House {self.house_number} in {self.sign}>"

class AspectTable(Base):
    """SQLAlchemy model for planetary aspects in a chart."""
    __tablename__ = "aspects"
    
    id = Column(Integer, primary_key=True, index=True)
    chart_id = Column(Integer, ForeignKey("birth_charts.id"), nullable=False)
    planet = Column(SQLEnum(Planet), nullable=False)
    aspecting_planet = Column(SQLEnum(Planet), nullable=False)
    aspect_degree = Column(Float, nullable=False)
    orb = Column(Float, nullable=False)
    is_mutual = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    
    # Relationships
    chart = relationship("BirthChartTable", back_populates="aspects")
    
    def __repr__(self):
        return f"<Aspect {self.planet} → {self.aspecting_planet} ({self.aspect_degree}°)>"

class DashaPeriodTable(Base):
    """SQLAlchemy model for Dasha periods in a chart."""
    __tablename__ = "dasha_periods"
    
    id = Column(Integer, primary_key=True, index=True)
    chart_id = Column(Integer, ForeignKey("birth_charts.id"), nullable=False)
    dasha_system = Column(SQLEnum(DashaSystem), default=DashaSystem.VIMSHOTTARI)
    planet = Column(SQLEnum(Planet), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    # Relationships
    chart = relationship("BirthChartTable", back_populates="dasha_periods")
    
    def __repr__(self):
        return f"<DashaPeriod {self.planet} ({self.start_date} to {self.end_date})>"

# Update User model with relationships
UserTable.birth_charts = relationship("BirthChartTable", back_populates="user", cascade="all, delete-orphan")
