import { CloudRain, Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite, FavoriteCity } from "../../store/favoritesSlice";
import { RootState } from "../../store/store";

// Typ danych pogodowych (taki sam jak w page.tsx)
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
}

interface BigCityCardProps {
  weather: WeatherData | null;
}

export function BigCityCard({ weather }: BigCityCardProps) {
  const unit = useSelector((state: RootState) => state.temperature.unit);
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const dispatch = useDispatch();
  if (!weather) {
    return (
      <div className="col-span-1 lg:col-span-2 relative group">
        <div className="relative glass-panel rounded-[3rem] p-8 md:p-10 flex items-center justify-center text-slate-400">
          Brak danych pogodowych
        </div>
      </div>
    );
  }
  // Conversion helpers
  const toF = (c: number) => (c * 9) / 5 + 32;
  const temp = unit === "C" ? weather.temp : toF(weather.temp);
  const feels_like = unit === "C" ? weather.feels_like : toF(weather.feels_like);
  const temp_min = unit === "C" ? weather.temp_min : toF(weather.temp_min);
  const temp_max = unit === "C" ? weather.temp_max : toF(weather.temp_max);
  const isFavorite = favorites.some(c => c.name === weather.name && c.country === weather.country);
  const cityObj: FavoriteCity = { name: weather.name, country: weather.country, lat: (weather as any).lat ?? (weather as any).coord?.lat ?? 0, lon: (weather as any).lon ?? (weather as any).coord?.lon ?? 0 };
  return (
    <div className="col-span-1 lg:col-span-2 relative group">
      <div className="absolute inset-0 bg-linear-to-r from-blue-900/400 to-slate-900/40 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
      <div className="relative glass-panel rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 hover:border-primary/30 overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay z-0 map-bg-image" data-alt="Abstract world map wireframe background"></div>
        <div className="relative z-10 flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 justify-between md:justify-start">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs fond-bold uppercase trakcking-wider border boder-primary/20">Obecna lokalizacja</span>
            <button
              className={`size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors ml-2 ${isFavorite ? 'text-amber-500' : 'text-slate-400'}`}
              title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              onClick={e => {
                e.stopPropagation();
                if (isFavorite) {
                  dispatch(removeFavorite(cityObj));
                } else {
                  dispatch(addFavorite(cityObj));
                }
              }}
            >
              <Bookmark className="w-6 h-6" fill={isFavorite ? '#f59e42' : 'none'} />
            </button>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">{weather.name}</h2>
          <p className="text-xl text-slate-300 font-light">{weather.country}</p>
          <div className="flex item-center gap-6 mt-6 justify-center md:justify-start">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Wiatr</span>
              <span className="text-lg font-bold">{weather.wind_speed} km/h</span>
            </div>
            <div className="vertical-divider"></div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Wilgotność</span>
              <span className="text-lg font-bold">{weather.humidity}%</span>
            </div>
            <div className="vertical-divider"></div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-400 uppercase tracking-widest">Ciśnienie</span>
              <span className="text-lg font-bold">{weather.pressure} hPa</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center">
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} alt={weather.description} className="size-48" />
          </div>
          <div className="text-center -mt-4">
            <span className="text-6xl md:text-8xl font-bold tracking-tigher bg-clip-text bg-gradient-tp-b from-white to-slate-400">{Math.round(temp)}°{unit}</span>
            <div className="text-slate-300 text-lg mt-2 capitalize">{weather.description}</div>
          </div>
        </div>
      </div>
    </div>
  )
};

export function BigCityCardSkeleton() {
  return (
    <div className="col-span-1 lg:col-span-2 relative group min-h-[504px] animate-pulse w-full">
      {/* glow */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-900/20 to-slate-900/40 rounded-[2.5rem] blur-xl opacity-60" />

      <div className="relative h-full glass-panel rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col justify-between">
        {/* background overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay z-0 pointer-events-none bg-slate-500" />

        {/* header */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            {/* city */}
            <div className="h-16 md:h-24 w-64 bg-slate-400 rounded-xl mb-3" />

            {/* country + icon */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 bg-slate-400 rounded-full" />
              <div className="h-6 w-32 bg-slate-400 rounded-lg" />
            </div>
          </div>

          {/* date + time */}
          <div className="text-right hidden md:flex flex-col gap-3">
            <div className="h-5 w-32 bg-slate-400 rounded-lg" />
            <div className="h-4 w-24 bg-slate-400 rounded-lg" />
          </div>
        </div>

        {/* bottom */}
        <div className="relative z-10 flex flex-col justify-between mt-8 md:mt-0 gap-6">
          {/* weather description */}
          <div className="h-8 w-56 bg-slate-400 rounded-lg" />

          <div className="flex justify-between items-center gap-6">
            {/* temperature */}
            <div className="h-[120px] md:h-[140px] w-48 bg-slate-400 rounded-2xl" />

            {/* stats */}
            <div className="flex gap-3 pb-4">
              <div className="h-20 w-24 bg-slate-400 rounded-xl" />
              <div className="h-20 w-24 bg-slate-400 rounded-xl" />
              <div className="h-20 w-24 bg-slate-400 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}