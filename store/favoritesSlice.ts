import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getJSON, setJSON } from '../lib/storage';

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  icon?: string;
}

interface FavoritesState {
  cities: FavoriteCity[];
}

const initialState: FavoritesState = {
  cities: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteCity>) => {
      if (!state.cities.some(c => c.name === action.payload.name && c.country === action.payload.country)) {
        state.cities.push(action.payload);
        setJSON('favorites', state.cities);
      }
    },
    removeFavorite: (state, action: PayloadAction<FavoriteCity>) => {
      state.cities = state.cities.filter(
        c => !(c.name === action.payload.name && c.country === action.payload.country)
      );
      setJSON('favorites', state.cities);
    },
    setFavorites: (state, action: PayloadAction<FavoriteCity[]>) => {
      state.cities = action.payload;
      setJSON('favorites', state.cities);
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
