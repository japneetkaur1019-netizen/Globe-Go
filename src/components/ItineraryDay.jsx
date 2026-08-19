import { Sun, Compass, Utensils, MapPin, Clock } from 'lucide-react';
import { formatINR } from '../utils/budgetCalculator.js';

export default function ItineraryDay({ day }) {
  return (
    <div className="itinerary-day-card">
      <div className="itinerary-day-header">
        <div className="itinerary-day-title">
          <div className="day-badge-num">{day.day}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--ink-900)' }}>
              Day {day.day} — {day.city}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-500)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> Regional Highlights
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', fontWeight: 600 }}>Estimated Day Spend</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pine-900)' }}>{formatINR(day.cost)}</div>
        </div>
      </div>

      <div className="itinerary-slots-grid">
        <div className="itinerary-slot-box">
          <div className="slot-time-badge">
            <Sun size={13} />
            <span>Morning Experience</span>
          </div>
          {day.morning.image && (
            <div style={{ width: '100%', height: 110, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
              <img src={day.morning.image} alt={day.morning.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="slot-activity-title">{day.morning.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-500)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> 09:00 AM – 12:30 PM
          </div>
        </div>

        <div className="itinerary-slot-box">
          <div className="slot-time-badge" style={{ color: '#c8791a' }}>
            <Compass size={13} />
            <span>Afternoon Tour</span>
          </div>
          {day.afternoon.image && (
            <div style={{ width: '100%', height: 110, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
              <img src={day.afternoon.image} alt={day.afternoon.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="slot-activity-title">{day.afternoon.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-500)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> 01:30 PM – 05:00 PM
          </div>
        </div>

        <div className="itinerary-slot-box">
          <div className="slot-time-badge" style={{ color: '#107c41' }}>
            <Utensils size={13} />
            <span>Evening Dining &amp; Sights</span>
          </div>
          {day.evening.image && (
            <div style={{ width: '100%', height: 110, borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
              <img src={day.evening.image} alt={day.evening.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div className="slot-activity-title">{day.evening.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-500)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} /> 06:30 PM – 09:30 PM
          </div>
        </div>
      </div>
    </div>
  );
}
