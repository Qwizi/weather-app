import { NextRequest, NextResponse } from 'next/server';
import { fetchGeoDirect, fetchWeatherByCoordsDirect } from '@/lib/weather-api';
import { getCachedData, setCachedData } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');

  if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      console.error("Missing API Key on Server");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    if (city) {
      const cacheKey = `weather:city:${city.toLowerCase()}`;
      try {
        const cached = await getCachedData(cacheKey);
        if (cached) {
            console.log(`[Cache Hit] City: ${city}`);
            return NextResponse.json(cached);
        }
      } catch (err) { console.error("Cache read error", err); }

      console.log(`[Cache Miss] City: ${city}`);
      const geo = await fetchGeoDirect(city);
      if (geo.length === 0) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
      
      const { lat, lon } = geo[0];
      const weather = await fetchWeatherByCoordsDirect(lat, lon);
      
      await setCachedData(cacheKey, weather, 600); 
      return NextResponse.json(weather);
    } 
    
    else if (latParam && lonParam) {
      const lat = parseFloat(latParam);
      const lon = parseFloat(lonParam);
      
      const cacheKey = `weather:coords:${lat.toFixed(2)}:${lon.toFixed(2)}`;
      
      try {
        const cached = await getCachedData(cacheKey);
        if (cached) {
            console.log(`[Cache Hit] Coords: ${lat}, ${lon}`);
            return NextResponse.json(cached);
        }
      } catch (err) { console.error("Cache read error", err); }

      console.log(`[Cache Miss] Coords: ${lat}, ${lon}`);
      const weather = await fetchWeatherByCoordsDirect(lat, lon);
      
      await setCachedData(cacheKey, weather, 600);
      return NextResponse.json(weather);
    }

    return NextResponse.json({ error: 'Missing city or coordinates' }, { status: 400 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch weather data' }, { status: 500 });
  }
}
