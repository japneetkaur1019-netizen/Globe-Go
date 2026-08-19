import { Check, Sliders, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { STYLE_OPTIONS, CLIMATE_OPTIONS, BUDGET_OPTIONS } from '../utils/preferenceEngine.js';

const BUDGET_PHOTOS = {
  budget: {
    label: 'Budget-Smart Explorer',
    desc: 'Boutique hostels, local transport & street delicacies',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80',
  },
  moderate: {
    label: 'Comfort & Heritage',
    desc: '4-star hotels, private transfers & curated tours',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  },
  luxury: {
    label: 'Ultra-Luxury VIP',
    desc: '5-star resorts, private villas & Michelin tasting',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
  },
};

const CLIMATE_PHOTOS = {
  warm: {
    label: 'Warm & Balmy',
    desc: 'Tropical islands & sunny coastal promenades',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  hot: {
    label: 'Sun-Drenched & Desert',
    desc: 'Golden deserts, infinity pools & warm evenings',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
  },
  cool: {
    label: 'Cool & Breezy',
    desc: 'Historic cities, temperate walks & café culture',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
  },
  cold: {
    label: 'Crisp Alpine & Snowy',
    desc: 'Snowy peaks, ski chalets & thermal springs',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
  },
  mild: {
    label: 'Mild & Temperate',
    desc: 'Pleasant spring gardens & mild autumn colors',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
  },
};

const STYLE_PHOTOS = {
  adventure: {
    label: 'Adventure & Outdoors',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  culture: {
    label: 'Art & Heritage',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
  },
  nature: {
    label: 'Nature & Landscapes',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
  },
  food: {
    label: 'Culinary & Dining',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  shopping: {
    label: 'Fashion & Shopping',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd302?auto=format&fit=crop&w=600&q=80',
  },
  relax: {
    label: 'Relaxation & Spa',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
  luxury: {
    label: 'VIP & High-End',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  },
};

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'SGD', 'JPY'];

export default function TravelPreferences() {
  const { preferences, updatePreferences, showToast } = useApp();

  const setBudget = (val) => {
    updatePreferences({ budget: val });
    showToast('Preferences Updated', `Budget target set to ${val}.`, 'CheckCircle');
  };

  const setClimate = (val) => {
    updatePreferences({ climate: val });
    showToast('Preferences Updated', `Climate set to ${val}.`, 'CheckCircle');
  };

  const toggleStyle = (val) => {
    const next = preferences.travelStyle.includes(val)
      ? preferences.travelStyle.filter((s) => s !== val)
      : [...preferences.travelStyle, val];
    updatePreferences({ travelStyle: next });
  };

  const setCurrency = (val) => updatePreferences({ currency: val });

  return (
    <>
      <header className="page-header">
        <div className="eyebrow">
          <Sliders size={14} />
          <span>Profile Personalization</span>
        </div>
        <h1>Personal Travel Preferences</h1>
        <p className="page-subtitle">
          Customize your travel taste once — our algorithm will tailor every AI recommendation, hotel and budget model to your choices.
        </p>
      </header>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <section style={{ marginBottom: 48 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">1. Budget Tier</h2>
              <p className="section-main-sub">Select your target comfort and spending tier for lodging and activities.</p>
            </div>
          </div>

          <div className="pref-photo-grid">
            {BUDGET_OPTIONS.map((b) => {
              const meta = BUDGET_PHOTOS[b];
              const isSelected = preferences.budget === b;
              return (
                <div
                  key={b}
                  className={`pref-photo-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setBudget(b)}
                >
                  <img src={meta.image} alt={meta.label} />
                  <div className="pref-photo-card-overlay">
                    <div>
                      <div className="pref-photo-title">{meta.label}</div>
                      <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>{meta.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="pref-check-badge">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">2. Preferred Climate</h2>
              <p className="section-main-sub">Pick the weather environments you enjoy most when traveling.</p>
            </div>
          </div>

          <div className="pref-photo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {CLIMATE_OPTIONS.map((c) => {
              const meta = CLIMATE_PHOTOS[c];
              const isSelected = preferences.climate === c;
              return (
                <div
                  key={c}
                  className={`pref-photo-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setClimate(c)}
                >
                  <img src={meta.image} alt={meta.label} />
                  <div className="pref-photo-card-overlay">
                    <div>
                      <div className="pref-photo-title">{meta.label}</div>
                      <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>{meta.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="pref-check-badge">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">3. Travel Style &amp; Interests</h2>
              <p className="section-main-sub">Select multiple interests to shape your custom day-by-day itineraries.</p>
            </div>
          </div>

          <div className="pref-photo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {STYLE_OPTIONS.map((s) => {
              const meta = STYLE_PHOTOS[s];
              const isSelected = preferences.travelStyle.includes(s);
              return (
                <div
                  key={s}
                  className={`pref-photo-card${isSelected ? ' selected' : ''}`}
                  onClick={() => toggleStyle(s)}
                >
                  <img src={meta.image} alt={meta.label} />
                  <div className="pref-photo-card-overlay">
                    <div className="pref-photo-title">{meta.label}</div>
                    {isSelected && (
                      <div className="pref-check-badge">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">4. Preferred Currency</h2>
            </div>
          </div>

          <div className="panel" style={{ maxWidth: 360 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 6 }}>
              Default Price Display Currency
            </label>
            <select
              value={preferences.currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.94rem', background: 'var(--white)' }}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </section>

        <div className="panel" style={{ background: 'var(--pine-50)', borderColor: 'var(--pine-400)', padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={18} color="#006ce4" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--pine-900)' }}>Active Personalization Profile</h3>
          </div>
          <p style={{ margin: 0, color: 'var(--ink-800)', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Your account is tuned for a <strong style={{ textTransform: 'capitalize' }}>{preferences.budget}</strong> budget tier,{' '}
            <strong style={{ textTransform: 'capitalize' }}>{preferences.climate}</strong> climate preferences, and{' '}
            <strong>{preferences.travelStyle.join(', ') || 'diverse experiences'}</strong>.
          </p>
        </div>
      </div>
    </>
  );
}
