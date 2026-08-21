import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Compass,
  Globe,
  HelpCircle,
  Briefcase,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  User,
  Heart,
  Plane,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';
import NotificationCenter from './NotificationCenter.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/ai-planner', label: 'AI Planner' },
  { to: '/flights', label: 'Flights' },
  { to: '/explore', label: 'Explore' },
  { to: '/wishlist', label: 'Wishlist', showWishlistBadge: true },
  { to: '/group', label: 'Group Trip' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/stats', label: 'Rewards' },
];

export default function Navbar() {
  const { theme, setTheme, preferences, updatePreferences } = useApp();
  const { wishlist } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  const toggleCurrency = () => {
    const next = preferences.currency === 'INR' ? 'USD' : preferences.currency === 'USD' ? 'EUR' : 'INR';
    updatePreferences({ currency: next });
  };

  return (
    <>
      <div className="top-bar-notice">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>Intelligent AI Travel Portal &amp; Flight Booking Engine with Member Price Guarantee.</span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link to="/flights" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Plane size={13} /> Book Flights
            </Link>
            <Link to="/ai-planner" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={13} /> AI Itinerary →
            </Link>
          </div>
        </div>
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
              <span>Explore services</span>
              <ChevronDown size={14} />
            </button>
            {shopDropdown && (
              <div className="shop-dropdown-menu">
                <Link to="/flights" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <Plane size={15} /> Flight Search &amp; Seat Selection
                </Link>
                <Link to="/explore" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <MapPin size={15} /> Explore Global Destinations
                </Link>
                <Link to="/ai-planner" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <Sparkles size={15} /> AI Smart Itinerary Planner
                </Link>
                <Link to="/group" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <Users size={15} /> Group Trip &amp; Splitter
                </Link>
                <Link to="/wishlist" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <Heart size={15} /> Saved Travel Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link to="/preferences" className="shop-dropdown-item" onClick={() => setShopDropdown(false)}>
                  <Globe size={15} /> Travel Persona &amp; Styles
                </Link>
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
                  {item.showWishlistBadge && wishlistCount > 0 && (
                    <span className="nav-badge-count">{wishlistCount}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="navbar-right-actions">
          <Link
            to="/wishlist"
            className="navbar-pill-link wishlist-nav-btn"
            title={`Wishlist (${wishlistCount} items)`}
          >
            <Heart size={16} fill={wishlistCount > 0 ? "#ff385c" : "none"} color={wishlistCount > 0 ? "#ff385c" : "currentColor"} />
            {wishlistCount > 0 && <span className="wishlist-dot-count">{wishlistCount}</span>}
          </Link>

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
                <span>{item.label}</span>
                {item.showWishlistBadge && wishlistCount > 0 && (
                  <span className="nav-badge-count">{wishlistCount}</span>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
