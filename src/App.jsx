import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SaveToast from './components/SaveToast.jsx';
import Home from './pages/Home.jsx';
import AITravelPlanner from './pages/AITravelPlanner.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TravelPreferences from './pages/TravelPreferences.jsx';
import TravelStatsAchievements from './pages/TravelStatsAchievements.jsx';

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-planner" element={<AITravelPlanner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<TravelPreferences />} />
          <Route path="/stats" element={<TravelStatsAchievements />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <SaveToast />
    </div>
  );
}
