# GlobeGo — React Travel Frontend

A group React frontend project with a multi-service home page, destination discovery, wishlist, flight-booking demonstration, profile, group planner, dashboard and preferences. The existing visual design is retained.

## Run the project

Use Node.js 22.12+ (Node.js 24 is used for verification).

```bash
npm install
npm run dev
```

Vite prints the local URL, normally http://localhost:5173.

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Syllabus implementation

| Topic | Implementation |
| --- | --- |
| Navigation layout/page structure | React Router, nested AppLayout with Outlet, existing page routes and 404 page |
| Context API/state architecture | Existing App/Auth/Wishlist/FlightBooking contexts; Home consumes shared wishlist and toast services |
| Redux Toolkit | configureStore, searchSlice, weatherSlice, generated actions, useSelector/useDispatch and createAsyncThunk |
| Form handling | Controlled Home search, reusable SearchField/useForm, field validation and accessible errors |
| REST API/async state | fetch to Open-Meteo, async/await, HTTP/response validation, 10-second timeout, loading/error/success state, Retry button and 10-minute in-memory cache |

## Live API feature

The existing home hero reel's destination badge displays current temperature for its displayed destination. It requests:

https://api.open-meteo.com/v1/forecast

Parameters: latitude, longitude, current=temperature_2m, temperature_unit=celsius, timezone=auto.

- No API key is needed for this educational, non-commercial demo.
- Only predefined destination coordinates are sent; user geolocation is never requested.
- Loading shows “Loading weather…”. A failure shows “Weather unavailable · Retry”; the carousel and rest of the app remain usable.
- Responses are cached per destination for 10 minutes. Concurrent duplicate requests are skipped.
- Weather attribution links to Open-Meteo in the badge.
- API docs: https://open-meteo.com/en/docs
- Weather is current model data, not a forecast for the dates entered in the search form.

## Main files

- src/App.jsx and src/layouts/AppLayout.jsx: page routing and shared layout.
- src/pages/Home.jsx: Member 1 home search, deals and shared wishlist integration.
- src/components/DynamicHeroReel.jsx and DestinationWeather.jsx: carousel and live destination weather.
- src/services/weatherApi.js: HTTP request, timeout and response validation.
- src/store/: Redux search and asynchronous weather state.
- src/context/: existing shared app/user/wishlist/booking state.
- src/hooks/useForm.js and src/components/SearchField.jsx: reusable form logic and fields.
- src/pages/Explore/: URL-backed destination filtering.
- src/pages/flights/: existing multi-step booking demonstration.
- tests/: search validation, Redux state and API success/failure/retry tests.

## Demo

1. Open Home and pause the reel to inspect the destination's current temperature.
2. In browser developer tools, switch the network offline, select an uncached destination and use Retry after restoring the network.
3. Submit an empty destination to demonstrate form validation. Dates use YYYY-MM-DD to YYYY-MM-DD; travelers use e.g. 2 travelers, 1 room.
4. Search Tokyo under Hotels to see Explore filtered to Tokyo. Under Flights, destination/dates/travelers populate the flight search.
5. Save a Home hotel, open Wishlist and refresh to demonstrate Context and persistence.
6. Visit an unknown URL to show the 404 page within the shared layout.

## Scope

Booking, hotel prices and payment flows are frontend demonstrations using existing project data; no real booking/payment service or AI backend is added. Non-flight service tabs lead to the existing destination catalogue. Redux search/weather state is in memory; wishlist/preferences retain existing browser-storage behavior.

Unused application files were removed only after checking the entry-point import graph and text/asset references. Developer documentation, tests, build configuration, required data, dependencies and active styles remain. See docs/React-Evaluation-Guide.md for additional evaluation notes.

## Run the combined team project

Run npm install once, then npm start to launch both Vite and the flight API server. The terminal prints the frontend URL; the API uses port 4000 by default. Ctrl+C stops both processes.

You can also run npm run dev and npm run server in separate terminals.

The team merge retains nested group pages, profile Travel Vault, updated wishlist, flight form validation, booking route guards and flight dark-mode styles. Search, weather and profile share one Redux store.

For live flight offers, create a local .env using .env.example and set your own DUFFEL_ACCESS_TOKEN. The real .env is ignored by Git. Without a token, flight search shows clearly marked demonstration results so the frontend booking walkthrough remains available. No real payment or flight order is submitted by this demo.

The dashboard stylesheet is now required by the incoming Dashboard page, so it is retained despite the earlier cleanup.
