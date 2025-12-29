'use client';
import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setFavorites, removeFavorite, FavoriteCity } from '../../store/favoritesSlice';
import { fetchWeatherByCoords } from '../../utils/fetchWeather';
import { Sun, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog, Wind, CloudOff, Bookmark } from "lucide-react";

function getLucideIcon(main: string) {
  switch (main) {
    case "Clear": return <Sun className="inline w-7 h-7 text-yellow-400" />;
    case "Clouds": return <CloudFog className="inline w-7 h-7 text-slate-300" />;
    case "Rain": return <CloudRain className="inline w-7 h-7 text-blue-400" />;
    case "Drizzle": return <CloudDrizzle className="inline w-7 h-7 text-blue-300" />;
    case "Thunderstorm": return <CloudLightning className="inline w-7 h-7 text-yellow-300" />;
    case "Snow": return <Snowflake className="inline w-7 h-7 text-cyan-200" />;
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Sand":
    case "Ash":
      return <CloudFog className="inline w-7 h-7 text-slate-400" />;
    case "Squall":
    case "Tornado":
      return <Wind className="inline w-7 h-7 text-slate-400" />;
    default: return <CloudOff className="inline w-7 h-7 text-slate-400" />;
  }
}

const SavedPage = () => {
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const [weatherData, setWeatherData] = React.useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('favorites');
    if (saved) {
      dispatch(setFavorites(JSON.parse(saved)));
    }
  }, [dispatch]);

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Fetch weather for all favorites
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) return;
    Promise.all(
      favorites.map(city => fetchWeatherByCoords(city.lat, city.lon, apiKey))
    ).then(setWeatherData);
  }, [favorites]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Saved Locations</h2>
          <p className="text-slate-400 mt-2 font-medium">Monitoring {favorites.length} cities</p>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-[fadeIn_0.5s_ease-out] mt-8">
        {weatherData.map((data, i) => (
          <div key={i} className="glass-panel glass-panel-hover p-8 rounded-[2.5rem] relative group cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-80">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
                  {getLucideIcon(data?.weather?.[0]?.main)}
                  {data?.weather?.[0]?.main}
                </span>
                <h3 className="text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">{favorites[i].name}</h3>
                <p className="text-slate-400 text-sm font-medium">{favorites[i].country}</p>
              </div>
              <button
                className="size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-amber-500 transition-colors ml-2"
                title="Usuń z ulubionych"
                onClick={e => {
                  e.stopPropagation();
                  dispatch(removeFavorite(favorites[i]));
                }}
              >
                <Bookmark className="w-6 h-6 fill-amber-500" />
              </button>
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
        ))}
      </section>
    </div>
  );
};

export default SavedPage;
