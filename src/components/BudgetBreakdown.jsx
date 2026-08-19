import { Plane, Building2, Utensils, Train, Ticket, ShoppingBag, AlertTriangle, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/budgetCalculator.js';

const ROWS = [
  { key: 'flights', icon: <Plane size={16} color="#006ce4" />, label: 'Flights & Airfare' },
  { key: 'hotels', icon: <Building2 size={16} color="#006ce4" />, label: 'Hotels & Accommodation' },
  { key: 'food', icon: <Utensils size={16} color="#006ce4" />, label: 'Food & Gourmet Dining' },
  { key: 'transport', icon: <Train size={16} color="#006ce4" />, label: 'Local Transit & Express Rail' },
  { key: 'activities', icon: <Ticket size={16} color="#006ce4" />, label: 'Attractions & Guided Tours' },
  { key: 'misc', icon: <ShoppingBag size={16} color="#006ce4" />, label: 'Shopping & Miscellaneous' },
];

export default function BudgetBreakdown({ breakdown, userBudget, status, onOptimize }) {
  const pct = userBudget ? Math.min(100, Math.round((breakdown.total / userBudget) * 100)) : 100;

  return (
    <section className="panel" style={{ marginBottom: 36 }}>
      <div className="section-header-row" style={{ marginBottom: 16 }}>
        <div>
          <h2 className="section-main-title">Transparent Budget Breakdown</h2>
          <p className="section-main-sub">Comprehensive estimate of expected expenses for the entire trip.</p>
        </div>
      </div>

      <table className="budget-table">
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key}>
              <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {row.icon}
                <span>{row.label}</span>
              </td>
              <td>{formatINR(breakdown[row.key])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ margin: '18px 0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, color: 'var(--ink-700)', marginBottom: 6 }}>
          <span>Budget Utilization ({pct}%)</span>
          <span>Target: {formatINR(userBudget || breakdown.total)}</span>
        </div>
        <div className="budget-bar-track">
          <div
            className={`budget-bar-fill${status?.overBudget ? ' over' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="budget-total-row">
        <span>Estimated Total</span>
        <span style={{ color: 'var(--pine-900)' }}>{formatINR(breakdown.total)}</span>
      </div>

      {status?.overBudget && (
        <div className="budget-warning-box">
          <AlertTriangle size={20} color="#d13b3b" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: '#991b1b', fontSize: '0.94rem' }}>Budget Alert</strong>
            <p style={{ margin: '2px 0 10px', fontSize: '0.84rem', color: '#7f1d1d' }}>
              This estimated itinerary is approximately {formatINR(status.diff)} above your target budget.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOptimize}
            >
              <Sparkles size={14} />
              <span>Optimize Budget by 15%</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
