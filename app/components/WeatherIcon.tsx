import { weatherIconMap } from "@/utils/icons";
import { Cloud } from "lucide-react";
import Image from "next/image";
interface WeatherIconProps {
    icon: string;
}

export const WeatherIcon = ({ icon }) => (
  <Image
    src={`https://openweathermap.org/img/wn/${icon}.png`}
    alt="Weather icon"
    width={100}
    height={100}
  />
);