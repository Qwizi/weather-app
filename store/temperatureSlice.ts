import { createSlice } from '@reduxjs/toolkit';

export type TemperatureUnit = 'C' | 'F' | 'K';

interface TemperatureState {
  unit: TemperatureUnit;
}

const initialState: TemperatureState = {
  unit: 'C',
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
    },
    setUnit: (state, action) => {
      if (["C", "F", "K"].includes(action.payload)) {
        state.unit = action.payload;
      }
    },
  },
});

export const { toggleUnit, setUnit } = temperatureSlice.actions;
export default temperatureSlice.reducer;
