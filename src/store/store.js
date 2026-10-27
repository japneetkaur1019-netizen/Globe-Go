import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice.js';
import weatherReducer from './weatherSlice.js';
import profileReducer from './profileSlice.js';

// All team features must use the same store and Provider.
export const store = configureStore({
  reducer: { search: searchReducer, weather: weatherReducer, profile: profileReducer },
});

let previousProfile = store.getState().profile;
store.subscribe(() => {
  const profile = store.getState().profile;
  if (profile === previousProfile) return;
  previousProfile = profile;
  try {
    localStorage.setItem('globego_redux_profile', JSON.stringify(profile));
  } catch {
    // Keep the app usable when browser storage is unavailable.
  }
});
