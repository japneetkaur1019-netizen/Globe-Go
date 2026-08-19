import { useState } from 'react';
import { X, RefreshCw, Sliders } from 'lucide-react';
import { DESTINATION_LIST } from '../data/destinations.js';
import { STYLE_OPTIONS, CLIMATE_OPTIONS } from '../utils/preferenceEngine.js';

export default function ModifyTripModal({ trip, onClose, onRegenerate }) {
  const [form, setForm] = useState({
    destinationId: trip.destinationId,
    duration: trip.duration,
    budget: trip.budget,
    travelStyle: trip.travelStyle || [],
    travelers: trip.travelers,
    climate: trip.climate,
  });

  const toggleStyle = (style) => {
    setForm((f) => ({
      ...f,
      travelStyle: f.travelStyle.includes(style)
        ? f.travelStyle.filter((s) => s !== style)
        : [...f.travelStyle, style],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegenerate(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} color="#006ce4" />
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Modify &amp; Recalculate Trip</h3>
          </div>
          <button
            type="button"
            className="navbar-icon-btn"
            onClick={onClose}
            aria-label="Close"
            style={{ width: 32, height: 32 }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
              Destination
            </label>
            <select
              value={form.destinationId}
              onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem', background: 'var(--white)' }}
            >
              {DESTINATION_LIST.map((d) => (
                <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
                Travelers
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.travelers}
                onChange={(e) => setForm((f) => ({ ...f, travelers: Number(e.target.value) }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 4 }}>
                Climate Preference
              </label>
              <select
                value={form.climate}
                onChange={(e) => setForm((f) => ({ ...f, climate: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.92rem', textTransform: 'capitalize', background: 'var(--white)' }}
              >
                {CLIMATE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-700)', marginBottom: 8 }}>
              Travel Interests &amp; Style
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STYLE_OPTIONS.map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => toggleStyle(style)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    border: '1.5px solid',
                    borderColor: form.travelStyle.includes(style) ? 'var(--expedia-blue)' : 'var(--border-color)',
                    background: form.travelStyle.includes(style) ? 'var(--expedia-blue)' : 'var(--white)',
                    color: form.travelStyle.includes(style) ? '#ffffff' : 'var(--ink-700)',
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <RefreshCw size={16} />
              <span>Regenerate Itinerary</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
