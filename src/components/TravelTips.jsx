import { Wallet, MapPin, Ticket, FileText, CloudSun, Zap, ShieldCheck, Sun, SunMedium, Wind, ThermometerSnowflake, Compass, Info } from 'lucide-react';

function getTipIcon(type) {
  switch (type) {
    case 'Wallet':
      return <Wallet size={18} color="#006ce4" />;
    case 'MapPin':
      return <MapPin size={18} color="#006ce4" />;
    case 'Ticket':
      return <Ticket size={18} color="#006ce4" />;
    case 'FileText':
      return <FileText size={18} color="#006ce4" />;
    case 'CloudSun':
      return <CloudSun size={18} color="#006ce4" />;
    case 'Zap':
      return <Zap size={18} color="#006ce4" />;
    case 'ShieldCheck':
      return <ShieldCheck size={18} color="#107c41" />;
    case 'Sun':
      return <Sun size={18} color="#c8791a" />;
    case 'SunMedium':
      return <SunMedium size={18} color="#c8791a" />;
    case 'Wind':
      return <Wind size={18} color="#006ce4" />;
    case 'ThermometerSnowflake':
      return <ThermometerSnowflake size={18} color="#006ce4" />;
    case 'Compass':
      return <Compass size={18} color="#006ce4" />;
    default:
      return <Info size={18} color="#006ce4" />;
  }
}

export default function TravelTips({ tips }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">AI Travel Tips &amp; Insights</h2>
          <p className="section-main-sub">Essential packing, money and local etiquette guidelines for your journey.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {tips.map((tip, i) => (
          <div
            key={i}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--pine-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getTipIcon(tip.iconType)}
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--ink-800)', lineHeight: 1.5 }}>
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
