import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

function loadFavorites(): FavoriteCity[] {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('favorites');
      if (data) return JSON.parse(data);
    } catch {}
  }
  return [];
}

const initialState: FavoritesState = {
  cities: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteCity>) => {
      if (!state.cities.some(c => c.name === action.payload.name && c.country === action.payload.country)) {
        state.cities.push(action.payload);
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify(state.cities));
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<FavoriteCity>) => {
      state.cities = state.cities.filter(
        c => !(c.name === action.payload.name && c.country === action.payload.country)
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.cities));
      }
    },
    setFavorites: (state, action: PayloadAction<FavoriteCity[]>) => {
      state.cities = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
