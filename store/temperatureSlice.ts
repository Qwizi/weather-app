import { createSlice } from '@reduxjs/toolkit';

export type TemperatureUnit = 'C' | 'F' | 'K';

interface TemperatureState {
  unit: TemperatureUnit;
}

function loadTemperatureUnit(): TemperatureUnit {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('temperatureUnit');
      if (data === 'C' || data === 'F' || data === 'K') return data;
    } catch {}
  }
  return 'C';
}

const initialState: TemperatureState = {
  unit: loadTemperatureUnit(),
};

const temperatureSlice = createSlice({
  name: 'temperature',
  initialState,
  reducers: {
    toggleUnit: (state) => {
      // Cycle through C -> F -> K -> C
      if (state.unit === 'C') {
        state.unit = 'F';
      } else if (state.unit === 'F') {
        state.unit = 'K';
      } else {
        state.unit = 'C';
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('temperatureUnit', state.unit);
      }
    },
    setUnit: (state, action) => {
      if (["C", "F", "K"].includes(action.payload)) {
        state.unit = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('temperatureUnit', state.unit);
        }
      }
    },
  },
});

export const { toggleUnit, setUnit } = temperatureSlice.actions;
export default temperatureSlice.reducer;
