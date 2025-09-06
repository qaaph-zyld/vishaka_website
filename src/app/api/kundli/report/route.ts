import { NextRequest, NextResponse } from 'next/server'
import { calculateKundli } from '@/lib/kundli-engine'
import { generateKundliReport } from '@/lib/kundli-report'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { dateString, timeString, lat, lng, timezone } = body
    
    if (!dateString || !timeString || lat === undefined || lng === undefined || timezone === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: dateString, timeString, lat, lng, timezone'
      }, { status: 400 })
    }

    // Validate data formats
    if (typeof dateString !== 'string' || typeof timeString !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'dateString and timeString must be strings'
      }, { status: 400 });
    }

    if (typeof lat !== 'number' || typeof lng !== 'number' || typeof timezone !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'lat, lng, and timezone must be numbers'
      }, { status: 400 });
    }

    // Calculate Kundli
    const kundliData = await calculateKundli({
      dateString,
      timeString,
      lat,
      lng,
      timezone
    })

    // Generate report
    const report = generateKundliReport(kundliData)

    return NextResponse.json({
      success: true,
      data: {
        kundliData,
        report,
        generatedAt: new Date().toISOString()
      },
      message: 'Kundli report generated successfully'
    })

  } catch (error) {
    console.error('Error generating Kundli report:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}