"""
Tests for the Vedic astrology calculation engine.
"""
import pytest
from datetime import datetime, time
from app.services.astrology.calculation_engine import VedicCalculator
from app.schemas.astrology import Planet, ZodiacSign

# Test data
TEST_BIRTH_DATE = datetime(1990, 6, 15).date()
TEST_BIRTH_TIME = time(12, 0, 0)  # 12:00 PM
TEST_LATITUDE = 19.0760  # Mumbai
TEST_LONGITUDE = 72.8777

@pytest.fixture
def calculator():
    """Fixture to provide a VedicCalculator instance."""
    return VedicCalculator()

class TestVedicCalculator:
    """Test suite for VedicCalculator class."""
    
    def test_calculate_planetary_positions(self, calculator):
        """Test calculation of planetary positions."""
        positions = calculator.calculate_planetary_positions(
            birth_date=TEST_BIRTH_DATE,
            birth_time=TEST_BIRTH_TIME,
            latitude=TEST_LATITUDE,
            longitude=TEST_LONGITUDE
        )
        
        # Check that all planets are present
        assert len(positions) == 11  # 9 planets + Rahu/Ketu
        
        # Check that all positions are within valid range (0-360°)
        for planet, position in positions.items():
            assert 0 <= position['longitude'] < 360
            assert -90 <= position['latitude'] <= 90
            assert position['sign'] in list(ZodiacSign)
            assert 'nakshatra' in position
            assert 'is_retrograde' in position
    
    def test_calculate_houses(self, calculator):
        """Test calculation of house cusps."""
        houses = calculator.calculate_houses(
            birth_date=TEST_BIRTH_DATE,
            birth_time=TEST_BIRTH_TIME,
            latitude=TEST_LATITUDE,
            longitude=TEST_LONGITUDE,
            house_system="P"  # Placidus
        )
        
        # Check that we have 12 houses
        assert len(houses) == 12
        
        # Check that all house cusps are in valid range (0-360°)
        for house in houses:
            assert 0 <= house['longitude'] < 360
            assert house['sign'] in list(ZodiacSign)
    
    def test_calculate_aspects(self, calculator):
        """Test calculation of planetary aspects."""
        # First get planetary positions
        positions = calculator.calculate_planetary_positions(
            birth_date=TEST_BIRTH_DATE,
            birth_time=TEST_BIRTH_TIME,
            latitude=TEST_LATITUDE,
            longitude=TEST_LONGITUDE
        )
        
        # Calculate aspects
        aspects = calculator.calculate_aspects(positions)
        
        # Check that we have some aspects
        assert len(aspects) > 0
        
        # Check aspect structure
        for aspect in aspects:
            assert 'from_planet' in aspect
            assert 'to_planet' in aspect
            assert 'aspect_degree' in aspect
            assert 'applied_orb' in aspect
            assert 'type' in aspect
    
    def test_calculate_dasha_periods(self, calculator):
        """Test calculation of Vimshottari Dasha periods."""
        dashas = calculator.calculate_dasha_periods(
            birth_date=TEST_BIRTH_DATE,
            birth_time=TEST_BIRTH_TIME,
            latitude=TEST_LATITUDE,
            longitude=TEST_LONGITUDE,
            years=5  # Only calculate for 5 years
        )
        
        # Check that we have some dasha periods
        assert len(dashas) > 0
        
        # Check dasha structure
        for dasha in dashas:
            assert 'planet' in dasha
            assert 'start_date' in dasha
            assert 'end_date' in dasha
            assert 'duration_years' in dasha
            
            # Check that end date is after start date
            assert dasha['end_date'] > dasha['start_date']
    
    def test_get_nakshatra(self, calculator):
        """Test nakshatra calculation."""
        # Test Ashwini start (0° Aries)
        nakshatra = calculator._get_nakshatra(0)
        assert nakshatra['name'] == "Ashwini"
        assert nakshatra['pada'] == 1
        
        # Test Revati end (30° Pisces)
        nakshatra = calculator._get_nakshatra(359.9)
        assert nakshatra['name'] == "Revati"
        assert nakshatra['pada'] == 4
        
        # Test middle of Rohini (Taurus 10°)
        nakshatra = calculator._get_nakshatra(40)
        assert nakshatra['name'] == "Rohini"
        assert 1 <= nakshatra['pada'] <= 4

    def test_get_zodiac_sign(self, calculator):
        """Test zodiac sign calculation."""
        # Test Aries start (0°)
        assert calculator._get_zodiac_sign(0) == ZodiacSign.ARIES
        
        # Test Taurus start (30°)
        assert calculator._get_zodiac_sign(30) == ZodiacSign.TAURUS
        
        # Test Pisces end (360°)
        assert calculator._get_zodiac_sign(359.9) == ZodiacSign.PISCES
    
    def test_julian_day_conversion(self, calculator):
        """Test Julian day conversion with timezone handling."""
        # Test with Mumbai timezone (UTC+5:30)
        dt = datetime(2023, 1, 1, 12, 0, 0)  # 12:00 PM IST
        jd = calculator._get_julian_day(dt, TEST_LATITUDE, TEST_LONGITUDE)
        
        # Should be around 2459945.22917 (2023-01-01 06:30:00 UTC)
        assert 2459945.22 < jd < 2459945.24

# Run tests with: python -m pytest tests/test_vedic_calculator.py -v
