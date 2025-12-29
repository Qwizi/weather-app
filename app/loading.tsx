import { BigCityCardSkeleton } from "./components/BitCityCard";

export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center mt-8 gap-8 animate-pulse">
      <BigCityCardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-glass-border/20 rounded-[3rem]" />
        ))}
      </div>
    </div>
  );
}
