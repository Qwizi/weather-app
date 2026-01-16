import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface WeatherIconProps {
  icon: string;
}

export const WeatherIcon = ({ icon }: WeatherIconProps) => {
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }
      );
    }
  }, [icon]);

  return (
    <span ref={iconRef} style={{ display: "inline-block" }}>
      <Image
        src={`https://openweathermap.org/img/wn/${icon}.png`}
        alt="Weather icon"
        width={100}
        height={100}
      />
    </span>
  );
};