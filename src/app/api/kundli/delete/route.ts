import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, kundliChartId } = await request.json();

    // Validate input
    if (!userId || !kundliChartId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId, kundliChartId'
      }, { status: 400 });
    }

    // Check if Kundli chart exists and belongs to user
    const kundliChart = await db.kundliChart.findFirst({
      where: {
        id: kundliChartId,
        userId: userId
      }
    });

    if (!kundliChart) {
      return NextResponse.json({
        success: false,
        error: 'Kundli chart not found or access denied'
      }, { status: 404 });
    }

    // Delete Kundli chart
    await db.kundliChart.delete({
      where: { id: kundliChartId }
    });

    return NextResponse.json({
      success: true,
      message: 'Kundli chart deleted successfully'
    });

  } catch (error) {
    console.error('Delete Kundli chart error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}