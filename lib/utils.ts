import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TemperatureUnit = "C" | "F" | "K";

export function isTemperatureUnit(value: unknown): value is TemperatureUnit {
  return value === "C" || value === "F" || value === "K";
}

// Converts Celsius to the selected unit (C, F, K)
export function convertTemperature(tempC: number, unit: TemperatureUnit) {
  if (unit === "C") return tempC;
  if (unit === "F") return (tempC * 9) / 5 + 32;
  if (unit === "K") return tempC + 273.15;
  return tempC;
}

export function formatTemperature(tempC: number, unit: TemperatureUnit) {
  return `${Math.round(convertTemperature(tempC, unit))}°${unit}`;
}

// Helper: Format time from unix and timezone offset
export function formatLocalTime(unix: number, timezone: number) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

const PL_DAYS = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const PL_MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

export function formatLocalDate(unix: number, timezone: number) {
  const date = new Date((unix + timezone) * 1000);
  const dayName = PL_DAYS[date.getUTCDay()];
  const day = date.getUTCDate();
  const monthName = PL_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${dayName}, ${day} ${monthName} ${year}`;
}
