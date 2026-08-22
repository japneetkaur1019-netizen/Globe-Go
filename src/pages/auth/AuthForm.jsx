import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plane
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AuthForm({ initialMode = 'login', onSuccess }) {
  const navigate = useNavigate();
  const { login, signup, switchDemoAccount, demoAccounts } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAirport, setHomeAirport] = useState('DEL - Delhi, India');
  const [preferredAirline, setPreferredAirline] = useState('IndiGo / Air India');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both your email and password.');
        return;
      }
      login(email, password);
      if (onSuccess) onSuccess();
      else navigate('/dashboard');
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in your name, email, and password.');
        return;
      }
      if (!agreeTerms) {
        setError('Please accept the GlobeGo Member Terms & Conditions.');
        return;
      }
      signup({
        name,
        email,
        phone,
        homeAirport,
        preferredAirline,
      });
      if (onSuccess) onSuccess();
      else navigate('/profile');
    }
  };

  const handleDemoSelect = (acc) => {
    switchDemoAccount(acc.id);
    if (onSuccess) onSuccess();
    else navigate('/profile');
  };

  return (
    <div className="auth-form-container">
      {/* Tab Switcher */}
      <div className="auth-tabs-bar">
        <button
          type="button"
          className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
          onClick={() => {
            setMode('login');
            setError('');
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => {
            setMode('signup');
            setError('');
          }}
        >
          Create Account
        </button>
      </div>

      {/* Header Info */}
      <div className="auth-form-header">
        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome Back Traveler' : 'Join GlobeGo Voyager'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Access your saved trips, flight tickets, and member benefits.'
            : 'Get 500 bonus reward points & member-only price unlock.'}
        </p>
      </div>

      {/* Quick 1-Click Demo Accounts Chip Picker */}
      <div className="auth-demo-picker">
        <span className="demo-picker-title">
          <Sparkles size={14} /> Quick Demo One-Click Sign-In
        </span>
        <div className="demo-chips-grid">
          {demoAccounts.map((acc) => (
            <button
              type="button"
              key={acc.id}
              className="demo-chip-btn"
              onClick={() => handleDemoSelect(acc)}
              title={`Sign in instantly as ${acc.name}`}
            >
              <img src={acc.avatar} alt={acc.name} className="demo-chip-avatar" />
              <div className="demo-chip-info">
                <span className="demo-chip-name">{acc.name}</span>
                <span className="demo-chip-tier">{acc.membershipTier}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="auth-error-banner" style={{
          background: '#fee2e2',
          border: '1px solid #f87171',
          color: '#b91c1c',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.86rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{error}</span>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'signup' && (
          <div className="signup-bonus-banner">
            <Sparkles size={16} />
            <span>500 Welcome Bonus Miles will be deposited instantly to your profile!</span>
          </div>
        )}

        {mode === 'signup' && (
          <div className="form-group-field">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon-left" />
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group-field">
          <label>Email Address</label>
          <div className="input-with-icon">
            <Mail size={16} className="input-icon-left" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {mode === 'signup' && (
          <div className="form-group-field">
            <label>Phone Number (Optional)</label>
            <div className="input-with-icon">
              <Phone size={16} className="input-icon-left" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div className="form-group-field">
            <label>Home Departure Airport</label>
            <div className="input-with-icon">
              <Plane size={16} className="input-icon-left" />
              <select
                value={homeAirport}
                onChange={(e) => setHomeAirport(e.target.value)}
              >
                <option value="DEL - Delhi, India">DEL - Delhi (Indira Gandhi Intl)</option>
                <option value="BOM - Mumbai, India">BOM - Mumbai (Chhatrapati Shivaji Intl)</option>
                <option value="BLR - Bengaluru, India">BLR - Bengaluru (Kempegowda Intl)</option>
                <option value="DXB - Dubai, UAE">DXB - Dubai International</option>
                <option value="SIN - Singapore">SIN - Singapore Changi</option>
                <option value="LHR - London Heathrow">LHR - London Heathrow</option>
                <option value="JFK - New York JFK">JFK - New York JFK</option>
              </select>
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div className="form-group-field">
            <label>Preferred Airline Partner</label>
            <div className="input-with-icon">
              <Plane size={16} className="input-icon-left" />
              <select
                value={preferredAirline}
                onChange={(e) => setPreferredAirline(e.target.value)}
              >
                <option value="IndiGo / Air India">IndiGo / Air India</option>
                <option value="Emirates">Emirates</option>
                <option value="Singapore Airlines">Singapore Airlines</option>
                <option value="Vistara">Vistara</option>
                <option value="Akasa Air">Akasa Air</option>
                <option value="British Airways / Delta">British Airways / Delta</option>
              </select>
            </div>
          </div>
        )}

        <div className="form-group-field">
          <label>Password</label>
          <div className="input-with-icon">
            <Lock size={16} className="input-icon-left" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {mode === 'login' ? (
          <div className="auth-options-row">
            <label className="remember-me-label">
              <input type="checkbox" defaultChecked />
              <span>Remember this device</span>
            </label>
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => alert('Password reset link sent to demo registered email!')}
            >
              Forgot password?
            </button>
          </div>
        ) : (
          <label className="remember-me-label" style={{ fontSize: '0.8rem' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span>I agree to GlobeGo Terms of Service &amp; Voyager Club Rewards.</span>
          </label>
        )}

        <button type="submit" className="auth-submit-btn">
          <span>{mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Social Login Options */}
      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <div className="auth-social-row">
        <button
          type="button"
          className="social-btn"
          onClick={() => handleDemoSelect(demoAccounts[0])}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          className="social-btn"
          onClick={() => handleDemoSelect(demoAccounts[1])}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.65-2.86 1.45-.6.69-1.12 1.84-.98 2.95 1.08.08 2.21-.57 2.85-1.3z"/>
          </svg>
          <span>Apple</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--ink-500)' }}>
        <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--rating-green)' }} />
        <span>256-bit SSL encrypted &amp; verified traveler protection.</span>
      </div>
    </div>
  );
}
