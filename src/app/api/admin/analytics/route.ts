import { NextResponse } from 'next/server';
import { getGA4AnalyticsData } from '@/lib/google-analytics';
import { getMockAnalyticsData } from '@/lib/mock-analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const liveData = await getGA4AnalyticsData();

    if (liveData) {
      return NextResponse.json({
        success: true,
        isMock: false,
        data: liveData
      });
    }

    const mockData = getMockAnalyticsData();
    return NextResponse.json({
      success: true,
      isMock: true,
      data: mockData
    });
  } catch (error: any) {
    console.error('Error in GA4 analytics API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
