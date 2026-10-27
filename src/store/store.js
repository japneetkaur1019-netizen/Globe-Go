import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice.js';
import weatherReducer from './weatherSlice.js';

export const store = configureStore({ reducer: { search: searchReducer, weather: weatherReducer } });
