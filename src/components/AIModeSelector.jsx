import { Plane, Compass, Map, Wallet, HelpCircle } from 'lucide-react';

export const PLANNER_MODES = [
  { id: 'plan', icon: <Plane size={18} />, title: 'Plan My Trip', desc: 'Complete trip based on destination, budget & duration.' },
  { id: 'suggest', icon: <Compass size={18} />, title: 'Suggest Destination', desc: 'AI suggestions by budget, climate, style & duration.' },
  { id: 'itinerary', icon: <Map size={18} />, title: 'Build Itinerary', desc: 'A detailed day-by-day itinerary timeline.' },
  { id: 'budget', icon: <Wallet size={18} />, title: 'Budget Advice', desc: 'Optimize and allocate your travel spending.' },
  { id: 'qa', icon: <HelpCircle size={18} />, title: 'Travel Questions', desc: 'Instant answers to packing, visas, and safety.' },
];

export default function AIModeSelector({ activeMode, onSelect }) {
  return (
    <nav className="agent-sidebar" aria-label="AI planning modes">
      <div style={{ padding: '8px 12px 14px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--ink-500)', letterSpacing: '0.05em' }}>
          AI Planner Modes
        </div>
      </div>

      {PLANNER_MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`agent-mode-btn${activeMode === mode.id ? ' active' : ''}`}
          onClick={() => onSelect(mode.id)}
          aria-pressed={activeMode === mode.id}
        >
          <div className="mode-icon-box">{mode.icon}</div>
          <div className="mode-copy">
            <strong>{mode.title}</strong>
            <span>{mode.desc}</span>
          </div>
        </button>
      ))}
    </nav>
  );
}
