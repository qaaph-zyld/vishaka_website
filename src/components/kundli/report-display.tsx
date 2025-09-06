'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Download, Star, Lightbulb, FileText } from 'lucide-react'

interface KundliReport {
  summary: string
  sections: Array<{
    title: string
    content: string
    importance: 'high' | 'medium' | 'low'
  }>
  recommendations: string[]
}

interface ReportDisplayProps {
  report: KundliReport
  onDownload?: () => void
}

export function ReportDisplay({ report, onDownload }: ReportDisplayProps) {
  const formatMarkdownContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-200">{line.replace('### ', '')}</h3>
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={index} className="text-md font-medium mt-3 mb-1 text-slate-700 dark:text-slate-300">{line.replace(/\*\*/g, '')}</h4>
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mt-1 text-slate-600 dark:text-slate-400">{line.replace('- ', '')}</li>
      } else if (line.trim() === '') {
        return <br key={index} />
      } else {
        return <p key={index} className="text-slate-600 dark:text-slate-400 leading-relaxed">{line}</p>
      }
    })
  }

  const getImportanceColor = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vedic Astrology Report
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your Kundli with detailed interpretations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Star className="h-3 w-3 mr-1" />
                Sidereal Vedic Astrology
              </Badge>
              <Badge variant="outline">
                <BookOpen className="h-3 w-3 mr-1" />
                Whole Sign System
              </Badge>
              <Badge variant="outline">
                Lahiri Ayanamsa
              </Badge>
            </div>
            <Button onClick={onDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {formatMarkdownContent(report.summary)}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <ScrollArea className="h-96 w-full">
            <div className="space-y-4">
              {report.sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <Badge className={getImportanceColor(section.importance)}>
                        {section.importance} importance
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {formatMarkdownContent(section.content)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>
                Practical suggestions based on your astrological chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>This report is generated using authentic Vedic astrology principles with sidereal calculations and Lahiri Ayanamsa.</p>
            <p className="mt-1">For personalized guidance, consider consulting with experienced Vedic astrologers.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}