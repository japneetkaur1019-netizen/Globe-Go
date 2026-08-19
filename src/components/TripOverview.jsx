import { MapPin, Calendar, Wallet, Users, Sun, Heart, Sliders, Sparkles, Check } from 'lucide-react';
import { formatINR } from '../utils/budgetCalculator.js';

export default function TripOverview({ trip, onSave, onModify, isSaved }) {
  const cover = trip.coverImage || trip.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="trip-overview">
      <div className="trip-overview-bg" style={{ backgroundImage: `url(${cover})` }} />
      <div className="trip-overview-gradient" />

      <div className="trip-overview-inner">
        {trip.personalized && (
          <div className="personalized-tag">
            <Sparkles size={14} />
            <span>Personalized for your profile</span>
          </div>
        )}

        <h2>{trip.destination}, {trip.country || 'Global'}</h2>
        <div className="trip-meta-line">
          {trip.duration} Days Tour · Estimated Total {formatINR(trip.budget)}
        </div>

        <div className="trip-facts-grid">
          <div>
            <div className="trip-fact-label">
              <MapPin size={13} />
              <span>Destination</span>
            </div>
            <div className="trip-fact-value">{trip.destination}</div>
          </div>

          <div>
            <div className="trip-fact-label">
              <Calendar size={13} />
              <span>Duration</span>
            </div>
            <div className="trip-fact-value">{trip.duration} Days</div>
          </div>

          <div>
            <div className="trip-fact-label">
              <Wallet size={13} />
              <span>Budget</span>
            </div>
            <div className="trip-fact-value">{formatINR(trip.budget)}</div>
          </div>

          <div>
            <div className="trip-fact-label">
              <Users size={13} />
              <span>Travelers</span>
            </div>
            <div className="trip-fact-value">{trip.travelers} Guests</div>
          </div>

          <div>
            <div className="trip-fact-label">
              <Sun size={13} />
              <span>Climate</span>
            </div>
            <div className="trip-fact-value" style={{ textTransform: 'capitalize' }}>{trip.climate}</div>
          </div>
        </div>

        <div className="trip-overview-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSave}
            disabled={isSaved}
            style={{ padding: '12px 24px' }}
          >
            {isSaved ? (
              <>
                <Check size={16} />
                <span>Saved to Dashboard</span>
              </>
            ) : (
              <>
                <Heart size={16} />
                <span>Save Itinerary</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onModify}
            style={{ background: 'rgba(255,255,255,0.95)', padding: '12px 24px' }}
          >
            <Sliders size={16} />
            <span>Modify &amp; Recalculate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
