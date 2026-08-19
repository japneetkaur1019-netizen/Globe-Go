import { Compass, Landmark, Trees, Utensils, ShoppingBag, Sparkles, Crown, Clock, Star } from 'lucide-react';

function getCategoryIcon(name) {
  switch (name) {
    case 'Compass':
      return <Compass size={16} />;
    case 'Landmark':
      return <Landmark size={16} />;
    case 'Trees':
      return <Trees size={16} />;
    case 'Utensils':
      return <Utensils size={16} />;
    case 'ShoppingBag':
      return <ShoppingBag size={16} />;
    case 'Crown':
      return <Crown size={16} />;
    default:
      return <Sparkles size={16} />;
  }
}

export default function ActivityRecommendations({ groups }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Curated Experiences &amp; Activities</h2>
          <p className="section-main-sub">Personalized tours and excursions tailored to your selected travel interests.</p>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.category} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--pine-100)',
                color: 'var(--expedia-blue)',
                padding: '6px 14px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.86rem',
              }}
            >
              {getCategoryIcon(group.iconName)}
              <span>{group.label}</span>
            </span>
          </div>

          <div className="hotel-deals-grid">
            {group.items.map((item) => (
              <div className="hotel-deal-card" key={item.name}>
                <div className="hotel-card-image-wrap" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="hotel-card-img"
                  />
                  {item.duration && (
                    <div className="hotel-vip-badge">
                      <Clock size={11} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                      {item.duration}
                    </div>
                  )}
                </div>

                <div className="hotel-card-body">
                  <h3 className="hotel-card-title" style={{ fontSize: '0.98rem' }}>{item.name}</h3>
                  <div className="hotel-rating-row" style={{ marginTop: 6, marginBottom: 8 }}>
                    <Star size={13} fill="#ffc72c" color="#ffc72c" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink-800)' }}>{item.rating || 4.9}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-500)' }}>(Verified Tour)</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-700)', margin: 0, lineHeight: 1.45 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
