import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function AIPlannerInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
  };

  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Sparkles size={18} color="#006ce4" />
        <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--ink-900)' }}>
          Where would you like to travel?
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe your dream trip in natural language (e.g. Plan a 5-day luxury trip to Japan with Michelin food and cultural sights under ₹1,20,000)..."
          rows={3}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '1.5px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.96rem',
            color: 'var(--ink-900)',
            background: 'var(--cream)',
            outline: 'none',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--ink-500)' }}>
            Suggested: <strong style={{ color: 'var(--ink-800)' }}>“Plan a 5-day trip to Japan under ₹70,000”</strong>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !value.trim()}
            style={{ padding: '10px 24px' }}
          >
            {isLoading ? (
              <span>Generating Itinerary...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Create My Itinerary</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
