"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Square, 
  Diamond, 
  RotateCcw, 
  Download, 
  Maximize2,
  Eye,
  Moon,
  Sun
} from "lucide-react";

interface KundliData {
  ascendant: {
    sign: string;
    degree: number;
    minute: number;
    nakshatra: string;
  };
  moonSign: {
    sign: string;
    degree: number;
    minute: number;
    nakshatra: string;
  };
  planets: Array<{
    name: string;
    sign: string;
    signIndex: number;
    degree: number;
    minute: number;
    nakshatra: string;
    nakshatraLord: string;
    house: number;
    isRetrograde: boolean;
  }>;
  houses: Array<{
    number: number;
    sign: string;
    lord: string;
    planets: string[];
  }>;
}

interface KundliChartProps {
  data: KundliData;
  className?: string;
}

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const PLANET_SYMBOLS = {
  'Sun': '☉',
  'Moon': '☽',
  'Mars': '♂',
  'Mercury': '☿',
  'Venus': '♀',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Rahu': '☊',
  'Ketu': '☋'
};

const SIGN_SYMBOLS = {
  'Aries': '♈',
  'Taurus': '♉',
  'Gemini': '♊',
  'Cancer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Scorpio': '♏',
  'Sagittarius': '♐',
  'Capricorn': '♑',
  'Aquarius': '♒',
  'Pisces': '♓'
};

export default function KundliChart({ data, className = "" }: KundliChartProps) {
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [showDegrees, setShowDegrees] = useState(true);
  const [showLords, setShowLords] = useState(true);

  const getHousePlanets = (houseNumber: number) => {
    return data.planets.filter(planet => planet.house === houseNumber);
  };

  const getHouseSign = (houseNumber: number) => {
    const ascendantIndex = SIGNS.indexOf(data.ascendant.sign);
    const signIndex = (ascendantIndex + houseNumber - 1) % 12;
    return SIGNS[signIndex];
  };

  const renderNorthIndianChart = () => {
    const houses = [
      { number: 1, position: 'top', row: 0, col: 2 },
      { number: 2, position: 'top-right', row: 0, col: 3 },
      { number: 3, position: 'right', row: 1, col: 4 },
      { number: 4, position: 'bottom-right', row: 2, col: 4 },
      { number: 5, position: 'bottom', row: 3, col: 3 },
      { number: 6, position: 'bottom-left', row: 3, col: 2 },
      { number: 7, position: 'left', row: 2, col: 1 },
      { number: 8, position: 'top-left', row: 1, col: 1 },
      { number: 9, position: 'center-top', row: 1, col: 2 },
      { number: 10, position: 'center-right', row: 1, col: 3 },
      { number: 11, position: 'center-bottom', row: 2, col: 2 },
      { number: 12, position: 'center-left', row: 2, col: 1 },
    ];

    return (
      <div className="relative w-full max-w-2xl mx-auto aspect-square">
        <div className="grid grid-cols-5 grid-rows-4 gap-0 w-full h-full border-2 border-slate-300 dark:border-slate-600">
          {houses.map((house) => {
            const planets = getHousePlanets(house.number);
            const sign = getHouseSign(house.number);
            const isCenterHouse = house.number >= 9;
            
            return (
              <div
                key={house.number}
                className={`
                  border border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center p-2
                  ${isCenterHouse ? 'bg-slate-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'}
                  ${house.number === 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
                `}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-lg font-bold">{house.number}</span>
                    <span className="text-lg">{SIGN_SYMBOLS[sign as keyof typeof SIGN_SYMBOLS]}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {sign}
                  </div>
                  {showLords && (
                    <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                      Lord: {data.houses[house.number - 1]?.lord}
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-1">
                    {planets.map((planet) => (
                      <div
                        key={planet.name}
                        className="flex flex-col items-center text-xs"
                        title={`${planet.name} in ${planet.sign} ${planet.degree}°${planet.minute}'${planet.isRetrograde ? ' R' : ''}`}
                      >
                        <span className="font-bold">
                          {PLANET_SYMBOLS[planet.name as keyof typeof PLANET_SYMBOLS]}
                        </span>
                        {showDegrees && (
                          <span className="text-[10px] text-slate-500">
                            {planet.degree}°
                          </span>
                        )}
                        {planet.isRetrograde && (
                          <span className="text-red-500 text-[10px]">R</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSouthIndianChart = () => {
    return (
      <div className="relative w-full max-w-2xl mx-auto aspect-square">
        <div className="grid grid-cols-4 grid-rows-4 gap-0 w-full h-full border-2 border-slate-300 dark:border-slate-600">
          {Array.from({ length: 12 }, (_, i) => {
            const houseNumber = i + 1;
            const planets = getHousePlanets(houseNumber);
            const sign = getHouseSign(houseNumber);
            
            // South Indian chart layout
            let row, col;
            if (houseNumber <= 3) {
              row = 0;
              col = houseNumber - 1;
            } else if (houseNumber <= 6) {
              row = houseNumber - 3;
              col = 3;
            } else if (houseNumber <= 9) {
              row = 3;
              col = 9 - houseNumber;
            } else {
              row = 12 - houseNumber;
              col = 0;
            }

            return (
              <div
                key={houseNumber}
                className={`
                  border border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center p-2
                  ${houseNumber === 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-slate-900'}
                `}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <span className="text-lg font-bold">{houseNumber}</span>
                    <span className="text-lg">{SIGN_SYMBOLS[sign as keyof typeof SIGN_SYMBOLS]}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {sign}
                  </div>
                  {showLords && (
                    <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                      Lord: {data.houses[houseNumber - 1]?.lord}
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-1">
                    {planets.map((planet) => (
                      <div
                        key={planet.name}
                        className="flex flex-col items-center text-xs"
                        title={`${planet.name} in ${planet.sign} ${planet.degree}°${planet.minute}'${planet.isRetrograde ? ' R' : ''}`}
                      >
                        <span className="font-bold">
                          {PLANET_SYMBOLS[planet.name as keyof typeof PLANET_SYMBOLS]}
                        </span>
                        {showDegrees && (
                          <span className="text-[10px] text-slate-500">
                            {planet.degree}°
                          </span>
                        )}
                        {planet.isRetrograde && (
                          <span className="text-red-500 text-[10px]">R</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Kundli Chart Visualization</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Sun className="h-3 w-3" />
                <span>{data.ascendant.sign}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Moon className="h-3 w-3" />
                <span>{data.moonSign.sign}</span>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Chart Style:</label>
              <Select value={chartStyle} onValueChange={(value: 'north' | 'south') => setChartStyle(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">
                    <div className="flex items-center space-x-2">
                      <Diamond className="h-4 w-4" />
                      <span>North Indian</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="south">
                    <div className="flex items-center space-x-2">
                      <Square className="h-4 w-4" />
                      <span>South Indian</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showDegrees"
                checked={showDegrees}
                onChange={(e) => setShowDegrees(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showDegrees" className="text-sm font-medium">
                Show Degrees
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showLords"
                checked={showLords}
                onChange={(e) => setShowLords(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showLords" className="text-sm font-medium">
                Show Lords
              </label>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            {chartStyle === 'north' ? renderNorthIndianChart() : renderSouthIndianChart()}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Planets</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(PLANET_SYMBOLS).map(([planet, symbol]) => (
                  <div key={planet} className="flex items-center space-x-1">
                    <span>{symbol}</span>
                    <span>{planet}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Signs</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(SIGN_SYMBOLS).map(([sign, symbol]) => (
                  <div key={sign} className="flex items-center space-x-1">
                    <span>{symbol}</span>
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Symbols</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">1</span>
                  <span>Ascendant House</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">R</span>
                  <span>Retrograde Planet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">12°</span>
                  <span>Planet Degree</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}