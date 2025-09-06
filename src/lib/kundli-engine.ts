// Mock Vedic astrology calculation engine
// This simulates the vedic-astrology library functionality
// In production, this would be replaced with actual calculations

export interface PlanetPosition {
  graha: string;
  rashi: string;
  nakshatra: string;
  longitude: number;
  isRetrograde: boolean;
}

export interface BirthChart {
  [key: string]: {
    rashi: string;
    signs: PlanetPosition[];
  } & {
    meta: {
      [key: string]: PlanetPosition;
    };
  };
}

export interface KundliData {
  birthChart: BirthChart;
  navamsaChart: BirthChart;
  birthData: {
    dateString: string;
    timeString: string;
    lat: number;
    lng: number;
    timezone: number;
  };
  note?: string;
}

// Mock data for planetary positions based on birth details
function generateMockPlanetaryPositions(dateString: string, timeString: string, lat: number, lng: number, timezone: number): PlanetPosition[] {
  const planets = [
    { graha: 'Sun', rashi: 'Aries', nakshatra: 'Ashwini', longitude: 15.5, isRetrograde: false },
    { graha: 'Moon', rashi: 'Taurus', nakshatra: 'Krittika', longitude: 45.2, isRetrograde: false },
    { graha: 'Mars', rashi: 'Gemini', nakshatra: 'Punarvasu', longitude: 78.8, isRetrograde: false },
    { graha: 'Mercury', rashi: 'Cancer', nakshatra: 'Pushya', longitude: 112.3, isRetrograde: true },
    { graha: 'Jupiter', rashi: 'Leo', nakshatra: 'Magha', longitude: 145.7, isRetrograde: false },
    { graha: 'Venus', rashi: 'Virgo', nakshatra: 'Purva Phalguni', longitude: 178.9, isRetrograde: false },
    { graha: 'Saturn', rashi: 'Libra', nakshatra: 'Chitra', longitude: 212.4, isRetrograde: true },
    { graha: 'Rahu', rashi: 'Scorpio', nakshatra: 'Vishakha', longitude: 245.6, isRetrograde: false },
    { graha: 'Ketu', rashi: 'Taurus', nakshatra: 'Rohini', longitude: 65.6, isRetrograde: false }
  ];

  // Add some variation based on input parameters
  const seed = dateString.charCodeAt(0) + timeString.charCodeAt(0) + Math.floor(lat) + Math.floor(lng) + Math.floor(timezone);
  
  return planets.map(planet => ({
    ...planet,
    longitude: (planet.longitude + seed * 0.1) % 360,
    isRetrograde: seed % 3 === 0 ? !planet.isRetrograde : planet.isRetrograde
  }));
}

function generateBirthChart(planets: PlanetPosition[]): BirthChart {
  const rashis = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const rashiNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  
  const chart: BirthChart = {
    meta: {}
  } as BirthChart;

  // Initialize chart structure
  rashis.forEach((rashi, index) => {
    chart[rashi] = {
      rashi: rashiNames[index],
      signs: []
    };
  });

  // Add planets to their respective rashis
  planets.forEach(planet => {
    const rashiKey = planet.rashi.toLowerCase();
    if (chart[rashiKey]) {
      chart[rashiKey].signs.push(planet);
      chart.meta[planet.graha] = planet;
    }
  });

  return chart;
}

function generateNavamsaChart(birthChart: BirthChart): BirthChart {
  // Mock Navamsa chart calculation
  const navamsaChart: BirthChart = {
    meta: {}
  } as BirthChart;

  const rashis = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const rashiNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  // Initialize Navamsa chart structure
  rashis.forEach((rashi, index) => {
    navamsaChart[rashi] = {
      rashi: rashiNames[index],
      signs: []
    };
  });

  // Redistribute planets for Navamsa chart (mock calculation)
  Object.entries(birthChart).forEach(([rashiKey, rashiData]) => {
    if (rashiData.signs && Array.isArray(rashiData.signs)) {
      rashiData.signs.forEach((planet, index) => {
        // Simple mock Navamsa calculation
        const navamsaRashiIndex = (rashis.indexOf(rashiKey) + index + 3) % 12;
        const navamsaRashiKey = rashis[navamsaRashiIndex];
        
        if (navamsaChart[navamsaRashiKey]) {
          navamsaChart[navamsaRashiKey].signs.push({
            ...planet,
            rashi: rashiNames[navamsaRashiIndex]
          });
          navamsaChart.meta[planet.graha] = {
            ...planet,
            rashi: rashiNames[navamsaRashiIndex]
          };
        }
      });
    }
  });

  return navamsaChart;
}

export async function calculateKundli(birthData: {
  dateString: string;
  timeString: string;
  lat: number;
  lng: number;
  timezone: number;
}): Promise<KundliData> {
  // Generate mock planetary positions
  const planets = generateMockPlanetaryPositions(
    birthData.dateString,
    birthData.timeString,
    birthData.lat,
    birthData.lng,
    birthData.timezone
  );
  
  // Generate birth chart
  const birthChart = generateBirthChart(planets);

  // Generate Navamsa chart
  const navamsaChart = generateNavamsaChart(birthChart);

  return {
    birthChart,
    navamsaChart,
    birthData,
    note: 'This is a mock calculation for demonstration purposes. In production, this would use actual Vedic astrology calculations with Lahiri Ayanamsa.'
  };
}