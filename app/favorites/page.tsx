'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchWeather } from '../../utils/fetchWeather';
import { Bookmark, Undo2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { CityCapsule, CityCapsuleSkeletons } from '../../components/CityCapsule';

const FavoritesPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) return;
    setLoading(true);
    Promise.all(
      favorites.map(city => fetchWeather(city.name))
    ).then(dataArr => {
      if (!dataArr) return;
      setWeatherData(
        dataArr.map(data => data && {
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
        })
      );
      setLoading(false);
    });
  }, [favorites]);

  if (!mounted || loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <button onClick={() => router.push("/")} className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
              <Undo2 />
              Powrót do listy
            </button>
            <span>/</span>
            <span className="text-white font-medium">Lista ulubionych miast</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pb-2 border-b border-white/5">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Ulubione miasta</h2>
            <p className="text-slate-400 mt-2 font-medium">Posiadasz ulubionych {favorites.length} miast</p>
          </div>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-[fadeIn_0.5s_ease-out] mt-8">
          <CityCapsuleSkeletons />
        </section>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <Bookmark className="w-16 h-16 text-slate-500 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Brak ulubionych miast</h2>
          <p className="text-slate-400">Dodaj miasta do ulubionych, aby je tutaj zobaczyć.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          <button onClick={() => router.push("/")} className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
            <Undo2 />
            Powrót do listy
          </button>
          <span>/</span>
          <span className="text-white font-medium">Lista ulubionych miast</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Ulubione miasta</h2>
          <p className="text-slate-400 mt-2 font-medium">Posiadasz ulubionych {favorites.length} miast</p>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-[fadeIn_0.5s_ease-out] mt-8">
        {weatherData.map((data, i) => {
          const city = favorites[i];
          if (!city) return null;
          return (
            <CityCapsule
              key={`${data.name}-${data.country}-${i}`}
              weather={{
                name: data.name,
                country: data.country,
                temp: data.temp,
                description: data.description,
                icon: data.icon,
              }}
            />
          );
        })}
      </section>
    </div>
  );
};

export default FavoritesPage;