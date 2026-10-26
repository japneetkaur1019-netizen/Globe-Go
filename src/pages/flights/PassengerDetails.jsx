import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import { useFormValidation } from "../../hooks/useFormValidation";
import "./PassengerDetails.css";

/* ─────────────────────────────────────────────────────────────────────────
   VALIDATION RULES
───────────────────────────────────────────────────────────────────────── */
const CONTACT_RULES = {
  email: (v) => {
    if (!v.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email (e.g. you@example.com).";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Phone number is required.";
    if (v.replace(/\D/g, "").length < 10) return "Enter a valid 10-digit phone number.";
    return "";
  },
};

function buildPassengerRules(index) {
  return {
    [`firstName_${index}`]: (v) => (!v?.trim() ? `First name is required for Passenger ${index + 1}.` : ""),
    [`lastName_${index}`]:  (v) => (!v?.trim() ? `Last name is required for Passenger ${index + 1}.`  : ""),
    [`gender_${index}`]:    (v) => (!v         ? `Gender is required for Passenger ${index + 1}.`     : ""),
    [`dob_${index}`]:       (v) => (!v         ? `Date of birth is required for Passenger ${index + 1}.` : ""),
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────────────────────────────────── */
/** Inline error chip rendered beneath each input */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <span className="field-error-msg" role="alert">
      <AlertCircle size={12} /> {message}
    </span>
  );
}

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { search, selectedFlight, passengers: savedPassengers } = state;

  /* ── Passenger data ──────────────────────────────────────────────────── */
  const initPassengers =
    savedPassengers && savedPassengers.length > 0
      ? savedPassengers
      : [{ id: "adult-1", type: "Adult", title: "", firstName: "", lastName: "", dateOfBirth: "", gender: "" }];

  const [passengerData, setPassengerData] = useState(initPassengers);

  /* ── Contact form via useFormValidation ─────────────────────────────── */
  const {
    values: contact,
    errors: contactErrors,
    touched: contactTouched,
    handleChange: handleContactChange,
    handleBlur: handleContactBlur,
    validate: validateContact,
  } = useFormValidation({ email: "", phone: "" }, CONTACT_RULES);

  /* ── Per-passenger field errors ─────────────────────────────────────── */
  const [paxErrors,  setPaxErrors]  = useState({});
  const [paxTouched, setPaxTouched] = useState({});

  const [submitting, setSubmitting] = useState(false);

  /* ── Update a passenger field ────────────────────────────────────────── */
  const updatePassenger = useCallback((index, field, value) => {
    setPassengerData((curr) =>
      curr.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
    // Live-clear error once touched
    const key = `${field}_${index}`;
    if (paxTouched[key]) {
      const rule = buildPassengerRules(index)[key];
      const msg  = rule ? rule(value) : "";
      setPaxErrors((prev) => ({ ...prev, [key]: msg }));
    }
  }, [paxTouched]);

  const blurPassenger = useCallback((index, field, value) => {
    const key  = `${field}_${index}`;
    const rule = buildPassengerRules(index)[key];
    const msg  = rule ? rule(value) : "";
    setPaxTouched((prev) => ({ ...prev, [key]: true }));
    setPaxErrors((prev)  => ({ ...prev, [key]: msg  }));
  }, []);

  /* ── Full validation on submit ──────────────────────────────────────── */
  const handleContinue = () => {
    setSubmitting(true);

    // Contact validation
    const contactOk = validateContact();

    // Passenger validation
    let paxOk = true;
    const newPaxErrors  = {};
    const newPaxTouched = {};

    passengerData.forEach((pax, i) => {
      const rules = buildPassengerRules(i);
      Object.entries(rules).forEach(([key, rule]) => {
        const field = key.replace(`_${i}`, "");
        const msg   = rule(pax[field]);
        newPaxErrors[key]  = msg;
        newPaxTouched[key] = true;
        if (msg) paxOk = false;
      });
    });

    setPaxErrors(newPaxErrors);
    setPaxTouched(newPaxTouched);

    if (!contactOk || !paxOk) {
      setSubmitting(false);
      // Scroll to first error
      document.querySelector(".field-error-msg")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    dispatch({ type: "SET_PASSENGERS", payload: passengerData });
    dispatch({ type: "SET_CONTACT",    payload: contact });
    navigate("/flights/seats");
  };

  /* ── Guard: no flight selected ───────────────────────────────────────── */
  if (!selectedFlight || !search?.origin || !search?.destination) {
    return (
      <div className="passenger-page">
        <div className="passenger-container">
          <div className="passenger-empty">
            <div className="empty-icon-wrap"><Plane size={46} /></div>
            <h2>No Flight Selected</h2>
            <p>Please select a flight before entering passenger details.</p>
            <button type="button" className="passenger-actions btn-primary" onClick={() => navigate("/flights")}>
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────── */
  return (
    <div className="passenger-page">
      <div className="passenger-container">

        {/* ── STEPPER ─────────────────────────────────────────────── */}
        <div className="flight-stepper-bar">
          <div className="step-node completed"><span className="step-num"><Check size={14} /></span><span className="step-label">Search</span></div>
          <div className="step-line completed" />
          <div className="step-node completed"><span className="step-num"><Check size={14} /></span><span className="step-label">Select Flight</span></div>
          <div className="step-line active" />
          <div className="step-node active"><span className="step-num">3</span><span className="step-label">Passengers</span></div>
          <div className="step-line" />
          <div className="step-node"><span className="step-num">4</span><span className="step-label">Seats</span></div>
          <div className="step-line" />
          <div className="step-node"><span className="step-num">5</span><span className="step-label">Payment</span></div>
        </div>

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="passenger-header">
          <span className="flight-label">PASSENGER DETAILS</span>
          <h1>Who's Flying?</h1>
          <p>Enter the details exactly as they appear on your government-issued ID or passport.</p>
        </div>

        {/* ── FLIGHT SUMMARY ──────────────────────────────────────── */}
        <div className="flight-summary">
          <div><span>Flight</span><strong>{selectedFlight.airline} · {selectedFlight.flightNumber}</strong></div>
          <div><span>Route</span><strong>{search.origin.code} → {search.destination.code}</strong></div>
          <div><span>Travel Date</span><strong>{search.departDate || "Upcoming"}</strong></div>
        </div>

        {/* ── CONTACT INFORMATION ─────────────────────────────────── */}
        <section className="passenger-section">
          <div className="passenger-title">
            <div>
              <h3>Contact Information</h3>
              <span>Booking Updates</span>
            </div>
          </div>
          <p className="section-description">
            We'll send your booking confirmation and important flight updates to these details.
          </p>

          <div className="contact-grid">
            {/* Email */}
            <div className={`form-group ${contactTouched.email && contactErrors.email ? "has-error" : ""}`}>
              <label htmlFor="email"><Mail size={13} /> Email Address <span className="req-star">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                value={contact.email}
                onChange={handleContactChange}
                onBlur={handleContactBlur}
                placeholder="you@example.com"
                aria-invalid={!!contactErrors.email}
                aria-describedby="email-error"
              />
              <FieldError message={contactTouched.email ? contactErrors.email : ""} />
            </div>

            {/* Phone */}
            <div className={`form-group ${contactTouched.phone && contactErrors.phone ? "has-error" : ""}`}>
              <label htmlFor="phone"><Phone size={13} /> Phone Number <span className="req-star">*</span></label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={contact.phone}
                onChange={handleContactChange}
                onBlur={handleContactBlur}
                placeholder="9876543210"
                aria-invalid={!!contactErrors.phone}
                aria-describedby="phone-error"
              />
              <FieldError message={contactTouched.phone ? contactErrors.phone : ""} />
            </div>
          </div>
        </section>

        {/* ── PASSENGER FORMS ─────────────────────────────────────── */}
        <section className="passenger-section">
          <div className="passenger-title">
            <div>
              <h3><Users size={17} /> Passenger Information</h3>
              <span>{passengerData.length} {passengerData.length === 1 ? "Passenger" : "Passengers"}</span>
            </div>
          </div>
          <p className="section-description">
            Make sure every passenger's name and personal information is entered correctly.
          </p>

          {passengerData.map((pax, index) => (
            <div className="passenger-form-card" key={pax.id || index}>
              <div className="passenger-card-header">
                <div className="passenger-card-title">
                  <div className="passenger-number">{index + 1}</div>
                  <div>
                    <h4>Passenger {index + 1}</h4>
                    <span>{pax.type || "Adult"}</span>
                  </div>
                </div>
                <User size={20} />
              </div>

              <div className="passenger-grid">

                {/* Title */}
                <div className="form-group">
                  <label htmlFor={`title-${index}`}>Title</label>
                  <select
                    id={`title-${index}`}
                    value={pax.title || ""}
                    onChange={(e) => updatePassenger(index, "title", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                {/* Gender */}
                <div className={`form-group ${paxTouched[`gender_${index}`] && paxErrors[`gender_${index}`] ? "has-error" : ""}`}>
                  <label htmlFor={`gender-${index}`}>Gender <span className="req-star">*</span></label>
                  <select
                    id={`gender-${index}`}
                    value={pax.gender || ""}
                    onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                    onBlur={(e) => blurPassenger(index, "gender", e.target.value)}
                    aria-invalid={!!(paxTouched[`gender_${index}`] && paxErrors[`gender_${index}`])}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <FieldError message={paxTouched[`gender_${index}`] ? paxErrors[`gender_${index}`] : ""} />
                </div>

                {/* First Name */}
                <div className={`form-group ${paxTouched[`firstName_${index}`] && paxErrors[`firstName_${index}`] ? "has-error" : ""}`}>
                  <label htmlFor={`firstName-${index}`}>First Name <span className="req-star">*</span></label>
                  <input
                    id={`firstName-${index}`}
                    type="text"
                    value={pax.firstName || ""}
                    onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                    onBlur={(e) => blurPassenger(index, "firstName", e.target.value)}
                    placeholder="Enter first name"
                    aria-invalid={!!(paxTouched[`firstName_${index}`] && paxErrors[`firstName_${index}`])}
                  />
                  <FieldError message={paxTouched[`firstName_${index}`] ? paxErrors[`firstName_${index}`] : ""} />
                </div>

                {/* Last Name */}
                <div className={`form-group ${paxTouched[`lastName_${index}`] && paxErrors[`lastName_${index}`] ? "has-error" : ""}`}>
                  <label htmlFor={`lastName-${index}`}>Last Name <span className="req-star">*</span></label>
                  <input
                    id={`lastName-${index}`}
                    type="text"
                    value={pax.lastName || ""}
                    onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                    onBlur={(e) => blurPassenger(index, "lastName", e.target.value)}
                    placeholder="Enter last name"
                    aria-invalid={!!(paxTouched[`lastName_${index}`] && paxErrors[`lastName_${index}`])}
                  />
                  <FieldError message={paxTouched[`lastName_${index}`] ? paxErrors[`lastName_${index}`] : ""} />
                </div>

                {/* Date of Birth */}
                <div className={`form-group ${paxTouched[`dob_${index}`] && paxErrors[`dob_${index}`] ? "has-error" : ""}`}>
                  <label htmlFor={`dob-${index}`}><Calendar size={13} /> Date of Birth <span className="req-star">*</span></label>
                  <input
                    id={`dob-${index}`}
                    type="date"
                    value={pax.dateOfBirth || ""}
                    onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                    onBlur={(e) => blurPassenger(index, "dob", e.target.value)}
                    aria-invalid={!!(paxTouched[`dob_${index}`] && paxErrors[`dob_${index}`])}
                  />
                  <FieldError message={paxTouched[`dob_${index}`] ? paxErrors[`dob_${index}`] : ""} />
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* ── SECURITY NOTE ───────────────────────────────────────── */}
        <div className="passenger-security-note">
          <ShieldCheck size={18} />
          <div>
            <strong>Your information is secure</strong>
            <span>Your passenger details are used only to process your flight booking.</span>
          </div>
        </div>

        {/* ── ACTIONS ─────────────────────────────────────────────── */}
        <div className="passenger-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/flights")}>
            <ArrowLeft size={16} /> Back to Flights
          </button>
          <button type="button" className="btn-primary" onClick={handleContinue} disabled={submitting}>
            Continue to Seat Selection <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}