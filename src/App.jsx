import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SaveToast from './components/SaveToast.jsx';

import Home from './pages/Home.jsx';
import AITravelPlanner from './pages/AITravelPlanner.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TravelPreferences from './pages/TravelPreferences.jsx';
import TravelStatsAchievements from './pages/TravelStatsAchievements.jsx';

// Merged Pages from Teammate Updates
import Explore from './pages/Explore/Explore.jsx';
import Wishlist from './pages/wishlist/Wishlist.jsx';
import GroupPlanner from './pages/group/GroupPlanner.jsx';
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
          <Route path="/ai-planner" element={<AITravelPlanner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<TravelPreferences />} />
          <Route path="/stats" element={<TravelStatsAchievements />} />

          {/* Discovery & Wishlist */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Group Travel Splitter */}
          <Route path="/group" element={<GroupPlanner />} />

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
    </div>
  );
}
