import { useState } from 'react';
import { Wallet, Plane, Building2, Utensils, Train, Ticket, ShieldCheck, CheckCircle, Send } from 'lucide-react';
import { generateBudgetAdvice } from '../data/mockAI.js';
import { extractBudget, extractDuration } from '../utils/tripParser.js';
import { formatINR } from '../utils/budgetCalculator.js';

const LABELS = {
  flights: { icon: <Plane size={16} color="#006ce4" />, label: 'Flights & Airfare' },
  accommodation: { icon: <Building2 size={16} color="#006ce4" />, label: 'Accommodation & Stays' },
  food: { icon: <Utensils size={16} color="#006ce4" />, label: 'Dining & Street Food' },
  transport: { icon: <Train size={16} color="#006ce4" />, label: 'Local Transit & Metro' },
  activities: { icon: <Ticket size={16} color="#006ce4" />, label: 'Attractions & Sightseeing' },
  emergency: { icon: <ShieldCheck size={16} color="#107c41" />, label: 'Emergency Reserve' },
};

export default function BudgetAdvicePanel() {
  const [text, setText] = useState('');
  const [advice, setAdvice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const budgetInfo = extractBudget(text);
    const duration = extractDuration(text);
    const budget = budgetInfo?.amount || 60000;
    setAdvice(generateBudgetAdvice({ budget, duration, destinationText: text }));
  };

  return (
    <div>
      <div className="panel" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Wallet size={22} color="#006ce4" />
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>AI Budget Allocation Advisor</h3>
        </div>
        <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginBottom: 16 }}>
          Describe your destination and total target funds — our engine suggests an optimal spending distribution strategy.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., I have ₹80,000 for a 7-day trip to Europe or Japan"
            style={{ flex: 1, minWidth: 260, padding: '12px 16px', borderRadius: 8, border: '1.5px solid var(--border-color)', fontSize: '0.94rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
            <Send size={16} />
            <span>Generate Strategy</span>
          </button>
        </form>
      </div>

      {advice && (
        <section>
          <div className="panel" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16, color: 'var(--ink-900)' }}>
              Recommended Allocation for {formatINR(advice.budget)}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {Object.entries(advice.strategy).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    background: 'var(--cream)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-700)', marginBottom: 6 }}>
                    {LABELS[key]?.icon}
                    <span>{LABELS[key]?.label || key}</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pine-900)' }}>
                    {formatINR(val)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 14, color: 'var(--ink-900)' }}>
              Cost Optimization Recommendations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {advice.suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem', color: 'var(--ink-800)' }}>
                  <CheckCircle size={17} color="#107c41" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
