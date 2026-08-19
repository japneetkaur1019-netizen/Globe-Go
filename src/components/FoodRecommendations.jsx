import { Utensils, Award } from 'lucide-react';
import { formatINR } from '../utils/budgetCalculator.js';

export default function FoodRecommendations({ food, destinationName }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Iconic Culinary Guide{destinationName ? ` — ${destinationName}` : ''}</h2>
          <p className="section-main-sub">Must-try local dishes and delicacies recommended by regional food experts.</p>
        </div>
      </div>

      <div className="hotel-deals-grid">
        {food.map((item) => (
          <div className="hotel-deal-card" key={item.name}>
            <div className="hotel-card-image-wrap" style={{ aspectRatio: '16/10' }}>
              <img
                src={item.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                alt={item.name}
                className="hotel-card-img"
              />
              {item.tag && (
                <div className="hotel-vip-badge">
                  <Award size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                  {item.tag}
                </div>
              )}
            </div>

            <div className="hotel-card-body">
              <h3 className="hotel-card-title" style={{ fontSize: '1rem' }}>{item.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-700)', margin: '6px 0 12px', lineHeight: 1.45 }}>
                {item.desc}
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: 8 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Utensils size={12} /> Avg. Portion
                </span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--pine-900)' }}>
                  ~{formatINR(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
