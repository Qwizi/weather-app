"use client";

import { LocateFixed, Search } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchBoxProps {
  onGpsClick: () => void;
  isGpsLoading: boolean;
}

export default function SearchBox({ onGpsClick, isGpsLoading }: SearchBoxProps) {
  const [searchValue, setSearchValue] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchValue.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const citySlug = encodeURIComponent(searchValue.trim().normalize("NFC"));
      router.push(`/city/${citySlug}`);
      setSearchValue("");
      if (searchInputRef.current) searchInputRef.current.blur();
    } catch {
      setSearchError("Nie znaleziono miasta lub błąd API");
    } finally {
      setSearchLoading(false);
    }
  }, [searchValue, router]);

  return (
    <section className="flex flex-col items-center justify-center w-full mx-auto gap-6 relative">
      <form className="relative w-full group" onSubmit={handleSearch} autoComplete="off">
        <div className="absolute -inset-1 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
        <div className="relative flex items-center w-full bg-[#1e2936]/90 backdrop-blur-xl rounded-full border border-glass-border h-16 shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
          <div className="pl-4 pr-4 text-slate-400">
            <Search />
          </div>
          <input
            ref={searchInputRef}
            className="w-full glass-panel border border-slate-400 text-white text-lg placeholder:text-slate-500 focus:ring-0 px-4 h-full font-medium font-body bg-transparent"
            placeholder="Wyszukaj miasto..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            disabled={searchLoading || isGpsLoading}
            autoComplete="off"
          />
          <div className="flex items-center gap-2 pr-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full transition duration-300 ease-in-out shadow-glow font-medium text-[20px] disabled:opacity-60 cursor-pointer"
              disabled={searchLoading || isGpsLoading}
            >
              {searchLoading ? (
                <span className="loader size-5" />
              ) : (
                <Search />
              )}
              <span className="hidden md:inline">Szukaj</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-full transition duration-300 ease-in-out shadow-glow font-medium text-[20px] disabled:opacity-60 cursor-pointer"
              onClick={onGpsClick}
              disabled={isGpsLoading}
            >
              <LocateFixed />
              <span className="hidden md:inline">GPS</span>
            </button>
          </div>
        </div>
        {searchError && <div className="text-red-500 mt-2 text-center">{searchError}</div>}
      </form>
    </section>
  );
}
