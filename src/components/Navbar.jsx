import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Compass,
  Globe,
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
  Sparkles,
  LogOut,
  Award
} from 'lucide-react';
import NotificationCenter from './NotificationCenter.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

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
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const userDropdownRef = useRef(null);
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCurrency = () => {
    const next = preferences.currency === 'INR' ? 'USD' : preferences.currency === 'USD' ? 'EUR' : 'INR';
    updatePreferences({ currency: next });
  };

  const handleLogout = () => {
    setUserDropdown(false);
    logout();
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

          {/* User Profile / Sign In */}
          {isAuthenticated && user ? (
            <div className="navbar-user-wrap" ref={userDropdownRef}>
              <button
                type="button"
                className="navbar-user-btn"
                onClick={() => setUserDropdown(!userDropdown)}
                title={`Account: ${user.name}`}
              >
                <img src={user.avatar} alt={user.name} className="navbar-user-avatar" />
                <span className="navbar-user-name">{user.name.split(' ')[0]}</span>
                <ChevronDown size={13} />
              </button>

              {userDropdown && (
                <div className="navbar-user-dropdown">
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <div className="user-dropdown-tier-badge">
                      <Award size={12} /> {user.membershipTier} · {user.points.toLocaleString()} pts
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="user-dropdown-item"
                    onClick={() => setUserDropdown(false)}
                  >
                    <User size={15} />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="user-dropdown-item"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Briefcase size={15} />
                    <span>My Saved Trips &amp; Bookings</span>
                  </Link>

                  <Link
                    to="/stats"
                    className="user-dropdown-item"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Award size={15} />
                    <span>Voyager Rewards &amp; Badges</span>
                  </Link>

                  <Link
                    to="/preferences"
                    className="user-dropdown-item"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Globe size={15} />
                    <span>Travel Preferences</span>
                  </Link>

                  <div className="user-dropdown-divider"></div>

                  <button
                    type="button"
                    className="user-dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="signin-pill-btn"
              onClick={openLoginModal}
            >
              <User size={14} />
              <span>Sign in</span>
            </button>
          )}

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
            {isAuthenticated && user ? (
              <div style={{ padding: '14px 16px', background: 'var(--pine-50)', borderRadius: '12px', margin: '8px 12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={user.avatar} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--pine-700)' }}>{user.membershipTier}</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '10px 12px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setMobileOpen(false);
                    openLoginModal();
                  }}
                >
                  <User size={15} /> Sign in / Register
                </button>
              </div>
            )}

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

            {isAuthenticated && (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                >
                  <span>My Profile &amp; Loyalty Tier</span>
                </NavLink>

                <button
                  type="button"
                  className="mobile-nav-link"
                  style={{ color: '#dc2626', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                >
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
