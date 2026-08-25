import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  Plane,
  ShieldCheck,
  CreditCard,
  Lock,
  Heart,
  Briefcase,
  Camera,
  Edit3,
  LogOut,
  CheckCircle,
  Clock,
  BookmarkCheck,
  Utensils,
  Armchair,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    updateProfile,
    logout,
    avatarPresets,
    demoAccounts,
    switchDemoAccount,
    openLoginModal
  } = useAuth();

  const { savedTrips, stats } = useApp();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'edit' | 'bookings' | 'security'
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Editable form state initialized with user details
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    passportNumber: user?.passportNumber || '',
    nationality: user?.nationality || 'United States',
    homeAirport: user?.homeAirport || 'DEL - Indira Gandhi Intl',
    preferredAirline: user?.preferredAirline || 'Air India / Emirates',
    dietaryPreference: user?.dietaryPreference || 'Vegetarian',
    seatPreference: user?.seatPreference || 'Window (Front)',
    bio: user?.bio || ''
  }));

  // Security notification toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-hero-card card" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <User size={56} style={{ margin: '0 auto 16px', color: 'var(--ink-400)' }} />
            <h2>Please Sign In to Access Your Profile</h2>
            <p style={{ color: 'var(--ink-500)', maxWidth: '440px', margin: '8px auto 24px' }}>
              Create an account or sign in to view your Voyager tier rewards, confirmed e-tickets, and travel preferences.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openLoginModal}
            >
              Sign In to GlobeGo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setActiveTab('overview');
  };

  const handleSelectAvatar = (url) => {
    updateProfile({ avatar: url });
    setAvatarModalOpen(false);
  };

  const handleApplyCustomAvatar = (e) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      updateProfile({ avatar: customAvatarUrl.trim() });
      setCustomAvatarUrl('');
      setAvatarModalOpen(false);
    }
  };

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  const tripsCount = savedTrips ? savedTrips.length : 0;

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* HERO PROFILE CARD */}
        <div className="profile-hero-card">
          <div className="profile-hero-cover"></div>
          <div className="profile-hero-main">
            <div className="profile-avatar-stack">
              <div className="avatar-wrapper">
                <img
                  src={user.avatar}
                  alt={`${user.name} profile`}
                  className="avatar-img"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=85';
                  }}
                />
                <button
                  type="button"
                  className="avatar-edit-badge"
                  onClick={() => setAvatarModalOpen(true)}
                  title="Change avatar photo"
                  aria-label="Change avatar photo"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div className="profile-identity">
                <div className="profile-name-row">
                  <h1>{user.name}</h1>
                  <span className="tier-pill-badge">
                    <Award size={13} /> {user.membershipTier}
                  </span>
                </div>

                <div className="profile-meta-line">
                  <span><Mail size={14} /> {user.email}</span>
                  <span><MapPin size={14} /> {user.homeAirport.split(' - ')[0]}</span>
                  <span><Calendar size={14} /> Member since {user.memberSince}</span>
                </div>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button
                type="button"
                className={`btn ${activeTab === 'edit' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
              >
                <Edit3 size={15} />
                <span>{activeTab === 'edit' ? 'Close Editor' : 'Edit Profile'}</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={logout}
                title="Sign out of your account"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* LOYALTY TIER PROGRESS BAR */}
          <div className="profile-tier-banner">
            <div className="tier-banner-top">
              <div>
                <strong>Voyager Loyalty Status: {user.membershipTier}</strong>
                <span style={{ marginLeft: '8px', color: 'var(--ink-500)' }}>
                  ({user.tierProgress}% toward Diamond Voyager)
                </span>
              </div>
              <span className="tier-points-tag">
                <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {user.points.toLocaleString('en-IN')} Reward Miles
              </span>
            </div>

            <div className="tier-progress-track">
              <div
                className="tier-progress-fill"
                style={{ width: `${user.tierProgress}%` }}
              ></div>
            </div>

            <p className="tier-banner-sub">
              Earn 5,750 more miles to unlock Diamond VIP Lounge Access, free seat selection, and 24/7 dedicated travel concierge.
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="profile-tabs-bar">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Briefcase size={16} />
            <span>Profile Overview</span>
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit3 size={16} />
            <span>Personal &amp; Travel Details</span>
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Plane size={16} />
            <span>My Bookings &amp; Tickets ({tripsCount})</span>
          </button>

          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={16} />
            <span>Security &amp; Switch Account</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Metrics */}
            <div className="profile-stats-grid">
              <div className="profile-stat-box card">
                <div className="stat-icon-wrap" style={{ background: 'var(--pine-100)', color: 'var(--pine-700)' }}>
                  <Briefcase size={22} />
                </div>
                <div className="stat-info-stack">
                  <span className="stat-val">{stats.trips}</span>
                  <span className="stat-lbl">Trips Saved &amp; Planned</span>
                </div>
              </div>

              <div className="profile-stat-box card">
                <div className="stat-icon-wrap" style={{ background: 'var(--amber-100)', color: 'var(--amber-700)' }}>
                  <Sparkles size={22} />
                </div>
                <div className="stat-info-stack">
                  <span className="stat-val">{user.points.toLocaleString('en-IN')}</span>
                  <span className="stat-lbl">Voyager Reward Points</span>
                </div>
              </div>

              <div className="profile-stat-box card">
                <div className="stat-icon-wrap" style={{ background: '#ffe4e6', color: '#e11d48' }}>
                  <Heart size={22} />
                </div>
                <div className="stat-info-stack">
                  <span className="stat-val">{wishlistCount}</span>
                  <span className="stat-lbl">Wishlisted Destinations</span>
                </div>
              </div>

              <div className="profile-stat-box card">
                <div className="stat-icon-wrap" style={{ background: 'var(--rating-green-bg)', color: 'var(--rating-green)' }}>
                  <CreditCard size={22} />
                </div>
                <div className="stat-info-stack">
                  <span className="stat-val">₹{Math.round(stats.totalSpent * 0.18).toLocaleString('en-IN')}</span>
                  <span className="stat-lbl">Member Savings Unlocked</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="profile-overview-layout">
              {/* Left Column: Persona & Preferences */}
              <div className="overview-card card">
                <div className="overview-card-header">
                  <h3><User size={18} /> Travel Persona &amp; Preferences</h3>
                  <button
                    type="button"
                    className="btn-link"
                    style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--expedia-blue)' }}
                    onClick={() => setActiveTab('edit')}
                  >
                    Edit Details →
                  </button>
                </div>

                {user.bio && (
                  <div className="profile-bio-box">
                    "{user.bio}"
                  </div>
                )}

                <div className="persona-badges-grid">
                  <div className="persona-badge-item">
                    <span className="p-label"><Plane size={12} /> Preferred Airline</span>
                    <strong className="p-value">{user.preferredAirline}</strong>
                  </div>

                  <div className="persona-badge-item">
                    <span className="p-label"><Armchair size={12} /> Seat Preference</span>
                    <strong className="p-value">{user.seatPreference}</strong>
                  </div>

                  <div className="persona-badge-item">
                    <span className="p-label"><Utensils size={12} /> Dietary Choice</span>
                    <strong className="p-value">{user.dietaryPreference}</strong>
                  </div>

                  <div className="persona-badge-item">
                    <span className="p-label"><MapPin size={12} /> Home Departure Hub</span>
                    <strong className="p-value">{user.homeAirport}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/preferences')}
                  >
                    Travel Persona
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/flights')}
                  >
                    <Plane size={14} /> Search Flights
                  </button>
                </div>
              </div>

              {/* Right Column: Recent Bookings / Saved Activity */}
              <div className="overview-card card">
                <div className="overview-card-header">
                  <h3><BookmarkCheck size={18} /> Recent Saved Activity</h3>
                  <button
                    type="button"
                    className="btn-link"
                    style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--expedia-blue)' }}
                    onClick={() => setActiveTab('bookings')}
                  >
                    View All ({tripsCount}) →
                  </button>
                </div>

                {savedTrips && savedTrips.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {savedTrips.slice(0, 3).map((trip) => (
                      <div className="booking-preview-item" key={trip.id}>
                        <div className="booking-preview-left">
                          <div className="booking-airline-badge">
                            {trip.airline ? trip.airline.slice(0, 2).toUpperCase() : 'GG'}
                          </div>
                          <div>
                            <div className="booking-dest-title">{trip.destination}</div>
                            <div className="booking-dest-sub">
                              {trip.airline ? `${trip.airline} · Flight ${trip.flightNumber || 'GG-204'}` : `${trip.days || 5} Days Itinerary`}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--expedia-blue)' }}>
                          ₹{trip.budget ? trip.budget.toLocaleString('en-IN') : '54,000'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--ink-500)' }}>
                    <Plane size={32} style={{ margin: '0 auto 8px', color: 'var(--ink-300)' }} />
                    <p style={{ margin: 0, fontSize: '0.88rem' }}>No trips saved yet.</p>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/flights')}
                >
                  <Plane size={15} /> Book a New Flight
                </button>
              </div>
            </div>

            {/* PREMIUM TRAVEL VISUAL GALLERY */}
            <section className="profile-travel-gallery" aria-label="Travel inspiration">
              <div className="profile-travel-gallery-head">
                <div>
                  <h3>Your next chapter starts here</h3>
                  <p>Curated destinations inspired by the GlobeGo traveler experience.</p>
                </div>
                <span className="tier-pill-badge">✦ INSPIRED BY YOU</span>
              </div>

              <div className="profile-gallery-grid">
                <div className="profile-gallery-item">
                  <img
                    src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85"
                    alt="Mountain landscape travel destination"
                    loading="lazy"
                  />
                  <div className="profile-gallery-caption">
                    <span className="profile-gallery-pill">Adventure</span>
                    Find your next horizon
                  </div>
                </div>

                <div className="profile-gallery-item">
                  <img
                    src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=700&q=85"
                    alt="Colorful coastal village in Italy"
                    loading="lazy"
                  />
                  <div className="profile-gallery-caption">Mediterranean escapes</div>
                </div>

                <div className="profile-gallery-item">
                  <img
                    src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=85"
                    alt="Traditional Japanese travel scene"
                    loading="lazy"
                  />
                  <div className="profile-gallery-caption">Culture &amp; discovery</div>
                </div>

                <div className="profile-gallery-item">
                  <img
                    src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=700&q=85"
                    alt="Tropical island travel destination"
                    loading="lazy"
                  />
                  <div className="profile-gallery-caption">Slow island days</div>
                </div>

                <div className="profile-gallery-item">
                  <img
                    src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=85"
                    alt="Modern city skyline at night"
                    loading="lazy"
                  />
                  <div className="profile-gallery-caption">City lights</div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: EDIT PROFILE FORM */}
        {activeTab === 'edit' && (
          <div className="profile-edit-card card">
            <div className="overview-card-header">
              <h3><Edit3 size={20} /> Edit Traveler Details &amp; Flying Preferences</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--ink-500)' }}>
                Changes are automatically synced with flight bookings and AI planner.
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form-grid">
              <div className="profile-field-wrap">
                <label>Full Legal Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="profile-field-wrap">
                <label>Registered Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="profile-field-wrap">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>

              <div className="profile-field-wrap">
                <label>Passport / ID Number</label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleFormChange}
                  placeholder="e.g. P98765432A"
                />
              </div>

              <div className="profile-field-wrap">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleFormChange}
                />
              </div>

              <div className="profile-field-wrap">
                <label>Home Airport Hub</label>
                <select
                  name="homeAirport"
                  value={formData.homeAirport}
                  onChange={handleFormChange}
                >
                  <option value="DEL - Indira Gandhi Intl, Delhi">DEL - Indira Gandhi Intl, Delhi</option>
                  <option value="BOM - Chhatrapati Shivaji Intl, Mumbai">BOM - Chhatrapati Shivaji Intl, Mumbai</option>
                  <option value="BLR - Kempegowda Intl, Bengaluru">BLR - Kempegowda Intl, Bengaluru</option>
                  <option value="DXB - Dubai International, UAE">DXB - Dubai International, UAE</option>
                  <option value="SIN - Singapore Changi">SIN - Singapore Changi</option>
                  <option value="LHR - London Heathrow, UK">LHR - London Heathrow, UK</option>
                  <option value="JFK - New York JFK, USA">JFK - New York JFK, USA</option>
                </select>
              </div>

              <div className="profile-field-wrap">
                <label>Preferred Airline</label>
                <input
                  type="text"
                  name="preferredAirline"
                  value={formData.preferredAirline}
                  onChange={handleFormChange}
                />
              </div>

              <div className="profile-field-wrap">
                <label>Preferred Seat Location</label>
                <select
                  name="seatPreference"
                  value={formData.seatPreference}
                  onChange={handleFormChange}
                >
                  <option value="Window (Front)">Window (Front)</option>
                  <option value="Aisle">Aisle</option>
                  <option value="Extra Legroom (Exit Row)">Extra Legroom (Exit Row)</option>
                  <option value="Window (Rear)">Window (Rear)</option>
                </select>
              </div>

              <div className="profile-field-wrap">
                <label>In-Flight Meal &amp; Dietary</label>
                <select
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleFormChange}
                >
                  <option value="Vegetarian">Vegetarian (Asian / Hindu)</option>
                  <option value="Jain / Pure Veg">Jain / Pure Veg</option>
                  <option value="Vegan">Vegan (Strict)</option>
                  <option value="Standard / Non-Veg">Standard / Non-Veg</option>
                  <option value="Halal Meal">Halal Meal</option>
                  <option value="Kosher Meal">Kosher Meal</option>
                  <option value="Gluten Free">Gluten Free Meal</option>
                </select>
              </div>

              <div className="profile-field-wrap full-span">
                <label>Traveler Bio &amp; Passions</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleFormChange}
                  placeholder="Share what excites you most about exploring new places..."
                ></textarea>
              </div>

              <div className="profile-form-actions full-span">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveTab('overview')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <CheckCircle size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div className="profile-bookings-stack">
            <div className="overview-card-header" style={{ background: 'var(--white)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
              <div>
                <h3 style={{ margin: 0 }}><Plane size={18} /> My Saved Itineraries &amp; Confirmed Flights</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--ink-500)' }}>
                  View e-ticket vouchers, boarding passes, and flight schedules.
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/flights')}
              >
                + Book New Flight
              </button>
            </div>

            {savedTrips && savedTrips.length > 0 ? (
              savedTrips.map((trip) => (
                <div className="profile-ticket-card card" key={trip.id}>
                  <div className="ticket-main-info">
                    <div className="ticket-pnr-badge">
                      {trip.bookingRef || 'GG-ETKT-2026'}
                    </div>
                    <div>
                      <h4 className="ticket-route-h4">
                        {trip.origin || user.homeAirport.split(' - ')[0]} → {trip.destination}
                      </h4>
                      <div className="ticket-sub-details">
                        <span><Calendar size={13} /> {trip.departDate || 'Upcoming Trip'}</span>
                        {trip.airline && <span><Plane size={13} /> {trip.airline} ({trip.flightNumber || 'GG-102'})</span>}
                        <span><Clock size={13} /> Saved on {new Date(trip.savedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--ink-500)', display: 'block' }}>Total Paid</span>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--expedia-blue)' }}>
                        ₹{trip.budget ? trip.budget.toLocaleString('en-IN') : '54,000'}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => navigate('/flights/confirmation')}
                    >
                      View Boarding Pass
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="profile-hero-card card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <Plane size={48} style={{ margin: '0 auto 12px', color: 'var(--ink-300)' }} />
                <h3>No Bookings Saved Yet</h3>
                <p style={{ color: 'var(--ink-500)', maxWidth: '400px', margin: '6px auto 20px' }}>
                  Search flights or use our AI Itinerary generator to save your first adventure.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/flights')}
                >
                  Find Flights
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SECURITY & DEMO ACCOUNT SWITCHER */}
        {activeTab === 'security' && (
          <div className="security-settings-grid">
            {/* Security Toggles */}
            <div className="overview-card card">
              <div className="overview-card-header">
                <h3><Lock size={18} /> Account Security &amp; Alerts</h3>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p>Require an SMS/Authenticator code upon login.</p>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <h4>Flight Status &amp; Gate Alerts</h4>
                  <p>Real-time SMS and push alerts for boarding and gate changes.</p>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <h4>Price Drop &amp; Member Deal Alerts</h4>
                  <p>Notify when prices drop on saved wishlist destinations.</p>
                </div>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={priceAlerts}
                  onChange={(e) => setPriceAlerts(e.target.checked)}
                />
              </div>
            </div>

            {/* Demo Accounts Switcher */}
            <div className="overview-card card">
              <div className="overview-card-header">
                <h3><User size={18} /> Switch Demo Profiles</h3>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--ink-500)', margin: '0 0 14px' }}>
                Test different Voyager membership tiers and traveler personas instantly:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {demoAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="booking-preview-item"
                    style={{
                      cursor: 'pointer',
                      border: user.id === acc.id ? '2px solid var(--expedia-blue)' : '1px solid var(--card-border)',
                      background: user.id === acc.id ? 'var(--pine-50)' : 'var(--cream)'
                    }}
                    onClick={() => switchDemoAccount(acc.id)}
                  >
                    <div className="booking-preview-left">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--ink-900)' }}>{acc.name}</strong>
                        <div style={{ fontSize: '0.76rem', color: 'var(--pine-700)' }}>
                          {acc.membershipTier} · {acc.points.toLocaleString()} pts
                        </div>
                      </div>
                    </div>

                    {user.id === acc.id ? (
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--expedia-blue)' }}>
                        ✓ Active Profile
                      </span>
                    ) : (
                      <button type="button" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        Switch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* AVATAR SELECTOR MODAL */}
      {avatarModalOpen && (
        <div className="auth-modal-backdrop" onClick={() => setAvatarModalOpen(false)}>
          <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <button
              type="button"
              className="auth-modal-close-btn"
              onClick={() => setAvatarModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="auth-modal-body">
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>Choose Profile Photo</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--ink-500)', margin: '0 0 16px' }}>
                Select one of our curated traveler avatars or provide a custom image URL:
              </p>

              <div className="avatar-presets-grid">
                {avatarPresets.map((presetUrl, idx) => (
                  <div
                    key={idx}
                    className={`avatar-preset-item ${user.avatar === presetUrl ? 'selected' : ''}`}
                    onClick={() => handleSelectAvatar(presetUrl)}
                  >
                    <img src={presetUrl} alt={`Avatar option ${idx + 1}`} />
                  </div>
                ))}
              </div>

              <form onSubmit={handleApplyCustomAvatar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink-700)' }}>
                  Or enter image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    fontSize: '0.88rem'
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!customAvatarUrl.trim()}
                >
                  Set Custom Photo
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}