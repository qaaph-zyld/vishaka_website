"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Printer,
  FileText,
  BookOpen,
  Eye
} from "lucide-react";
import Link from "next/link";
import { marked } from 'marked';

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

interface ReportData {
  kundliData: KundliData;
  report: string;
  generatedAt: string;
}

export default function KundliReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get birth data from localStorage
        const savedBirthData = localStorage.getItem('kundliBirthData');
        
        if (savedBirthData) {
          const birthData = JSON.parse(savedBirthData);
          
          const response = await fetch('/api/kundli/report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(birthData),
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || 'Failed to generate report');
          }

          setReportData(result.data);
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

    fetchReportData();
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (reportData) {
      const reportText = reportData.report;
      const dataBlob = new Blob([reportText], { type: 'text/markdown' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kundli-report-${reportData.kundliData.birthData.dateString}.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderMarkdown = (markdown: string) => {
    return { __html: marked(markdown) };
  };

  const getReportSections = () => {
    if (!reportData) return [];
    
    const sections = [
      { id: 'overview', title: 'Overview', icon: Eye },
      { id: 'planetary', title: 'Planetary Analysis', icon: Star },
      { id: 'houses', title: 'House Analysis', icon: BookOpen },
      { id: 'dasha', title: 'Dasha Periods', icon: Clock },
      { id: 'panchang', title: 'Panchang', icon: Calendar },
      { id: 'recommendations', title: 'Recommendations', icon: FileText },
    ];
    
    return sections;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Generating your comprehensive Kundli report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Failed to generate report'}</p>
            <Link href="/kundli">
              <Button>Go Back to Form</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { kundliData, report } = reportData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
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
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Vishaka Report</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Complete Vedic Astrology Analysis</p>
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Report Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {getReportSections().map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Birth Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
                    <p className="font-medium text-sm">{kundliData.birthData.dateString}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                    <p className="font-medium text-sm">{kundliData.birthData.timeString}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                    <p className="font-medium text-sm">{kundliData.birthData.lat}°N, {kundliData.birthData.lng}°E</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ascendant</p>
                    <p className="font-medium text-sm">{kundliData.ascendant.sign}</p>
                  </div>
                  <Badge variant="secondary">{kundliData.ascendant.nakshatra}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Moon Sign</p>
                    <p className="font-medium text-sm">{kundliData.moonSign.sign}</p>
                  </div>
                  <Badge variant="secondary">{kundliData.moonSign.nakshatra}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Report Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {activeSection === 'overview' && (
                    <div>
                      <h1 className="text-3xl font-bold mb-6">Vedic Astrology Whole Sign Report</h1>
                      <div 
                        className="report-content"
                        dangerouslySetInnerHTML={renderMarkdown(report)}
                      />
                    </div>
                  )}
                  
                  {activeSection === 'planetary' && (
                    <div>
                      <h1 className="text-3xl font-bold mb-6">Planetary Analysis</h1>
                      <div className="space-y-6">
                        {kundliData.planets.map((planet) => (
                          <div key={planet.name} className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-xl font-semibold mb-2">
                              {planet.name} in {planet.sign}
                              {planet.isRetrograde && (
                                <Badge variant="destructive" className="ml-2">Retrograde</Badge>
                              )}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                              Position: {planet.degree}°{planet.minute}′ in House {planet.house}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                              Nakshatra: {planet.nakshatra} (Lord: {planet.nakshatraLord})
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded">
                              <h4 className="font-medium mb-2">Interpretation:</h4>
                              <p className="text-sm">
                                {planet.name} in {planet.sign} indicates {
                                  planet.name === 'Sun' ? 'a strong sense of identity and creative expression' :
                                  planet.name === 'Moon' ? 'emotional sensitivity and nurturing qualities' :
                                  planet.name === 'Mars' ? 'courage, energy, and assertiveness' :
                                  planet.name === 'Mercury' ? 'intellectual abilities and communication skills' :
                                  planet.name === 'Venus' ? 'love, beauty, and harmonious relationships' :
                                  planet.name === 'Jupiter' ? 'wisdom, expansion, and good fortune' :
                                  planet.name === 'Saturn' ? 'discipline, responsibility, and life lessons' :
                                  planet.name === 'Rahu' ? 'ambition, material desires, and transformation' :
                                  'spirituality, detachment, and liberation'
                                }.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === 'houses' && (
                    <div>
                      <h1 className="text-3xl font-bold mb-6">House Analysis</h1>
                      <div className="grid gap-6">
                        {kundliData.houses.map((house) => (
                          <div key={house.number} className="border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-semibold">House {house.number} - {house.sign}</h3>
                              <Badge>Lord: {house.lord}</Badge>
                            </div>
                            {house.planets.length > 0 && (
                              <div className="mb-4">
                                <p className="font-medium mb-2">Planets in this house:</p>
                                <div className="flex flex-wrap gap-2">
                                  {house.planets.map((planet) => (
                                    <Badge key={planet} variant="secondary">{planet}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded">
                              <h4 className="font-medium mb-2">Significance:</h4>
                              <p className="text-sm">
                                {house.number === 1 && 'Represents self, personality, physical appearance, and how you project yourself to the world.'}
                                {house.number === 2 && 'Represents wealth, family, speech, and accumulated resources.'}
                                {house.number === 3 && 'Represents courage, siblings, communication, and short travels.'}
                                {house.number === 4 && 'Represents home, mother, emotions, and property.'}
                                {house.number === 5 && 'Represents creativity, romance, children, and speculative gains.'}
                                {house.number === 6 && 'Represents health, enemies, obstacles, and service.'}
                                {house.number === 7 && 'Represents partnerships, marriage, business, and relationships.'}
                                {house.number === 8 && 'Represents transformation, longevity, inheritance, and occult matters.'}
                                {house.number === 9 && 'Represents fortune, higher learning, spirituality, and long journeys.'}
                                {house.number === 10 && 'Represents career, status, achievements, and public life.'}
                                {house.number === 11 && 'Represents gains, friends, hopes, and aspirations.'}
                                {house.number === 12 && 'Represents losses, expenses, foreign lands, and spiritual liberation.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === 'dasha' && (
                    <div>
                      <h1 className="text-3xl font-bold mb-6">Dasha Period Analysis</h1>
                      <div className="space-y-6">
                        <div className="border-l-4 border-amber-500 pl-4">
                          <h3 className="text-xl font-semibold mb-2">Current Mahadasha</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Lord</p>
                              <p className="font-medium text-lg">{kundliData.planetaryPeriods.major.lord}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Period</p>
                              <p className="font-medium text-lg">{kundliData.planetaryPeriods.major.start} - {kundliData.planetaryPeriods.major.end}</p>
                            </div>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded mt-4">
                            <h4 className="font-medium mb-2">Effects of {kundliData.planetaryPeriods.major.lord} Mahadasha:</h4>
                            <p className="text-sm">
                              This period will bring significant changes related to {
                                kundliData.planetaryPeriods.major.lord === 'Sun' ? 'career, authority, and self-expression' :
                                kundliData.planetaryPeriods.major.lord === 'Moon' ? 'emotions, home, and family life' :
                                kundliData.planetaryPeriods.major.lord === 'Mars' ? 'courage, competition, and physical energy' :
                                kundliData.planetaryPeriods.major.lord === 'Mercury' ? 'communication, business, and intellectual pursuits' :
                                kundliData.planetaryPeriods.major.lord === 'Venus' ? 'relationships, luxury, and creative arts' :
                                kundliData.planetaryPeriods.major.lord === 'Jupiter' ? 'wisdom, expansion, and spiritual growth' :
                                kundliData.planetaryPeriods.major.lord === 'Saturn' ? 'discipline, responsibility, and karmic lessons' :
                                kundliData.planetaryPeriods.major.lord === 'Rahu' ? 'ambition, material success, and transformation' :
                                'spirituality, detachment, and liberation'
                              }.
                            </p>
                          </div>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h3 className="text-xl font-semibold mb-2">Current Antardasha</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Lord</p>
                              <p className="font-medium text-lg">{kundliData.planetaryPeriods.minor.lord}</p>
                            </div>
                            <div>
                              <p className="text-slate-600 dark:text-slate-400">Period</p>
                              <p className="font-medium text-lg">{kundliData.planetaryPeriods.minor.start} - {kundliData.planetaryPeriods.minor.end}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'panchang' && (
                    <div>
                      <h1 className="text-3xl font-bold mb-6">Panchang at Birth</h1>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Tithi (Lunar Day)</h3>
                            <p className="text-2xl font-bold text-blue-600">{kundliData.panchang.tithi}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                              Influences mental state and emotional well-being
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Karana</h3>
                            <p className="text-2xl font-bold text-green-600">{kundliData.panchang.karana}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                              Affects success in activities and undertakings
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Yoga</h3>
                            <p className="text-2xl font-bold text-purple-600">{kundliData.panchang.yoga}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                              Indicates overall auspiciousness and fortune
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Vara (Weekday)</h3>
                            <p className="text-2xl font-bold text-orange-600">{kundliData.panchang.vara}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                              Ruling planet influences daily activities
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                        <h3 className="font-semibold mb-2">Birth Nakshatra</h3>
                        <p className="text-2xl font-bold text-indigo-600">{kundliData.panchang.nakshatra}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Most important factor in Vedic astrology, influences personality, career, and life path
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'recommendations' && (
                    <div>
                      <h1 className="text-3xl font-bold mb-6">Recommendations & Remedies</h1>
                      <div className="space-y-6">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h3 className="text-xl font-semibold mb-3">General Life Guidance</h3>
                          <div className="space-y-3">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                              <h4 className="font-medium mb-1">Career & Profession</h4>
                              <p className="text-sm">
                                Based on your 10th house placement and planetary positions, careers in {
                                  kundliData.houses[9]?.sign === 'Aries' ? 'leadership, sports, or military' :
                                  kundliData.houses[9]?.sign === 'Taurus' ? 'finance, banking, or beauty' :
                                  kundliData.houses[9]?.sign === 'Gemini' ? 'communication, media, or technology' :
                                  kundliData.houses[9]?.sign === 'Cancer' ? 'healthcare, education, or hospitality' :
                                  kundliData.houses[9]?.sign === 'Leo' ? 'entertainment, politics, or management' :
                                  'business, consulting, or research'
                                } may be suitable for you.
                              </p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                              <h4 className="font-medium mb-1">Relationships</h4>
                              <p className="text-sm">
                                Your {kundliData.moonSign.sign} Moon suggests you seek {
                                  kundliData.moonSign.sign === 'Aries' ? 'excitement and independence' :
                                  kundliData.moonSign.sign === 'Taurus' ? 'stability and security' :
                                  kundliData.moonSign.sign === 'Gemini' ? 'intellectual stimulation and variety' :
                                  kundliData.moonSign.sign === 'Cancer' ? 'emotional connection and nurturing' :
                                  kundliData.moonSign.sign === 'Leo' ? 'appreciation and loyalty' :
                                  'harmony and intellectual compatibility'
                                } in relationships.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                          <h3 className="text-xl font-semibold mb-3">Spiritual Practices</h3>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                            <p className="text-sm mb-3">
                              Based on your birth chart, the following spiritual practices may be beneficial:
                            </p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              <li>Meditation during {kundliData.moonSign.nakshatra} nakshatra hours</li>
                              <li>Worship of {kundliData.ascendant.nakshatra} deity</li>
                              <li>Chanting mantras for {kundliData.planetaryPeriods.major.lord}</li>
                              <li>Charity on {kundliData.panchang.vara.toLowerCase()}</li>
                            </ul>
                          </div>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-4">
                          <h3 className="text-xl font-semibold mb-3">Health & Wellness</h3>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                            <p className="text-sm">
                              Pay attention to your 6th house influences and maintain regular health checkups. 
                              The placement of {kundliData.planets.find(p => p.house === 6)?.name || 'no planets'} 
                              in your 6th house suggests focusing on {
                                kundliData.planets.find(p => p.house === 6)?.name === 'Sun' ? 'heart health and vitality' :
                                kundliData.planets.find(p => p.house === 6)?.name === 'Moon' ? 'mental and emotional well-being' :
                                kundliData.planets.find(p => p.house === 6)?.name === 'Mars' ? 'physical fitness and injury prevention' :
                                kundliData.planets.find(p => p.house === 6)?.name === 'Mercury' ? 'nervous system and respiratory health' :
                                'overall wellness and preventive care'
                              }.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Footer */}
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>Report generated on {new Date(reportData.generatedAt).toLocaleDateString()} at {new Date(reportData.generatedAt).toLocaleTimeString()}</p>
              <p className="mt-1">© 2024 Vishaka - Vedic Astrology Wisdom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}