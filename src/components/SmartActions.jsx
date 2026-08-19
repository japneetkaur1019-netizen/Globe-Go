import { TrendingDown, Building2, CalendarPlus, Utensils, Wind, RefreshCw } from 'lucide-react';

const ACTIONS = [
  { id: 'cheaper', icon: <TrendingDown size={18} color="#107c41" />, label: 'Optimize Budget (-15%)' },
  { id: 'upgradeHotels', icon: <Building2 size={18} color="#006ce4" />, label: 'Upgrade to VIP Hotels' },
  { id: 'moreActivities', icon: <CalendarPlus size={18} color="#006ce4" />, label: 'Add More Experiences' },
  { id: 'moreFood', icon: <Utensils size={18} color="#c8791a" />, label: 'Add Food Tastings' },
  { id: 'relaxed', icon: <Wind size={18} color="#006ce4" />, label: 'More Relaxed Pace' },
  { id: 'regenerate', icon: <RefreshCw size={18} color="#006ce4" />, label: 'Regenerate Variations' },
];

export default function SmartActions({ onAction }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink-900)', marginBottom: 12 }}>
        Smart AI Quick Adjustments
      </h3>
      <div className="smart-actions-grid">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="smart-action-card-btn"
            onClick={() => onAction(a.id)}
          >
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
