"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { setUnit } from "./temperatureSlice";
import { setFavorites } from "./favoritesSlice";
import { getJSON, getLocalStorageItem } from "../lib/storage";
import { isTemperatureUnit } from "../lib/utils";

function HydrateStore() {
  const dispatch = useDispatch();

  useEffect(() => {
    const raw = getLocalStorageItem("temperatureUnit");
    if (raw) {
      const unit = raw.replace(/"/g, '').trim();
      if (isTemperatureUnit(unit)) {
        dispatch(setUnit(unit));
      }
    }

    const fav = getJSON<unknown>("favorites");
    if (Array.isArray(fav)) {
      dispatch(setFavorites(fav));
    }
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
