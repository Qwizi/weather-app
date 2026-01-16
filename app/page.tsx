"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { formatTemperature, formatLocalTime, formatLocalDate } from "@/lib/utils";
import { CityCapsule, CityCapsuleSkeletons } from "../components/CityCapsule";
import {  useEffect,  useReducer, useCallback, useMemo } from "react";
import { fetchWeather, fetchWeatherByCoords,reverseGeocode } from "@/utils/fetchWeather";
import { useGeolocation,  } from "../hooks/useGeolocation";
import WeatherHero, { WeatherHeroSkeleton } from "../components/WeatherHero";
import { WeatherSummary } from "@/lib/types";
import SearchBox from "@/components/SearchBox";

type HomeState = {
  weather: WeatherSummary | null;
  cityWeathers: WeatherSummary[];
  cityWeathersLoading: boolean;
  isFetchingLocationWeather: boolean;
  weatherLoading: boolean;
};

type HomeAction =
  | { type: 'SET_LOCATION_WEATHER_LOADING'; payload: boolean }
  | { type: 'SET_LOCATION_WEATHER'; payload: WeatherSummary | null }
  | { type: 'SET_CITY_WEATHERS_LOADING'; payload: boolean }
  | { type: 'SET_CITY_WEATHERS'; payload: WeatherSummary[] }
  | { type: 'FETCH_ERROR'; payload: Error };

const initialState: HomeState = {
  weather: null,
  cityWeathers: [],
  cityWeathersLoading: true,
  isFetchingLocationWeather: false,
  weatherLoading: true,
};

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'SET_LOCATION_WEATHER_LOADING':
      return { ...state, weatherLoading: action.payload, isFetchingLocationWeather: action.payload };
    case 'SET_LOCATION_WEATHER':
      return { ...state, weather: action.payload, weatherLoading: false, isFetchingLocationWeather: false };
    case 'SET_CITY_WEATHERS_LOADING':
      return { ...state, cityWeathersLoading: action.payload };
    case 'SET_CITY_WEATHERS':
      return { ...state, cityWeathers: action.payload, cityWeathersLoading: false };
    case 'FETCH_ERROR':
      // Simplified error handling for demo purposes; in real app, might want specific error fields
      return { ...state, weatherLoading: false, cityWeathersLoading: false, isFetchingLocationWeather: false };
    default:
      return state;
  }
}

export default function Home() {

  const { coords, error, loading, getLocation } = useGeolocation();
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const { weather, cityWeathers, cityWeathersLoading, isFetchingLocationWeather, weatherLoading } = state;
  const unit = useSelector((state: RootState) => state.temperature.unit);

  const handleGpsClick = useCallback(async () => {
    await getLocation();
  }, [getLocation]);

  useEffect(() => {
    const fetchWeatherForCoords = async () => {
      if (coords) {
        dispatch({ type: 'SET_LOCATION_WEATHER_LOADING', payload: true });
        try {
          const geo = await reverseGeocode(coords.lat, coords.lon);
          if (geo && geo[0]) {
            const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
            if (!apiKey) throw new Error('Brak klucza API');
            const weatherData = await fetchWeatherByCoords(coords.lat, coords.lon, apiKey);
            dispatch({ type: 'SET_LOCATION_WEATHER', payload: {
              name: weatherData.name,
              country: weatherData.sys.country,
              temp: weatherData.main.temp,
              feels_like: weatherData.main.feels_like,
              temp_min: weatherData.main.temp_min,
              temp_max: weatherData.main.temp_max,
              pressure: weatherData.main.pressure,
              humidity: weatherData.main.humidity,
              wind_speed: weatherData.wind.speed,
              wind_deg: weatherData.wind.deg,
              description: weatherData.weather[0].description,
              icon: weatherData.weather[0].icon,
              visibility: weatherData.visibility,
              clouds: weatherData.clouds.all,
              sunrise: weatherData.sys.sunrise,
              sunset: weatherData.sys.sunset,
              timezone: weatherData.timezone,
              main: weatherData.weather[0].main,
              lat: weatherData.coord.lat,
              lon: weatherData.coord.lon,
            }});
          }
        } catch (e) {
          console.error("Błąd reverse geocoding/pogody:", e);
          dispatch({ type: 'FETCH_ERROR', payload: e as Error });
        }
      }
    };
    fetchWeatherForCoords();
  }, [coords]);

  const polishCities = useMemo(() => [
    "Warszawa",
    "Kraków",
    "Łódź",
    "Wrocław",
    "Poznań",
    "Szczecin"
  ], []);

  useEffect(() => {
    getLocation();

    const fetchCitiesWeather = async () => {
      dispatch({ type: 'SET_CITY_WEATHERS_LOADING', payload: true });
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        dispatch({ type: 'SET_CITY_WEATHERS_LOADING', payload: false });
        return;
      }
      const results: WeatherSummary[] = [];
      for (const city of polishCities) {
        try {
          const weatherData = await fetchWeather(city);
          results.push({
            name: weatherData.name,
            country: weatherData.sys.country,
            temp: weatherData.main.temp,
            feels_like: weatherData.main.feels_like,
            temp_min: weatherData.main.temp_min,
            temp_max: weatherData.main.temp_max,
            pressure: weatherData.main.pressure,
            humidity: weatherData.main.humidity,
            wind_speed: weatherData.wind.speed,
            wind_deg: weatherData.wind.deg,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
          });
        } catch (e) {
          console.error(`Błąd pobierania pogody dla miasta ${city}:`, e);
        }
      }
      dispatch({ type: 'SET_CITY_WEATHERS', payload: results });
    };
    fetchCitiesWeather();
  }, [polishCities, getLocation]);

  return (
    <div className="container mx-auto px-4">
      <SearchBox onGpsClick={handleGpsClick} isGpsLoading={loading} />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-8">
        <div className="col-span-1 lg:col-span-2">
          {weatherLoading || isFetchingLocationWeather ? (
            <WeatherHeroSkeleton />
          ) : weather ? (
            <WeatherHero
              city={weather.name}
              country={weather.country}
              date={formatLocalDate(Date.now() / 1000, weather.timezone || 0)}
              time={formatLocalTime(Date.now() / 1000, weather.timezone || 0)}
              temperature={formatTemperature(weather.temp, unit)}
              weatherDesc={weather.description}
              feelsLike={formatTemperature(weather.feels_like, unit)}
              high={formatTemperature(weather.temp_max, unit)}
              low={formatTemperature(weather.temp_min, unit)}
              icon={weather.icon}
              redirect={true}
            />
          ) : null}
        </div>
        {cityWeathersLoading ? (
          <CityCapsuleSkeletons count={6} />
        ) : (
          cityWeathers.map((cityWeather) => (
            <CityCapsule key={cityWeather.name} weather={{
              name: cityWeather.name,
              country: cityWeather.country,
              temp: cityWeather.temp,
              description: cityWeather.description,
              icon: cityWeather.icon,
            }} />
          ))
        )}
      </section>
    </div>
  );
}
