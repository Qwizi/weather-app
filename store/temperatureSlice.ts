import { createSlice } from '@reduxjs/toolkit';
import { isTemperatureUnit, type TemperatureUnit } from '../lib/utils';
import { setLocalStorageItem } from '../lib/storage';

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
      setLocalStorageItem('temperatureUnit', state.unit);
    },
    setUnit: (state, action) => {
      if (isTemperatureUnit(action.payload)) {
        state.unit = action.payload;
        setLocalStorageItem('temperatureUnit', state.unit);
      }
    },
  },
});

export const { toggleUnit, setUnit } = temperatureSlice.actions;
export default temperatureSlice.reducer;
