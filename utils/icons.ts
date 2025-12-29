import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudSun,
  CloudMoon,
  CloudOff,
} from "lucide-react";

export const weatherIconMap = {
  // Clear sky
  "01d": Sun,
  "01n": Moon,
  // Few clouds
  "02d": CloudSun,
  "02n": CloudMoon,
  // Scattered clouds
  "03d": Cloud,
  "03n": Cloud,
  // Broken clouds
  "04d": CloudOff,
  "04n": CloudOff,
  // Shower rain
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,
  // Rain
  "10d": CloudRain,
  "10n": CloudRain,
  // Thunderstorm
  "11d": CloudLightning,
  "11n": CloudLightning,
  // Snow
  "13d": CloudSnow,
  "13n": CloudSnow,
  // Mist
  "50d": CloudFog,
  "50n": CloudFog,

  // All codes from your list
  // Thunderstorm group 2xx
  200: CloudLightning,
  201: CloudLightning,
  202: CloudLightning,
  210: CloudLightning,
  211: CloudLightning,
  212: CloudLightning,
  221: CloudLightning,
  230: CloudLightning,
  231: CloudLightning,
  232: CloudLightning,
  // Drizzle group 3xx
  300: CloudDrizzle,
  301: CloudDrizzle,
  302: CloudDrizzle,
  310: CloudDrizzle,
  311: CloudDrizzle,
  312: CloudDrizzle,
  313: CloudDrizzle,
  314: CloudDrizzle,
  321: CloudDrizzle,
  // Rain group 5xx
  500: CloudRain,
  501: CloudRain,
  502: CloudRain,
  503: CloudRain,
  504: CloudRain,
  511: CloudSnow,
  520: CloudDrizzle,
  521: CloudDrizzle,
  522: CloudDrizzle,
  531: CloudDrizzle,
  // Snow group 6xx
  600: CloudSnow,
  601: CloudSnow,
  602: CloudSnow,
  611: CloudSnow,
  612: CloudSnow,
  613: CloudSnow,
  615: CloudSnow,
  616: CloudSnow,
  620: CloudSnow,
  621: CloudSnow,
  622: CloudSnow,
  // Atmosphere group 7xx
  701: CloudFog,
  711: CloudFog,
  721: CloudFog,
  731: CloudFog,
  741: CloudFog,
  751: CloudFog,
  761: CloudFog,
  762: CloudFog,
  771: CloudFog,
  781: CloudFog,
  // Clear group 800
  800: Sun,
  // Clouds group 80x
  801: CloudSun,
  802: Cloud,
  803: CloudOff,
  804: CloudOff,
};