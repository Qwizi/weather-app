import { Sun, Wind, Droplets, Eye, Thermometer } from "lucide-react";

interface StatCardProps {
  icon: "uv" | "wind" | "humidity" | "visibility" | "temperature";
  value: string;
  label: string;
  sublabel?: string;
  accent?: string;
  progress?: number;
  extra?: string;
}

function getStatIcon(icon: StatCardProps["icon"], accent?: string) {
  switch (icon) {
    case "temperature": return <Thermometer className={accent || "w-6 h-6 text-accent-hot"} />;
    case "uv": return <Sun className={accent || "w-6 h-6 text-accent-uv"} />;
    case "wind": return <Wind className={accent || "w-6 h-6 text-primary"} />;
    case "humidity": return <Droplets className={accent || "w-6 h-6 text-blue-400"} />;
    case "visibility": return <Eye className={accent || "w-6 h-6 text-purple-400"} />;
    default: return null;
  }
}

export default function StatCard({ icon, value, label, sublabel, accent, progress, extra }: StatCardProps) {
  return (
    <div className="glass-panel rounded-4xl p-6 hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-2 mb-4 text-slate-400 group-hover:text-white">
        {getStatIcon(icon, accent)}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex flex-col items-center relative py-2 w-full">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold text-white">{value}</span>
          {extra && <span className="text-xl text-slate-400 mb-1">{extra}</span>}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-surface-dark rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-linear-to-r from-blue-400 to-primary h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {sublabel && <p className="text-xs text-slate-400 mt-4 text-center">{sublabel}</p>}
      </div>
    </div>
  );
}
