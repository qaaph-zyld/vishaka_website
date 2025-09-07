declare module 'vedic-astrology' {
  interface ChartOptions {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    lat: number;
    lng: number;
    tzone: number;
    settings: {
      ayanamsha: string;
      sidereal: boolean;
      houseSystem: string;
      aspectPoints: string[];
      aspectWithOrb: boolean;
      aspectOrbs: Record<string, number>;
    };
  }

  interface PlanetPosition {
    name: string;
    longitude: number;
    latitude: number;
    distance: number;
    speed: number;
    sign: string;
    signNum: number;
    house: number;
    nakshatra: string;
    nakshatraLord: string;
    nakshatraPada: number;
  }

  interface HouseCusp {
    house: number;
    position: number;
    sign: string;
    signNum: number;
  }

  interface Aspect {
    from: string;
    to: string;
    aspect: string;
    orb: number;
  }

  interface ChartData {
    planets: PlanetPosition[];
    houses: HouseCusp[];
    ascendant: number;
    mc: number;
    vertex: number;
    aspects: Aspect[];
  }

  export function calculate(options: ChartOptions): Promise<ChartData>;
}
