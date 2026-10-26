import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane,
  Globe,
  Heart,
  Wallet,
  Clock,
  CheckCircle,
  Sliders,
  Award,
  User,
  ArrowRight,
  Calendar,
  Sparkles,
  MapPin,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Compass,
  Lightbulb,
  CheckSquare,
  Square,
  Plus,
  TrendingUp,
  Tag,
  Luggage
} from 'lucide-react';

import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatINR } from '../utils/budgetCalculator.js';
import destinations from '../data/destination.js';
import './Dashboard.css';

// -------------------------------------------------------------
// 1. STATIC CONFIGURATION DATA & ASSETS
// -------------------------------------------------------------

// Hero Slider Banners featuring world-class destinations
const HERO_SLIDES = [
  {
    id: 'tokyo',
    title: 'Explore Neon Skylines & Historic Temples',
    destination: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    tag: 'Cherry Blossom Special',
    query: 'Plan a 7-day culture & food trip to Japan'
  },
  {
    id: 'bali',
    title: 'Serene Emerald Terraces & Ocean Sunsets',
    destination: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=80',
    tag: 'Tropical Escape',
    query: 'Plan a 5-day relaxing nature getaway to Bali'
  },
  {
    id: 'swiss',
    title: 'Majestic Alpine Summits & Crystal Lakes',
    destination: 'Swiss Alps, Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
    tag: 'Mountain Adventure',
    query: 'Plan a 6-day scenic adventure in Switzerland'
  },
  {
    id: 'paris',
    title: 'Timeless Art, Cafes & Romantic Boulevards',
    destination: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
    tag: 'Gourmet & Culture',
    query: 'Plan a 4-day romantic highlights tour of Paris'
  }
];

// Curated Starter Itineraries (Displayed if user has no saved trips yet)
const CURATED_TRIPS = [
  {
    id: 'curated_japan',
    destination: 'Tokyo & Kyoto, Japan',
    duration: 7,
    budget: 87500,
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    category: 'Culture & Food',
    daysLeft: 14,
    status: 'upcoming'
  },
  {
    id: 'curated_bali',
    destination: 'Ubud & Seminyak, Bali',
    duration: 5,
    budget: 42000,
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    category: 'Beach & Nature',
    daysLeft: 28,
    status: 'upcoming'
  },
  {
    id: 'curated_paris',
    destination: 'Paris & Versailles, France',
    duration: 4,
    budget: 68000,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    category: 'Romantic & Art',
    daysLeft: 45,
    status: 'upcoming'
  }
];

// Smart AI Travel Tips for the generator widget
const TRAVEL_TIPS = [
  {
    category: 'Smart Booking',
    tip: 'Book international flights on Tuesday afternoons 6 to 8 weeks in advance for up to 18% lower airfares.'
  },
  {
    category: 'Packing Pro-Tip',
    tip: 'Roll your clothes instead of folding to save 30% suitcase volume and prevent unwanted creases.'
  },
  {
    category: 'Budget Optimization',
    tip: 'Always opt for local currency payments on your credit card at checkout to avoid high dynamic currency conversion fees.'
  },
  {
    category: 'AI Travel Hack',
    tip: 'Download offline Google Maps of your destination before departure to navigate seamlessly without cellular data.'
  },
  {
    category: 'VIP Privilege',
    tip: 'Remember to check airport lounge access tied to your Platinum tier card before your upcoming flight departure!'
  }
];

// Category filter list for the destinations gallery
const CATEGORIES = ['All', 'Beach', 'Romantic', 'Adventure', 'Luxury', 'Culture', 'City'];

// Helper function to format ISO date strings into readable Indian standard format
function formatDate(iso) {
  if (!iso) return 'Recent';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// -------------------------------------------------------------
// 2. MAIN DASHBOARD COMPONENT
// -------------------------------------------------------------
export default function Dashboard() {
  const navigate = useNavigate();

  // App & Auth contexts for global state
  const { stats, savedTrips, saveTrip } = useApp();
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // -----------------------------------------------------------
  // REACT STATE HOOKS (useState)
  // -----------------------------------------------------------

  // State 1: Active index of the hero carousel banner (0 to HERO_SLIDES.length - 1)
  const [heroIndex, setHeroIndex] = useState(0);

  // State 2: Autoplay toggle for the hero image carousel
  const [isAutoplay, setIsAutoplay] = useState(true);

  // State 3: Dynamic greeting message (Good morning / afternoon / evening)
  const [greeting, setGreeting] = useState('Welcome');

  // State 4: Current active navigation tab ('all', 'explore', 'tools')
  const [activeTab, setActiveTab] = useState('all');

  // State 5: Destination category filter pill ('All', 'Beach', etc.)
  const [selectedCategory, setSelectedCategory] = useState('All');

  // State 6: Search input text for filtering destination cards live
  const [searchQuery, setSearchQuery] = useState('');

  // State 7: Index of the current AI Travel Tip displayed
  const [tipIndex, setTipIndex] = useState(0);

  // State 8: Travel Bucket List goals checklist
  const [bucketList, setBucketList] = useState([
    { id: 1, text: 'See the Northern Lights in Iceland', done: false, icon: '❄️' },
    { id: 2, text: 'Ride the Shinkansen bullet train in Japan', done: true, icon: '🚄' },
    { id: 3, text: 'Hot air balloon flight over Cappadocia', done: false, icon: '🎈' },
    { id: 4, text: 'Scuba dive the coral reefs in Bali', done: false, icon: '🐠' }
  ]);

  // State 9: New goal text input
  const [newGoalInput, setNewGoalInput] = useState('');

  // State 10: Interactive trip budget calculator parameters
  const [calcDays, setCalcDays] = useState(5);
  const [calcTravelers, setCalcTravelers] = useState(2);
  const [calcTier, setCalcTier] = useState('moderate'); // 'budget', 'moderate', 'luxury'

  // -----------------------------------------------------------
  // REACT EFFECT HOOKS (useEffect)
  // -----------------------------------------------------------

  // Effect 1: Determine dynamic greeting based on current local hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []); // Runs once when component mounts

  // Effect 2: Hero image carousel automatic interval timer
  useEffect(() => {
    if (!isAutoplay) return;

    // Advance to next hero image every 5 seconds
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    // Cleanup interval timer on unmount or when autoplay state changes
    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Effect 3: AI travel tips rotation timer (every 8 seconds)
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TRAVEL_TIPS.length);
    }, 8000);

    return () => clearInterval(tipInterval);
  }, []);

  // -----------------------------------------------------------
  // HANDLER FUNCTIONS & LOGIC
  // -----------------------------------------------------------

  // Manual next/prev hero slide controls
  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  // Toggle bucket list goal completion
  const handleToggleGoal = (id) => {
    setBucketList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // Add new dream goal to bucket list
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;

    const newGoal = {
      id: Date.now(),
      text: newGoalInput.trim(),
      done: false,
      icon: '✈️'
    };

    setBucketList((prev) => [...prev, newGoal]);
    setNewGoalInput('');
  };

  // Next AI tip button handler
  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % TRAVEL_TIPS.length);
  };

  // Toggle destination heart in wishlist
  const handleToggleWishlist = (dest) => {
    if (isInWishlist(dest.id)) {
      removeFromWishlist(dest.id);
    } else {
      addToWishlist(dest);
    }
  };

  // Quick Plan action - navigates to AI travel planner with search state
  const handleQuickPlan = (query) => {
    navigate('/ai-planner', { state: { initialQuery: query } });
  };

  // Calculate estimated budget for the interactive tool widget
  const tierCostMap = {
    budget: 4500,
    moderate: 9500,
    luxury: 18000
  };
  const estimatedCost = calcDays * calcTravelers * tierCostMap[calcTier];

  // Filtered destination gallery based on category & search query
  const destinationList = Array.isArray(destinations) ? destinations : [];
  const filteredDestinations = destinationList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Display user's saved trips or fallback to curated starter trips if empty
  const upcomingTrips = savedTrips.filter((t) => t.status === 'upcoming');
  const displayTrips = upcomingTrips.length > 0 ? upcomingTrips : CURATED_TRIPS;

  // Active hero slide object
  const currentHero = HERO_SLIDES[heroIndex];

  // -----------------------------------------------------------
  // 3. RENDER JSX
  // -----------------------------------------------------------
  return (
    <div className="dashboard-page">
      <div className="container">
        
        {/* =========================================================
            HERO SHOWCASE WITH DYNAMIC CAROUSEL & GREETING
            ========================================================= */}
        <section className="dashboard-hero">
          {/* Background Image of active slide */}
          <img
            key={currentHero.id}
            src={currentHero.image}
            alt={currentHero.destination}
            className="dashboard-hero-bg"
          />

          {/* Dark gradient overlay for high contrast readability */}
          <div className="dashboard-hero-overlay" />

          {/* Hero Content text and action buttons */}
          <div className="dashboard-hero-content">
            <div className="hero-member-pill">
              <Sparkles size={15} color="#38bdf8" />
              <span>GlobeGo VIP • {user?.membershipTier || 'Platinum Voyager'}</span>
            </div>

            <h1 className="dashboard-hero-title">
              {greeting}, {user?.name ? user.name.split(' ')[0] : 'Traveler'}! ✈️
            </h1>

            <p className="dashboard-hero-subtitle">
              {currentHero.title} — Discover curated AI day-by-day itineraries, member perks, and explore {currentHero.destination}.
            </p>

            <div className="hero-actions">
              <button
                onClick={() => handleQuickPlan(currentHero.query)}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.96rem' }}
              >
                <Sparkles size={18} />
                <span>Plan Trip to {currentHero.destination.split(',')[0]}</span>
              </button>

              <Link
                to="/explore"
                className="btn btn-secondary"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  borderColor: 'rgba(255,255,255,0.35)',
                  color: '#ffffff',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Globe size={18} />
                <span>Explore All Places</span>
              </Link>
            </div>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="hero-controls">
            <button
              onClick={handlePrevHero}
              className="hero-ctrl-btn"
              title="Previous Destination"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="hero-ctrl-btn"
              title={isAutoplay ? 'Pause Slideshow' : 'Play Slideshow'}
              aria-label="Toggle Autoplay"
            >
              {isAutoplay ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <div className="hero-dots">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setHeroIndex(idx)}
                  className={`hero-dot ${idx === heroIndex ? 'active' : ''}`}
                  title={slide.destination}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextHero}
              className="hero-ctrl-btn"
              title="Next Destination"
              aria-label="Next Slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* =========================================================
            QUICK STATS CARDS (Dynamic Numbers & Icons)
            ========================================================= */}
        <section className="stats-grid">
          {/* Stat 1: Planned Trips */}
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--pine-50, #eff6ff)', color: '#0284c7' }}>
              <Plane size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.trips || 4}</div>
              <div className="stat-label">Planned Trips</div>
            </div>
          </div>

          {/* Stat 2: Destinations Explored */}
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--pine-50, #f0fdf4)', color: '#16a34a' }}>
              <Globe size={24} />
            </div>
            <div>
              <div className="stat-value">{stats?.destinations || 9}</div>
              <div className="stat-label">Destinations Visited</div>
            </div>
          </div>

          {/* Stat 3: Wishlist Stays & Spots */}
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <Heart size={24} />
            </div>
            <div>
              <div className="stat-value">{wishlist.length > 0 ? wishlist.length : (stats?.wishlist || 14)}</div>
              <div className="stat-label">Wishlist Places</div>
            </div>
          </div>

          {/* Stat 4: Estimated Budget / Spend */}
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: 'var(--amber-100, #fefce8)', color: '#ca8a04' }}>
              <Wallet size={24} />
            </div>
            <div>
              <div className="stat-value">{formatINR(stats?.totalSpent || 185000)}</div>
              <div className="stat-label">Estimated Spend</div>
            </div>
          </div>
        </section>

        {/* =========================================================
            DASHBOARD NAVIGATION TABS (Tab-based view switcher)
            ========================================================= */}
        <div className="dashboard-tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`dash-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          >
            <Compass size={17} />
            <span>Overview &amp; Itineraries</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`dash-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
          >
            <Globe size={17} />
            <span>Trending Destinations</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`dash-tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          >
            <Sparkles size={17} />
            <span>Smart Travel Tools</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: ITINERARIES & ACTIVE TRIPS (Overview)
            ========================================================= */}
        {(activeTab === 'all' || activeTab === 'trips') && (
          <section style={{ marginBottom: 44 }}>
            <div className="section-head-bar">
              <div>
                <h2>
                  <Luggage size={22} color="#0284c7" />
                  <span>Upcoming &amp; Recommended Itineraries</span>
                </h2>
                <p>
                  {upcomingTrips.length > 0
                    ? 'Your active customized itineraries ready for departure.'
                    : 'Curated itineraries crafted by our AI engine ready for your next getaway.'}
                </p>
              </div>

              <Link to="/ai-planner" className="btn btn-primary btn-sm">
                <Sparkles size={15} />
                <span>Generate Custom Trip</span>
              </Link>
            </div>

            <div className="trips-cards-grid">
              {displayTrips.map((trip) => (
                <div key={trip.id} className="trip-card-item">
                  <div className="trip-card-image-wrap">
                    <img
                      src={trip.coverImage || trip.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'}
                      alt={trip.destination}
                    />
                    <div className="trip-status-badge">
                      <Clock size={13} />
                      <span>Starts in {trip.daysLeft || 14} Days</span>
                    </div>
                    <div className="trip-duration-pill">
                      {trip.duration} Days Tour
                    </div>
                  </div>

                  <div className="trip-card-body">
                    <h3 className="trip-card-title">{trip.destination}</h3>
                    
                    <div className="trip-meta-row">
                      <div className="trip-meta-item">
                        <Calendar size={14} color="#0284c7" />
                        <span>{trip.savedAt ? formatDate(trip.savedAt) : 'Spring Departure'}</span>
                      </div>
                      <div className="trip-meta-item">
                        <Wallet size={14} color="#16a34a" />
                        <span>Budget {formatINR(trip.budget || 50000)}</span>
                      </div>
                    </div>

                    <div className="trip-card-actions">
                      <button
                        onClick={() =>
                          handleQuickPlan(`Plan a ${trip.duration}-day detailed travel itinerary to ${trip.destination}`)
                        }
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <span>View Day-by-Day Plan</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        onClick={() => {
                          saveTrip({
                            destination: trip.destination,
                            duration: trip.duration,
                            budget: trip.budget,
                            coverImage: trip.coverImage
                          });
                        }}
                        className="btn btn-secondary btn-sm"
                        title="Save to My Trips"
                      >
                        <Heart size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================
            TAB 2: TRENDING DESTINATIONS GALLERY (High-Res Images & Filter)
            ========================================================= */}
        {(activeTab === 'all' || activeTab === 'explore') && (
          <section style={{ marginBottom: 44 }}>
            <div className="section-head-bar">
              <div>
                <h2>
                  <MapPin size={22} color="#0284c7" />
                  <span>Featured World Destinations</span>
                </h2>
                <p>Browse high-rated global spots with estimated daily packages and one-click AI planning.</p>
              </div>
            </div>

            {/* Filter pills and real-time search input */}
            <div className="destinations-filter-wrap">
              <div className="filter-pills-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="search-input-box">
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search city, country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Destination cards grid */}
            <div className="destinations-grid">
              {filteredDestinations.slice(0, 8).map((dest) => {
                const isSaved = isInWishlist(dest.id);
                return (
                  <div key={dest.id} className="dest-card">
                    <div className="dest-card-image-wrap">
                      <img src={dest.image} alt={dest.name} loading="lazy" />

                      {/* Wishlist Heart Toggle Button */}
                      <button
                        onClick={() => handleToggleWishlist(dest)}
                        className={`dest-heart-btn ${isSaved ? 'saved' : ''}`}
                        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        aria-label="Wishlist toggle"
                      >
                        <Heart size={18} fill={isSaved ? '#e11d48' : 'none'} color={isSaved ? '#e11d48' : '#475569'} />
                      </button>

                      {dest.category && (
                        <div className="dest-category-badge">
                          {dest.category}
                        </div>
                      )}
                    </div>

                    <div className="dest-card-body">
                      <div className="dest-card-header">
                        <h4 className="dest-name">{dest.name}</h4>
                        <div className="dest-rating">
                          <Star size={14} fill="#d97706" color="#d97706" />
                          <span>{dest.rating || '4.8'}</span>
                        </div>
                      </div>

                      <div className="dest-country">
                        <MapPin size={13} />
                        <span>{dest.country}</span>
                      </div>

                      <div className="dest-price-row">
                        <div>
                          <div className="dest-price-value">{formatINR(dest.price)}</div>
                          <div className="dest-price-unit">Estimated Package</div>
                        </div>

                        <button
                          onClick={() => handleQuickPlan(`Plan a 5-day holiday in ${dest.name}, ${dest.country}`)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                        >
                          <span>Plan AI Trip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================
            TAB 3: SMART DASHBOARD TOOLS & INTERACTIVE WIDGETS
            ========================================================= */}
        {(activeTab === 'all' || activeTab === 'tools') && (
          <section style={{ marginBottom: 44 }}>
            <div className="section-head-bar">
              <div>
                <h2>
                  <Sparkles size={22} color="#0284c7" />
                  <span>Travel Tools &amp; Daily Insights</span>
                </h2>
                <p>Interactive utilities powered by standard React hooks (useState &amp; useEffect).</p>
              </div>
            </div>

            <div className="tools-widgets-grid">
              
              {/* WIDGET 1: AI Daily Travel Tip Generator */}
              <div className="widget-card">
                <div className="widget-header">
                  <div className="widget-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <Lightbulb size={22} />
                  </div>
                  <div>
                    <h3 className="widget-title">AI Travel Tip of the Day</h3>
                    <p className="widget-sub">Auto-refreshes daily with insider hacks</p>
                  </div>
                </div>

                <div className="tip-display-box">
                  <div className="tip-category-tag">{TRAVEL_TIPS[tipIndex].category}</div>
                  <p className="tip-text">"{TRAVEL_TIPS[tipIndex].tip}"</p>
                </div>

                <button onClick={handleNextTip} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <Sparkles size={14} />
                  <span>Get Another Travel Hack ({tipIndex + 1}/{TRAVEL_TIPS.length})</span>
                </button>
              </div>

              {/* WIDGET 2: Instant Trip Budget Calculator */}
              <div className="widget-card">
                <div className="widget-header">
                  <div className="widget-icon" style={{ background: '#eff6ff', color: '#0284c7' }}>
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <h3 className="widget-title">Instant Budget Estimator</h3>
                    <p className="widget-sub">Real-time dynamic cost calculation</p>
                  </div>
                </div>

                <div className="calc-field-group">
                  <div className="calc-row">
                    <span className="calc-label">Trip Duration:</span>
                    <select
                      className="calc-select"
                      value={calcDays}
                      onChange={(e) => setCalcDays(Number(e.target.value))}
                    >
                      <option value={3}>3 Days (Weekend)</option>
                      <option value={5}>5 Days (Standard)</option>
                      <option value={7}>7 Days (1 Week)</option>
                      <option value={10}>10 Days (Extended)</option>
                      <option value={14}>14 Days (Grand Tour)</option>
                    </select>
                  </div>

                  <div className="calc-row">
                    <span className="calc-label">Travelers:</span>
                    <select
                      className="calc-select"
                      value={calcTravelers}
                      onChange={(e) => setCalcTravelers(Number(e.target.value))}
                    >
                      <option value={1}>1 Solo Explorer</option>
                      <option value={2}>2 Travelers (Couple)</option>
                      <option value={4}>4 Travelers (Family / Group)</option>
                    </select>
                  </div>

                  <div className="calc-row">
                    <span className="calc-label">Travel Style:</span>
                    <select
                      className="calc-select"
                      value={calcTier}
                      onChange={(e) => setCalcTier(e.target.value)}
                    >
                      <option value="budget">Backpacker / Budget</option>
                      <option value="moderate">Comfort &amp; Standard</option>
                      <option value="luxury">Luxury &amp; 5-Star</option>
                    </select>
                  </div>
                </div>

                <div className="calc-result-box">
                  <span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>Estimated Total:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                    {formatINR(estimatedCost)}
                  </span>
                </div>
              </div>

              {/* WIDGET 3: Interactive Travel Bucket List */}
              <div className="widget-card">
                <div className="widget-header">
                  <div className="widget-icon" style={{ background: '#fefce8', color: '#ca8a04' }}>
                    <CheckSquare size={22} />
                  </div>
                  <div>
                    <h3 className="widget-title">Travel Bucket List</h3>
                    <p className="widget-sub">Check off adventures or add new goals</p>
                  </div>
                </div>

                <div className="bucket-list-items">
                  {bucketList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleGoal(item.id)}
                      className={`bucket-item-row ${item.done ? 'done' : ''}`}
                    >
                      {item.done ? (
                        <CheckSquare size={17} color="#16a34a" />
                      ) : (
                        <Square size={17} color="#94a3b8" />
                      )}
                      <span>{item.icon} {item.text}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddGoal} className="bucket-add-box">
                  <input
                    type="text"
                    placeholder="Add dream adventure..."
                    value={newGoalInput}
                    onChange={(e) => setNewGoalInput(e.target.value)}
                    className="bucket-add-input"
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 14px' }}>
                    <Plus size={16} />
                  </button>
                </form>
              </div>

            </div>
          </section>
        )}

        {/* =========================================================
            BOTTOM QUICK ACCESS LINKS (Member Portal Links)
            ========================================================= */}
        <section className="bottom-links-grid">
          <Link to="/preferences" className="bottom-link-card">
            <div className="bottom-link-icon" style={{ background: '#eff6ff', color: '#0284c7' }}>
              <Sliders size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.98rem' }}>
                Travel Preferences
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)' }}>
                Update budget tier, climate &amp; preferred styles
              </span>
            </div>
          </Link>

          <Link to="/stats" className="bottom-link-card">
            <div className="bottom-link-icon" style={{ background: '#fefce8', color: '#ca8a04' }}>
              <Award size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.98rem' }}>
                Stats &amp; Achievements
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)' }}>
                View member tier badges &amp; spending insights
              </span>
            </div>
          </Link>

          <Link to="/flights" className="bottom-link-card">
            <div className="bottom-link-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <Plane size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.98rem' }}>
                Flight Search &amp; Booking
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)' }}>
                Book domestic &amp; international flights with member deals
              </span>
            </div>
          </Link>

          <Link to="/wishlist" className="bottom-link-card">
            <div className="bottom-link-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <Heart size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.98rem' }}>
                My Wishlist Stays
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)' }}>
                View all your saved dream destinations ({wishlist.length})
              </span>
            </div>
          </Link>
        </section>

      </div>
    </div>
  );
}
