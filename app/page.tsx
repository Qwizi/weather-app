"use client";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { formatTemperature, formatLocalTime, formatLocalDate } from "@/lib/utils";
import { LocateFixed, Search } from "lucide-react";
import { CityCapsule, CityCapsuleSkeletons } from "../components/CityCapsule";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchWeather, fetchWeatherByCoords,reverseGeocode } from "@/utils/fetchWeather";
import { useGeolocation,  } from "../hooks/useGeolocation";
import WeatherHero, { WeatherHeroSkeleton } from "../components/WeatherHero";
import { WeatherSummary } from "@/lib/types";
import SearchBox from "@/components/SearchBox";


export default function Home() {

  const { coords, error, loading, getLocation } = useGeolocation();
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [cityWeathers, setCityWeathers] = useState<WeatherSummary[]>([]);
  const [cityWeathersLoading, setCityWeathersLoading] = useState(true);
  
  const [isFetchingLocationWeather, setIsFetchingLocationWeather] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const unit = useSelector((state: RootState) => state.temperature.unit);

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
      setCityWeathers(results);
      setCityWeathersLoading(false);
    };
    fetchCitiesWeather();
  }, []);

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
