# Weather App - Projekt DevOps

Aplikacja pogodowa zbudowana w oparciu o Next.js 16, w pełni skonteneryzowana i zintegrowana z procesami CI/CD.

## Krótki opis

Projekt jest aplikacją pogodową wykorzystującą Next.js, Redux Toolkit oraz Tailwind CSS. W ramach zajęć DevOps aplikacja została wzbogacona o:
1.  **Konteneryzację:** Dockerfile (multi-stage build) zmniejszający obraz produkcyjny.
2.  **Orkiestrację:** Docker Compose uruchamiający aplikację wraz z bazą Redis (cache).
3.  **CI/CD:** GitHub Actions (testy, lintowanie, budowanie obrazu Docker i push do rejestru).

## Jak uruchomić projekt (Docker - Zalecane)

Jest to preferowana metoda uruchomienia, zgodna z wymaganiami projektu.

1.  **Wymagania:** Zainstalowany Docker i Docker Compose.
2.  **Uruchomienie:**
    W katalogu głównym projektu uruchom komendę:
    ```bash
    docker-compose up --build
    ```
3.  **Dostęp:** Aplikacja dostępna pod adresem [http://localhost:3000](http://localhost:3000).

---

## Jak uruchomić projekt (Metoda tradycyjna / Deweloperska)

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
- **Komponenty UI:** Lucide React (ikony)
- **Animacje:** GSAP
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
