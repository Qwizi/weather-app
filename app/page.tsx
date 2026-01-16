"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { convertTemperature } from "../lib/utils";
import { LocateFixed, Search } from "lucide-react";
import { CityCapsule, CityCapsuleSkeletons } from "../components/CityCapsule";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchWeather, fetchWeatherByCoords,reverseGeocode } from "@/utils/fetchWeather";
import { useGeolocation,  } from "../hooks/useGeolocation";
import WeatherHero, { WeatherHeroSkeleton } from "../components/WeatherHero";

interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
  visibility?: number;
  clouds?: number;
  sunrise?: number;
  sunset?: number;
  timezone?: number;
  main?: string;
  lat?: number;
  lon?: number;
  date?: string;

}


export default function Home() {

  const { coords, error, loading, getLocation } = useGeolocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cityWeathers, setCityWeathers] = useState<WeatherData[]>([]);
  const [cityWeathersLoading, setCityWeathersLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isFetchingLocationWeather, setIsFetchingLocationWeather] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);


  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchValue.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const citySlug = encodeURIComponent(searchValue.trim().normalize("NFC"));
      router.push(`/city/${citySlug}`);
      setSearchValue("");
      if (searchInputRef.current) searchInputRef.current.blur();
    } catch (err: any) {
      setSearchError("Nie znaleziono miasta lub błąd API");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleGpsClick = async () => {
    await getLocation();
  };

  useEffect(() => {
    const fetchWeatherForCoords = async () => {
      if (coords) {
        setIsFetchingLocationWeather(true);
        setWeatherLoading(true);
        try {
          const geo = await reverseGeocode(coords.lat, coords.lon);
          if (geo && geo[0]) {
            const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
            if (!apiKey) throw new Error('Brak klucza API');
            const weatherData = await fetchWeatherByCoords(coords.lat, coords.lon, apiKey);
            setWeather({
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
            });
          }
        } catch (e) {
          console.error("Błąd reverse geocoding/pogody:", e);
        } finally {
          setWeatherLoading(false);
          setIsFetchingLocationWeather(false);
        }
      }
    };
    fetchWeatherForCoords();
  }, [coords]);

  // On mount, try to get location automatically and fetch 6 biggest Polish cities
  useEffect(() => {
    getLocation();

    // 6 największych polskich miast
    const polishCities = [
      "Warszawa",
      "Kraków",
      "Łódź",
      "Wrocław",
      "Poznań",
      "Szczecin"
    ];

    const fetchCitiesWeather = async () => {
      setCityWeathersLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setCityWeathersLoading(false);
        return;
      }
      const results: WeatherData[] = [];
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
      setCityWeathers(results);
      setCityWeathersLoading(false);
    };
    fetchCitiesWeather();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-col items-center justify-center w-full  mx-auto gap-6 relative">
        <form className="relative w-full group" onSubmit={handleSearch} autoComplete="off">
          <div className="absolute -inset-1  rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
          <div className="relative flex items-center w-full bg-[#1e2936]/90 backdrop-blur-xl rounded-full border border-glass-border h-16 shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
            <div className="pl-4 pr-4 text-slate-400">
              <Search />
            </div>
            <input
              ref={searchInputRef}
              className="w-full glass-panel border border-slate-400 text-white text-lg placeholder:text-slate-500 focus:ring-0 px-4 h-full font-medium font-body"
              placeholder="Wyszukaj miasto..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              disabled={searchLoading || loading}
              autoComplete="off"
            />
            <div className="flex items-center gap-2 pr-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full transition duration-300 ease-in-out shadow-glow font-medium text-[20px] disabled:opacity-60"
                disabled={searchLoading || loading}
              >
                {searchLoading ? (
                  <span className="loader size-5" />
                ) : (
                  <Search />
                )}
                <span className="hidden md:inline">Szukaj</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-full transition duration-300 ease-in-out shadow-glow font-medium text-[20px] disabled:opacity-60"
                onClick={handleGpsClick}
                disabled={loading}
              >
                <LocateFixed />
                <span className="hidden md:inline">GPS</span>
              </button>
            </div>
          </div>
          {searchError && <div className="text-red-500 mt-2 text-center">{searchError}</div>}
        </form>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-8">
        <div className="col-span-1 lg:col-span-2">
          {weatherLoading || isFetchingLocationWeather ? (
            <WeatherHeroSkeleton />
          ) : weather ? (
            <WeatherHero
              city={weather.name}
              country={weather.country}
              date={new Date((Date.now() + (weather.timezone || 0) * 1000)).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              time={new Date((Date.now() + (weather.timezone || 0) * 1000)).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              temperature={`${Math.round(convertTemperature(weather.temp, unit))}°${unit}`}
              weatherDesc={weather.description}
              feelsLike={`${Math.round(convertTemperature(weather.feels_like, unit))}°${unit}`}
              high={`${Math.round(convertTemperature(weather.temp_max, unit))}°${unit}`}
              low={`${Math.round(convertTemperature(weather.temp_min, unit))}°${unit}`}
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
