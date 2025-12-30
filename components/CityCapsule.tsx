import { Sun, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite, FavoriteCity } from "../store/favoritesSlice";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import BookmarkButton from "./BookmarkButton";
import { WeatherIcon } from "./WeatherIcon";

interface CityCapsuleWeather {
  name: string;
  country: string;
  temp: number;
  description: string;
  icon: string;
}

interface CityCapsuleSkeletonProps {
  count?: number;
}

interface CityCapsuleProps {
  weather: CityCapsuleWeather;
}

export const CityCapsuleSkeleton = () => {
  return (
    <div className="relative glass-panel rounded-[3rem] p-6 flex items-center justify-between gap-4 animate-pulse">
      

      <div className="flex items-center gap-6 pl-4">
        <div className="flex flex-col gap-3">
          <div className="h-8 w-40 bg-white/10 rounded-lg" />
          <div className="h-4 w-24 bg-white/10 rounded-md" />
        </div>
      </div>

      <div className="flex items-center gap-6 pr-4">
        <div className="flex flex-col items-end gap-3">
          <div className="h-10 w-20 bg-white/10 rounded-lg" />
          <div className="h-4 w-28 bg-white/10 rounded-md" />
        </div>
        <div className="glass-panel rounded-full p-3 flex items-center justify-center w-16 h-16">
          <div className="w-8 h-8 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export const CityCapsuleSkeletons = ({ count = 6 }: CityCapsuleSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CityCapsuleSkeleton key={i} />
      ))}
    </>
  );
}


export function CityCapsule({ weather }: CityCapsuleProps) {
  const unit = useSelector((state: RootState) => state.temperature.unit);
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const dispatch = useDispatch();
  const toF = (c: number) => (c * 9) / 5 + 32;
  const temp = unit === "C" ? weather.temp : toF(weather.temp);
  const router = useRouter();
  const isFavorite = favorites.some(c => c.name === weather.name && c.country === weather.country);
  const cityObj: FavoriteCity = { name: weather.name, country: weather.country, lat: (weather as any).lat ?? (weather as any).coord?.lat ?? 0, lon: (weather as any).lon ?? (weather as any).coord?.lon ?? 0 };
  return (
    <div
      className="glass-panel glass-panel-hover rounded-[3rem] p-6 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 group"
      onClick={() => router.push(`/city/${encodeURIComponent(weather.name)}`)}
      tabIndex={0}
      role="button"
      aria-label={`Zobacz pogodę dla ${weather.name}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push(`/city/${encodeURIComponent(weather.name)}`); }}
    >
      <div className="absolute -top-4 right-4">
        <BookmarkButton
          isFavorite={isFavorite}
          cityObj={cityObj}

        />
      </div>
      <div className="flex items-center gap-6 pl-4">
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">
            {weather.name}
          </h3>
          <p className="text-sm text-slate-400">{weather.country}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 pr-4">
        <div className="text-right">
          <span className="block text-4xl font-bold text-white">{Math.round(temp)}°{unit}</span>
          <span className="text-sm text-slate-400 capitalize">{weather.description}</span>
        </div>
        <div className="glass-panel rounded-full p-3 flex items-center justify-center w-16 h-16">
          <WeatherIcon icon={weather.icon} />
        </div>
      </div>
    </div>
  );
}