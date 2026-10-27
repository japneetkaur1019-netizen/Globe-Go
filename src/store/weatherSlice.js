import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentWeather } from '../services/weatherApi.js';

const CACHE_MS = 10 * 60 * 1000;
export const fetchDestinationWeather = createAsyncThunk(
  'weather/fetchDestination',
  async (destination, { signal, rejectWithValue }) => {
    try {
      const data = await getCurrentWeather(destination, { signal });
      return { ...data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error.name === 'TimeoutError'
        ? 'Weather request timed out. Please retry.'
        : 'Weather is unavailable. Please retry.');
    }
  },
  {
    condition: ({ id }, { getState }) => {
      const entry = getState().weather.byDestination[id];
      // Deduplicate StrictMode requests and reuse recent successful responses.
      return entry?.status !== 'loading' && !(entry?.status === 'succeeded' && Date.now() - entry.fetchedAt < CACHE_MS);
    },
  },
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { byDestination: {} },
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchDestinationWeather.pending, (state, action) => {
      state.byDestination[action.meta.arg.id] = { status: 'loading', error: null };
    })
    .addCase(fetchDestinationWeather.fulfilled, (state, action) => {
      state.byDestination[action.meta.arg.id] = { ...action.payload, status: 'succeeded', error: null };
    })
    .addCase(fetchDestinationWeather.rejected, (state, action) => {
      state.byDestination[action.meta.arg.id] = { status: 'failed', error: action.payload || 'Weather is unavailable. Please retry.' };
    }),
});

export default weatherSlice.reducer;
