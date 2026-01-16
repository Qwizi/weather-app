"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { setUnit } from "./temperatureSlice";
import { setFavorites } from "./favoritesSlice";

function HydrateStore() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const unit = localStorage.getItem("temperatureUnit");
      if (unit === "C" || unit === "F" || unit === "K") {
        dispatch(setUnit(unit));
      }
    } catch {}

    try {
      const fav = localStorage.getItem("favorites");
      if (fav) {
        const parsed = JSON.parse(fav);
        if (Array.isArray(parsed)) {
          dispatch(setFavorites(parsed));
        }
      }
    } catch {}
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrateStore />
      {children}
    </Provider>
  );
}
