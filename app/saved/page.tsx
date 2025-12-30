'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setFavorites, removeFavorite, FavoriteCity } from '../../store/favoritesSlice';
import { fetchWeatherByCoords } from '../../utils/fetchWeather';
import { Sun, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog, Wind, CloudOff, Bookmark, Book, Save, Undo2 } from "lucide-react";
import BookmarkButton from '../components/BookmarkButton';
import { WeatherIcon } from '../components/WeatherIcon';
import { useRouter } from 'next/navigation';

interface SavedSkeletonsProps {
  count?: number;
}

const SkeletonCard = () => (
  <div className="glass-panel p-8 rounded-[2.5rem] min-h-80 animate-pulse flex flex-col justify-between">
    {/* Header */}
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-white/10 rounded" />
        <div className="h-8 w-40 bg-white/10 rounded" />
        <div className="h-4 w-20 bg-white/10 rounded" />
      </div>
      <div className="h-10 w-10 bg-white/10 rounded-full" />
    </div>

    {/* Temperature */}
    <div className="my-6 space-y-3">
      <div className="h-16 w-32 bg-white/10 rounded" />
      <div className="h-4 w-40 bg-white/10 rounded" />
    </div>

    {/* Footer */}
    <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="h-3 w-16 bg-white/10 rounded" />
        <div className="h-5 w-20 bg-white/10 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-20 bg-white/10 rounded" />
        <div className="h-5 w-16 bg-white/10 rounded" />
      </div>
    </div>
  </div>
);


const SavedSkeletons = ({ count = 6 }: SavedSkeletonsProps) => {
  return (
    <div className="container mx-auto px-4">
      {/* Header skeleton */}
      <div className="pb-2 border-b border-white/5 space-y-3">
        <div className="h-10 w-64 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    </div>
  );
}


const SavedPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    const saved = localStorage.getItem('favorites');
    if (saved) {
      dispatch(setFavorites(JSON.parse(saved)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) return;
    
    Promise.all(
      favorites.map(city => fetchWeatherByCoords(city.lat, city.lon, apiKey))
    ).then(data => {
      setWeatherData(data);
      setLoading(false);
    });
  }, [favorites]);

  const handleRedirect = (cityName: string) => {
    router.push(`/city/${encodeURIComponent(cityName)}`);
  }

  

  if (!mounted || loading) {
    return <SavedSkeletons />;
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <Bookmark className="w-16 h-16 text-slate-500 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Brak zapisanych miast</h2>
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
            <span className="text-white font-medium">Lista zapisanych miast</span>
          </div>
        </div>
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Zapisane miasta</h2>
          <p className="text-slate-400 mt-2 font-medium">Posiadasz zapisanych {favorites.length} miast</p>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-[fadeIn_0.5s_ease-out] mt-8">
        {weatherData.map((data, i) => {
          const city = favorites[i];
          if (!city) return null;
          return (
            <div key={i} className="glass-panel glass-panel-hover p-8 rounded-[2.5rem] relative group cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-80" onClick={() => handleRedirect(city.name)}>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="">
                    <WeatherIcon icon={data?.weather?.[0]?.icon} />
                    {data?.weather?.[0]?.main}
                  </span>
                  <h3 className="text-3xl font-bold text-white">{city.name}</h3>
                  <p className="text-slate-400 text-sm font-medium">{city.country}</p>
                </div>
                <BookmarkButton cityObj={{ name: city.name, country: city.country, lat: city.lat, lon: city.lon }} isFavorite={true} />
              </div>
              <div className="relative z-10 flex items-center justify-between my-4">
                <div className="flex flex-col">
                  <span className="text-7xl font-display font-bold text-white tracking-tighter">{Math.round(data?.main?.temp)}°</span>
                  <span className="text-slate-400 font-medium text-sm">H: {Math.round(data?.main?.temp_max)}° L: {Math.round(data?.main?.temp_min)}°</span>
                </div>
              </div>
              <div className="relative z-10 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Wind</span>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="material-symbols-outlined text-[18px]">air</span>
                    <span className="font-bold">{data?.wind?.speed} km/h</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">Humidity</span>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <span className="material-symbols-outlined text-[18px]">humidity_percentage</span>
                    <span className="font-bold">{data?.main?.humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default SavedPage;
