import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Home as HomeIcon,
  Plane,
  Car,
  Package,
  Ticket,
  Ship,
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

const SEARCH_TABS = [
  { id: 'hotels', icon: <Building2 size={20} />, label: 'Hotels' },
  { id: 'homes', icon: <HomeIcon size={20} />, label: 'Homes' },
  { id: 'flights', icon: <Plane size={20} />, label: 'Flights' },
  { id: 'cars', icon: <Car size={20} />, label: 'Cars' },
  { id: 'packages', icon: <Package size={20} />, label: 'Packages' },
  { id: 'activities', icon: <Ticket size={20} />, label: 'Things to do' },
  { id: 'cruises', icon: <Ship size={20} />, label: 'Cruises' },
];

const WEEKEND_DEALS = [
  {
    id: 'hotel-1',
    name: 'The Imperial New Delhi',
    city: 'New Delhi, India',
    rating: 9.6,
    ratingLabel: 'Exceptional',
    reviews: 860,
    nightlyRate: 18500,
    totalRate: 44000,
    originalTotal: 58000,
    vipAccess: true,
    memberPrice: true,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hotel-2',
    name: 'Orchid Hotel & Spa Chandigarh',
    city: 'Zirakpur, India',
    rating: 9.4,
    ratingLabel: 'Exceptional',
    reviews: 450,
    nightlyRate: 4600,
    totalRate: 9800,
    originalTotal: 13200,
    vipAccess: false,
    memberPrice: true,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hotel-3',
    name: 'WelcomHeritage Santa Roza Kasauli',
    city: 'Kasauli Hills, India',
    rating: 9.4,
    ratingLabel: 'Exceptional',
    reviews: 670,
    nightlyRate: 10600,
    totalRate: 25200,
    originalTotal: 32500,
    vipAccess: true,
    memberPrice: true,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hotel-4',
    name: 'WelcomHeritage Elysium Resort & Spa',
    city: 'Shimla, India',
    rating: 9.2,
    ratingLabel: 'Wonderful',
    reviews: 520,
    nightlyRate: 8300,
    totalRate: 19600,
    originalTotal: 28600,
    vipAccess: false,
    memberPrice: true,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
  },
];

const VACATION_RENTALS = [
  { title: 'Private vacation homes', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
  { title: 'Apartments & Condos', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
  { title: 'Cabins', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
  { title: 'Cottages', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80' },
  { title: 'Villas', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80' },
];

const PACKAGE_CITIES = ['Bangkok', 'Goa', 'Maldives', 'Paris', 'Tokyo', 'Dubai'];

const PACKAGE_DEALS = {
  Bangkok: [
    { name: 'Divalux Resort & Spa Bangkok', detail: 'Suvarnabhumi Airport + Flight Included', price: 34500, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Shanghai Mansion Bangkok', detail: 'Historic Chinatown + Flight Included', price: 29800, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Quarter Saladaeng by UHG', detail: 'Silom Business Hub + Flight Included', price: 32000, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Night Hotel Bangkok Sukhumvit 15', detail: 'Sukhumvit City Center + Flight Included', price: 38200, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
  ],
  Goa: [
    { name: 'Taj Exotica Resort & Spa', detail: 'Benaulim Beach + Flight Included', price: 42000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
    { name: 'W Goa Beachfront Retreat', detail: 'Vagator Bay + Flight Included', price: 49000, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
    { name: 'Alila Diwa South Goa', detail: 'Majorda Paddy Vistas + Flight Included', price: 38000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Grand Hyatt Goa Waterfront', detail: 'Bambolim Bay + Flight Included', price: 45000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
  ],
  Maldives: [
    { name: 'Centara Grand Island Resort', detail: 'South Ari Atoll + Seaplane + Flight', price: 115000, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sun Siyam Olhuveli Maldives', detail: 'Overwater Lagoon Suite + Flight Included', price: 98000, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Kurumba Maldives Heritage', detail: 'North Malé Atoll Speedboat + Flight', price: 82000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hard Rock Hotel Maldives', detail: 'Emboodhoo Lagoon + Flight Included', price: 108000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  ],
  Paris: [
    { name: 'Pullman Paris Tour Eiffel', detail: 'Champ de Mars + Flight Included', price: 135000, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { name: 'CitizenM Paris Gare de Lyon', detail: 'Boutique Design + Flight Included', price: 89000, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80' },
    { name: 'Novotel Paris Centre Tour Eiffel', detail: 'Seine Riverfront + Flight Included', price: 110000, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hôtel Regina Louvre', detail: 'Palais Royal + Flight Included', price: 165000, image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80' },
  ],
  Tokyo: [
    { name: 'Keio Plaza Hotel Tokyo', detail: 'Shinjuku Skyscraper + Flight Included', price: 95000, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'Hotel Gracery Shinjuku', detail: 'Kabukicho Sights + Flight Included', price: 86000, image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80' },
    { name: 'Grand Nikko Tokyo Daiba', detail: 'Tokyo Bay Waterfront + Flight Included', price: 104000, image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80' },
    { name: 'The Prince Park Tower Tokyo', detail: 'Tokyo Tower Views + Flight Included', price: 122000, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  ],
  Dubai: [
    { name: 'JW Marriott Marquis Dubai', detail: 'Business Bay Towers + Flight Included', price: 72000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Atlantis The Palm Dubai', detail: 'Aquaventure Pass + Flight Included', price: 145000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Rove Downtown Dubai', detail: 'Burj Khalifa Walking + Flight Included', price: 58000, image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80' },
    { name: 'Sofitel Dubai The Palm Resort', detail: 'Private Beach Cabana + Flight Included', price: 92000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80' },
  ],
};

const TRAVEL_STYLES = [
  { id: 'beach', label: 'Beach' },
  { id: 'culture', label: 'Culture' },
  { id: 'ski', label: 'Ski' },
  { id: 'family', label: 'Family' },
  { id: 'wellness', label: 'Wellness and Relaxation' },
  { id: 'adventure', label: 'Adventure' },
];

const STYLE_CARDS = {
  beach: [
    { title: 'Pattaya', region: 'Chonburi Province, Thailand', tag: 'Lively beaches', price: 3400, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { title: 'Sydney', region: 'New South Wales, Australia', tag: 'Modern and vibrant', price: 14500, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80' },
    { title: 'Da Nang', region: 'Da Nang Municipality, Vietnam', tag: 'Coastal destination', price: 4400, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80' },
    { title: 'Miami Beach', region: 'Florida, United States', tag: 'Relaxing beaches', price: 17800, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
  ],
  culture: [
    { title: 'Kyoto', region: 'Kansai, Japan', tag: 'Historic temples', price: 10500, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
    { title: 'Paris', region: 'Île-de-France, France', tag: 'Iconic museums', price: 18000, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { title: 'Rome', region: 'Lazio, Italy', tag: 'Ancient heritage', price: 13200, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
    { title: 'London', region: 'Greater London, UK', tag: 'Royal landmarks', price: 17500, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
  ],
  ski: [
    { title: 'Zermatt', region: 'Valais, Switzerland', tag: 'Matterhorn slopes', price: 26000, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80' },
    { title: 'Chamonix', region: 'Mont-Blanc, France', tag: 'Glacier skiing', price: 22000, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80' },
    { title: 'Niseko', region: 'Hokkaido, Japan', tag: 'Powder snow', price: 19500, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80' },
    { title: 'Aspen', region: 'Colorado, USA', tag: 'Luxury chalets', price: 34000, image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80' },
  ],
  family: [
    { title: 'Singapore', region: 'Marina Bay, Singapore', tag: 'Gardens & Zoos', price: 13000, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80' },
    { title: 'Orlando', region: 'Florida, USA', tag: 'Theme park capital', price: 15500, image: 'https://images.unsplash.com/photo-1575089776834-8be34696ffb9?auto=format&fit=crop&w=800&q=80' },
    { title: 'London', region: 'England, UK', tag: 'Museums & Shows', price: 17500, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80' },
    { title: 'Dubai', region: 'Dubai, UAE', tag: 'Waterparks & Malls', price: 15000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
  ],
  wellness: [
    { title: 'Ubud', region: 'Bali, Indonesia', tag: 'Yoga & holistic spas', price: 6500, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
    { title: 'Maldives', region: 'South Ari Atoll', tag: 'Overwater serenity', price: 25000, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
    { title: 'Interlaken', region: 'Bernese Oberland, Switzerland', tag: 'Alpine wellness', price: 22000, image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80' },
    { title: 'Santorini', region: 'Cyclades, Greece', tag: 'Sunset caldera', price: 19000, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80' },
  ],
  adventure: [
    { title: 'Queenstown', region: 'Otago, New Zealand', tag: 'Thrill capital', price: 16000, image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80' },
    { title: 'Banff', region: 'Alberta, Canada', tag: 'Wilderness & peaks', price: 18500, image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80' },
    { title: 'Dubai Desert', region: 'Dubai, UAE', tag: 'Dune safari', price: 15000, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
    { title: 'Phuket', region: 'Andaman Sea, Thailand', tag: 'Island diving', price: 6000, image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80' },
  ],
};

const PARTNER_BRANDS = [
  'FeWo-direkt',
  'bookabach',
  'Abritel',
  'wotif',
  'Expedia Cruises',
  'ebookers',
  'CheapTickets',
  'travelocity',
  'ORBITZ',
  'hotwire',
];

export default function Home() {
  const navigate = useNavigate();
  const [activeSearchTab, setActiveSearchTab] = useState('hotels');
  const [whereTo, setWhereTo] = useState('');
  const [dates, setDates] = useState('Wed, Aug 19 - Tue, Aug 25');
  const [travelers, setTravelers] = useState('2 travelers, 1 room');
  const [addFlight, setAddFlight] = useState(false);
  const [addCar, setAddCar] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const [selectedPackageCity, setSelectedPackageCity] = useState('Bangkok');
  const [selectedStyle, setSelectedStyle] = useState('beach');

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = whereTo.trim() || 'Japan';
    if (activeSearchTab === 'flights' || addFlight) {
      navigate('/flights', {
        state: {
          prefillDestination: query,
        },
      });
    } else {
      navigate('/explore');
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
                    onClick={() => setActiveSearchTab(t.id)}
                  >
                    <div className="search-tab-icon-wrap">{t.icon}</div>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearchSubmit}>
                <div className="search-inputs-grid">
                  <div className="search-input-box">
                    <MapPin size={20} className="search-input-icon" />
                    <div className="search-input-content">
                      <span className="search-input-label">Where to?</span>
                      <input
                        type="text"
                        value={whereTo}
                        onChange={(e) => setWhereTo(e.target.value)}
                        placeholder="Destination, city or resort (e.g. Japan, Bali, Paris)"
                      />
                    </div>
                  </div>

                  <div className="search-input-box">
                    <Calendar size={20} className="search-input-icon" />
                    <div className="search-input-content">
                      <span className="search-input-label">Dates</span>
                      <input
                        type="text"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        placeholder="Select travel dates"
                      />
                    </div>
                  </div>

                  <div className="search-input-box">
                    <Users size={20} className="search-input-icon" />
                    <div className="search-input-content">
                      <span className="search-input-label">Travelers</span>
                      <input
                        type="text"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        placeholder="Guests & Rooms"
                      />
                    </div>
                  </div>

                  <button type="submit" className="search-submit-btn">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </div>

                <div className="search-options-row">
                  <label className="search-checkbox-label">
                    <input
                      type="checkbox"
                      checked={addFlight}
                      onChange={(e) => setAddFlight(e.target.checked)}
                    />
                    <span>Add a flight</span>
                  </label>
                  <label className="search-checkbox-label">
                    <input
                      type="checkbox"
                      checked={addCar}
                      onChange={(e) => setAddCar(e.target.checked)}
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
          DISCOUNT PROMO BANNER (Matching Screenshot 1 Bottom)
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
            onClick={() => navigate('/flights')}
          >
            Book now
          </button>
        </div>

        {/* ==========================================================================
            LAST-MINUTE WEEKEND DEALS (Matching Screenshot 2)
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
                    className={`hotel-wishlist-btn${wishlist[deal.id] ? ' active' : ''}`}
                    onClick={() => toggleWishlist(deal.id)}
                    aria-label="Save to wishlist"
                  >
                    <Heart size={16} fill={wishlist[deal.id] ? '#e11d48' : 'none'} />
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
            VACATION RENTALS (Matching Screenshot 3 Top)
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
            EASY PACKAGES (Matching Screenshot 3 Bottom)
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
                onClick={() => navigate('/flights', { state: { prefillDestination: pkg.name } })}
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
            STAYS FOR EVERY TRAVEL STYLE (Matching Screenshot 4 Top)
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
            MEMBER REWARDS BANNER (Matching Screenshot 4 Bottom)
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
          PARTNER BRANDS & TESTIMONIAL (Matching Screenshot 5)
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
