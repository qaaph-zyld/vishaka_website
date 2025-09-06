import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use dynamic import to avoid CommonJS issues
    const vedicAstrology = await import('vedic-astrology');
    const { positioner } = vedicAstrology;
    
    // Test data - a sample birth details
    const birthData = {
      dateString: '1990-01-01',
      timeString: '12:00:00',
      lat: 28.6139,  // New Delhi
      lng: 77.2090,
      timezone: 5.5  // IST
    };

    console.log('Testing Vedic Astrology calculations...');
    console.log('Birth Data:', birthData);

    // Test basic chart calculation
    const chart = positioner.getBirthChart(
      birthData.dateString,
      birthData.timeString,
      birthData.lat,
      birthData.lng,
      birthData.timezone
    );
    console.log('Birth Chart calculated successfully');

    // Test Navamsa chart
    const navamsaChart = positioner.getNavamsaChart(chart);
    console.log('Navamsa Chart calculated successfully');

    return NextResponse.json({
      birthChart: chart,
      navamsaChart: navamsaChart,
      success: true,
      message: 'Vedic Astrology library test completed successfully'
    });

  } catch (error) {
    console.error('Error testing Vedic Astrology:', error);
    return NextResponse.json({
      error: error.message,
      success: false,
      message: 'Failed to test Vedic Astrology library'
    }, { status: 500 });
  }
}