import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plane,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Clock,
  Check
} from "lucide-react";
import airports from "../../data/airports";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./FlightSearch.css";

const POPULAR_ROUTES = [
  { fromCode: "DEL", fromCity: "Delhi", toCode: "BOM", toCity: "Mumbai", price: 5420, airline: "IndiGo", duration: "2h 10m" },
  { fromCode: "DEL", fromCity: "Delhi", toCode: "BLR", toCity: "Bengaluru", price: 7200, airline: "Air India", duration: "2h 45m" },
  { fromCode: "BOM", fromCity: "Mumbai", toCode: "GOI", toCity: "Goa", price: 3890, airline: "Akasa Air", duration: "1h 15m" },
  { fromCode: "DEL", fromCity: "Delhi", toCode: "DXB", toCity: "Dubai", price: 18500, airline: "Emirates", duration: "3h 50m" },
  { fromCode: "BOM", fromCity: "Mumbai", toCode: "SIN", toCity: "Singapore", price: 22400, airline: "Singapore Air", duration: "5h 20m" },
  { fromCode: "DEL", fromCity: "Delhi", toCode: "HND", toCity: "Tokyo", price: 38900, airline: "ANA / Air India", duration: "7h 45m" },
];

export default function FlightSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useFlightBooking();

  // Find default airports
  const defaultOrigin = airports.find((a) => a.code === "DEL") || airports[0];
  const defaultDestination = airports.find((a) => a.code === "BOM") || airports[1];

  const [tripType, setTripType] = useState(state.search?.tripType || "round-trip");
  const [origin, setOrigin] = useState(state.search?.origin || defaultOrigin);
  const [destination, setDestination] = useState(state.search?.destination || defaultDestination);

  const [originQuery, setOriginQuery] = useState(state.search?.origin?.city || defaultOrigin.city);
  const [destinationQuery, setDestinationQuery] = useState(state.search?.destination?.city || defaultDestination.city);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Set default dates: depart next week, return in 2 weeks
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [departDate, setDepartDate] = useState(state.search?.departDate || nextWeek);
  const [returnDate, setReturnDate] = useState(state.search?.returnDate || twoWeeks);

  const [adults, setAdults] = useState(state.search?.adults || 1);
  const [children, setChildren] = useState(state.search?.children || 0);
  const [cabin, setCabin] = useState(state.search?.cabin || "Economy");
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [error, setError] = useState("");

  // Handle prefill from location.state if navigated from other pages
  useEffect(() => {
    if (location.state?.prefillDestination) {
      const match = airports.find(
        (a) =>
          a.city.toLowerCase().includes(location.state.prefillDestination.toLowerCase()) ||
          a.country.toLowerCase().includes(location.state.prefillDestination.toLowerCase())
      );
      if (match) {
        setDestination(match);
        setDestinationQuery(`${match.city} (${match.code})`);
      }
    }
  }, [location.state]);

  const filteredOriginAirports = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(originQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(originQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(originQuery.toLowerCase())
  );

  const filteredDestAirports = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(destinationQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(destinationQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  const handleSwapAirports = () => {
    const tempAirport = origin;
    const tempQuery = originQuery;
    setOrigin(destination);
    setOriginQuery(destinationQuery);
    setDestination(tempAirport);
    setDestinationQuery(tempQuery);
  };

  const selectPopularRoute = (route) => {
    const orig = airports.find((a) => a.code === route.fromCode) || {
      code: route.fromCode,
      city: route.fromCity,
      name: `${route.fromCity} Airport`,
      country: "India"
    };
    const dest = airports.find((a) => a.code === route.toCode) || {
      code: route.toCode,
      city: route.toCity,
      name: `${route.toCity} Airport`,
      country: "International"
    };
    setOrigin(orig);
    setOriginQuery(`${orig.city} (${orig.code})`);
    setDestination(dest);
    setDestinationQuery(`${dest.city} (${dest.code})`);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!origin) {
      setError("Please select a departure airport.");
      return;
    }
    if (!destination) {
      setError("Please select a destination airport.");
      return;
    }
    if (origin.code === destination.code) {
      setError("Departure and destination cannot be the same airport.");
      return;
    }
    if (!departDate) {
      setError("Please choose a departure date.");
      return;
    }
    if (tripType === "round-trip" && returnDate && returnDate < departDate) {
      setError("Return date must be on or after departure date.");
      return;
    }

    dispatch({
      type: "SET_SEARCH",
      payload: {
        tripType,
        origin,
        destination,
        departDate,
        returnDate: tripType === "one-way" ? "" : returnDate,
        adults,
        children,
        infants: 0,
        cabin
      }
    });

    navigate("/flights/results");
  };

  return (
    <div className="flight-search-page">
      <div className="flight-search-container">

        {/* Hero Section */}
        <section className="flight-hero-card">
          <div className="flight-hero-overlay">
            <div className="flight-hero-eyebrow">
              <Plane size={15} />
              <span>GLOBAL FLIGHT SEARCH &amp; INSTANT SEAT BOOKING</span>
            </div>

            <h1>Where will you fly next?</h1>
            <p>
              Compare verified airline fares, pick your favorite aircraft seat with interactive 3D cabin maps, and enjoy member privileges.
            </p>

            <div className="flight-perks-row">
              <div className="flight-perk"><ShieldCheck size={16} /> 100% Verified Airlines</div>
              <div className="flight-perk"><Award size={16} /> Zero Hidden Booking Fees</div>
              <div className="flight-perk"><TrendingDown size={16} /> Best Price Guaranteed</div>
            </div>
          </div>
        </section>

        {/* Flight Booking Progress Bar */}
        <div className="flight-stepper-bar">
          <div className="step-node active">
            <span className="step-num">1</span>
            <span className="step-label">Flight Search</span>
          </div>
          <div className="step-line"></div>
          <div className="step-node">
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

        {/* Main Search Widget Card */}
        <div className="flight-widget-card card">
          {/* Trip Type Tabs */}
          <div className="trip-type-row">
            <div className="trip-tabs-group">
              <button
                type="button"
                className={`trip-tab-btn${tripType === "round-trip" ? " active" : ""}`}
                onClick={() => setTripType("round-trip")}
              >
                Round Trip
              </button>
              <button
                type="button"
                className={`trip-tab-btn${tripType === "one-way" ? " active" : ""}`}
                onClick={() => setTripType("one-way")}
              >
                One Way
              </button>
            </div>

            <div className="cabin-select-wrap">
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value)}
                className="cabin-select"
                aria-label="Cabin Class"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First">First Class</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="search-error-alert">
              <span>{error}</span>
            </div>
          )}

          {/* Search Inputs Grid */}
          <form onSubmit={handleSearch} className="flight-search-form">
            <div className="airports-grid-row">
              {/* Origin Field */}
              <div className="airport-input-box">
                <label><MapPin size={15} /> Flying From</label>
                <input
                  type="text"
                  value={originQuery}
                  onChange={(e) => {
                    setOriginQuery(e.target.value);
                    setShowOriginDropdown(true);
                  }}
                  onFocus={() => setShowOriginDropdown(true)}
                  placeholder="City or Airport (e.g. Delhi, DEL)"
                />
                {origin && <span className="airport-tag-pill">{origin.code}</span>}

                {showOriginDropdown && (
                  <div className="airports-dropdown card">
                    {filteredOriginAirports.slice(0, 6).map((a) => (
                      <div
                        key={a.code}
                        className="airport-drop-item"
                        onClick={() => {
                          setOrigin(a);
                          setOriginQuery(`${a.city} (${a.code})`);
                          setShowOriginDropdown(false);
                        }}
                      >
                        <div className="drop-item-main">
                          <strong>{a.city}</strong>
                          <span>{a.name}</span>
                        </div>
                        <span className="drop-code">{a.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="swap-btn-wrap">
                <button
                  type="button"
                  className="swap-airports-btn"
                  onClick={handleSwapAirports}
                  title="Swap Origin & Destination"
                  aria-label="Swap origin and destination airports"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* Destination Field */}
              <div className="airport-input-box">
                <label><MapPin size={15} /> Flying To</label>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  placeholder="City or Airport (e.g. Mumbai, Tokyo, Dubai)"
                />
                {destination && <span className="airport-tag-pill">{destination.code}</span>}

                {showDestDropdown && (
                  <div className="airports-dropdown card">
                    {filteredDestAirports.slice(0, 6).map((a) => (
                      <div
                        key={a.code}
                        className="airport-drop-item"
                        onClick={() => {
                          setDestination(a);
                          setDestinationQuery(`${a.city} (${a.code})`);
                          setShowDestDropdown(false);
                        }}
                      >
                        <div className="drop-item-main">
                          <strong>{a.city}</strong>
                          <span>{a.name}</span>
                        </div>
                        <span className="drop-code">{a.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dates & Passengers Row */}
            <div className="dates-passengers-grid">
              {/* Depart Date */}
              <div className="form-input-field">
                <label><Calendar size={15} /> Departure Date</label>
                <input
                  type="date"
                  value={departDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
              </div>

              {/* Return Date */}
              {tripType === "round-trip" && (
                <div className="form-input-field">
                  <label><Calendar size={15} /> Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    min={departDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              )}

              {/* Passenger Selector */}
              <div className="form-input-field passenger-field-wrap">
                <label><Users size={15} /> Travelers</label>
                <button
                  type="button"
                  className="passenger-summary-btn"
                  onClick={() => setShowPassengerModal(!showPassengerModal)}
                >
                  <span>{adults + children} Traveler{(adults + children) > 1 ? "s" : ""}</span>
                  <span className="cabin-badge-small">{cabin}</span>
                </button>

                {showPassengerModal && (
                  <div className="passengers-popover card">
                    <div className="counter-row">
                      <div>
                        <strong>Adults</strong>
                        <span>Age 12+ years</span>
                      </div>
                      <div className="counter-controls">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                        >
                          -
                        </button>
                        <span>{adults}</span>
                        <button
                          type="button"
                          disabled={adults >= 9}
                          onClick={() => setAdults(adults + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="counter-row">
                      <div>
                        <strong>Children</strong>
                        <span>Age 2-11 years</span>
                      </div>
                      <div className="counter-controls">
                        <button
                          type="button"
                          disabled={children <= 0}
                          onClick={() => setChildren(Math.max(0, children - 1))}
                        >
                          -
                        </button>
                        <span>{children}</span>
                        <button
                          type="button"
                          disabled={children >= 6}
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-block popover-done-btn"
                      onClick={() => setShowPassengerModal(false)}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-submit-col">
                <button type="submit" className="btn-search-flights">
                  <Search size={18} />
                  <span>Search Flights</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Popular Routes Section */}
        <section className="popular-routes-section">
          <div className="section-title-wrap">
            <div>
              <span className="section-eyebrow">TRENDING FLIGHTS</span>
              <h2>Popular Non-Stop &amp; Direct Routes</h2>
            </div>
            <span className="section-hint">Click any deal to auto-fill search</span>
          </div>

          <div className="popular-routes-grid">
            {POPULAR_ROUTES.map((route, i) => (
              <div
                className="popular-route-card card"
                key={i}
                onClick={() => selectPopularRoute(route)}
                role="button"
                tabIndex={0}
              >
                <div className="route-card-top">
                  <div className="route-cities">
                    <strong>{route.fromCity}</strong>
                    <ArrowRightLeft size={13} className="route-arrow-icon" />
                    <strong>{route.toCity}</strong>
                  </div>
                  <span className="route-duration"><Clock size={12} /> {route.duration}</span>
                </div>

                <div className="route-card-bottom">
                  <div className="airline-meta">
                    <span className="airline-name">{route.airline}</span>
                    <span className="code-pair">{route.fromCode} ➔ {route.toCode}</span>
                  </div>
                  <div className="price-tag">
                    <span className="from-text">from</span>
                    <strong>₹{route.price.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}