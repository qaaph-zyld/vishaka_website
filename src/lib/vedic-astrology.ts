// Server-side Vedic astrology calculations utility
// This will only be imported and used on the server side

interface BirthData {
  dateString: string;
  timeString: string;
  lat: number;
  lng: number;
  timezone: number;
}

interface PlanetPosition {
  graha: string;
  rashi: string;
  nakshatra: string;
  longitude: number;
  isRetrograde: boolean;
}

interface BirthChart {
  [key: string]: {
    rashi: string;
    signs: PlanetPosition[];
  } & {
    meta: {
      [key: string]: PlanetPosition;
    };
  };
}

// This function will only be called on the server side
export async function calculateBirthChart(birthData: BirthData): Promise<{
  birthChart: BirthChart;
  navamsaChart: BirthChart;
  success: boolean;
  error?: string;
}> {
  try {
    // Dynamic import to avoid bundling issues
    const vedicAstrology = await import('vedic-astrology');
    const { positioner } = vedicAstrology;
    
    // Calculate birth chart
    const birthChart = positioner.getBirthChart(
      birthData.dateString,
      birthData.timeString,
      birthData.lat,
      birthData.lng,
      birthData.timezone
    );

    // Calculate Navamsa chart
    const navamsaChart = positioner.getNavamsaChart(birthChart);

    return {
      birthChart,
      navamsaChart,
      success: true
    };

  } catch (error) {
    console.error('Error calculating birth chart:', error);
    return {
      birthChart: {} as BirthChart,
      navamsaChart: {} as BirthChart,
      success: false,
      error: error.message
    };
  }
}

// Get planetary positions only
export async function getPlanetaryPositions(birthData: BirthData): Promise<{
  planets: PlanetPosition[];
  success: boolean;
  error?: string;
}> {
  try {
    const result = await calculateBirthChart(birthData);
    
    if (!result.success) {
      return {
        planets: [],
        success: false,
        error: result.error
      };
    }

    // Extract planetary positions from the birth chart
    const planets: PlanetPosition[] = [];
    Object.values(result.birthChart.meta).forEach((planet: PlanetPosition) => {
      if (planet.graha) {
        planets.push(planet);
      }
    });

    return {
      planets,
      success: true
    };

  } catch (error) {
    console.error('Error getting planetary positions:', error);
    return {
      planets: [],
      success: false,
      error: error.message
    };
  }
}

// Get house information
export async function getHouseInformation(birthData: BirthData): Promise<{
  houses: { [key: string]: PlanetPosition[] };
  success: boolean;
  error?: string;
}> {
  try {
    const result = await calculateBirthChart(birthData);
    
    if (!result.success) {
      return {
        houses: {},
        success: false,
        error: result.error
      };
    }

    // Extract house information (each house corresponds to a rashi in whole sign system)
    const houses: { [key: string]: PlanetPosition[] } = {};
    Object.entries(result.birthChart).forEach(([rashiKey, rashiData]) => {
      if (rashiData.signs && Array.isArray(rashiData.signs)) {
        houses[rashiKey] = rashiData.signs;
      }
    });

    return {
      houses,
      success: true
    };

  } catch (error) {
    console.error('Error getting house information:', error);
    return {
      houses: {},
      success: false,
      error: error.message
    };
  }
}