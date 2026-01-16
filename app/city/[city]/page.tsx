"use client";
import React from "react";
import { convertTemperature } from "../../../lib/utils";
import { Sun, Cloudy, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog, Wind, CloudOff, Undo2, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  FavoriteCity } from "../../../store/favoritesSlice";
import { RootState } from "../../../store/store";
import { useRouter } from "next/navigation";
import { fetchWeather, fetchForecastByCoords } from "@/utils/fetchWeather";
import WeatherHero, { WeatherHeroSkeleton } from "../../../components/WeatherHero";
import HourlyForecast from "../../../components/HourlyForecast";
import StatCard from "../../../components/StatCard";
import SevenDayForecast from "../../../components/SevenDayForecast";
import SunTimes from "../../../components/SunTimes";
import BookmarkButton from "@/components/BookmarkButton";





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
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  main: string;
  lat: number;
  lon: number;
}




// Helper: Format time from unix and timezone offset
function formatTime(unix: number, timezone: number) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

export default function CityPage({ params }: { params: Promise<{ city: string }> }) {

  const router = useRouter();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { city } = React.use(params);
  const unit = useSelector((state: RootState) => state.temperature.unit);
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const dispatch = useDispatch();
  const isFavorite = weather && favorites.some(c => c.name === weather.name && c.country === weather.country);
  const cityObj: FavoriteCity | null = weather ? { name: weather.name, country: weather.country, lat: 0, lon: 0 } : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Decode city param to support Polish/special characters
        const decodedCity = decodeURIComponent(city);
        const data = await fetchWeather(decodedCity);
        setWeather({
          name: data.name,
          country: data.sys.country,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          temp_min: data.main.temp_min,
          temp_max: data.main.temp_max,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          wind_deg: data.wind.deg,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          visibility: data.visibility,
          clouds: data.clouds.all,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          timezone: data.timezone,
          main: data.weather[0].main,
          lat: data.coord.lat,
          lon: data.coord.lon,
        });
        // Fetch forecast
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (apiKey) {
          const forecastData = await fetchForecastByCoords(data.coord.lat, data.coord.lon, apiKey);
          setForecast(forecastData);
        }
      } catch (e) {
        setError("Nie znaleziono miasta lub błąd API");
      } finally {
        setLoading(false);
      }
    };
    if (city) fetchData();
  }, [city]);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <button onClick={() => router.push("/")} className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
              <Undo2 />
              Powrót do listy
            </button>
            <span>/</span>
            <span className="text-white font-medium">{weather ? `${weather.name}, ${weather.country}` : city}</span>
          </div>
          <div className="flex items-end mb-4">
            <BookmarkButton isFavorite={isFavorite || false} cityObj={cityObj || undefined} />
          </div>
        </div>
        {loading ? (
          <WeatherHeroSkeleton />
        ) : error ? (
          <div className="text-red-500 mt-8">{error}</div>
        ) : weather && (
          <>
            <section className="grid grid-cols-1">
              <WeatherHero
                icon={weather.icon}
                city={weather.name}
                country={weather.country}
                date={"Dziś"}
                time={formatTime(Date.now() / 1000, +1)}
                temperature={`${Math.round(convertTemperature(weather.temp, unit))}°${unit}`}
                weatherDesc={weather.description}
                feelsLike={`${Math.round(convertTemperature(weather.feels_like, unit))}°${unit}`}
                high={`${Math.round(convertTemperature(weather.temp_max, unit))}°${unit}`}
                low={`${Math.round(convertTemperature(weather.temp_min, unit))}°${unit}`}
              />
            </section>
            <section className="flex flex-col gap-6 mt-6">
              {forecast && (
                <div className="flex flex-col gap-6 w-full">
                  <div className="flex-1 ">
                    <HourlyForecast
                      hours={forecast.list.slice(0, 8).map((item: any, idx: number) => {
                        const tempVal = convertTemperature(item.main.temp, unit);
                        return {
                          time: item.dt_txt.split(' ')[1].slice(0, 5),
                          icon: item.weather[0].icon,
                          temp: `${Math.round(tempVal)}°${unit}`,
                          desc: item.weather[0].description,
                          pop: item.pop ? `${Math.round(item.pop * 100)}%` : '',
                          accent: idx === 0,
                        };
                      })}
                    />
                  </div>
                  <div className=" p-4 flex-1 min-w-0">
                    <SevenDayForecast
                      days={Array.from({ length: 7 }).map((_, i) => {
                        const dayItems = forecast.list.filter((item: any) => {
                          const date = new Date(item.dt_txt);
                          return date.getDate() === (new Date().getDate() + i) && item.dt_txt.includes('12:00:00');
                        });
                        const item = dayItems[0] || forecast.list[i * 8] || forecast.list[0];
                        const low = convertTemperature(item.main.temp_min, unit);
                        const high = convertTemperature(item.main.temp_max, unit);
                        return {
                          day: i === 0 ? 'Dziś' :
                            new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('pl-PL', { weekday: 'short' }),
                          icon: item.weather[0].main === 'Rain' ? 'rainy' : item.weather[0].main === 'Clouds' ? 'cloud' : item.weather[0].main === 'Snow' ? 'snow' : item.weather[0].main === 'Clear' ? 'sunny' : 'cloud',
                          pop: item.pop ? `${Math.round(item.pop * 100)}%` : '',
                          low: `${Math.round(low)}°${unit}`,
                          high: `${Math.round(high)}°${unit}`,
                        };
                      })}
                    />

                  </div>
                </div>
              )}
              {/* Stat cards row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="uv" value="4" label="Indeks UV" sublabel="Chroń się przed słońcem do 16:00." />


                <StatCard icon="wind" value={weather.wind_speed.toString()} label="Wiatr" extra="km/h" sublabel="NE" />


                <StatCard icon="humidity" value={weather.humidity.toString()} label="Wilgotność" extra="%" progress={weather.humidity} sublabel="Punkt rosy to teraz 9°." />


                <StatCard icon="visibility" value={(weather.visibility / 1000).toString()} label="Widoczność" extra="km" sublabel="Idealna przejrzystość. Mgła nie występuje." />

              </div>
              <div className="mt-4">
                <SunTimes sunrise={formatTime(weather.sunrise, weather.timezone)} sunset={formatTime(weather.sunset, weather.timezone)} />
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

