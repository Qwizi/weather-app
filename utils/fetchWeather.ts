export interface GeoResult {
    name: string;
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


export async function fetchWeatherByCoords(lat: number, lon: number, apiKey: string) {;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Błąd pobierania pogody');
    return await res.json();
}


export async function fetchWeather(city: string) {
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
