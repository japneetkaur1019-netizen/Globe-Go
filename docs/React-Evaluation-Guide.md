# React frontend evaluation — Member 1

The existing visual design and CSS are preserved. Implementation focuses on the home platform, plus the small shared routing and receiving-page changes needed to connect it.

## Mandatory topics and where to explain them

| Topic | Files | Demonstration |
| --- | --- | --- |
| Navigation layout and page structure | src/App.jsx, src/layouts/AppLayout.jsx, src/pages/NotFound.jsx | React Router nested layout route and Outlet share Navbar, Footer, toast and auth modal across pages. Unknown URLs show a real 404 page. |
| Context API | src/context/WishlistContext.jsx, src/context/AppContext.jsx, src/pages/Home.jsx | Home now consumes the existing shared wishlist and notification contexts. Save a hotel on Home, navigate to Wishlist, then refresh: the hotel remains saved. |
| State architecture | src/pages/Home.jsx, src/hooks/useForm.js, src/store/searchSlice.js | Local state owns form drafts, errors and presentation tabs. Context owns existing wishlist and app services. Redux owns the active search service and last submitted search. URL query parameters own the Explore search filter. |
| Redux Toolkit | src/store/store.js, src/store/searchSlice.js, src/main.jsx | configureStore, createSlice, generated actions, Provider, useSelector and useDispatch. Switch service tabs and submit a search; inspect search/serviceSelected and search/searchSubmitted in Redux DevTools. |
| Form handling | src/hooks/useForm.js, src/components/SearchField.jsx, src/utils/searchValidation.js | Controlled fields, reusable input component and hook, blur/submit validation, accessible error messages and focus on first invalid field. |

The syllabus describes React Router navigation for a web SPA, so the existing react-router-dom library is used. React Native's React Navigation package is not introduced.

## Demo sequence

1. Run npm install, then npm run dev from the project directory.
2. Submit the Home form with an empty destination to show validation.
3. Dates use YYYY-MM-DD to YYYY-MM-DD. Try a past date, impossible date or reversed range.
4. Travelers use e.g. 2 travelers, 1 room. Zero guests and more rooms than guests are rejected; maximum 9 guests.
5. Search Tokyo under Hotels: Explore opens with Tokyo prefiltered. Returning Home restores the last submitted fields within the current app session.
6. Select Flights, enter Tokyo and submit: destination, travel dates and guests populate FlightSearch. Guests are treated as adults because the home form has no child-age fields.
7. Save a weekend hotel using its heart, open Wishlist and refresh. Remove it there and return Home to see the shared state update.
8. Open /this-page-does-not-exist to demonstrate the shared layout and 404 page.
9. Run npm test, npm run build and npm run lint.

## Scope and limitations

- No CSS, assets, promotional content, hero reel or card styling was changed.
- Existing non-flight service tabs continue to lead to Explore's destination catalogue; no hotel/car/cruise booking backend is added. The chosen service, rooms and add-ons are retained in Redux as search intent, not claimed as booked services.
- Redux search state lasts for the current app session; the existing Wishlist Context persists its data in localStorage.
- Explore.jsx only receives a URL-backed search filter. FlightSearch.jsx only receives home-search dates/guest counts in its existing location-state effect. Other teammates' booking flows remain as implemented.
- Build passes with Vite's bundle-size advisory. Source lint has 11 pre-existing warnings and no errors.
- Four automated tests cover validation/parsing/default dates and Redux state transitions. Browser checks cover empty submission, Explore filtering, saved hotel persistence and flight prefill.

Redux setup follows the official quick-start pattern: https://redux.js.org/tutorials/quick-start

Final verification: the original project now builds successfully after reinstalling dependencies with npm ci. All 8 tests pass, including the new weather API tests. See Project-Cleanup-and-API.md for cleanup details and the live REST API feature.
