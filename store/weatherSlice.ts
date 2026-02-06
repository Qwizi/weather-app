import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  description: string;
  icon: string;
  dt: number;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city: string) => {
    // Call our internal API which handles caching and OWM key
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.error || 'Błąd pobierania pogody');
    }
    const data = await res.json();
    
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      description: data.weather[0].main,
      icon: data.weather[0].icon,
      dt: data.dt,
    } as WeatherData;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Błąd';
      });
  },
});

export default weatherSlice.reducer;
