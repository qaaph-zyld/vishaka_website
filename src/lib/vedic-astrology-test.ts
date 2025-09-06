import VedicAstrology from 'vedic-astrology';

// Test the Vedic Astrology library
export async function testVedicAstrology() {
  try {
    // Create a new instance
    const va = new VedicAstrology();
    
    // Test data - a sample birth details
    const birthData = {
      date: '1990-01-01',
      time: '12:00',
      latitude: 28.6139,  // New Delhi
      longitude: 77.2090,
      timezone: 5.5  // IST
    };

    console.log('Testing Vedic Astrology calculations...');
    console.log('Birth Data:', birthData);

    // Test basic chart calculation
    const chart = await va.calculateBirthChart(birthData);
    console.log('Birth Chart:', chart);

    // Test if it supports ayanamsa settings
    const ayanamsaInfo = await va.getAyanamsa(birthData.date);
    console.log('Ayanamsa Info:', ayanamsaInfo);

    // Test house calculation (whole sign system)
    const houses = await va.calculateHouses(birthData);
    console.log('Houses:', houses);

    // Test planetary positions
    const planets = await va.getPlanetaryPositions(birthData);
    console.log('Planetary Positions:', planets);

    return {
      chart,
      ayanamsaInfo,
      houses,
      planets,
      success: true
    };

  } catch (error) {
    console.error('Error testing Vedic Astrology:', error);
    return {
      error: error.message,
      success: false
    };
  }
}