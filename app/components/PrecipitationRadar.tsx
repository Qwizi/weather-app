import { Radar, MoveRight } from "lucide-react";

interface PrecipitationRadarProps {
  rainStatus: string;
  rainMessage: string;
  rainProgress: number[]; // [normal, heavy, ...] as percentages
}

export default function PrecipitationRadar({
  rainStatus,
  rainMessage,
  rainProgress,
}: PrecipitationRadarProps) {
  return (
    <div className="col-span-1 h-full min-h-75 lg:min-h-auto relative group cursor-pointer overflow-hidden rounded-[2.5rem]">
      <div className="absolute inset-0 bg-slate-900"></div>
      <div className="absolute inset-0 opacity-60 hover:opacity-80 transition-opacity duration-500" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBY88epuG0FCHO2v79h4qVnD2okiTkodt3WYnBaRHCbWMA7tLmFoaE6ViivvUrdC3RLwD_pBvMRdmHEaD8XcUaK_qRqSAcpc-sXoC8yXHAMVs8j9dYCF8OR3W4SAEgeTlLO06VTMaETXqR4ehj6SxbQvyJEr-89bodCMkL057nBE3C5BjEvFvTS_ThDtIS04yFTNdjHvZsfcZUcCzBaovPkITP9nFNViXUAsDhrKHPylkJLNwzGpf_5sRpf8X-zZLQ7HFfZ2ezRg3s')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
      <div className="absolute inset-0 bg-linear-to-t from-surface-dark via-transparent to-transparent opacity-90"></div>
      <div className="absolute top-6 right-6 z-20 size-12 rounded-full bg-surface-dark/80 backdrop-blur border border-glass-border flex items-center justify-center text-white shadow-lg group-hover:bg-primary group-hover:border-primary transition-colors">
        <MoveRight className="w-6 h-6" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Radar className="w-6 h-6 text-primary" />
            Precipitation Radar
          </h3>
          <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded uppercase tracking-wider border border-red-500/20">{rainStatus}</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">{rainMessage}</p>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
          <div className="h-full bg-primary/50" style={{ width: `${rainProgress[0] || 0}%` }}></div>
          <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${rainProgress[1] || 0}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono uppercase">
          <span>Now</span>
          <span>11:00</span>
          <span>12:00</span>
        </div>
      </div>
    </div>
  );
}
