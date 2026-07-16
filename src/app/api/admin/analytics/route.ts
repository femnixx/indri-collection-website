import { NextResponse } from 'next/server';
import { getGA4AnalyticsData } from '@/lib/google-analytics';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Tangkap parameter 'range' dari URL untuk fitur filter tanggal
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Masukkan range ke dalam fungsi
    const liveData = await getGA4AnalyticsData(range);

    if (liveData) {
      return NextResponse.json({
        success: true,
        isMock: false,
        data: liveData
      });
    }
    
    // TAMBAHKAN INI: Balasan jika liveData kosong/env belum diset
    return NextResponse.json({
      success: false,
      isMock: true,
      error: 'Data kosong atau kredensial GA4 belum diset.'
    }, { status: 400 });

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