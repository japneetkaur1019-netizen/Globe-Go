import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Plane,
  Award,
  Heart,
  Star
} from 'lucide-react';
import AuthForm from './AuthForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

export default function AuthPage({ defaultMode = 'login' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const mode = location.pathname === '/signup' ? 'signup' : defaultMode;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="auth-page-container">
      <div className="auth-split-card card">
        {/* Left Side: Editorial Lifestyle & Member Perks */}
        <div className="auth-hero-col">
          <div className="auth-hero-header">
            <Link to="/" className="auth-hero-brand">
              <div className="auth-brand-badge">
                <Compass size={22} strokeWidth={2.5} />
              </div>
              <span>Globe<span style={{ color: 'var(--amber-400)' }}>Go</span> Voyager</span>
            </Link>
          </div>

          <div className="auth-hero-content">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--amber-400)',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '999px',
              width: 'fit-content'
            }}>
              <Award size={14} /> EXCLUSIVE MEMBER PRIVILEGES
            </span>

            <h2>Unlock world-class AI travel itineraries and insider airline rates.</h2>
            <p>
              Join over 120,000+ wanderlust travelers optimizing flights, splitting group expenses, and discovering pristine destinations.
            </p>

            <div className="auth-benefits-list">
              <div className="auth-benefit-item">
                <div className="auth-benefit-icon"><Sparkles size={14} /></div>
                <span>Instant AI 5-Day Customized Itinerary Generation</span>
              </div>
              <div className="auth-benefit-item">
                <div className="auth-benefit-icon"><Plane size={14} /></div>
                <span>Guaranteed Member Seat Maps &amp; Zero Surcharge Fares</span>
              </div>
              <div className="auth-benefit-item">
                <div className="auth-benefit-icon"><Award size={14} /></div>
                <span>Earn 500 Welcome Reward Miles on Sign-Up</span>
              </div>
              <div className="auth-benefit-item">
                <div className="auth-benefit-icon"><Heart size={14} /></div>
                <span>Synced Wishlists &amp; Collaborative Group Splitter</span>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
              </div>
              <strong style={{ color: '#ffffff' }}>4.9/5</strong>
              <span>from 42k reviews</span>
            </div>
            <span>© 2026 GlobeGo</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="auth-form-col">
          {isAuthenticated && user ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 16px',
                  border: '3px solid var(--expedia-blue)'
                }}
              />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px' }}>
                Already logged in as {user.name}
              </h3>
              <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Active tier: <strong>{user.membershipTier}</strong> · {user.points.toLocaleString('en-IN')} points
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/profile')}
                >
                  Go to My Profile
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  My Trips Dashboard
                </button>
              </div>
            </div>
          ) : (
            <AuthForm initialMode={mode} />
          )}
        </div>
      </div>
    </div>
  );
}
