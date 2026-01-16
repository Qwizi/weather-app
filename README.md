# Weather App

Aplikacja pogodowa zbudowana w oparciu o Next.js 16, oferująca szczegółowe prognozy pogody, obsługę wielu lokalizacji.

## Jak uruchomić projekt

### Wymagania wstępne
- Node.js (zalecana wersja 20.x lub nowsza)
- Klucz API OpenWeatherMap

### Instalacja i uruchomienie

1. **Pobierz repozytorium i wejdź do katalogu projektu:**
   ```bash
   cd weather-app
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Skonfiguruj zmienne środowiskowe:**
   Utwórz plik `.env.local` w głównym katalogu projektu i dodaj swój klucz API:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=twoj_klucz_api_tutaj
   ```

4. **Uruchom wersję deweloperską:**
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

5. **Budowanie wersji produkcyjnej:**
   ```bash
   npm run build
   npm start
   ```

## Lista wykorzystanych technologii

- **Framework:** Next.js 16 (App Router)
- **Język:** TypeScript
- **Zarządzanie stanem:** Redux Toolkit (React Redux)
- **Stylowanie:** Tailwind CSS v4
- **Komponenty UI:** Lucide React (ikony), Shadcn-like glassmorphism
- **Animacje:** GSAP (GreenSock), tw-animate-css
- **API:** OpenWeatherMap (Geocoding, Current Weather, 5 Day Forecast)

## Struktura katalogów

- **`app/`** - Główny katalog routera Next.js (App Router). Zawiera strony (`page.tsx`), layouy oraz globalne style.
  - `city/[city]/` - Dynamiczna ścieżka dla szczegółów wybranego miasta.
- **`components/`** - Komponenty wielokrotnego użytku (np. `WeatherHero`, `HourlyForecast`, `StatCard`).
  - `layout/` - Komponenty strukturalne (Nagłówek, Panel nawigacyjny).
- **`store/`** - Konfiguracja Reduxa (definicje `slices`).
- **`lib/`** - Konfiguracje typów i funkcji pomocniczych (np. formatowanie, wrappery storage).
- **`utils/`** - Funkcje do komunikacji z API (`fetchWeather.ts`).
- **`hooks/`** - Niestandardowe hooki (np. `useGeolocation`).

## Główne funkcjonalności

1. **Wyszukiwanie i Geolokalizacja:**
   - Wyszukiwanie miast po nazwie.
   - Automatyczne wykrywanie lokalizacji użytkownika (GPS).
2. **Szczegółowa prognoza:**
   - Aktualna pogoda, temperatura odczuwalna, wiatr, wilgotność, UV, widoczność.
   - Wykres pogody godzinowej na najbliższe 24h.
   - Prognoza na 5 dni z wizualizacją zakresu temperatur.
   - Czasy wschodów i zachodów słońca.
3. **Personalizacja:**
   - Dostępne jednostki temperatury: Celsjusz (°C), Fahrenheit (°F), Kelvin (K).
   - System ulubionych miast z szybkim dostępem przez DockPanel.
   - Ustawienia (jednostki, ulubione) są zapisywane w pamięci przeglądarki.
