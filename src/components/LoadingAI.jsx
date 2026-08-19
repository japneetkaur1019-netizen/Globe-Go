import { useEffect, useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';

const STEPS = [
  'Analyzing your travel profile and budget...',
  'Scanning verified hotel availability and VIP rates...',
  'Curating optimal morning, afternoon and evening itinerary routes...',
  'Computing tax and fee projections...',
  'Finalizing personalized AI recommendations...',
];

export default function LoadingAI({ label = 'Computing your personalized itinerary...' }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel" style={{ textAlign: 'center', padding: '48px 24px', margin: '24px 0' }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--pine-100)',
          color: 'var(--expedia-blue)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          animation: 'spin 3s linear infinite',
        }}
      >
        <Compass size={28} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-900)', marginBottom: 8 }}>
        {label}
      </h3>
      <div style={{ fontSize: '0.9rem', color: 'var(--expedia-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Sparkles size={15} />
        <span>{STEPS[stepIndex]}</span>
      </div>
    </div>
  );
}
