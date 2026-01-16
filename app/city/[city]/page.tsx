"use client";
import React from "react";
import { formatTemperature, formatLocalTime, convertTemperature } from "@/lib/utils";
import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FavoriteCity } from "@/store/favoritesSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { fetchWeather, fetchForecastByCoords } from "@/utils/fetchWeather";
import WeatherHero, { WeatherHeroSkeleton } from "@/components/WeatherHero";
import HourlyForecast from "@/components/HourlyForecast";
import StatCard from "@/components/StatCard";
import SevenDayForecast from "@/components/SevenDayForecast";
import SunTimes from "@/components/SunTimes";
import BookmarkButton from "@/components/BookmarkButton";
import { WeatherDetails, OpenWeatherForecastResponse } from "@/lib/types";


export default function CityPage({ params }: { params: Promise<{ city: string }> }) {

  const router = useRouter();
  const [weather, setWeather] = useState<WeatherDetails | null>(null);
  const [forecast, setForecast] = useState<OpenWeatherForecastResponse | null>(null);
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
                time={formatLocalTime(Date.now() / 1000, weather.timezone)}
                temperature={formatTemperature(weather.temp, unit)}
                weatherDesc={weather.description}
                feelsLike={formatTemperature(weather.feels_like, unit)}
                high={formatTemperature(weather.temp_max, unit)}
                low={formatTemperature(weather.temp_min, unit)}
              />
            </section>
            <section className="flex flex-col gap-6 mt-6">
              {forecast && (
                <div className="flex flex-col gap-6 w-full">
                  <div className="flex-1 ">
                    <HourlyForecast
                      hours={forecast.list.slice(0, 8).map((item: any, idx: number) => {
                        return {
                          time: item.dt_txt.split(' ')[1].slice(0, 5),
                          icon: item.weather[0].icon,
                          temp: formatTemperature(item.main.temp, unit),
                          desc: item.weather[0].description,
                          pop: item.pop ? `${Math.round(item.pop * 100)}%` : '',
                          accent: idx === 0,
                        };
                      })}
                    />
                  </div>
                  <div className=" p-4 flex-1 min-w-0">
                    <SevenDayForecast
                      days={
                        // Group forecast items by day
                        Object.values(forecast.list.reduce((acc: any, item: any) => {
                          const date = new Date(item.dt * 1000).toDateString();
                          if (!acc[date]) {
                            acc[date] = [];
                          }
                          acc[date].push(item);
                          return acc;
                        }, {})).slice(0, 7).map((dayItems: any, i) => {
                          // Find min/max for the whole day
                          const minTemp = Math.min(...dayItems.map((d: any) => d.main.temp_min));
                          const maxTemp = Math.max(...dayItems.map((d: any) => d.main.temp_max));
                          
                          // Find item closest to noon for icon/desc
                          const midDayItem = dayItems.find((d: any) => d.dt_txt.includes("12:00:00")) || dayItems[0];
                          
                          return {
                            day: i === 0 ? 'Dziś' : new Date(dayItems[0].dt * 1000).toLocaleDateString('pl-PL', { weekday: 'short' }),
                            icon: midDayItem.weather[0].icon,
                            pop: midDayItem.pop ? `${Math.round(midDayItem.pop * 100)}%` : '',
                            low: formatTemperature(minTemp, unit),
                            high: formatTemperature(maxTemp, unit),
                            minTemp: convertTemperature(minTemp, unit),
                            maxTemp: convertTemperature(maxTemp, unit)
                          };
                        })
                      }
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
                <SunTimes sunrise={formatLocalTime(weather.sunrise, weather.timezone)} sunset={formatLocalTime(weather.sunset, weather.timezone)} />
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}

