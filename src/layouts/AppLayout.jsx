import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SaveToast from '../components/SaveToast.jsx';
import AuthModal from '../components/AuthModal.jsx';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content"><Outlet /></main>
      <Footer />
      <SaveToast />
      <AuthModal />
    </div>
  );
}
