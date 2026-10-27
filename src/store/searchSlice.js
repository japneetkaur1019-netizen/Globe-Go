import { createSlice } from '@reduxjs/toolkit';

export const SERVICES = ['hotels', 'homes', 'flights', 'cars', 'packages', 'activities', 'cruises'];

// Redux owns cross-page search intent; inputs and validation remain local to the form.
const searchSlice = createSlice({
  name: 'search',
  initialState: { activeService: 'hotels', lastSearch: null },
  reducers: {
    serviceSelected(state, { payload }) {
      if (SERVICES.includes(payload)) state.activeService = payload;
    },
    searchSubmitted(state, { payload }) {
      state.lastSearch = payload;
    },
  },
});

export const { serviceSelected, searchSubmitted } = searchSlice.actions;
export const selectActiveService = (state) => state.search.activeService;
export const selectLastSearch = (state) => state.search.lastSearch;
export default searchSlice.reducer;
