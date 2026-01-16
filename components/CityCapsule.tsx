import { convertTemperature } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {  FavoriteCity } from "../store/favoritesSlice";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import BookmarkButton from "./BookmarkButton";
import { WeatherIcon } from "./WeatherIcon";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

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
    <div className="relative glass-panel rounded-[3rem] p-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-6 pl-4">
        <div className="flex flex-col gap-3">
          <div className="h-8 w-40 bg-white/10 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-24 bg-white/10 rounded-md skeleton-shimmer" />
        </div>
      </div>

      <div className="flex items-center gap-6 pr-4">
        <div className="flex flex-col items-end gap-3">
          <div className="h-10 w-20 bg-white/10 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-28 bg-white/10 rounded-md skeleton-shimmer" />
        </div>
        <div className="glass-panel rounded-full p-3 flex items-center justify-center w-16 h-16">
          <div className="w-8 h-8 bg-white/10 rounded-full skeleton-shimmer" />
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
  const temp = convertTemperature(weather.temp, unit);
  const [displayTemp, setDisplayTemp] = useState(Math.round(temp));
  const tempRef = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const isFavorite = favorites.some(c => c.name === weather.name && c.country === weather.country);
  const cityObj: FavoriteCity = { name: weather.name, country: weather.country, lat: (weather as any).lat ?? (weather as any).coord?.lat ?? 0, lon: (weather as any).lon ?? (weather as any).coord?.lon ?? 0 };
  const capsuleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (capsuleRef.current) {
      gsap.fromTo(
        capsuleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out"
        }
      );
    }
    // Animate temperature count up
    if (tempRef.current) {
      const end = Math.round(temp);
      const obj = { val: end - 10 };
      gsap.to(obj, {
        val: end,
        duration: 1,
        ease: "power3.out",
        onUpdate: () => setDisplayTemp(Math.round(obj.val))
      });
    }
  }, [temp]);

  return (
    <div
      ref={capsuleRef}
      className="glass-panel glass-panel-hover rounded-[3rem] p-6 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 group hover:scale-[1.03]"
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
          <span ref={tempRef} className="block text-4xl font-bold text-white">{displayTemp}°{unit}</span>
          <span className="text-sm text-slate-400 capitalize">{weather.description}</span>
        </div>
        <div className="glass-panel rounded-full p-3 flex items-center justify-center w-16 h-16">
          <WeatherIcon icon={weather.icon} />
        </div>
      </div>
    </div>
  );
}