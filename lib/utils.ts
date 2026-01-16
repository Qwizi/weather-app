
// Converts Celsius to the selected unit (C, F, K)
export function convertTemperature(tempC: number, unit: 'C' | 'F' | 'K') {
  if (unit === 'C') return tempC;
  if (unit === 'F') return (tempC * 9) / 5 + 32;
  if (unit === 'K') return tempC + 273.15;
  return tempC;
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
