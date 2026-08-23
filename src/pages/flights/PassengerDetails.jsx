import { useState } from "react";
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
  Users
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./PassengerDetails.css";

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();

  const {
    search,
    selectedFlight,
    passengers: savedPassengers
  } = state;

  const passengers =
    savedPassengers && savedPassengers.length > 0
      ? savedPassengers
      : [
          {
            id: "adult-1",
            type: "Adult",
            title: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: ""
          }
        ];

  const [passengerData, setPassengerData] = useState(passengers);

  const [contact, setContact] = useState({
    email: "",
    phone: ""
  });

  const [error, setError] = useState("");

  /* =========================================================
     UPDATE PASSENGER
     ========================================================= */

  const updatePassenger = (index, field, value) => {
    setPassengerData((current) =>
      current.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value
            }
          : passenger
      )
    );

    setError("");
  };

  /* =========================================================
     UPDATE CONTACT
     ========================================================= */

  const updateContact = (field, value) => {
    setContact((current) => ({
      ...current,
      [field]: value
    }));

    setError("");
  };

  /* =========================================================
     VALIDATION
     ========================================================= */

  const validateForm = () => {
    if (!contact.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    if (!contact.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!contact.phone.trim()) {
      setError("Please enter your phone number.");
      return false;
    }

    if (contact.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }

    for (let i = 0; i < passengerData.length; i++) {
      const passenger = passengerData[i];

      if (!passenger.firstName?.trim()) {
        setError(`Please enter the first name for Passenger ${i + 1}.`);
        return false;
      }

      if (!passenger.lastName?.trim()) {
        setError(`Please enter the last name for Passenger ${i + 1}.`);
        return false;
      }

      if (!passenger.gender) {
        setError(`Please select the gender for Passenger ${i + 1}.`);
        return false;
      }

      if (!passenger.dateOfBirth) {
        setError(`Please enter the date of birth for Passenger ${i + 1}.`);
        return false;
      }
    }

    return true;
  };

  /* =========================================================
     CONTINUE
     ========================================================= */

  const handleContinue = () => {
    if (!validateForm()) return;

    dispatch({
      type: "SET_PASSENGERS",
      payload: passengerData
    });

    dispatch({
      type: "SET_CONTACT",
      payload: contact
    });

    navigate("/flights/seats");
  };

  /* =========================================================
     NO FLIGHT STATE
     ========================================================= */

  if (!selectedFlight || !search?.origin || !search?.destination) {
    return (
      <div className="passenger-page">
        <div className="passenger-container">
          <div className="passenger-empty">
            <div className="empty-icon-wrap">
              <Plane size={46} />
            </div>

            <h2>No Flight Selected</h2>

            <p>
              Please select a flight before entering passenger details.
            </p>

            <button
              type="button"
              className="passenger-actions btn-primary"
              onClick={() => navigate("/flights")}
            >
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="passenger-page">
      <div className="passenger-container">

        {/* =====================================================
            STEPPER
        ===================================================== */}

        <div className="flight-stepper-bar">

          <div className="step-node completed">
            <span className="step-num">
              <Check size={14} />
            </span>
            <span className="step-label">Search</span>
          </div>

          <div className="step-line completed"></div>

          <div className="step-node completed">
            <span className="step-num">
              <Check size={14} />
            </span>
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

        {/* =====================================================
            HEADER / BANNER
        ===================================================== */}

        <div className="passenger-header">

          <span className="flight-label">
            PASSENGER DETAILS
          </span>

          <h1>Who's Flying?</h1>

          <p>
            Enter the details exactly as they appear on your
            government-issued ID or passport.
          </p>

        </div>

        {/* =====================================================
            FLIGHT SUMMARY
        ===================================================== */}

        <div className="flight-summary">

          <div>
            <span>Flight</span>

            <strong>
              {selectedFlight.airline} · {selectedFlight.flightNumber}
            </strong>
          </div>

          <div>
            <span>Route</span>

            <strong>
              {search.origin.code} → {search.destination.code}
            </strong>
          </div>

          <div>
            <span>Travel Date</span>

            <strong>
              {search.departDate || "Upcoming"}
            </strong>
          </div>

        </div>

        {/* =====================================================
            CONTACT INFORMATION
        ===================================================== */}

        <section className="passenger-section">

          <div className="passenger-title">
            <div>
              <h3>Contact Information</h3>

              <span>
                Booking Updates
              </span>
            </div>
          </div>

          <p className="section-description">
            We'll send your booking confirmation and important
            flight updates to these details.
          </p>

          <div className="contact-grid">

            <div className="form-group">

              <label htmlFor="email">
                <Mail size={13} /> Email Address
              </label>

              <input
                id="email"
                type="email"
                value={contact.email}
                onChange={(e) =>
                  updateContact("email", e.target.value)
                }
                placeholder="you@example.com"
              />

            </div>

            <div className="form-group">

              <label htmlFor="phone">
                <Phone size={13} /> Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                value={contact.phone}
                onChange={(e) =>
                  updateContact("phone", e.target.value)
                }
                placeholder="9876543210"
              />

            </div>

          </div>

        </section>

        {/* =====================================================
            PASSENGERS
        ===================================================== */}

        <section className="passenger-section">

          <div className="passenger-title">

            <div>

              <h3>
                <Users size={17} /> Passenger Information
              </h3>

              <span>
                {passengerData.length}{" "}
                {passengerData.length === 1
                  ? "Passenger"
                  : "Passengers"}
              </span>

            </div>

          </div>

          <p className="section-description">
            Make sure every passenger's name and personal
            information is entered correctly.
          </p>

          {passengerData.map((passenger, index) => (

            <div
              className="passenger-form-card"
              key={passenger.id || index}
            >

              {/* Passenger heading */}

              <div className="passenger-card-header">

                <div className="passenger-card-title">

                  <div className="passenger-number">
                    {index + 1}
                  </div>

                  <div>
                    <h4>
                      Passenger {index + 1}
                    </h4>

                    <span>
                      {passenger.type || "Adult"}
                    </span>
                  </div>

                </div>

                <User size={20} />

              </div>

              {/* Form */}

              <div className="passenger-grid">

                {/* Title */}

                <div className="form-group">

                  <label htmlFor={`title-${index}`}>
                    Title
                  </label>

                  <select
                    id={`title-${index}`}
                    value={passenger.title || ""}
                    onChange={(e) =>
                      updatePassenger(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select
                    </option>

                    <option value="Mr">
                      Mr
                    </option>

                    <option value="Ms">
                      Ms
                    </option>

                    <option value="Mrs">
                      Mrs
                    </option>

                    <option value="Dr">
                      Dr
                    </option>

                  </select>

                </div>

                {/* Gender */}

                <div className="form-group">

                  <label htmlFor={`gender-${index}`}>
                    Gender
                  </label>

                  <select
                    id={`gender-${index}`}
                    value={passenger.gender || ""}
                    onChange={(e) =>
                      updatePassenger(
                        index,
                        "gender",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* First Name */}

                <div className="form-group">

                  <label htmlFor={`firstName-${index}`}>
                    First Name *
                  </label>

                  <input
                    id={`firstName-${index}`}
                    type="text"
                    value={passenger.firstName || ""}
                    onChange={(e) =>
                      updatePassenger(
                        index,
                        "firstName",
                        e.target.value
                      )
                    }
                    placeholder="Enter first name"
                  />

                </div>

                {/* Last Name */}

                <div className="form-group">

                  <label htmlFor={`lastName-${index}`}>
                    Last Name *
                  </label>

                  <input
                    id={`lastName-${index}`}
                    type="text"
                    value={passenger.lastName || ""}
                    onChange={(e) =>
                      updatePassenger(
                        index,
                        "lastName",
                        e.target.value
                      )
                    }
                    placeholder="Enter last name"
                  />

                </div>

                {/* DOB */}

                <div className="form-group">

                  <label htmlFor={`dob-${index}`}>
                    <Calendar size={13} /> Date of Birth *
                  </label>

                  <input
                    id={`dob-${index}`}
                    type="date"
                    value={passenger.dateOfBirth || ""}
                    onChange={(e) =>
                      updatePassenger(
                        index,
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>

          ))}

        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="passenger-error">
            {error}
          </div>
        )}

        {/* =====================================================
            SECURITY NOTE
        ===================================================== */}

        <div className="passenger-security-note">

          <ShieldCheck size={18} />

          <div>
            <strong>Your information is secure</strong>

            <span>
              Your passenger details are used only to process
              your flight booking.
            </span>
          </div>

        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="passenger-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/flights")}
          >
            <ArrowLeft size={16} />
            Back to Flights
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleContinue}
          >
            Continue to Seat Selection
            <ArrowRight size={16} />
          </button>

        </div>

      </div>
    </div>
  );
}