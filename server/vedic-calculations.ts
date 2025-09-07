import { calculate as vedicCalculate } from 'vedic-astrology';

interface ChartRequest {
  birthDate: Date;
  birthTime: string;
  latitude: number;
  longitude: number;
}

export async function calculateChart({
  birthDate,
  birthTime,
  latitude,
  longitude
}: ChartRequest) {
  try {
    // Format the birth date and time for the Vedic astrology library
    const dateStr = `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`;
    const timeStr = birthTime;

    // Calculate the chart using the Vedic astrology library
    const chart = await vedicCalculate({
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate(),
      hour: parseInt(timeStr.split(':')[0]),
      min: parseInt(timeStr.split(':')[1]) || 0,
      lat: latitude,
      lng: longitude,
      tzone: 0, // Timezone offset in hours
      settings: {
        ayanamsha: 'lahiri',
        sidereal: true,
        houseSystem: 'placidus',
        aspectPoints: ['asc', 'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu'],
        aspectWithOrb: true,
        aspectOrbs: {
          conjunction: 10,
          opposition: 10,
          square: 8,
          trine: 8,
          sextile: 6,
          quincunx: 3,
          quintile: 2,
          septile: 1,
          'semi-square': 2,
          'semi-sextile': 2,
          'bi-quintile': 2
        }
      }
    });

    return {
      success: true,
      data: chart,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in calculateChart:', error);
    throw new Error('Failed to calculate Vedic chart');
  }
}
