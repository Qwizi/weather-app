import { Sunrise, Sunset } from "lucide-react";

interface SunTimesProps {
  sunrise: string;
  sunset: string;
}

export default function SunTimes({ sunrise, sunset }: SunTimesProps) {
  return (
    <div className="mt-6 pt-6 border-t border-white/5">
      <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Wschód i zachód słońca</h4>
      <div className="flex items-center justify-between bg-surface-dark/50 rounded-xl p-3 border border-white/5">
        <div className="flex items-center gap-2">
          <Sunrise className="text-accent-hot w-5 h-5" />
          <div>
            <span className="block text-sm font-bold text-white">{sunrise}</span>
            <span className="text-[10px] text-slate-400">Wschód słońca</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <span className="block text-sm font-bold text-white">{sunset}</span>
            <span className="text-[10px] text-slate-400">Zachód słońca</span>
          </div>
          <Sunset className="text-purple-400 w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
