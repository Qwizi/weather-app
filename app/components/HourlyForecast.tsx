import { CloudRain, CloudSnow, Cloud, Sun, Wind } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";

interface ForecastHour {
  time: string;
  icon: string;
  temp: string;
  desc: string;
  pop: string;
  accent?: boolean;
}

interface HourlyForecastProps {
  hours: ForecastHour[];
  onViewFullChart?: () => void;
}

function getLucideIcon(icon: string) {
  switch (icon) {
    case "rainy": return <CloudRain className="w-8 h-8 text-white" />;
    case "cloudy_snowing": return <CloudSnow className="w-8 h-8 text-slate-300" />;
    case "cloud": return <Cloud className="w-8 h-8 text-slate-300" />;
    case "partly_cloudy_day": return <Wind className="w-8 h-8 text-slate-300" />;
    case "sunny": return <Sun className="w-8 h-8 text-accent-hot" />;
    default: return <Cloud className="w-8 h-8 text-slate-300" />;
  }
}

export default function HourlyForecast({ hours, onViewFullChart }: HourlyForecastProps) {
  return (
    <div className="glass-panel rounded-4xl p-8 w-full relative overflow-hidden  h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sun className="w-6 h-6 text-primary" />
          24 Godziny
        </h3>
        {onViewFullChart && (
          <button className="text-sm text-primary hover:text-white transition-colors font-medium" onClick={onViewFullChart}>
            View Full Chart
          </button>
        )}
      </div>
      <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth min-w-48">
        {hours.map((h, i) => (
          <div
            key={i}
            className={`min-w-36 ${h.accent ? "bg-primary" : "bg-white/5 hover:bg-white/10 border border-white/5"} rounded-3xl p-4 flex flex-col items-center gap-3 shadow-glow transition-transform hover:-translate-y-1 group cursor-pointer`}
          >
            <span className={`text-sm font-medium ${h.accent ? "text-white" : "text-slate-400 group-hover:text-white"}`}>{h.time}</span>
            <span><WeatherIcon icon={h.icon} /></span>
            <span className={`text-2xl font-bold ${h.accent ? "text-white" : "text-slate-300 group-hover:text-white"}`}>{h.temp}</span>
            <div className={`flex flex-col items-center gap-1 mt-1 ${h.accent ? "" : "opacity-50 group-hover:opacity-100"}`}>
              <span className="text-[10px] uppercase text-slate-400">{h.desc}</span>
              <span className={`text-xs font-bold ${h.icon === "rainy" ? "text-blue-300" : h.icon === "sunny" ? "text-accent-hot" : "text-slate-400"}`}>{h.pop}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
