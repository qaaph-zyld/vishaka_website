'use client'

import { useState } from 'react'
import { BirthForm } from '@/components/kundli/birth-form'
import { ChartVisualization } from '@/components/kundli/chart-visualization'
import { ReportDisplay } from '@/components/kundli/report-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Moon, Sun, BookOpen, Users, Calculator, MapPin, Clock, Calendar, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { BirthChart, KundliReport } from '@/lib/kundli-engine'

interface BirthData {
  dateString: string
  timeString: string
  lat: number
  lng: number
  timezone: number
  placeName: string
}

interface KundliResult {
  birthChart: BirthChart
  navamsaChart: BirthChart
  birthData: BirthData
}

export default function KundliPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null)
  const [chartType, setChartType] = useState<'birth' | 'navamsa'>('birth')
  const [report, setReport] = useState<KundliReport | null>(null)

  const handleFormSubmit = async (birthData: BirthData) => {
    setIsLoading(true)
    setReport(null) // Clear previous report
    
    try {
      const response = await fetch('/api/kundli/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateString: birthData.dateString,
          timeString: birthData.timeString,
          lat: birthData.lat,
          lng: birthData.lng,
          timezone: birthData.timezone,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setKundliResult({
          ...result.data,
          birthData
        })
        toast.success('Kundli calculated successfully!')
      } else {
        toast.error(result.error || 'Failed to calculate Kundli')
      }
    } catch (error) {
      console.error('Error calculating Kundli:', error)
      toast.error('Failed to calculate Kundli. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!kundliResult) return
    
    setIsGeneratingReport(true)
    
    try {
      const response = await fetch('/api/kundli/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateString: kundliResult.birthData.dateString,
          timeString: kundliResult.birthData.timeString,
          lat: kundliResult.birthData.lat,
          lng: kundliResult.birthData.lng,
          timezone: kundliResult.birthData.timezone,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setReport(result.data.report)
        toast.success('Kundli report generated successfully!')
      } else {
        toast.error(result.error || 'Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleDownloadReport = () => {
    toast.info('PDF download functionality will be available soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Vedic Kundli Generator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate authentic Vedic astrology charts using traditional sidereal calculations with Lahiri Ayanamsa
          </p>
        </div>

        {/* Birth Form */}
        {!kundliResult && (
          <BirthForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}

        {/* Results */}
        {kundliResult && (
          <div className="space-y-6">
            {/* Birth Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Birth Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-medium">{kundliResult.birthData.dateString}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Time</p>
                      <p className="font-medium">{kundliResult.birthData.timeString}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Place</p>
                      <p className="font-medium">{kundliResult.birthData.placeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Coordinates</p>
                      <p className="font-medium">
                        {kundliResult.birthData.lat.toFixed(4)}°, {kundliResult.birthData.lng.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="charts">Charts & Analysis</TabsTrigger>
                <TabsTrigger value="report">Detailed Report</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts" className="space-y-6">
                {/* Chart Visualization */}
                <ChartVisualization
                  birthChart={kundliResult.birthChart}
                  navamsaChart={kundliResult.navamsaChart}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                />

                {/* Generate Report Button */}
                {!report && (
                  <div className="text-center">
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGeneratingReport}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FileText className="h-5 w-5" />
                      {isGeneratingReport ? 'Generating Report...' : 'Generate Detailed Report'}
                    </button>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Get a comprehensive Vedic astrology analysis of your Kundli
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="report" className="space-y-6">
                {report ? (
                  <ReportDisplay 
                    report={report} 
                    onDownload={handleDownloadReport}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                        No Report Generated Yet
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
                        Generate a detailed Vedic astrology report to get comprehensive insights into your Kundli.
                      </p>
                      <button
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                      </button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setKundliResult(null)
                  setReport(null)
                }}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Generate New Kundli
              </button>
              <button
                onClick={() => {
                  // Placeholder for save functionality
                  toast.info('Save functionality will be available soon!')
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Kundli
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}