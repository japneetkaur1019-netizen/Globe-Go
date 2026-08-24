import { Link } from 'react-router-dom';
import { Plane, Globe, Heart, Wallet, Clock, CheckCircle, Sliders, Award, User, ArrowRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { formatINR } from '../utils/budgetCalculator.js';

const QUICK_STATS = [
  { key: 'trips', icon: <Plane size={22} color="#006ce4" />, label: 'Planned Trips' },
  { key: 'destinations', icon: <Globe size={22} color="#006ce4" />, label: 'Destinations' },
  { key: 'wishlist', icon: <Heart size={22} color="#e11d48" />, label: 'Wishlist Stays' },
  { key: 'totalSpent', icon: <Wallet size={22} color="#107c41" />, label: 'Estimated Spend', money: true },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { stats, savedTrips } = useApp();
  const upcomingTrips = savedTrips.filter((t) => t.status === 'upcoming');
  const otherTrips = savedTrips.filter((t) => t.status !== 'upcoming');

  return (
    <>
      <header className="page-header">
        <div className="eyebrow">
          <User size={14} />
          <span>Expedia VIP Member</span>
        </div>
        <h1>Member Travel Dashboard</h1>
        <p className="page-subtitle">Track your upcoming flight bookings, saved destinations and loyalty stats.</p>
      </header>

      <div className="container" style={{ paddingTop: 36, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
          {QUICK_STATS.map((card) => (
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
                  {card.money ? formatINR(stats[card.key]) : stats[card.key]}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--ink-500)', fontWeight: 600 }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        <section style={{ marginBottom: 40 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Upcoming Itineraries &amp; Bookings</h2>
              <p className="section-main-sub">Your active flight bookings and travel itineraries ready for departure.</p>
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
                Discover trending destinations and search low-fare flights for your next dream getaway.
              </p>
              <Link to="/explore" className="btn btn-primary">
                <span>Explore Destinations</span>
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
                        to="/flights"
                        state={{ prefillDestination: t.destination }}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Book Flights
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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
    </>
  );
}
