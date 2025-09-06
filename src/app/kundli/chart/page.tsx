"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import KundliChart from "@/components/kundli-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  Moon, 
  Sun, 
  Calendar, 
  Clock, 
  MapPin,
  Download,
  Share2,
  Printer
} from "lucide-react";
import Link from "next/link";

interface KundliData {
  birthData: {
    dateString: string;
    timeString: string;
    lat: number;
    lng: number;
    timezone: number;
  };
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
  planetaryPeriods: {
    major: {
      lord: string;
      start: string;
      end: string;
    };
    minor: {
      lord: string;
      start: string;
      end: string;
    };
  };
  panchang: {
    tithi: string;
    karana: string;
    yoga: string;
    vara: string;
    nakshatra: string;
  };
}

export default function KundliChartPage() {
  const [kundliData, setKundliData] = useState<KundliData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we might get the birth data from URL params or localStorage
    // For now, let's use mock data or get it from the API
    const fetchKundliData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get birth data from localStorage (set by the form page)
        const savedBirthData = localStorage.getItem('kundliBirthData');
        
        if (savedBirthData) {
          const birthData = JSON.parse(savedBirthData);
          
          const response = await fetch('/api/kundli/calculate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(birthData),
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || 'Failed to calculate Kundli');
          }

          setKundliData(result.data);
        } else {
          // If no saved data, redirect to the form
          router.push('/kundli');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKundliData();
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (kundliData) {
      const dataStr = JSON.stringify(kundliData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kundli-${kundliData.birthData.dateString}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Calculating your Kundli...</p>
        </div>
      </div>
    );
  }

  if (error || !kundliData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Failed to load Kundli data'}</p>
            <Link href="/kundli">
              <Button>Go Back to Form</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kundli" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8">
                  <img
                    src="/logo.png"
                    alt="Vishaka Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Vishaka Kundli</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Vedic Birth Chart</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Birth Details Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Birth Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                  <p className="font-medium">{kundliData.birthData.dateString}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                  <p className="font-medium">{kundliData.birthData.timeString}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                  <p className="font-medium">{kundliData.birthData.lat}°N, {kundliData.birthData.lng}°E</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Key Points</p>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {kundliData.ascendant.sign} Asc
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {kundliData.moonSign.sign} Moon
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kundli Chart */}
        <KundliChart data={kundliData} />

        {/* Additional Details */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Planetary Positions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Planetary Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kundliData.planets.map((planet) => (
                  <div key={planet.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">
                        {planet.name === 'Sun' ? '☉' : 
                         planet.name === 'Moon' ? '☽' :
                         planet.name === 'Mars' ? '♂' :
                         planet.name === 'Mercury' ? '☿' :
                         planet.name === 'Venus' ? '♀' :
                         planet.name === 'Jupiter' ? '♃' :
                         planet.name === 'Saturn' ? '♄' :
                         planet.name === 'Rahu' ? '☊' : '☋'}
                      </span>
                      <div>
                        <p className="font-medium">{planet.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {planet.sign} {planet.degree}°{planet.minute}'
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">House {planet.house}</Badge>
                        {planet.isRetrograde && (
                          <Badge variant="destructive" className="text-xs">R</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {planet.nakshatra}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Dasha & Panchang */}
          <div className="space-y-6">
            {/* Current Dasha */}
            <Card>
              <CardHeader>
                <CardTitle>Current Planetary Period (Dasha)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Mahadasha</span>
                      <Badge>{kundliData.planetaryPeriods.major.lord}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {kundliData.planetaryPeriods.major.start} - {kundliData.planetaryPeriods.major.end}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Antardasha</span>
                      <Badge>{kundliData.planetaryPeriods.minor.lord}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {kundliData.planetaryPeriods.minor.start} - {kundliData.planetaryPeriods.minor.end}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Panchang */}
            <Card>
              <CardHeader>
                <CardTitle>Panchang at Birth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tithi</p>
                    <p className="font-medium">{kundliData.panchang.tithi}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Karana</p>
                    <p className="font-medium">{kundliData.panchang.karana}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Yoga</p>
                    <p className="font-medium">{kundliData.panchang.yoga}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Weekday</p>
                    <p className="font-medium">{kundliData.panchang.vara}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Birth Nakshatra</p>
                  <p className="font-medium">{kundliData.panchang.nakshatra}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}