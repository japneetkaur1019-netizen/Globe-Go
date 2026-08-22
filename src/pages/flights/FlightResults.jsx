import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Clock,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Luggage,
  Coffee,
  ShieldCheck,
  Star,
  Check,
  Calendar,
  Users
} from "lucide-react";
import flightsData from "../../data/flights";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./FlightResults.css";

// Helper function to synthesize realistic scheduled flights if route not in static mock
function generateDynamicFlights(originCode, destCode, cabin = "Economy") {
  const airlines = [
    { name: "IndiGo", code: "6E", base: 5400, rating: 4.3, duration: 135, stops: 0 },
    { name: "Air India", code: "AI", base: 6200, rating: 4.5, duration: 140, stops: 0 },
    { name: "Vistara", code: "UK", base: 6800, rating: 4.6, duration: 130, stops: 0 },
    { name: "Akasa Air", code: "QP", base: 4900, rating: 4.2, duration: 145, stops: 0 },
    { name: "Emirates", code: "EK", base: 19500, rating: 4.8, duration: 230, stops: 0 },
    { name: "Singapore Airlines", code: "SQ", base: 22000, rating: 4.9, duration: 320, stops: 0 },
  ];

  const times = [
    { dep: "06:15", arr: "08:35" },
    { dep: "09:40", arr: "12:00" },
    { dep: "13:10", arr: "15:35" },
    { dep: "16:45", arr: "19:10" },
    { dep: "20:30", arr: "22:50" },
    { dep: "22:15", arr: "00:40" },
  ];

  return airlines.map((airline, idx) => {
    const time = times[idx % times.length];
    const flightNum = `${airline.code}-${Math.floor(200 + Math.random() * 700)}`;
    const multiplier = cabin === "Business" ? 2.8 : cabin === "Premium Economy" ? 1.5 : cabin === "First" ? 4.5 : 1;
    const price = Math.round(airline.base * multiplier);

    const hours = Math.floor(airline.duration / 60);
    const mins = airline.duration % 60;

    return {
      id: `dyn_${originCode}_${destCode}_${idx}`,
      airline: airline.name,
      flightNumber: flightNum,
      from: originCode,
      to: destCode,
      departure: time.dep,
      arrival: time.arr,
      duration: `${hours}h ${mins}m`,
      durationMinutes: airline.duration,
      stops: airline.stops,
      price,
      rating: airline.rating,
      refundable: idx % 2 === 0,
      meals: idx !== 3,
    };
  });
}

export default function FlightResults() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { search } = state;

  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [stops, setStops] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [maxPrice] = useState(100000);

  const hasSearch = Boolean(search?.origin && search?.destination);

  // Find exact flights from dataset or synthesize
  const availableFlights = useMemo(() => {
    if (!hasSearch) return [];
    const rawFlightMatches = flightsData.filter(
      (f) => f.from === search.origin.code && f.to === search.destination.code
    );
    return rawFlightMatches.length > 0
      ? rawFlightMatches
      : generateDynamicFlights(search.origin.code, search.destination.code, search.cabin);
  }, [hasSearch, search?.origin?.code, search?.destination?.code, search?.cabin]);

  // All distinct airlines on this route
  const allAirlines = useMemo(() => {
    return [...new Set(availableFlights.map((f) => f.airline))];
  }, [availableFlights]);

  // Filter & Sort
  const filteredFlights = useMemo(() => {
    let list = availableFlights.filter((flight) => {
      const matchAirline = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
      const matchStops = stops === "all" || flight.stops === Number(stops);
      const matchPrice = flight.price <= maxPrice;
      return matchAirline && matchStops && matchPrice;
    });

    if (sortBy === "price") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "duration") {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === "departure") {
      list.sort((a, b) => a.departure.localeCompare(b.departure));
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [availableFlights, selectedAirlines, stops, maxPrice, sortBy]);

  const toggleAirline = (airline) => {
    if (selectedAirlines.includes(airline)) {
      setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
    } else {
      setSelectedAirlines([...selectedAirlines, airline]);
    }
  };

  // Safety fallback if accessed without search
  if (!hasSearch) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="results-empty card">
            <div className="empty-icon-wrap">
              <Plane size={44} />
            </div>
            <h2>No flight search selected</h2>
            <p>Please enter your departure and destination airports to find flights.</p>
            <button className="btn btn-primary" onClick={() => navigate("/flights")}>
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectFlight = (flight) => {
    dispatch({
      type: "SELECT_FLIGHT",
      payload: flight,
    });
    navigate("/flights/passengers");
  };

  return (
    <div className="results-page">
      <div className="results-container">

        {/* Flight Booking Progress Bar */}
        <div className="flight-stepper-bar">
          <div className="step-node completed">
            <span className="step-num"><Check size={14} /></span>
            <span className="step-label">Search</span>
          </div>
          <div className="step-line active"></div>
          <div className="step-node active">
            <span className="step-num">2</span>
            <span className="step-label">Select Flight</span>
          </div>
          <div className="step-line"></div>
          <div className="step-node">
            <span className="step-num">3</span>
            <span className="step-label">Passengers</span>
          </div>
          <div className="step-line"></div>
          <div className="step-node">
            <span className="step-num">4</span>
            <span className="step-label">Seats</span>
          </div>
          <div className="step-line"></div>
          <div className="step-node">
            <span className="step-num">5</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {/* Search Route Summary Header */}
        <div className="results-route-summary card">
          <div className="route-info-left">
            <div className="route-badges">
              <span className="cabin-badge">{search.cabin || "Economy"}</span>
              <span className="trip-badge">{search.tripType === "round-trip" ? "Round Trip" : "One Way"}</span>
            </div>
            <h1 className="route-title">
              {search.origin.city} ({search.origin.code}) <ArrowRight size={20} className="route-arrow" /> {search.destination.city} ({search.destination.code})
            </h1>
            <div className="route-sub-meta">
              <span><Calendar size={14} /> {search.departDate || "Selected Date"}</span>
              <span><Users size={14} /> {search.adults + (search.children || 0)} Traveler{(search.adults + (search.children || 0)) > 1 ? "s" : ""}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline change-search-btn"
            onClick={() => navigate("/flights")}
          >
            Change Search
          </button>
        </div>

        {/* Layout: Filters Sidebar + Flight Cards List */}
        <div className="results-main-layout">

          {/* Filters Sidebar */}
          <aside className="results-filter-sidebar card">
            <div className="filter-header">
              <h3><Filter size={16} /> Filter Flights</h3>
              {(selectedAirlines.length > 0 || stops !== "all") && (
                <button
                  type="button"
                  className="reset-filters-link"
                  onClick={() => {
                    setSelectedAirlines([]);
                    setStops("all");
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Stops Filter */}
            <div className="filter-group">
              <label className="filter-label">Stops</label>
              <div className="filter-options-stack">
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="stops"
                    value="all"
                    checked={stops === "all"}
                    onChange={() => setStops("all")}
                  />
                  <span>All Flights ({availableFlights.length})</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="stops"
                    value="0"
                    checked={stops === "0"}
                    onChange={() => setStops("0")}
                  />
                  <span>Non-stop only</span>
                </label>
                <label className="filter-radio-label">
                  <input
                    type="radio"
                    name="stops"
                    value="1"
                    checked={stops === "1"}
                    onChange={() => setStops("1")}
                  />
                  <span>1 Stop</span>
                </label>
              </div>
            </div>

            {/* Airlines Filter */}
            <div className="filter-group">
              <label className="filter-label">Airlines</label>
              <div className="filter-checkbox-stack">
                {allAirlines.map((airline) => (
                  <label key={airline} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedAirlines.includes(airline)}
                      onChange={() => toggleAirline(airline)}
                    />
                    <span>{airline}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trust badge info */}
            <div className="filter-trust-badge">
              <ShieldCheck size={16} color="#107c41" />
              <span>Prices include all taxes, surcharges &amp; baggage.</span>
            </div>
          </aside>

          {/* Results List Pane */}
          <div className="results-content-pane">

            {/* Sort bar */}
            <div className="sort-toolbar card">
              <span className="results-count-text">
                Showing <strong>{filteredFlights.length}</strong> flight options
              </span>

              <div className="sort-select-wrap">
                <SlidersHorizontal size={14} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort flight results"
                >
                  <option value="price">Cheapest Price</option>
                  <option value="duration">Fastest Flight</option>
                  <option value="departure">Earliest Departure</option>
                  <option value="rating">Highest Airline Rating</option>
                </select>
              </div>
            </div>

            {/* Flights List */}
            {filteredFlights.length === 0 ? (
              <div className="no-flights-found card">
                <Plane size={36} className="text-muted" />
                <h3>No flights match the current filters</h3>
                <p>Try resetting the stops or airline filters on the left.</p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSelectedAirlines([]);
                    setStops("all");
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="flights-cards-stack">
                {filteredFlights.map((flight) => (
                  <div className="flight-deal-card card" key={flight.id}>
                    {/* Airline Left Info */}
                    <div className="flight-card-airline">
                      <div className="airline-icon-avatar">
                        {flight.airline.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="airline-title">{flight.airline}</strong>
                        <span className="flight-number-sub">{flight.flightNumber}</span>
                        <div className="airline-rating-tag">
                          <Star size={11} fill="#ffc72c" color="#ffc72c" />
                          <span>{flight.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Flight Schedule Middle Node */}
                    <div className="flight-card-schedule">
                      <div className="sched-node">
                        <span className="sched-time">{flight.departure}</span>
                        <span className="sched-code">{flight.from}</span>
                      </div>

                      <div className="sched-mid">
                        <span className="sched-duration"><Clock size={12} /> {flight.duration}</span>
                        <div className="flight-track-line">
                          <span className="track-dot"></span>
                          <div className="track-bar"></div>
                          <Plane size={15} className="plane-mini-icon" />
                          <div className="track-bar"></div>
                          <span className="track-dot"></span>
                        </div>
                        <span className="stops-sub-label">
                          {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}
                        </span>
                      </div>

                      <div className="sched-node text-right">
                        <span className="sched-time">{flight.arrival}</span>
                        <span className="sched-code">{flight.to}</span>
                      </div>
                    </div>

                    {/* Inclusions & Amenities */}
                    <div className="flight-amenities-col">
                      <span className="amenity-item"><Luggage size={13} /> 15 kg check-in</span>
                      <span className="amenity-item"><Coffee size={13} /> Complimentary meal</span>
                      <span className="refundable-tag">Free Cancellation available</span>
                    </div>

                    {/* Price & Action Right */}
                    <div className="flight-card-action">
                      <div className="price-stack">
                        <span className="price-small-label">Per Traveler</span>
                        <strong className="price-large">₹{flight.price.toLocaleString("en-IN")}</strong>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary select-flight-btn"
                        onClick={() => handleSelectFlight(flight)}
                      >
                        <span>Select</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}