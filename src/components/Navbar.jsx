import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Compass, Globe, HelpCircle, Briefcase, Sun, Moon, Menu, X, ChevronDown, User } from 'lucide-react';
import NotificationCenter from './NotificationCenter.jsx';
import { useApp } from '../context/AppContext.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/ai-planner', label: 'AI Planner' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/preferences', label: 'Preferences' },
  { to: '/stats', label: 'Stats & Rewards' },
];

export default function Navbar() {
  const { theme, setTheme, preferences, updatePreferences } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);

  const toggleCurrency = () => {
    const next = preferences.currency === 'INR' ? 'USD' : preferences.currency === 'USD' ? 'EUR' : 'INR';
    updatePreferences({ currency: next });
  };

  return (
    <>
      <div className="top-bar-notice">
        <span>Welcome to GlobeGo. Powered by Expedia-grade intelligent travel algorithms.</span>
        <Link to="/ai-planner">Plan an AI Trip →</Link>
      </div>

      <header className="app-navbar">
        {/* Brand and Dropdown */}
        <div className="navbar-left">
          <Link to="/" className="brand">
            <div className="brand-icon-box">
              <Compass size={20} strokeWidth={2.5} />
            </div>
            <span>Globe<span className="accent">Go</span></span>
          </Link>

          <div className="shop-travel-wrapper">
            <button
              type="button"
              className="navbar-pill-link"
              onClick={() => setShopDropdown(!shopDropdown)}
            >
              <span>Shop travel</span>
              <ChevronDown size={14} />
            </button>
            {shopDropdown && (
              <div className="shop-dropdown-menu">
                <Link to="/ai-planner" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>Hotels &amp; Stays</Link>
                <Link to="/ai-planner" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>Flights &amp; Combos</Link>
                <Link to="/ai-planner" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>Vacation Packages</Link>
                <Link to="/preferences" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>Travel Styles</Link>
              </div>
            )}
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="navbar-center" aria-label="Main Navigation">
          <ul className="app-nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-tab-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="navbar-right-actions">
          <button
            type="button"
            className="navbar-pill-link currency-btn"
            onClick={toggleCurrency}
            title="Switch Display Currency"
          >
            <Globe size={15} />
            <span>{preferences.currency || 'INR'}</span>
          </button>

          <Link to="/dashboard" className="navbar-pill-link trips-btn">
            <Briefcase size={15} />
            <span>Trips</span>
          </Link>

          <Link to="/ai-planner" className="navbar-pill-link support-btn">
            <HelpCircle size={15} />
            <span>Support</span>
          </Link>

          <NotificationCenter />

          <button
            type="button"
            className="navbar-icon-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link to="/dashboard" className="signin-pill-btn">
            <User size={14} />
            <span>Sign in</span>
          </Link>

          <button
            type="button"
            className="navbar-icon-btn mobile-menu-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileOpen && (
          <div className="mobile-nav-panel">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
