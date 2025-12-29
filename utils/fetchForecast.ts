import type { FavoriteCity } from "../store/favoritesSlice";

export async function fetchForecastByCoords(lat: number, lon: number, apiKey: string) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pl`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Błąd pobierania prognozy');
  return await res.json();
}

export async function fetchForecastForCity(city: FavoriteCity, apiKey: string) {
  return fetchForecastByCoords(city.lat, city.lon, apiKey);
}
