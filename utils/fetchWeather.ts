
import { OpenWeatherForecastResponse, OpenWeatherResponse } from "../lib/types";
import type { FavoriteCity } from "../store/favoritesSlice";

export interface GeoResult {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export interface ReverseGeoResult {
    name: string;
    local_names?: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export async function fetchGeo(city: string, apiKey: string, limit = 1): Promise<GeoResult[]> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=${limit}&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania współrzędnych');
    return await res.json();
}


export async function fetchWeatherByCoords(lat: number, lon: number, apiKey: string): Promise<OpenWeatherResponse> {
    ;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania pogody');
    const data = await res.json();
    return data as OpenWeatherResponse;
}


export async function fetchWeather(city: string): Promise<OpenWeatherResponse> {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error('Brak klucza API');
    const geo = await fetchGeo(city, apiKey);
    if (geo.length === 0) {
        throw new Error('Nie znaleziono miasta');
    }
    const { lat, lon } = geo[0];
    const weather = await fetchWeatherByCoords(lat, lon, apiKey);
    if (!weather) {
        throw new Error('Błąd pobierania pogody');
    }
    return weather;
}

export async function reverseGeocode(lat: number, lon: number): Promise<ReverseGeoResult[]> {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error('Brak klucza API');
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd reverse geocoding');
    return await res.json();
}


export async function fetchForecastByCoords(lat: number, lon: number, apiKey: string): Promise<OpenWeatherForecastResponse> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania prognozy');
    return await res.json() as OpenWeatherForecastResponse;
}

export async function fetchForecastForCity(city: FavoriteCity, apiKey: string): Promise<OpenWeatherForecastResponse> {
    return fetchForecastByCoords(city.lat, city.lon, apiKey);
}
