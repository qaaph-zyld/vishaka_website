'use client'

import { BirthChart } from '@/lib/kundli-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Download, RotateCcw } from 'lucide-react'

interface ChartVisualizationProps {
  birthChart: BirthChart
  navamsaChart: BirthChart
  chartType: 'birth' | 'navamsa'
  onChartTypeChange: (type: 'birth' | 'navamsa') => void
}

const RASHI_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
const RASHI_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
const PLANET_SYMBOLS = {
  'Sun': '☉',
  'Moon': '☽',
  'Mars': '♂',
  'Mercury': '☿',
  'Jupiter': '♃',
  'Venus': '♀',
  'Saturn': '♄',
  'Rahu': '☊',
  'Ketu': '☋'
}

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

export function ChartVisualization({ birthChart, navamsaChart, chartType, onChartTypeChange }: ChartVisualizationProps) {
  const currentChart = chartType === 'birth' ? birthChart : navamsaChart
  const chartTitle = chartType === 'birth' ? 'Birth Chart (Rashi)' : 'Navamsa Chart (D-9)'

  // North Indian Chart Style (Diamond shape)
  const renderNorthIndianChart = () => {
    const houses = [
      { position: 'top', rashi: 3, index: 2 },    // Gemini
      { position: 'top-right', rashi: 4, index: 3 }, // Cancer
      { position: 'right', rashi: 5, index: 4 },   // Leo
      { position: 'bottom-right', rashi: 6, index: 5 }, // Virgo
      { position: 'bottom', rashi: 7, index: 6 },   // Libra
      { position: 'bottom-left', rashi: 8, index: 7 }, // Scorpio
      { position: 'left', rashi: 9, index: 8 },    // Sagittarius
      { position: 'top-left', rashi: 10, index: 9 }, // Capricorn
      { position: 'center-top', rashi: 0, index: 11 }, // Aries
      { position: 'center-right', rashi: 1, index: 0 }, // Taurus
      { position: 'center-bottom', rashi: 11, index: 10 }, // Pisces
      { position: 'center-left', rashi: 2, index: 1 }  // Aquarius
    ]

    return (
      <div className="relative w-96 h-96 mx-auto">
        {/* Outer diamond */}
        <div className="absolute inset-0 border-4 border-slate-800 dark:border-slate-200 transform rotate-45"></div>
        
        {/* Inner diamond */}
        <div className="absolute inset-8 border-2 border-slate-600 dark:border-slate-400 transform rotate-45"></div>
        
        {/* House divisions */}
        <div className="absolute inset-16 border border-slate-400 dark:border-slate-600 transform rotate-45"></div>
        
        {/* Houses */}
        {houses.map((house, index) => {
          const rashiKey = RASHI_NAMES[house.rashi].toLowerCase()
          const rashiData = currentChart[rashiKey]
          const planets = rashiData?.signs || []
          
          return (
            <div
              key={index}
              className={`absolute flex flex-col items-center justify-center p-2 text-xs font-medium ${
                house.position.includes('center') ? 'bg-white dark:bg-slate-800' : ''
              }`}
              style={{
                top: getHousePosition(house.position).top,
                left: getHousePosition(house.position).left,
                transform: house.position.includes('center') ? 'none' : 'rotate(-45deg)',
                width: house.position.includes('center') ? '25%' : '33.33%',
                height: house.position.includes('center') ? '25%' : '33.33%'
              }}
            >
              <div className="text-lg mb-1">
                {RASHI_SYMBOLS[house.rashi]}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                {house.rashi + 1}
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {planets.map((planet, pIndex) => (
                  <div key={pIndex} className="text-xs">
                    {PLANET_SYMBOLS[planet.graha as keyof typeof PLANET_SYMBOLS] || planet.graha.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        
        {/* Center label */}
        <div className="absolute inset-1/3 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full w-16 h-16">
          <div className="text-xs text-center">
            <div className="font-bold">{chartType === 'birth' ? 'Rashi' : 'D-9'}</div>
          </div>
        </div>
      </div>
    )
  }

  // South Indian Chart Style (Square grid)
  const renderSouthIndianChart = () => {
    const grid = [
      [11, 0, 1],  // Pisces, Aries, Taurus
      [10, null, 2], // Aquarius, (center), Gemini
      [9, 8, 7]    // Capricorn, Sagittarius, Scorpio
    ]

    return (
      <div className="relative w-96 h-96 mx-auto border-4 border-slate-800 dark:border-slate-200">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="border border-slate-400 dark:border-slate-600"></div>
          ))}
        </div>
        
        {/* Houses */}
        {grid.map((row, rowIndex) =>
          row.map((rashiIndex, colIndex) => {
            if (rashiIndex === null) {
              // Center cell
              return (
                <div
                  key="center"
                  className="absolute inset-1/3 flex items-center justify-center bg-white dark:bg-slate-800"
                  style={{
                    top: '33.33%',
                    left: '33.33%',
                    width: '33.33%',
                    height: '33.33%'
                  }}
                >
                  <div className="text-center">
                    <div className="font-bold text-sm">{chartType === 'birth' ? 'Rashi' : 'D-9'}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Chart</div>
                  </div>
                </div>
              )
            }

            const rashiKey = RASHI_NAMES[rashiIndex].toLowerCase()
            const rashiData = currentChart[rashiKey]
            const planets = rashiData?.signs || []

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute flex flex-col items-center justify-center p-2"
                style={{
                  top: `${rowIndex * 33.33}%`,
                  left: `${colIndex * 33.33}%`,
                  width: '33.33%',
                  height: '33.33%'
                }}
              >
                <div className="text-lg mb-1">
                  {RASHI_SYMBOLS[rashiIndex]}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  {rashiIndex + 1}
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {planets.map((planet, pIndex) => (
                    <div key={pIndex} className="text-xs">
                      {PLANET_SYMBOLS[planet.graha as keyof typeof PLANET_SYMBOLS] || planet.graha.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    )
  }

  const getHousePosition = (position: string) => {
    const positions: Record<string, { top: string; left: string }> = {
      'top': { top: '0%', left: '33.33%' },
      'top-right': { top: '0%', left: '66.66%' },
      'right': { top: '33.33%', left: '66.66%' },
      'bottom-right': { top: '66.66%', left: '66.66%' },
      'bottom': { top: '66.66%', left: '33.33%' },
      'bottom-left': { top: '66.66%', left: '0%' },
      'left': { top: '33.33%', left: '0%' },
      'top-left': { top: '0%', left: '0%' },
      'center-top': { top: '16.66%', left: '37.5%' },
      'center-right': { top: '37.5%', left: '62.5%' },
      'center-bottom': { top: '62.5%', left: '37.5%' },
      'center-left': { top: '37.5%', left: '16.66%' }
    }
    return positions[position] || { top: '50%', left: '50%' }
  }

  const renderPlanetLegend = () => {
    const allPlanets = Object.values(currentChart.meta)
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Planetary Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPlanets.map((planet, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {PLANET_SYMBOLS[planet.graha as keyof typeof PLANET_SYMBOLS] || planet.graha.charAt(0)}
                  </span>
                  <span className="font-medium">{planet.graha}</span>
                </div>
                <div className="text-right text-sm">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {planet.rashi}
                    </Badge>
                    {planet.isRetrograde && (
                      <Badge variant="destructive" className="text-xs">
                        R
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {planet.nakshatra}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex justify-center">
        <Tabs value={chartType} onValueChange={(value) => onChartTypeChange(value as 'birth' | 'navamsa')}>
          <TabsList>
            <TabsTrigger value="birth">Birth Chart</TabsTrigger>
            <TabsTrigger value="navamsa">Navamsa Chart</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chart Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{chartTitle}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Rotate
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Traditional Vedic astrology chart visualization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="north" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="north">North Indian Style</TabsTrigger>
              <TabsTrigger value="south">South Indian Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="north" className="space-y-4">
              <div className="flex justify-center py-4">
                {renderNorthIndianChart()}
              </div>
            </TabsContent>
            
            <TabsContent value="south" className="space-y-4">
              <div className="flex justify-center py-4">
                {renderSouthIndianChart()}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Planet Legend */}
      {renderPlanetLegend()}
    </div>
  )
}