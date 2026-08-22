import { Routes, Route } from "react-router-dom";
import FlightSearch from "../pages/flights/FlightSearch";
import FlightResults from "../pages/flights/FlightResults";
import PassengerDetails from "../pages/flights/PassengerDetails";
import SeatSelection from "../pages/flights/SeatSelection";
import BookingSummary from "../pages/flights/BookingSummary";
import Payment from "../pages/flights/Payment";
import ExplorePage from "../pages/Explore/Explore";
import WishlistPage from "../pages/wishlist/Wishlist";
import GroupPlannerPage from "../pages/group/GroupPlanner";
import BookingConfirmation from "../pages/flights/BookingConfirmation";
import Home from "../pages/Home";
function AppRoutes() {
  return (
    
    <Routes>

      <Route path="/" element={<Home />} />
<Route
  path="/explore"
  element={<ExplorePage />}
/>
      <Route
  path="/flights/payment"
  element={<Payment />}
/>
<Route
  path="/flights/summary"
  element={<BookingSummary />}
/>
<Route
  path="/flights/confirmation"
  element={<BookingConfirmation />}
/>
      <Route
        path="/flights"
        element={<FlightSearch />}
      />

      <Route
  path="/wishlist"
  element={<WishlistPage />}
/>
      <Route
  path="/flights/seats"
  element={<SeatSelection />}
/>
      <Route
  path="/flights/passengers"
  element={<PassengerDetails />}
/>
      <Route
  path="/flights/results"
  element={<FlightResults />}
/>

      <Route
  path="/group"
  element={<GroupPlannerPage />}
/>

    </Routes>
    
  );
}

export default AppRoutes;