import { configureStore } from '@reduxjs/toolkit';

import temperatureReducer from './temperatureSlice';
import favoritesReducer from './favoritesSlice';


export const store = configureStore({
  reducer: {
    temperature: temperatureReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
