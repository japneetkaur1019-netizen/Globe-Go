import ItineraryDay from './ItineraryDay.jsx';

export default function Itinerary({ days }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-main-title">Day-by-Day Itinerary</h2>
          <p className="section-main-sub">Optimized timeline with recommended morning, afternoon and evening activities.</p>
        </div>
      </div>
      <div className="itinerary-list">
        {days.map((day) => (
          <ItineraryDay key={day.day} day={day} />
        ))}
      </div>
    </section>
  );
}
