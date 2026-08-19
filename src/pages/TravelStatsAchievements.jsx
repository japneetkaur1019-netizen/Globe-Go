import { Plane, Globe, Heart, Wallet, Award, Medal, Crown, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { formatINR } from '../utils/budgetCalculator.js';

const STAT_CARDS = [
  { key: 'trips', icon: <Plane size={22} color="#006ce4" />, label: 'Total Planned Trips' },
  { key: 'destinations', icon: <Globe size={22} color="#006ce4" />, label: 'Destinations Explored' },
  { key: 'wishlist', icon: <Heart size={22} color="#e11d48" />, label: 'Wishlist Stays' },
  { key: 'totalSpent', icon: <Wallet size={22} color="#107c41" />, label: 'Estimated Spend', money: true },
];

const ACHIEVEMENTS = [
  { id: 'first', icon: <Award size={20} color="#006ce4" />, label: 'First Itinerary', desc: 'Save your first AI-planned trip', unlockAt: 1 },
  { id: 'explorer', icon: <Globe size={20} color="#006ce4" />, label: 'Global Explorer', desc: 'Save 2 distinct trips', unlockAt: 2 },
  { id: 'planner', icon: <Medal size={20} color="#ffc72c" />, label: 'Master Planner', desc: 'Save 3 trips with custom budgets', unlockAt: 3 },
  { id: 'jetsetter', icon: <Plane size={20} color="#006ce4" />, label: 'VIP Jetsetter', desc: 'Save 5 trip itineraries', unlockAt: 5 },
  { id: 'globetrotter', icon: <ShieldCheck size={20} color="#107c41" />, label: 'Globe Trotter', desc: 'Save 8 trip itineraries', unlockAt: 8 },
  { id: 'legend', icon: <Crown size={20} color="#ffc72c" />, label: 'GlobeGo Legend', desc: 'Save 10 trip itineraries', unlockAt: 10 },
];

export default function TravelStatsAchievements() {
  const { stats, savedTrips } = useApp();
  const savedCount = savedTrips.length;

  const avgBudget = savedCount
    ? Math.round(savedTrips.reduce((sum, t) => sum + (t.budget || 0), 0) / savedCount)
    : Math.round(stats.totalSpent / Math.max(1, stats.trips));

  const maxBudget = Math.max(1, ...savedTrips.map((t) => t.budget || 0), avgBudget);

  return (
    <>
      <header className="page-header">
        <div className="eyebrow">
          <Award size={14} />
          <span>Loyalty &amp; Milestones</span>
        </div>
        <h1>Travel Statistics &amp; Achievements</h1>
        <p className="page-subtitle">Track your travel spending history, loyalty progression and unlock member badges.</p>
      </header>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section style={{ marginBottom: 40 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Account Overview</h2>
              <p className="section-main-sub">Your personal travel metrics across all generated itineraries.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {STAT_CARDS.map((card) => (
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
        </section>

        <section style={{ marginBottom: 40 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Spending &amp; Budget Insights</h2>
              <p className="section-main-sub">Historical comparison of your saved destination budgets.</p>
            </div>
          </div>

          <div className="panel">
            <div className="budget-total-row" style={{ paddingTop: 0, marginBottom: 16 }}>
              <span>Average Planned Trip Budget</span>
              <span style={{ color: 'var(--pine-900)' }}>{formatINR(avgBudget)}</span>
            </div>

            {savedTrips.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--ink-500)', fontSize: '0.9rem' }}>
                Save trips in the AI Planner to view historical budget progression graphs here.
              </p>
            ) : (
              savedTrips.slice(0, 6).map((t) => (
                <div key={t.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{t.destination} ({t.duration} Days)</span>
                    <span style={{ fontWeight: 800, color: 'var(--pine-900)' }}>{formatINR(t.budget)}</span>
                  </div>
                  <div className="budget-bar-track">
                    <div
                      className="budget-bar-fill"
                      style={{ width: `${Math.max(8, Math.round((t.budget / maxBudget) * 100))}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Member Badges &amp; Achievements</h2>
              <p className="section-main-sub">Unlock status tiers as you plan and save more journeys.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {ACHIEVEMENTS.map((a) => {
              const unlocked = savedCount >= a.unlockAt;
              return (
                <div
                  key={a.id}
                  style={{
                    background: unlocked ? 'var(--white)' : 'var(--off-white)',
                    border: '1.5px solid',
                    borderColor: unlocked ? 'var(--expedia-blue)' : 'var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 16px',
                    textAlign: 'center',
                    boxShadow: unlocked ? 'var(--shadow-sm)' : 'none',
                    opacity: unlocked ? 1 : 0.65,
                    transition: 'all 200ms ease',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: unlocked ? 'var(--pine-100)' : 'var(--card-border)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    {a.icon}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--ink-900)', marginBottom: 4 }}>
                    {a.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--ink-500)', lineHeight: 1.35, marginBottom: 8 }}>
                    {a.desc}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: unlocked ? 'var(--rating-green)' : 'var(--ink-500)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {unlocked ? <><Check size={12} /> Unlocked</> : `Progress: ${savedCount}/${a.unlockAt}`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
