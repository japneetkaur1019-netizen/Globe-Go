/**
 * index.js
 * Redux Toolkit Store Configuration
 */
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

// Auto-save profile slice to localStorage on state changes
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('globego_redux_profile', JSON.stringify(state.profile));
  } catch (err) {
    console.error('Failed to save Redux state to localStorage:', err);
  }
});

export default store;
