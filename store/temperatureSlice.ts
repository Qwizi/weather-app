import { createSlice } from '@reduxjs/toolkit';

export type TemperatureUnit = 'C' | 'F';

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
      state.unit = state.unit === 'C' ? 'F' : 'C';
    },
    setUnit: (state, action) => {
      state.unit = action.payload;
    },
  },
});

export const { toggleUnit, setUnit } = temperatureSlice.actions;
export default temperatureSlice.reducer;
