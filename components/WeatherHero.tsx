import { MapPin, CalendarDays, Clock } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface WeatherHeroProps {
  city: string;
  country: string;
  date: string;
  time: string;
  temperature: string;
  weatherDesc: string;
  feelsLike: string;
  high: string;
  low: string;
  icon?: string;
  redirect?: boolean
}


export const WeatherHeroSkeleton = () => {
  return (
    <div className="col-span-1 lg:col-span-2 relative min-h-100">
      <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] blur-xl opacity-60" />

      <div className="relative h-full glass-panel rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 opacity-10 bg-white/5 z-0 pointer-events-none" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-4">
            <div className="h-16 md:h-20 w-72 bg-white/10 rounded-xl skeleton-shimmer" />
            <div className="h-6 w-40 bg-white/10 rounded-lg skeleton-shimmer" />
          </div>

          <div className="hidden md:flex flex-col items-end space-y-3">
            <div className="h-5 w-32 bg-white/10 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-24 bg-white/10 rounded-lg skeleton-shimmer" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-between mt-8 md:mt-0 space-y-6">
          <div className="h-8 w-56 bg-white/10 rounded-lg skeleton-shimmer" />

          <div className="flex justify-between items-center gap-4">
            <div className="h-30 md:h-35 w-60 bg-white/10 rounded-2xl skeleton-shimmer" />
            <div className="flex gap-2 pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-20 bg-white/10 rounded-2xl skeleton-shimmer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function WeatherHero({
  ...props
}: WeatherHeroProps) {
  const { city, country, date, time, temperature, weatherDesc, feelsLike, high, low, icon, redirect } = props;
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLSpanElement>(null);
  const statCardsRef = useRef<HTMLDivElement>(null);
  const [displayTemp, setDisplayTemp] = useState(temperature);

  useGSAP(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }
      );
    }
    if (tempRef.current) {
      const match = temperature.match(/(-?\d+)/);
      const unitMatch = temperature.match(/[CFK]$/);
      const unit = unitMatch ? unitMatch[0] : "C";
      if (match) {
        const end = parseInt(match[1], 10);
        const obj = { val: end - 20 };
        gsap.to(obj, {
          val: end,
          duration: 1.2,
          ease: "power3.out",
          onUpdate: () => setDisplayTemp(`${Math.round(obj.val)}°${unit}`)
        });
      }
    }
    // fade-in and slide animation for weather description
    if (descRef.current) {
      gsap.fromTo(descRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.5, ease: "power2.out" });
    }
    // Animate stat cards pop-in
    if (statCardsRef.current) {
      const cards = statCardsRef.current.querySelectorAll('.stat-card-anim');
      gsap.fromTo(cards, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, delay: 0.7, ease: "back.out(1.7)" });
    }
  }, [temperature]);

  const redirectHandler = () => {
    if (redirect) {
      router.push(`/city/${encodeURIComponent(city)}`);
    }
  };

  return (
    <div
      ref={heroRef}
      className={`col-span-1 lg:col-span-2 relative group min-h-100 transition-transform duration-300 ${redirect ? "cursor-pointer hover:scale-[1.01]" : ""}`}
      onClick={redirect ? redirectHandler : undefined}
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-900/20 to-slate-900/40 rounded-[2.5rem] blur-xl opacity-60"></div>
      <div className="relative h-full glass-panel rounded-[2.5rem] p-8 md:p-12 overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay z-0 pointer-events-none" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBY88epuG0FCHO2v79h4qVnD2okiTkodt3WYnBaRHCbWMA7tLmFoaE6ViivvUrdC3RLwD_pBvMRdmHEaD8XcUaK_qRqSAcpc-sXoC8yXHAMVs8j9dYCF8OR3W4SAEgeTlLO06VTMaETXqR4ehj6SxbQvyJEr-89bodCMkL057nBE3C5BjEvFvTS_ThDtIS04yFTNdjHvZsfcZUcCzBaovPkITP9nFNViXUAsDhrKHPylkJLNwzGpf_5sRpf8X-zZLQ7HFfZ2ezRg3s')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-lg flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              {city}
            </h2>
            <p className="text-2xl text-slate-300 font-light mt-1 flex items-center gap-2">
              <WeatherIcon icon={icon ? icon : "01d"} />
              {country}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xl font-medium text-white flex items-center gap-2"><CalendarDays className="w-5 h-5" />{date}</p>
            <p className="text-slate-400 flex items-center gap-2"><Clock className="w-5 h-5" />{time}</p>
          </div>
        </div>
        <div className="relative z-10 flex flex-col justify-between mt-8 md:mt-0">
          <span ref={descRef} className="text-3xl text-white font-medium">{weatherDesc}</span>
          <div className="flex justify-between items-center gap-4">
            <span ref={tempRef} className="text-[120px] md:text-[140px] leading-none font-bold tracking-tighter temp-gradient-text drop-shadow-2xl">{displayTemp}</span>
            <div ref={statCardsRef} className="flex gap-1 pb-4">
              <div className="stat-card-anim"><StatCard icon="temperature" value={feelsLike} label="Odczuwalna" accent="text-green-400" /></div>
              <div className="stat-card-anim"><StatCard icon="temperature" value={low} label="Najmniejsza temp" accent="text-blue-400" /></div>
              <div className="stat-card-anim"><StatCard icon="temperature" value={high} label="Najwieksza temp" accent="text-red-400" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
