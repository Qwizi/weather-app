import { NextRequest, NextResponse } from 'next/server';
import { fetchForecastByCoordsDirect } from '@/lib/weather-api';
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
  const cacheKey = `forecast:coords:${lat.toFixed(2)}:${lon.toFixed(2)}`;

  try {
    try {
        const cached = await getCachedData(cacheKey);
        if (cached) {
            console.log(`[Cache Hit] Forecast: ${lat}, ${lon}`);
            return NextResponse.json(cached);
        }
    } catch(err) { console.error("Cache read error", err); }

    const forecast = await fetchForecastByCoordsDirect(lat, lon);
    
    await setCachedData(cacheKey, forecast, 1800); // 30 min
    return NextResponse.json(forecast);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch forecast' }, { status: 500 });
  }
}
