import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveService, selectLastSearch, serviceSelected, searchSubmitted } from '../store/searchSlice.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useForm } from '../hooks/useForm.js';
import SearchField from '../components/SearchField.jsx';
import { defaultSearchValues, validateSearch, parseDates, parseTravelers } from '../utils/searchValidation.js';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  Search,
  Tag,
  Heart,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  ArrowRight,
  Play,
} from 'lucide-react';
import { formatINR } from '../utils/budgetCalculator.js';
import DynamicHeroReel from '../components/DynamicHeroReel.jsx';
import SearchTabIcon from '../components/SearchTabIcon.jsx';
import homeData from '../data/db.json';
import destinations from '../data/destination.js';

// Static home-page content comes from a single JSON data file.
const {
  searchTabs: SEARCH_TABS,
  weekendDeals: WEEKEND_DEALS,
  vacationRentals: VACATION_RENTALS,
  packageCities: PACKAGE_CITIES,
  packageDeals: PACKAGE_DEALS,
  travelStyles: TRAVEL_STYLES,
  styleCards: STYLE_CARDS,
  partnerBrands: PARTNER_BRANDS,
} = homeData;

const FEATURED_DESTINATIONS = (Array.isArray(destinations) ? destinations : []).slice(0, 8);

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeSearchTab = useSelector(selectActiveService);
  const lastSearch = useSelector(selectLastSearch);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useApp();
  const [selectedPackageCity, setSelectedPackageCity] = useState('Bangkok');
  const [selectedStyle, setSelectedStyle] = useState('beach');
  const form = useForm(lastSearch?.formValues || defaultSearchValues(), validateSearch, (values) => {
    const search = {
      service: activeSearchTab, destination: values.whereTo.trim(),
      ...parseDates(values.dates), ...parseTravelers(values.travelers),
      addFlight: values.addFlight, addCar: values.addCar, formValues: { ...values },
    };
    dispatch(searchSubmitted(search));
    if (activeSearchTab === 'flights' || values.addFlight) {
      navigate('/flights', { state: { prefillDestination: search.destination, travelSearch: search } });
    } else {
      navigate('/explore?' + new URLSearchParams({ q: search.destination, service: search.service }));
    }
  });
  const toggleWishlist = (deal) => {
    if (isInWishlist(deal.id)) {
      removeFromWishlist(deal.id);
      showToast('Removed from wishlist', deal.name, 'Heart');
    } else {
      addToWishlist({
        id: deal.id,
        name: deal.name,
        country: deal.country || deal.city || '',
        category: deal.category || 'Luxury',
        price: deal.price || deal.nightlyRate || 0,
        rating: deal.rating || 4.5,
        image: (deal.image || '').split('?')[0],
      });
      showToast('Saved to wishlist', deal.name, 'Heart');
    }
  };

  return (
    <>
      {/* ==========================================================================
          HERO SECTION WITH DYNAMIC CINEMATIC TRAVEL REEL
          ========================================================================== */}
      <section className="expedia-hero-wrapper">
        <DynamicHeroReel />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="expedia-hero-content">
            <h1 className="expedia-hero-title">The one place you go to go places</h1>
            <p className="expedia-hero-subtitle">
              Plan flights, luxury stays, vacation rentals and AI-optimized daily itineraries in seconds.
            </p>
          </div>

          <div className="search-widget-container">
            <div className="search-widget-card">
              <div className="search-widget-tabs">
                {SEARCH_TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`search-tab-btn${activeSearchTab === t.id ? ' active' : ''}`}
                    aria-pressed={activeSearchTab === t.id}
                    onClick={() => dispatch(serviceSelected(t.id))}
                  >
                    <div className="search-tab-icon-wrap"><SearchTabIcon name={t.icon} /></div>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={form.handleSubmit} noValidate>
                <div className="search-inputs-grid">
                  <SearchField name="whereTo" label="Where to?"
                    icon={<MapPin size={20} className="search-input-icon" />}
                    value={form.values.whereTo} error={form.errors.whereTo}
                    onChange={form.handleChange} onBlur={form.handleBlur}
                    placeholder="Destination, city or resort (e.g. Japan, Bali, Paris)" />
                  <SearchField name="dates" label="Dates"
                    icon={<Calendar size={20} className="search-input-icon" />}
                    value={form.values.dates} error={form.errors.dates}
                    onChange={form.handleChange} onBlur={form.handleBlur}
                    placeholder="YYYY-MM-DD to YYYY-MM-DD" title="Travel dates: YYYY-MM-DD to YYYY-MM-DD" />
                  <SearchField name="travelers" label="Travelers"
                    icon={<Users size={20} className="search-input-icon" />}
                    value={form.values.travelers} error={form.errors.travelers}
                    onChange={form.handleChange} onBlur={form.handleBlur}
                    placeholder="2 travelers, 1 room" title="Example: 2 travelers, 1 room (up to 9 travelers)" />

                  <button type="submit" className="search-submit-btn">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </div>

                <div className="search-options-row">
                  <label className="search-checkbox-label">
                    <input
                      type="checkbox"
                      name="addFlight"
                      checked={form.values.addFlight}
                      onChange={form.handleChange}
                    />
                    <span>Add a flight</span>
                  </label>
                  <label className="search-checkbox-label">
                    <input
                      type="checkbox"
                      name="addCar"
                      checked={form.values.addCar}
                      onChange={form.handleChange}
                    />
                    <span>Add a car</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          DISCOUNT PROMO BANNER
          ========================================================================== */}
      <div className="container">
        <div className="discount-promo-card">
          <div className="discount-promo-left">
            <div className="discount-badge-icon">
              <Tag size={24} />
            </div>
            <div>
              <h2 className="discount-promo-title">Save 30% or more off hotels</h2>
              <p className="discount-promo-sub">
                Save on the long weekend ahead. Find exclusive member deals on select stays worldwide.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="discount-promo-btn"
            onClick={() => navigate('/destinations')}
          >
            Explore Destinations
          </button>
        </div>

        {/* ==========================================================================
            POPULAR WORLD DESTINATIONS (FEATURED GLOBAL DESTINATIONS)
            ========================================================================== */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Popular World Destinations</h2>
              <p className="section-main-sub">Explore curated destinations across 20+ global cities with real-time flight search &amp; itineraries.</p>
            </div>
            <button
              type="button"
              className="section-action-btn"
              onClick={() => navigate('/destinations')}
            >
              <span>Explore all 20+ destinations</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="hotel-deals-grid">
            {FEATURED_DESTINATIONS.map((dest) => (
              <div className="hotel-deal-card" key={dest.id}>
                <div
                  className="hotel-card-image-wrap"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/flights', { state: { prefillDestination: dest.name } })}
                >
                  <img
                    src={`${dest.image}?auto=format&fit=crop&w=600&q=75`}
                    alt={dest.name}
                    className="hotel-card-img"
                  />
                  <div className="hotel-vip-badge" style={{ background: 'var(--primary, #1a73e8)' }}>
                    {dest.category}
                  </div>
                  <button
                    type="button"
                    className={`hotel-wishlist-btn${isInWishlist(dest.id) ? ' active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(dest);
                    }}
                    aria-pressed={isInWishlist(dest.id)}
                    aria-label={isInWishlist(dest.id) ? `Remove ${dest.name} from wishlist` : `Save ${dest.name} to wishlist`}
                  >
                    <Heart size={16} fill={isInWishlist(dest.id) ? '#e11d48' : 'none'} />
                  </button>
                </div>

                <div className="hotel-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h3 className="hotel-card-title" style={{ margin: 0 }}>{dest.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>

                  <div className="hotel-card-location" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                    <MapPin size={13} color="var(--ink-500)" />
                    <span>{dest.country}</span>
                  </div>

                  <div className="hotel-price-box" style={{ marginTop: 'auto' }}>
                    <div className="nightly-rate">
                      {formatINR(dest.price)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-500)' }}>est. trip</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: '100%', marginTop: 10, fontSize: '0.85rem', padding: '8px 12px', justifyContent: 'center' }}
                      onClick={() => navigate('/flights', { state: { prefillDestination: dest.name } })}
                    >
                      <Plane size={14} style={{ marginRight: 6 }} /> Find Flights
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            LAST-MINUTE WEEKEND DEALS
            ========================================================================== */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Last-minute weekend deals</h2>
              <p className="section-main-sub">Minimum 20% off deals for your next weekend getaway!</p>
            </div>
            <button
              type="button"
              className="section-action-btn"
              onClick={() => navigate('/explore')}
            >
              <span>See all deals</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="hotel-deals-grid">
            {WEEKEND_DEALS.map((deal) => (
              <div className="hotel-deal-card" key={deal.id}>
                <div className="hotel-card-image-wrap">
                  <img src={deal.image} alt={deal.name} className="hotel-card-img" />
                  {deal.vipAccess && (
                    <div className="hotel-vip-badge">
                      <ShieldCheck size={12} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                      VIP Access
                    </div>
                  )}
                  <button
                    type="button"
                    className={`hotel-wishlist-btn${isInWishlist(deal.id) ? ' active' : ''}`}
                    onClick={() => toggleWishlist(deal)}
                    aria-pressed={isInWishlist(deal.id)}
                    aria-label={isInWishlist(deal.id) ? `Remove ${deal.name} from wishlist` : `Save ${deal.name} to wishlist`}
                  >
                    <Heart size={16} fill={isInWishlist(deal.id) ? '#e11d48' : 'none'} />
                  </button>
                </div>

                <div className="hotel-card-body">
                  <h3 className="hotel-card-title">{deal.name}</h3>
                  <div className="hotel-card-location">{deal.city}</div>

                  <div className="hotel-rating-row">
                    <span className="score-badge">{deal.rating}</span>
                    <span className="score-label">{deal.ratingLabel}</span>
                    <span className="score-reviews">({deal.reviews} reviews)</span>
                  </div>

                  {deal.memberPrice && (
                    <div className="member-discount-pill">
                      <Star size={11} fill="#ffffff" />
                      Member Price available
                    </div>
                  )}

                  <div className="hotel-price-box">
                    <div className="nightly-rate">{formatINR(deal.nightlyRate)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-500)' }}>nightly</span></div>
                    <div className="total-rate-row">
                      <span>{formatINR(deal.totalRate)} total</span>
                      <span className="original-price-strike">{formatINR(deal.originalTotal)}</span>
                    </div>
                    <div className="taxes-note">
                      <Check size={11} /> Total with taxes and fees
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            VACATION RENTALS
            ========================================================================== */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Vacation rentals for your kind of stay</h2>
              <p className="section-main-sub">From modern city lofts to private mountain chalets and coastal villas.</p>
            </div>
          </div>

          <div className="vacation-rentals-grid">
            {VACATION_RENTALS.map((rental) => (
              <div
                className="rental-type-card"
                key={rental.title}
                onClick={() => navigate('/flights', { state: { prefillDestination: rental.title } })}
              >
                <img src={rental.image} alt={rental.title} className="rental-type-img" />
                <div className="rental-type-overlay">
                  <h3 className="rental-type-title">{rental.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            EASY PACKAGES
            ========================================================================== */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Easy packages, unforgettable places</h2>
              <p className="section-main-sub">Flight + Hotel bundles designed for seamless booking.</p>
            </div>
          </div>

          <div className="pill-tabs-row">
            {PACKAGE_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                className={`pill-tab-item${selectedPackageCity === city ? ' active' : ''}`}
                onClick={() => setSelectedPackageCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="package-cards-grid">
            {(PACKAGE_DEALS[selectedPackageCity] || PACKAGE_DEALS.Bangkok).map((pkg) => (
              <div
                className="package-deal-card"
                key={pkg.name}
                onClick={() => navigate('/flights', { state: { prefillDestination: selectedPackageCity } })}
                style={{ cursor: 'pointer' }}
              >
                <div className="package-img-wrap">
                  <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="package-badge">
                    <Plane size={12} />
                    Flight Included
                  </div>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--ink-900)' }}>
                    {pkg.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink-500)', marginBottom: 12 }}>
                    {pkg.detail}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: 10 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-500)' }}>Complete Package</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pine-900)' }}>
                      {formatINR(pkg.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            STAYS FOR EVERY TRAVEL STYLE
            ========================================================================== */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Stays for every travel style</h2>
              <p className="section-main-sub">Average prices based on current calendar month.</p>
            </div>
          </div>

          <div className="pill-tabs-row">
            {TRAVEL_STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`pill-tab-item${selectedStyle === st.id ? ' active' : ''}`}
                onClick={() => setSelectedStyle(st.id)}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="travel-style-grid">
            {(STYLE_CARDS[selectedStyle] || STYLE_CARDS.beach).map((sc) => (
              <div
                className="travel-style-card"
                key={sc.title}
                onClick={() => navigate('/explore')}
              >
                <div className="style-card-img-wrap">
                  <img src={sc.image} alt={sc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="style-badge-tag">{sc.tag}</div>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 2px', color: 'var(--ink-900)' }}>
                    {sc.title}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--ink-500)', marginBottom: 12 }}>
                    {sc.region}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink-900)' }}>
                    {formatINR(sc.price)} <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ink-500)' }}>avg per night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
            MEMBER REWARDS BANNER
            ========================================================================== */}
        <div className="rewards-promo-card">
          <div className="rewards-image-pane">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
              alt="Yacht ocean relaxation"
            />
            <div className="credit-card-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>OneKey+</span>
                <div className="credit-card-chip" />
              </div>
              <div style={{ fontSize: '0.65rem', color: '#cbd5e1', letterSpacing: '0.1em' }}>
                •••• 8824
              </div>
            </div>
          </div>

          <div className="rewards-text-pane">
            <div className="rewards-headline">Earn $350 in OneKeyCash™ Rewards</div>
            <div className="rewards-subline">
              Unlock instant tier upgrades, hotel room perks and cash rewards after qualifying purchases. Terms apply.
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/stats')}
                style={{ padding: '10px 22px' }}
              >
                <span>View Member Rewards</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          PARTNER BRANDS & TESTIMONIAL
          ========================================================================== */}
      <section className="partner-section-wrapper">
        <div className="container">
          <div className="section-header-row" style={{ marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--expedia-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                GlobeGo Group Network
              </div>
              <h2 className="section-main-title">Partner with us</h2>
            </div>
            <button
              type="button"
              className="section-action-btn"
              onClick={() => navigate('/preferences')}
            >
              <span>Explore Partnership</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="partner-brands-grid">
            {PARTNER_BRANDS.map((brand) => (
              <div className="brand-logo-tile" key={brand}>
                {brand}
              </div>
            ))}
          </div>

          <div className="partner-testimonial-card">
            <div className="partner-story-content">
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-900)', marginBottom: 12 }}>
                Drive demand like our hotel partners
              </h3>
              <p style={{ color: 'var(--ink-700)', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: 20 }}>
                Hear how GlobeGo Group helps Edwardian Hotels London reach higher-value travelers across our global AI-driven marketplace from Commercial Director Hasnain Alloo.
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/preferences')}
                  style={{ padding: '10px 24px' }}
                >
                  List your property
                </button>
              </div>
            </div>

            <div className="partner-story-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Hotel Commercial Director"
              />
              <div className="video-play-badge">
                <Play size={22} fill="#ffffff" style={{ marginLeft: 3 }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
