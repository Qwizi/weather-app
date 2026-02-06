import { NextRequest, NextResponse } from 'next/server';
import { reverseGeocodeDirect } from '@/lib/weather-api';
import { getCachedData, setCachedData } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  if (!latParam || !lonParam) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);
  const cacheKey = `geo:reverse:${lat.toFixed(4)}:${lon.toFixed(4)}`;

  try {
     try {
        const cached = await getCachedData(cacheKey);
        if (cached) {
            console.log(`[Cache Hit] RevGeo: ${lat}, ${lon}`);
            return NextResponse.json(cached);
        }
     } catch(err) { console.error("Cache read error", err); }

    const data = await reverseGeocodeDirect(lat, lon);
    
    await setCachedData(cacheKey, data, 86400); // 24h
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to reverse geocode' }, { status: 500 });
  }
}
