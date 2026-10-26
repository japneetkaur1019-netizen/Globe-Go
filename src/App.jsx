import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SaveToast from './components/SaveToast.jsx';
import AuthModal from './components/AuthModal.jsx';

import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TravelPreferences from './pages/TravelPreferences.jsx';
import TravelStatsAchievements from './pages/TravelStatsAchievements.jsx';

// Auth and User Profile
import Profile from './pages/profile/Profile.jsx';
import AuthPage from './pages/auth/AuthPage.jsx';

// Discovery, Wishlist & Group
import Explore from './pages/Explore/Explore.jsx';
import Wishlist from './pages/wishlist/Wishlist.jsx';
import GroupPlannerLayout from './pages/group/GroupPlannerLayout.jsx';
import GroupOverview from './pages/group/GroupOverview.jsx';
import GroupBudget from './pages/group/GroupBudget.jsx';
import GroupExpenses from './pages/group/GroupExpenses.jsx';
import GroupItinerary from './pages/group/GroupItinerary.jsx';
import GroupPolls from './pages/group/GroupPolls.jsx';

// Flight Booking Flow
import FlightSearch from './pages/flights/FlightSearch.jsx';
import FlightResults from './pages/flights/FlightResults.jsx';
import PassengerDetails from './pages/flights/PassengerDetails.jsx';
import SeatSelection from './pages/flights/SeatSelection.jsx';
import Payment from './pages/flights/Payment.jsx';
import BookingConfirmation from './pages/flights/BookingConfirmation.jsx';

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        <Routes>
          {/* Core App Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<TravelPreferences />} />
          <Route path="/stats" element={<TravelStatsAchievements />} />

          {/* User Auth & Profile Routes */}
          <Route path="/login" element={<AuthPage defaultMode="login" />} />
          <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
          <Route path="/profile" element={<Profile />} />

          {/* Discovery & Wishlist */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Group Travel & Budget Tracking (Nested Routes) */}
          <Route path="/group" element={<GroupPlannerLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<GroupOverview />} />
            <Route path="budget" element={<GroupBudget />} />
            <Route path="expenses" element={<GroupExpenses />} />
            <Route path="itinerary" element={<GroupItinerary />} />
            <Route path="polls" element={<GroupPolls />} />
          </Route>
          <Route path="/budget" element={<Navigate to="/group/budget" replace />} />

          {/* Full Flight Booking Flow */}
          <Route path="/flights" element={<FlightSearch />} />
          <Route path="/flights/results" element={<FlightResults />} />
          <Route path="/flights/passengers" element={<PassengerDetails />} />
          <Route path="/flights/seats" element={<SeatSelection />} />
          <Route path="/flights/payment" element={<Payment />} />
          <Route path="/flights/confirmation" element={<BookingConfirmation />} />
          <Route path="/flights/summary" element={<BookingConfirmation />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <SaveToast />
      <AuthModal />
    </div>
  );
}
