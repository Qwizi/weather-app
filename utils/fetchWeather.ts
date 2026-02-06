
import { OpenWeatherForecastResponse, OpenWeatherResponse, ReverseGeoResult, GeoResult } from "../lib/types";
import type { FavoriteCity } from "../store/favoritesSlice";

// Client-side wrappers that call our internal API Routes.
// These do NOT need the API Key.

export async function fetchWeather(city: string): Promise<OpenWeatherResponse> {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
        let errorData;
        try { errorData = await res.json(); } catch(e) {}
        throw new Error(errorData?.error || 'Błąd pobierania pogody');
    }
    return await res.json();
}

export async function fetchWeatherByCoords(lat: number, lon: number, apiKey: string): Promise<OpenWeatherResponse> {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) {
        let errorData;
        try { errorData = await res.json(); } catch(e) {}
        throw new Error(errorData?.error || 'Błąd pobierania pogody');
    }
    return await res.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeoResult[]> {
     const res = await fetch(`/api/geo/reverse?lat=${lat}&lon=${lon}`);
     if (!res.ok) {
        throw new Error('Błąd reverse geocoding');
     }
     return await res.json();
}

export async function fetchForecastByCoords(lat: number, lon: number, apiKey: string): Promise<OpenWeatherForecastResponse> {
    const res = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
    if (!res.ok) {
         throw new Error('Błąd pobierania prognozy');
    }
    return await res.json();
}

export async function fetchForecastForCity(city: FavoriteCity, apiKey: string): Promise<OpenWeatherForecastResponse> {
     return fetchForecastByCoords(city.lat, city.lon, apiKey);
}

// Deprecated: Only used if some component directly calls it.
// If SearchBox uses it, it will fail in Docker without key.
// But we assume SearchBox calls fetchWeather.
export async function fetchGeo(city: string, apiKey: string): Promise<GeoResult[]> {
    // We don't have a direct geo API endpoint exposed yet. 
    // Ideally we should add /api/geo/direct if needed.
    // For now, let's assume it's not critical or fall back to client fetch which might fail.
    // But better: throw error to see if it breaks.
    console.warn("Direct fetchGeo called on client");
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geo fetch failed");
    return await res.json();
}
