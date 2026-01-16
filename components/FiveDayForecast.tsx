import { CalendarDays } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";

interface DayForecast {
  day: string;
  icon: string;
  pop?: string;
  low: string;
  high: string;
  minTemp: number;
  maxTemp: number;
}

interface FiveDayForecastProps {
  days: DayForecast[];
}

export default function FiveDayForecast({ days }: FiveDayForecastProps) {
  const minTemps = days.map(d => d.minTemp);
  const maxTemps = days.map(d => d.maxTemp);
  const weekMin = Math.min(...minTemps);
  const weekMax = Math.max(...maxTemps);
  const range = (weekMax - weekMin) || 1;

  return (
    <div className="glass-panel rounded-4xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6 pl-2 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        5 Dni
      </h3>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {days.map((d, i) => {
          const left = ((d.minTemp - weekMin) / range) * 100;
          const width = ((d.maxTemp - d.minTemp) / range) * 100;
          
          return (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
            <span className="w-12 font-medium text-slate-300 group-hover:text-white">{d.day}</span>
            <div className="flex flex-col items-center w-8">
              <div className="w-8 h-8 flex items-center justify-center">
                <WeatherIcon icon={d.icon} />
              </div>
              {d.pop && <span className="text-[10px] text-blue-300 font-bold">{d.pop}</span>}
            </div>
            <div className="flex items-center gap-2 flex-1 mx-4">
              <span className="text-xs text-slate-400 w-8 text-right">{d.low}</span>
              <div className="flex-1 h-1.5 bg-surface-dark rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 bottom-0 bg-linear-to-r from-blue-400 to-accent-hot rounded-full opacity-80"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 5)}%` 
                  }}
                />
              </div>
              <span className="text-xs text-white font-bold w-8">{d.high}</span>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
