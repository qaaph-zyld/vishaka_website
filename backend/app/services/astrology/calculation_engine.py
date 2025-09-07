"""
Core Vedic Astrology Calculation Engine

This module provides the fundamental calculations for Vedic astrology,
including planetary positions, houses, and aspects.
"""
from datetime import datetime, date, time, timedelta
from typing import Dict, List, Tuple, Optional
import math
import swisseph as swe
from timezonefinder import TimezoneFinder
import pytz

from app.core.config import settings
from app.schemas.astrology import (
    Planet, ZodiacSign, House, Aspect, DashaPeriod, ChartType
)

# Initialize Swiss Ephemeris
swe.set_ephe_path(settings.SWISS_EPHEM_PATH)

class VedicCalculator:
    """Core class for Vedic astrology calculations."""
    
    # Ayanamsa (Lahiri)
    AYANAMSA = 0  # Will be set based on date
    
    # Planetary numbers for Swiss Ephemeris
    PLANET_MAPPING = {
        Planet.SUN: swe.SUN,
        Planet.MOON: swe.MOON,
        Planet.MARS: swe.MARS,
        Planet.MERCURY: swe.MERCURY,
        Planet.JUPITER: swe.JUPITER,
        Planet.VENUS: swe.VENUS,
        Planet.SATURN: swe.SATURN,
        Planet.RAHU: swe.MEAN_NODE,  # North Node
        Planet.KETU: swe.MEAN_NODE,  # South Node (same as Rahu but with 180°)
        Planet.URANUS: swe.URANUS,
        Planet.NEPTUNE: swe.NEPTUNE,
        Planet.PLUTO: swe.PLUTO
    }
    
    # Zodiac sign start degrees (sidereal)
    ZODIAC_START_DEGREES = {
        ZodiacSign.ARIES: 0,
        ZodiacSign.TAURUS: 30,
        ZodiacSign.GEMINI: 60,
        ZodiacSign.CANCER: 90,
        ZodiacSign.LEO: 120,
        ZodiacSign.VIRGO: 150,
        ZodiacSign.LIBRA: 180,
        ZodiacSign.SCORPIO: 210,
        ZodiacSign.SAGITTARIUS: 240,
        ZodiacSign.CAPRICORN: 270,
        ZodiacSign.AQUARIUS: 300,
        ZodiacSign.PISCES: 330
    }
    
    # Planetary aspects (planet: [aspect_degrees])
    PLANETARY_ASPECTS = {
        Planet.MARS: [4, 8, 7],
        Planet.JUPITER: [5, 7, 9],
        Planet.SATURN: [3, 7, 10],
        Planet.RAHU: [5, 7],
        Planet.KETU: [5, 7]
    }
    
    def __init__(self):
        """Initialize the calculator with default settings."""
        self.tf = TimezoneFinder()
        
    def calculate_planetary_positions(
        self,
        birth_date: date,
        birth_time: time,
        latitude: float,
        longitude: float,
        ayanamsa: Optional[float] = None
    ) -> Dict[Planet, Dict]:
        """
        Calculate planetary positions for a given birth chart.
        
        Args:
            birth_date: Date of birth
            birth_time: Time of birth
            latitude: Birth latitude
            longitude: Birth longitude
            ayanamsa: Optional ayanamsa value (if None, will be calculated)
            
        Returns:
            Dictionary mapping planets to their positions and attributes
        """
        # Convert to datetime and get Julian day
        birth_dt = datetime.combine(birth_date, birth_time)
        jd = self._get_julian_day(birth_dt, latitude, longitude)
        
        # Set ayanamsa
        self.AYANAMSA = ayanamsa or swe.get_ayanamsa_ut(jd, swe.SIDM_LAHIRI)
        
        positions = {}
        
        # Calculate positions for each planet
        for planet, planet_id in self.PLANET_MAPPING.items():
            if planet == Planet.KETU:
                # For Ketu, we'll calculate Rahu's position and add 180°
                rahu_pos = self._calculate_planet_position(Planet.RAHU, jd)
                positions[planet] = {
                    'longitude': (rahu_pos['longitude'] + 180) % 360,
                    'latitude': -rahu_pos['latitude'],  # Opposite latitude
                    'speed': rahu_pos['speed'],
                    'sign': self._get_zodiac_sign((rahu_pos['longitude'] + 180) % 360),
                    'nakshatra': self._get_nakshatra((rahu_pos['longitude'] + 180) % 360),
                    'is_retrograde': rahu_pos['is_retrograde']
                }
            else:
                positions[planet] = self._calculate_planet_position(planet, jd)
        
        return positions
    
    def _calculate_planet_position(
        self,
        planet: Planet,
        jd: float
    ) -> Dict:
        """Calculate position for a single planet."""
        planet_id = self.PLANET_MAPPING[planet]
        
        # Get planet position (geocentric)
        flags = swe.FLG_SWIEPH | swe.FLG_SPEED
        if planet in [Planet.RAHU, Planet.KETU]:
            # For nodes, use special calculation
            flags |= swe.FLG_SIDEREAL
            xx, _ = swe.calc_ut(jd, planet_id, flags)
            long = xx[0]  # Longitude
            lat = xx[1]   # Latitude
            speed = xx[3]  # Speed in longitude
        else:
            # For regular planets
            xx, _ = swe.calc_ut(jd, planet_id, flags)
            long = (xx[0] - self.AYANAMSA) % 360  # Convert to sidereal
            lat = xx[1]
            speed = xx[3]
        
        # Determine if retrograde
        is_retrograde = speed < 0
        
        return {
            'longitude': long,
            'latitude': lat,
            'speed': abs(speed),
            'sign': self._get_zodiac_sign(long),
            'nakshatra': self._get_nakshatra(long),
            'is_retrograde': is_retrograde
        }
    
    def calculate_houses(
        self,
        birth_date: date,
        birth_time: time,
        latitude: float,
        longitude: float,
        house_system: str = "P"
    ) -> List[Dict]:
        """
        Calculate house cusps using the specified house system.
        
        Args:
            birth_date: Date of birth
            birth_time: Time of birth
            latitude: Birth latitude
            longitude: Birth longitude
            house_system: House system code (P=Placidus, K=Koch, etc.)
            
        Returns:
            List of house cusps with their positions
        """
        birth_dt = datetime.combine(birth_date, birth_time)
        jd = self._get_julian_day(birth_dt, latitude, longitude)
        
        # Calculate houses
        hsys = house_system.upper()
        cusps, ascmc = swe.houses_ex(jd, latitude, longitude, hsys)
        
        # Convert to sidereal zodiac
        cusps = [(c - self.AYANAMSA) % 360 for c in cusps[1:13]]  # cusps[0] is not used
        
        houses = []
        for i, cusp in enumerate(cusps, 1):
            houses.append({
                'house_number': i,
                'longitude': cusp,
                'sign': self._get_zodiac_sign(cusp)
            })
            
        return houses
    
    def calculate_aspects(
        self,
        positions: Dict[Planet, Dict],
        orb: float = 3.0
    ) -> List[Dict]:
        """
        Calculate aspects between planets.
        
        Args:
            positions: Dictionary of planet positions from calculate_planetary_positions
            orb: Orb in degrees for aspect application
            
        Returns:
            List of aspects between planets
        """
        aspects = []
        planets = list(positions.keys())
        
        # Check aspects between all planet pairs
        for i, p1 in enumerate(planets):
            for p2 in planets[i+1:]:
                # Skip if same planet
                if p1 == p2:
                    continue
                    
                # Get positions
                pos1 = positions[p1]['longitude']
                pos2 = positions[p2]['longitude']
                
                # Calculate angular distance
                distance = abs(pos1 - pos2)
                if distance > 180:
                    distance = 360 - distance
                
                # Check for conjunction (0°)
                if distance <= orb:
                    aspects.append({
                        'from_planet': p1,
                        'to_planet': p2,
                        'aspect_degree': 0,
                        'applied_orb': distance,
                        'type': 'conjunction'
                    })
                
                # Check for opposition (180°)
                if abs(distance - 180) <= orb:
                    aspects.append({
                        'from_planet': p1,
                        'to_planet': p2,
                        'aspect_degree': 180,
                        'applied_orb': abs(distance - 180),
                        'type': 'opposition'
                    })
                
                # Check for square (90°)
                if abs(distance - 90) <= orb:
                    aspects.append({
                        'from_planet': p1,
                        'to_planet': p2,
                        'aspect_degree': 90,
                        'applied_orb': abs(distance - 90),
                        'type': 'square'
                    })
                
                # Check for trine (120°)
                if abs(distance - 120) <= orb:
                    aspects.append({
                        'from_planet': p1,
                        'to_planet': p2,
                        'aspect_degree': 120,
                        'applied_orb': abs(distance - 120),
                        'type': 'trine'
                    })
                
                # Check for sextile (60°)
                if abs(distance - 60) <= orb:
                    aspects.append({
                        'from_planet': p1,
                        'to_planet': p2,
                        'aspect_degree': 60,
                        'applied_orb': abs(distance - 60),
                        'type': 'sextile'
                    })
                
                # Check for planetary aspects
                for aspect_planet, aspect_degrees in self.PLANETARY_ASPECTS.items():
                    if p1 == aspect_planet or p2 == aspect_planet:
                        for degree in aspect_degrees:
                            if abs(distance - degree) <= orb:
                                aspects.append({
                                    'from_planet': p1 if p1 == aspect_planet else p2,
                                    'to_planet': p2 if p1 == aspect_planet else p1,
                                    'aspect_degree': degree,
                                    'applied_orb': abs(distance - degree),
                                    'type': 'planetary'
                                })
        
        return aspects
    
    def calculate_dasha_periods(
        self,
        birth_date: date,
        birth_time: time,
        latitude: float,
        longitude: float,
        years: int = 100
    ) -> List[Dict]:
        """
        Calculate Vimshottari Dasha periods.
        
        Args:
            birth_date: Date of birth
            birth_time: Time of birth
            latitude: Birth latitude
            longitude: Birth longitude
            years: Number of years to calculate (default: 100)
            
        Returns:
            List of Dasha periods
        """
        birth_dt = datetime.combine(birth_date, birth_time)
        jd = self._get_julian_day(birth_dt, latitude, longitude)
        
        # Calculate Moon's nakshatra
        moon_pos = self._calculate_planet_position(Planet.MOON, jd)
        nakshatra = self._get_nakshatra(moon_pos['longitude'])
        
        # Vimshottari Dasha sequence and years
        dasha_sequence = [
            (Planet.KETU, 7),
            (Planet.VENUS, 20),
            (Planet.SUN, 6),
            (Planet.MOON, 10),
            (Planet.MARS, 7),
            (Planet.RAHU, 18),
            (Planet.JUPITER, 16),
            (Planet.SATURN, 19),
            (Planet.MERCURY, 17)
        ]
        
        # Find current dasha based on Moon's nakshatra
        nakshatra_num = (nakshatra['number'] - 1) % 9
        
        # Calculate elapsed time in current nakshatra
        elapsed_deg = (moon_pos['longitude'] - nakshatra['start_degree']) % 360
        elapsed_ratio = elapsed_deg / 13.333333333333334  # 120° / 9 = 13.333...
        
        # Calculate start and end dates for each dasha period
        periods = []
        current_date = birth_dt
        
        for i in range(len(dasha_sequence) * 2):  # Calculate for 2 cycles
            idx = (nakshatra_num + i) % len(dasha_sequence)
            planet, years_total = dasha_sequence[idx]
            
            # For first period, calculate remaining time
            if i == 0:
                remaining_ratio = 1 - elapsed_ratio
                period_years = years_total * remaining_ratio
            else:
                period_years = years_total
            
            end_date = current_date + timedelta(days=period_years * 365.25)
            
            periods.append({
                'planet': planet,
                'start_date': current_date,
                'end_date': end_date,
                'duration_years': period_years
            })
            
            current_date = end_date
            
            # Stop if we've calculated enough years
            if (current_date - birth_dt).days / 365.25 > years:
                break
        
        return periods
    
    def _get_julian_day(
        self,
        dt: datetime,
        latitude: float,
        longitude: float
    ) -> float:
        """Convert datetime to Julian day with timezone adjustment."""
        # Get timezone from coordinates
        timezone_str = self.tf.timezone_at(lat=latitude, lng=longitude)
        if not timezone_str:
            timezone_str = 'UTC'
        
        # Convert to UTC
        local_tz = pytz.timezone(timezone_str)
        local_dt = local_tz.localize(dt, is_dst=None)
        utc_dt = local_dt.astimezone(pytz.utc)
        
        # Convert to Julian day
        jd = swe.julday(
            utc_dt.year,
            utc_dt.month,
            utc_dt.day,
            utc_dt.hour + utc_dt.minute/60.0 + utc_dt.second/3600.0
        )
        
        return jd
    
    def _get_zodiac_sign(self, longitude: float) -> ZodiacSign:
        """Get zodiac sign from longitude."""
        sign_num = int(longitude // 30)
        return list(ZodiacSign)[sign_num]
    
    def _get_nakshatra(self, longitude: float) -> Dict:
        """Get nakshatra and pada from longitude."""
        nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
            "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
            "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
            "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
            "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
            "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        
        # Each nakshatra is 13°20' (13.333... degrees)
        nakshatra_num = int(longitude / 13.333333333333334)
        nakshatra_name = nakshatras[nakshatra_num % 27]
        
        # Calculate pada (1-4)
        remainder = (longitude % 13.333333333333334) / 13.333333333333334
        pada = int(remainder * 4) + 1
        
        return {
            'number': nakshatra_num + 1,
            'name': nakshatra_name,
            'pada': pada,
            'start_degree': nakshatra_num * 13.333333333333334,
            'end_degree': (nakshatra_num + 1) * 13.333333333333334
        }
