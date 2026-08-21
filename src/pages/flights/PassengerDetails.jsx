import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  Plane,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Info
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./PassengerDetails.css";

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { search, selectedFlight } = state;

  if (!selectedFlight || !search?.origin || !search?.destination) {
    return (
      <div className="passenger-page">
        <div className="passenger-container">
          <div className="passenger-empty card">
            <div className="empty-icon-wrap">
              <Plane size={44} />
            </div>
            <h2>No flight selected</h2>
            <p>Please select a flight before entering passenger details.</p>
            <button className="btn btn-primary" onClick={() => navigate("/flights")}>
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initialAdultCount = Math.max(1, search.adults || 1);
  const initialChildCount = search.children || 0;

  const [passengers, setPassengers] = useState(() => {
    if (state.passengers && state.passengers.length > 0) {
      return state.passengers;
    }
    const list = [];
    for (let i = 0; i < initialAdultCount; i++) {
      list.push({
        id: `adult-${i + 1}`,
        type: "Adult",
        title: "Mr",
        firstName: i === 0 ? "John" : "",
        lastName: i === 0 ? "Doe" : "",
        dob: "1994-05-15",
        gender: "Male",
        nationality: "Indian"
      });
    }
    for (let i = 0; i < initialChildCount; i++) {
      list.push({
        id: `child-${i + 1}`,
        type: "Child",
        title: "Master",
        firstName: "",
        lastName: "",
        dob: "2018-09-20",
        gender: "Male",
        nationality: "Indian"
      });
    }
    return list;
  });

  const [contactEmail, setContactEmail] = useState("traveler@globego.com");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [error, setError] = useState("");

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const autofillSample = () => {
    const samples = [
      { firstName: "Rohan", lastName: "Sharma", dob: "1992-04-12", gender: "Male", title: "Mr", nationality: "Indian" },
      { firstName: "Ananya", lastName: "Iyer", dob: "1995-11-28", gender: "Female", title: "Ms", nationality: "Indian" },
      { firstName: "Karan", lastName: "Mehta", dob: "2000-01-19", gender: "Male", title: "Mr", nationality: "Indian" },
    ];
    setPassengers(
      passengers.map((p, i) => {
        const sample = samples[i % samples.length];
        return { ...p, ...sample };
      })
    );
  };

  const handleContinue = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!contactEmail.includes("@")) {
      setError("Please provide a valid contact email for e-ticket delivery.");
      return;
    }
    if (!contactPhone.trim()) {
      setError("Please enter a mobile phone number for flight SMS updates.");
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName.trim() || !p.lastName.trim()) {
        setError(`Please fill first and last name for Passenger ${i + 1} (${p.type}).`);
        return;
      }
    }

    dispatch({
      type: "SET_PASSENGERS",
      payload: passengers
    });

    navigate("/flights/seats");
  };

  return (
    <div className="passenger-page">
      <div className="passenger-container">

        {/* Stepper Bar */}
        <div className="flight-stepper-bar">
          <div className="step-node completed">
            <span className="step-num"><Check size={14} /></span>
            <span className="step-label">Search</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-node completed">
            <span className="step-num"><Check size={14} /></span>
            <span className="step-label">Select Flight</span>
          </div>
          <div className="step-line active"></div>
          <div className="step-node active">
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

        {/* Header & Quick Fill */}
        <div className="passenger-header-row">
          <div>
            <span className="flight-badge-label">TRAVELER INFORMATION</span>
            <h1>Who's travelling on this flight?</h1>
            <p className="passenger-subtext">
              Names must match government-issued photo ID or passport exactly.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline quick-fill-btn"
            onClick={autofillSample}
          >
            <Sparkles size={14} /> Auto-fill Demo Details
          </button>
        </div>

        {error && (
          <div className="form-error-alert card">
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="passenger-layout-grid">

          {/* Left Form Area */}
          <div className="passenger-forms-col">

            {/* Contact Details Card */}
            <div className="passenger-card card">
              <div className="card-section-title">
                <h3><Mail size={18} /> Primary Contact &amp; Booking Updates</h3>
                <span>Your e-ticket and boarding alerts will be sent here</span>
              </div>

              <div className="form-two-col">
                <div className="form-group">
                  <label><Mail size={14} /> Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. traveler@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label><Phone size={14} /> Mobile Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Passengers Cards */}
            {passengers.map((p, idx) => (
              <div className="passenger-card card" key={p.id || idx}>
                <div className="passenger-card-header">
                  <div className="passenger-title-wrap">
                    <div className="passenger-num-circle">{idx + 1}</div>
                    <div>
                      <h3>Passenger {idx + 1}</h3>
                      <span className="passenger-type-pill">{p.type}</span>
                    </div>
                  </div>
                </div>

                <div className="passenger-inputs-grid">
                  <div className="form-group title-group">
                    <label>Title</label>
                    <select
                      value={p.title || "Mr"}
                      onChange={(e) => handlePassengerChange(idx, "title", e.target.value)}
                    >
                      <option value="Mr">Mr.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Dr">Dr.</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>First &amp; Middle Name</label>
                    <input
                      type="text"
                      value={p.firstName}
                      onChange={(e) => handlePassengerChange(idx, "firstName", e.target.value)}
                      placeholder="As on passport / ID"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Last / Surname</label>
                    <input
                      type="text"
                      value={p.lastName}
                      onChange={(e) => handlePassengerChange(idx, "lastName", e.target.value)}
                      placeholder="As on passport / ID"
                      required
                    />
                  </div>
                </div>

                <div className="passenger-meta-grid">
                  <div className="form-group">
                    <label><Calendar size={14} /> Date of Birth</label>
                    <input
                      type="date"
                      value={p.dob}
                      onChange={(e) => handlePassengerChange(idx, "dob", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label><User size={14} /> Gender</label>
                    <select
                      value={p.gender || "Male"}
                      onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label><Globe size={14} /> Nationality</label>
                    <input
                      type="text"
                      value={p.nationality || "Indian"}
                      onChange={(e) => handlePassengerChange(idx, "nationality", e.target.value)}
                      placeholder="e.g. Indian"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation buttons */}
            <div className="passenger-nav-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/flights/results")}
              >
                <ArrowLeft size={16} /> Back to Flights
              </button>

              <button
                type="button"
                className="btn btn-primary next-step-btn"
                onClick={handleContinue}
              >
                <span>Continue to Seat Selection</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

          {/* Right Summary Sidebar */}
          <aside className="passenger-summary-sidebar">
            <div className="flight-brief-card card">
              <div className="brief-header">
                <span className="airline-name">{selectedFlight.airline}</span>
                <span className="flight-number">{selectedFlight.flightNumber}</span>
              </div>

              <div className="brief-route">
                <div>
                  <strong>{selectedFlight.departure}</strong>
                  <span>{search.origin.city} ({search.origin.code})</span>
                </div>
                <div className="brief-mid">
                  <span>{selectedFlight.duration}</span>
                  <Plane size={14} />
                  <span>{selectedFlight.stops === 0 ? "Non-stop" : `${selectedFlight.stops} Stop`}</span>
                </div>
                <div className="text-right">
                  <strong>{selectedFlight.arrival}</strong>
                  <span>{search.destination.city} ({search.destination.code})</span>
                </div>
              </div>

              <div className="brief-divider"></div>

              <div className="fare-summary-list">
                <div className="fare-line">
                  <span>Flight Fare ({passengers.length} traveler{passengers.length > 1 ? "s" : ""})</span>
                  <strong>₹{(selectedFlight.price * passengers.length).toLocaleString("en-IN")}</strong>
                </div>
                <div className="fare-line">
                  <span>Estimated Taxes &amp; GST</span>
                  <strong>₹{Math.round(selectedFlight.price * passengers.length * 0.12).toLocaleString("en-IN")}</strong>
                </div>
                <div className="brief-divider"></div>
                <div className="fare-line total-fare">
                  <span>Estimated Total</span>
                  <strong className="text-primary">
                    ₹{Math.round(selectedFlight.price * passengers.length * 1.12).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="brief-security-note">
                <ShieldCheck size={16} color="#107c41" />
                <span>Encrypted SSL 256-bit safe checkout</span>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}