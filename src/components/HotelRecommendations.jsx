import { Star, ShieldCheck, Check } from 'lucide-react';
import { formatINR } from '../utils/budgetCalculator.js';

export default function HotelRecommendations({ hotels }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Recommended Stays &amp; Resorts</h2>
          <p className="section-main-sub">Hand-picked VIP properties matched to your trip style with member privileges.</p>
        </div>
      </div>

      <div className="hotel-deals-grid">
        {hotels.map((hotel) => (
          <div className="hotel-deal-card" key={hotel.name}>
            <div className="hotel-card-image-wrap">
              <img
                src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                alt={hotel.name}
                className="hotel-card-img"
              />
              {hotel.vipAccess && (
                <div className="hotel-vip-badge">
                  <ShieldCheck size={12} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                  VIP Access
                </div>
              )}
            </div>

            <div className="hotel-card-body">
              <h3 className="hotel-card-title">{hotel.name}</h3>
              <div className="hotel-card-location">{hotel.city}</div>

              <div className="hotel-rating-row">
                <span className="score-badge">{hotel.rating || 9.4}</span>
                <span className="score-label">{hotel.ratingLabel || 'Exceptional'}</span>
                <span className="score-reviews">({hotel.reviews || 520} reviews)</span>
              </div>

              {hotel.memberPrice && (
                <div className="member-discount-pill">
                  <Star size={11} fill="#ffffff" />
                  Member Price Available
                </div>
              )}

              <p style={{ fontSize: '0.82rem', color: 'var(--ink-700)', margin: '0 0 12px', lineHeight: 1.4 }}>
                {hotel.desc}
              </p>

              <div className="hotel-price-box">
                <div className="nightly-rate">{formatINR(hotel.price)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--ink-500)' }}>nightly</span></div>
                {hotel.originalPrice && (
                  <div className="total-rate-row">
                    <span className="original-price-strike">{formatINR(hotel.originalPrice)}</span>
                    <span>Save {formatINR(hotel.originalPrice - hotel.price)}</span>
                  </div>
                )}
                <div className="taxes-note">
                  <Check size={11} /> Total includes estimated taxes and fees
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
