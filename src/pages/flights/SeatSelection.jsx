import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  User,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Armchair,
  Info
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./SeatSelection.css";

export default function SeatSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { search, selectedFlight } = state;

  const passengers = state.passengers && state.passengers.length > 0
    ? state.passengers
    : [{ id: "adult-1", type: "Adult", firstName: "Primary", lastName: "Traveler" }];

  const [selectedSeats, setSelectedSeats] = useState(state.seats || {});
  const [activePassenger, setActivePassenger] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Some seats are occupied by default for realism
  const occupiedSeats = ["1A", "1B", "3C", "4D", "6A", "7F", "9B", "11E"];
  const extraLegroomRows = [1, 6];

  const rows = Array.from({ length: 12 }, (_, index) => index + 1);
  const leftSeats = ["A", "B", "C"];
  const rightSeats = ["D", "E", "F"];

  const selectSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    // Check if another passenger already has this seat
    const alreadySelectedBy = Object.keys(selectedSeats).find(
      (passengerId) => selectedSeats[passengerId] === seatId
    );

    if (alreadySelectedBy && alreadySelectedBy !== passengers[activePassenger]?.id) {
      return;
    }

    const currentPId = passengers[activePassenger]?.id;
    setSelectedSeats((current) => ({
      ...current,
      [currentPId]: seatId
    }));
    setSkipped(false);

    // Auto advance to next passenger
    if (activePassenger < passengers.length - 1) {
      setActivePassenger(activePassenger + 1);
    }
  };

  const autoAssign = () => {
    const availableSeats = [];
    rows.forEach((row) => {
      [...leftSeats, ...rightSeats].forEach((letter) => {
        const seat = `${row}${letter}`;
        if (!occupiedSeats.includes(seat)) {
          availableSeats.push(seat);
        }
      });
    });

    const assignments = {};
    passengers.forEach((passenger, index) => {
      assignments[passenger.id] = availableSeats[index] || "5C";
    });

    setSelectedSeats(assignments);
    setSkipped(false);
  };

  const handleContinue = () => {
    dispatch({
      type: "SET_SEATS",
      payload: skipped ? {} : selectedSeats
    });
    navigate("/flights/payment");
  };

  const getSeatStatus = (seatId) => {
    if (occupiedSeats.includes(seatId)) return "occupied";
    const selectedBy = Object.keys(selectedSeats).find(
      (passengerId) => selectedSeats[passengerId] === seatId
    );
    if (selectedBy) {
      const isCurrent = selectedBy === passengers[activePassenger]?.id;
      return isCurrent ? "selected-current" : "selected-other";
    }
    return "available";
  };

  if (!selectedFlight) {
    return (
      <div className="seat-page">
        <div className="seat-container">
          <div className="seat-empty card">
            <div className="empty-icon-wrap">
              <Plane size={44} />
            </div>
            <h2>No flight selected</h2>
            <p>Please select a flight before choosing your cabin seats.</p>
            <button className="btn btn-primary" onClick={() => navigate("/flights")}>
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const assignedCount = Object.keys(selectedSeats).length;
  const currentSeat = selectedSeats[passengers[activePassenger]?.id];

  return (
    <div className="seat-page">
      <div className="seat-container">

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
          <div className="step-line completed"></div>
          <div className="step-node completed">
            <span className="step-num"><Check size={14} /></span>
            <span className="step-label">Passengers</span>
          </div>
          <div className="step-line active"></div>
          <div className="step-node active">
            <span className="step-num">4</span>
            <span className="step-label">Seats</span>
          </div>
          <div className="step-line"></div>
          <div className="step-node">
            <span className="step-num">5</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {/* Header */}
        <div className="seat-header-row">
          <div>
            <span className="flight-badge-label">AIRCRAFT CABIN SEAT MAP</span>
            <h1>Select Your Preferred Seats</h1>
            <p className="seat-subtext">
              Choose your window, aisle, or extra-legroom seats on the {selectedFlight.airline} Boeing 787.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline auto-assign-btn"
            onClick={autoAssign}
          >
            <Sparkles size={14} /> Auto-Assign All Seats
          </button>
        </div>

        {/* Passenger Switcher Tabs */}
        <div className="passenger-seat-tabs-bar">
          {passengers.map((p, idx) => {
            const seat = selectedSeats[p.id];
            const isCurrent = activePassenger === idx;
            return (
              <button
                type="button"
                key={p.id || idx}
                className={`passenger-seat-tab${isCurrent ? " active" : ""}`}
                onClick={() => setActivePassenger(idx)}
              >
                <div className="tab-user-info">
                  <User size={15} />
                  <span>{p.firstName || `Passenger ${idx + 1}`} {p.lastName || ""}</span>
                </div>
                <span className={`tab-seat-code${seat ? " assigned" : ""}`}>
                  {seat ? `Seat ${seat}` : "Pick Seat"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="seat-main-grid">

          {/* Left: Aircraft Cabin Diagram */}
          <div className="aircraft-cabin-pane card">
            <div className="aircraft-nose">
              <span className="nose-label">FRONT · COCKPIT</span>
            </div>

            {/* Wing / Exit Row Markers */}
            <div className="cabin-seating-grid">
              {rows.map((row) => {
                const isExtraLegroom = extraLegroomRows.includes(row);

                return (
                  <div className={`cabin-row${isExtraLegroom ? " extra-legroom" : ""}`} key={row}>
                    {/* Left 3 seats (A, B, C) */}
                    <div className="seat-triplet">
                      {leftSeats.map((letter) => {
                        const seatId = `${row}${letter}`;
                        const status = getSeatStatus(seatId);

                        return (
                          <button
                            type="button"
                            key={seatId}
                            className={`aircraft-seat ${status}`}
                            disabled={status === "occupied"}
                            onClick={() => selectSeat(seatId)}
                            title={`Seat ${seatId} (${status})`}
                          >
                            <span className="seat-letter">{letter}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Center Aisle with Row Number */}
                    <div className="cabin-aisle">
                      <span className="row-num">{row}</span>
                    </div>

                    {/* Right 3 seats (D, E, F) */}
                    <div className="seat-triplet">
                      {rightSeats.map((letter) => {
                        const seatId = `${row}${letter}`;
                        const status = getSeatStatus(seatId);

                        return (
                          <button
                            type="button"
                            key={seatId}
                            className={`aircraft-seat ${status}`}
                            disabled={status === "occupied"}
                            onClick={() => selectSeat(seatId)}
                            title={`Seat ${seatId} (${status})`}
                          >
                            <span className="seat-letter">{letter}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="aircraft-tail">
              <span>REAR GALLEY &amp; LAVATORIES</span>
            </div>
          </div>

          {/* Right: Legend & Summary Details */}
          <aside className="seat-sidebar-pane">
            <div className="seat-legend-card card">
              <h3>Seat Legend</h3>
              <div className="legend-items-list">
                <div className="legend-row">
                  <div className="legend-box available-box"></div>
                  <span>Available (₹250)</span>
                </div>
                <div className="legend-row">
                  <div className="legend-box selected-current-box"></div>
                  <span>Selected (Current Passenger)</span>
                </div>
                <div className="legend-row">
                  <div className="legend-box selected-other-box"></div>
                  <span>Selected (Other Passenger)</span>
                </div>
                <div className="legend-row">
                  <div className="legend-box occupied-box"></div>
                  <span>Occupied / Reserved</span>
                </div>
              </div>
            </div>

            <div className="selected-seats-summary-card card">
              <h3>Assigned Seats</h3>
              <div className="assigned-passengers-list">
                {passengers.map((p, idx) => {
                  const seat = selectedSeats[p.id];
                  return (
                    <div className="assigned-p-row" key={p.id || idx}>
                      <span>{p.firstName || `Passenger ${idx + 1}`} {p.lastName || ""}</span>
                      <strong className="seat-tag-assigned">
                        {seat || "Not assigned"}
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="seat-pricing-total">
                <div className="pricing-line">
                  <span>Seat Fee (₹250 × {assignedCount})</span>
                  <strong>₹{(assignedCount * 250).toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="seat-action-buttons">
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={() => {
                    setSkipped(true);
                    setSelectedSeats({});
                  }}
                >
                  {skipped ? "Seats Cleared" : "Skip Seat Selection"}
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleContinue}
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}