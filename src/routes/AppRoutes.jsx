import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import FlightSearch from "../pages/flights/FlightSearch";
import FlightResults from "../pages/flights/FlightResults";
import PassengerDetails from "../pages/flights/PassengerDetails";
import SeatSelection from "../pages/flights/SeatSelection";
import BookingSummary from "../pages/flights/BookingSummary";
import Payment from "../pages/flights/Payment";
import BookingConfirmation from "../pages/flights/BookingConfirmation";
import ExplorePage from "../pages/Explore/Explore";
import WishlistPage from "../pages/wishlist/Wishlist";
import GroupPlannerPage from "../pages/group/GroupPlanner";
import Profile from "../pages/profile/Profile";
import AuthPage from "../pages/auth/AuthPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage defaultMode="login" />} />
      <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/group" element={<GroupPlannerPage />} />
      <Route path="/flights" element={<FlightSearch />} />
      <Route path="/flights/results" element={<FlightResults />} />
      <Route path="/flights/passengers" element={<PassengerDetails />} />
      <Route path="/flights/seats" element={<SeatSelection />} />
      <Route path="/flights/payment" element={<Payment />} />
      <Route path="/flights/summary" element={<BookingSummary />} />
      <Route path="/flights/confirmation" element={<BookingConfirmation />} />
    </Routes>
  );
}

export default AppRoutes;