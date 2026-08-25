import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Globe,
  Heart,
  Wallet,
  Clock,
  CheckCircle,
  Sliders,
  Award,
  ArrowRight,
  Calendar,
  Sparkles,
  MapPin,
  CheckSquare,
  Square,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatINR } from '../utils/budgetCalculator.js';

const DEFAULT_BUCKET_LIST = [
  { id: 1, text: 'See the Northern Lights in Iceland', done: false, icon: '❄️' },
  { id: 2, text: 'Ride the Shinkansen bullet train in Japan', done: true, icon: '🚄' },
  { id: 3, text: 'Hot air balloon flight over Cappadocia', done: false, icon: '🎈' },
  { id: 4, text: 'Scuba dive the coral reefs in Bali', done: false, icon: '🐠' },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { stats, savedTrips } = useApp();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [bucketList, setBucketList] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_bucket_list');
      return saved ? JSON.parse(saved) : DEFAULT_BUCKET_LIST;
    } catch {
      return DEFAULT_BUCKET_LIST;
    }
  });
  const [newGoalInput, setNewGoalInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('travel_bucket_list', JSON.stringify(bucketList));
    } catch (e) {
      console.error('Failed to save bucket list to localStorage', e);
    }
  }, [bucketList]);

  const toggleGoal = (id) => {
    setBucketList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const removeGoal = (id, e) => {
    e.stopPropagation();
    setBucketList((prev) => prev.filter((item) => item.id !== id));
  };

  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    const item = {
      id: Date.now(),
      text: newGoalInput.trim(),
      done: false,
      icon: '✈️',
    };
    setBucketList((prev) => [...prev, item]);
    setNewGoalInput('');
  };

  const upcomingTrips = savedTrips.filter((t) => t.status === 'upcoming');
  const otherTrips = savedTrips.filter((t) => t.status !== 'upcoming');

  const quickStats = [
    { key: 'trips', icon: <Plane size={22} color="#006ce4" />, label: 'Planned Trips', value: stats.trips },
    { key: 'destinations', icon: <Globe size={22} color="#006ce4" />, label: 'Destinations', value: stats.destinations },
    {
      key: 'wishlist',
      icon: <Heart size={22} color="#e11d48" />,
      label: 'Wishlist Stays',
      value: wishlist.length > 0 ? wishlist.length : (stats.wishlist || 0),
    },
    { key: 'totalSpent', icon: <Wallet size={22} color="#107c41" />, label: 'Estimated Spend', value: stats.totalSpent, money: true },
  ];

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 64 }}>
      {/* Scenic Destination Header Banner */}
      <header
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl, 20px)',
          overflow: 'hidden',
          minHeight: 220,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '44px 24px',
          marginBottom: 32,
          boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.08))',
          color: '#ffffff',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="Scenic Travel Destination"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8, 28, 60, 0.68) 0%, rgba(5, 18, 38, 0.84) 100%)',
            zIndex: 1,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 640 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={14} color="#38bdf8" />
            <span>Expedia VIP Member</span>
          </div>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              margin: '0 0 10px',
              lineHeight: 1.2,
              textShadow: '0 2px 10px rgba(0,0,0,0.35)',
            }}
          >
            Member Travel Dashboard
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.98rem',
              margin: '0 auto',
              lineHeight: 1.5,
              maxWidth: 540,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            Track your upcoming AI-planned itineraries, saved destinations and loyalty stats.
          </p>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
        {quickStats.map((card) => (
          <div
            key={card.key}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--pine-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink-900)' }}>
                {card.money ? formatINR(card.value) : card.value}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--ink-500)', fontWeight: 600 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Wishlist & Travel Bucket List Section */}
      <section style={{ marginBottom: 40 }}>
        <div
          className="section-header-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h2 className="section-main-title" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <Heart size={22} color="#e11d48" fill="#e11d48" />
              <span>Wishlist &amp; Travel Bucket List</span>
            </h2>
            <p className="section-main-sub" style={{ margin: '4px 0 0' }}>
              Manage your saved dream destinations and check off personal travel goals.
            </p>
          </div>
          <Link to="/wishlist" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>View Full Wishlist</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Card 1: Saved Wishlist Stays */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-900)' }}>
                <Heart size={18} color="#e11d48" />
                Saved Wishlist Stays
              </h3>
              <span
                className="badge"
                style={{
                  background: '#fff1f2',
                  color: '#e11d48',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: 999,
                }}
              >
                {wishlist.length} {wishlist.length === 1 ? 'place' : 'places'}
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  background: 'var(--pine-50, #f8fafc)',
                  borderRadius: 'var(--radius-md)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={36} color="#e11d48" style={{ marginBottom: 12, opacity: 0.8 }} />
                <strong style={{ fontSize: '0.96rem', color: 'var(--ink-900)', marginBottom: 4 }}>No wishlist stays saved yet</strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--ink-500)', maxWidth: 280, margin: '0 0 16px' }}>
                  Explore trending destinations and click the heart icon on any stay to save your favorites here.
                </p>
                <Link to="/explore" className="btn btn-primary btn-sm">
                  <span>Explore Stays</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, maxHeight: 290, overflowY: 'auto', paddingRight: 4 }}>
                {wishlist.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      background: 'var(--pine-50, #f8fafc)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name || item.destination || 'Destination'}
                      style={{ width: 46, height: 46, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong
                        style={{
                          display: 'block',
                          fontSize: '0.9rem',
                          color: 'var(--ink-900)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name || item.destination}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {item.country || 'Global'}
                      </span>
                    </div>
                    {item.price && (
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--expedia-blue, #006ce4)', flexShrink: 0 }}>
                        {formatINR(item.price)}
                      </span>
                    )}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      title="Remove from wishlist"
                      aria-label="Remove item"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ink-400, #94a3b8)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Interactive Travel Bucket List */}
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-900)' }}>
                <CheckSquare size={18} color="#16a34a" />
                Travel Bucket List
              </h3>
              <span
                className="badge"
                style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: 999,
                }}
              >
                {bucketList.filter((b) => b.done).length}/{bucketList.length} Done
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flex: 1,
                maxHeight: 210,
                overflowY: 'auto',
                marginBottom: 16,
                paddingRight: 4,
              }}
            >
              {bucketList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleGoal(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: item.done ? 'var(--pine-50, #f0fdf4)' : 'var(--pine-50, #f8fafc)',
                    border: `1px solid ${item.done ? '#bbf7d0' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {item.done ? (
                      <CheckSquare size={17} color="#16a34a" style={{ flexShrink: 0 }} />
                    ) : (
                      <Square size={17} color="#94a3b8" style={{ flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: '0.88rem',
                        color: item.done ? 'var(--ink-400, #94a3b8)' : 'var(--ink-900)',
                        textDecoration: item.done ? 'line-through' : 'none',
                        fontWeight: item.done ? 500 : 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.icon} {item.text}
                    </span>
                  </div>
                  <button
                    onClick={(e) => removeGoal(item.id, e)}
                    title="Delete goal"
                    aria-label="Delete goal"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addGoal} style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <input
                type="text"
                placeholder="Add new dream destination or adventure..."
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg, #ffffff)',
                  color: 'var(--ink-900)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Upcoming Itineraries Section */}
      <section style={{ marginBottom: 40 }}>
        <div className="section-header-row">
          <div>
            <h2 className="section-main-title">Upcoming Itineraries</h2>
            <p className="section-main-sub">Your active AI-generated travel itineraries ready for departure.</p>
          </div>
        </div>

        {upcomingTrips.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'var(--pine-100)',
                color: 'var(--expedia-blue)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Plane size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>No saved trips yet</h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '0.92rem', maxWidth: 420, margin: '0 auto 20px' }}>
              Use our AI travel planner to create your first customized day-by-day itinerary with verified hotel picks.
            </p>
            <Link to="/ai-planner" className="btn btn-primary">
              <span>Plan a Trip</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {upcomingTrips.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  <img
                    src={t.coverImage || t.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'}
                    alt={t.destination}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'var(--rating-green)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Clock size={12} /> Upcoming
                  </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink-900)' }}>
                    {t.destination} · {t.duration} Days Tour
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--ink-500)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} /> Saved {formatDate(t.savedAt)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Wallet size={13} /> Budget {formatINR(t.budget)}
                    </span>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                    <Link
                      to="/ai-planner"
                      state={{ initialQuery: `Plan a ${t.duration}-day trip to ${t.destination}` }}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      View Itinerary
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Travel History Section */}
      {otherTrips.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Past Travel History</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {otherTrips.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{t.destination} · {t.duration} Days</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-500)' }}>Completed on {formatDate(t.savedAt)}</div>
                </div>
                <span className="badge green">
                  <CheckCircle size={12} /> Completed
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Navigation Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: 16, margin: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'var(--pine-100)',
              color: 'var(--expedia-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sliders size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', color: 'var(--ink-900)', fontSize: '0.98rem' }}>Travel Preferences</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--ink-500)' }}>Update budget tier, climate &amp; preferred styles.</p>
          </div>
          <Link to="/preferences" className="btn btn-secondary btn-sm">Configure</Link>
        </div>

        <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: 16, margin: 0 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'var(--amber-100)',
              color: 'var(--amber-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Award size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', color: 'var(--ink-900)', fontSize: '0.98rem' }}>Stats &amp; Achievements</strong>
            <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--ink-500)' }}>View member tier badges and spending insights.</p>
          </div>
          <Link to="/stats" className="btn btn-secondary btn-sm">View</Link>
        </div>
      </div>
    </div>
  );
}
