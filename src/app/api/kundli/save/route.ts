import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, name, birthData, kundliData, isPublic = false } = await request.json();

    // Validate input
    if (!userId || !birthData || !kundliData) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId, birthData, kundliData'
      }, { status: 400 });
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Save Kundli chart
    const kundliChart = await db.kundliChart.create({
      data: {
        userId,
        name: name || null,
        birthData: JSON.stringify(birthData),
        kundliData: JSON.stringify(kundliData),
        isPublic
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kundli chart saved successfully',
      kundliChart: {
        id: kundliChart.id,
        name: kundliChart.name,
        createdAt: kundliChart.createdAt,
        isPublic: kundliChart.isPublic
      }
    });

  } catch (error) {
    console.error('Save Kundli chart error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user's Kundli charts
    const kundliCharts = await db.kundliChart.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        isPublic: true,
        birthData: true
      }
    });

    return NextResponse.json({
      success: true,
      kundliCharts: kundliCharts.map(chart => ({
        ...chart,
        birthData: JSON.parse(chart.birthData)
      }))
    });

  } catch (error) {
    console.error('Get Kundli charts error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}