import { CalendarDays, Sun, CloudRain, Cloud, Snowflake, Wind } from "lucide-react";

interface DayForecast {
  day: string;
  icon: string;
  pop?: string;
  low: string;
  high: string;
}

interface SevenDayForecastProps {
  days: DayForecast[];
}

function getLucideIcon(icon: string) {
  switch (icon) {
    case "rainy": return <CloudRain className="w-6 h-6 text-primary" />;
    case "cloud": return <Cloud className="w-6 h-6 text-slate-400" />;
    case "sunny": return <Sun className="w-6 h-6 text-accent-hot" />;
    case "snow": return <Snowflake className="w-6 h-6 text-blue-200" />;
    case "wind": return <Wind className="w-6 h-6 text-slate-400" />;
    default: return <Cloud className="w-6 h-6 text-slate-400" />;
  }
}

export default function SevenDayForecast({ days }: SevenDayForecastProps) {
  return (
    <div className="glass-panel rounded-4xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6 pl-2 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        7 Dni
      </h3>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {days.map((d, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
            <span className="w-12 font-medium text-slate-300 group-hover:text-white">{d.day}</span>
            <div className="flex flex-col items-center w-8">
              {getLucideIcon(d.icon)}
              {d.pop && <span className="text-[10px] text-blue-300 font-bold">{d.pop}</span>}
            </div>
            <div className="flex items-center gap-2 flex-1 mx-4">
              <span className="text-xs text-slate-400 w-6 text-right">{d.low}</span>
              <div className="flex-1 h-1.5 bg-surface-dark rounded-full overflow-hidden relative">
                {/* Add a colored bar for temperature range if needed */}
                <div className="absolute left-[20%] right-[40%] top-0 bottom-0 bg-linear-to-r from-blue-400 to-accent-hot rounded-full"></div>
              </div>
              <span className="text-xs text-white font-bold w-6">{d.high}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
