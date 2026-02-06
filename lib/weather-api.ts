
import { OpenWeatherResponse, OpenWeatherForecastResponse, ReverseGeoResult, GeoResult } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

function getApiKey() {
    if (!API_KEY) throw new Error("Server API Key missing");
    return API_KEY;
}

export async function fetchGeoDirect(city: string, limit = 1): Promise<GeoResult[]> {
    const key = getApiKey();
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=${limit}&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania współrzędnych');
    return await res.json();
}

export async function fetchWeatherByCoordsDirect(lat: number, lon: number): Promise<OpenWeatherResponse> {
    const key = getApiKey();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=pl`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania pogody');
    return await res.json();
}

export async function reverseGeocodeDirect(lat: number, lon: number): Promise<ReverseGeoResult[]> {
    const key = getApiKey();
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd reverse geocoding');
    return await res.json();
}

export async function fetchForecastByCoordsDirect(lat: number, lon: number): Promise<OpenWeatherForecastResponse> {
    const key = getApiKey();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=pl`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania prognozy');
    return await res.json() as OpenWeatherForecastResponse;
}
