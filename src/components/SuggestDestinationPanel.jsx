import { useState } from 'react';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { generateDestinationSuggestions } from '../data/mockAI.js';
import { CLIMATE_OPTIONS, STYLE_OPTIONS } from '../utils/preferenceEngine.js';
import { formatINR } from '../utils/budgetCalculator.js';

export default function SuggestDestinationPanel({ preferences, onExplore }) {
  const [form, setForm] = useState({
    budget: 50000,
    duration: 5,
    climate: preferences.climate || 'warm',
    style: preferences.travelStyle?.[0] || 'adventure',
    region: '',
  });
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setResults(generateDestinationSuggestions(form, 3));
  };

  return (
    <div>
      <div className="panel" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Compass size={22} color="#006ce4" />
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>AI Destination Matchmaker</h3>
        </div>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginBottom: 20 }}>
          Tell us your budget, preferred climate and travel vibe — our algorithm computes optimal destination matches.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
              Target Budget (₹)
            </label>
            <input
              type="number"
              min={5000}
              step={1000}
              value={form.budget}
              onChange={(e) => setForm((f) => ({ ...f, budget: Number(e.target.value) }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
              Duration (Days)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
              Climate
            </label>
            <select
              value={form.climate}
              onChange={(e) => setForm((f) => ({ ...f, climate: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem', textTransform: 'capitalize', background: 'var(--white)' }}
            >
              {CLIMATE_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
              Travel Style
            </label>
            <select
              value={form.style}
              onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem', textTransform: 'capitalize', background: 'var(--white)' }}
            >
              {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-block" style={{ height: 42 }}>
              <Sparkles size={16} />
              <span>Suggest Places</span>
            </button>
          </div>
        </form>
      </div>

      {results && (
        <section>
          <div className="section-header-row">
            <div>
              <h2 className="section-main-title">Matched Destination Recommendations</h2>
              <p className="section-main-sub">AI ranked suggestions based on your target budget and climate filters.</p>
            </div>
          </div>

          <div className="hotel-deals-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {results.map((r) => (
              <div className="hotel-deal-card" key={r.id}>
                <div className="hotel-card-image-wrap" style={{ aspectRatio: '16/10' }}>
                  <img src={r.image} alt={r.name} className="hotel-card-img" />
                  <div className="hotel-vip-badge">
                    <MapPin size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                    {r.country}
                  </div>
                </div>

                <div className="hotel-card-body">
                  <h3 className="hotel-card-title">{r.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-700)', margin: '6px 0 12px', lineHeight: 1.45 }}>
                    {r.why}
                  </p>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.84rem' }}>
                      <span style={{ color: 'var(--ink-500)' }}>Estimated Budget:</span>
                      <strong style={{ color: 'var(--pine-900)' }}>{formatINR(r.estimatedBudget)}</strong>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-sm"
                      onClick={() => onExplore(r)}
                    >
                      <span>Explore Itinerary</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
