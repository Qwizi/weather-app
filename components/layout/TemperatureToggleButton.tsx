"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toggleUnit } from "../../store/temperatureSlice";

export function TemperatureToggleButton() {
  const unit = useSelector((state: RootState) => state.temperature.unit);
  const dispatch = useDispatch();

  return (
    <button
      className="dock-button"
      onClick={() => dispatch(toggleUnit())}
      aria-label="Przełącz jednostkę temperatury"
    >
      <span className={unit === "C" ? "text-white font-bold" : "text-slate-500"}>°C</span>
      <span className="text-slate-500">/</span>
      <span className={unit === "F" ? "text-white font-bold" : "text-slate-500"}>°F</span>
      <span className="text-slate-500">/</span>
      <span className={unit === "K" ? "text-white font-bold" : "text-slate-500"}>K</span>
    </button>
  );
}
