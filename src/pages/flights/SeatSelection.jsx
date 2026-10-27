import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./SeatSelection.css";

export default function SeatSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { selectedFlight } = state;

  // Get passengers from the booking context.
  const passengers =
    state.passengers && state.passengers.length > 0
      ? state.passengers
      : [
          {
            id: "adult-1",
            type: "Adult",
            firstName: "Primary",
            lastName: "Traveler",
          },
        ];

  // Ensure every passenger has a unique ID.
  const passengerList = passengers.map((passenger, index) => ({
    ...passenger,
    id: passenger.id || `passenger-${index + 1}`,
  }));

  // Seat assignments are stored using passenger IDs.
  const [selectedSeats, setSelectedSeats] = useState(() => {
    const savedSeats = state.seats || {};

    // Retain existing assignments only for current passengers.
    const validSeats = {};

    passengerList.forEach((passenger) => {
      if (savedSeats[passenger.id]) {
        validSeats[passenger.id] = savedSeats[passenger.id];
      }
    });

    return validSeats;
  });

  const [activePassenger, setActivePassenger] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Some seats are occupied by default.
  const occupiedSeats = [
    "1A",
    "1B",
    "3C",
    "4D",
    "6A",
    "7F",
    "9B",
    "11E",
  ];

  const extraLegroomRows = [1, 6];

  const rows = Array.from({ length: 12 }, (_, index) => index + 1);
  const leftSeats = ["A", "B", "C"];
  const rightSeats = ["D", "E", "F"];

  // Keep the active passenger index valid if passenger count changes.
  useEffect(() => {
    if (activePassenger >= passengerList.length) {
      setActivePassenger(Math.max(0, passengerList.length - 1));
    }
  }, [activePassenger, passengerList.length]);

  // Find the passenger currently selecting a seat.
  const currentPassenger = passengerList[activePassenger];

  // Select a seat for the active passenger.
  const selectSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) {
      return;
    }

    if (!currentPassenger) {
      return;
    }

    const currentPassengerId = currentPassenger.id;

    // Check whether another passenger already has this seat.
    const alreadySelectedBy = Object.keys(selectedSeats).find(
      (passengerId) =>
        selectedSeats[passengerId] === seatId &&
        passengerId !== currentPassengerId
    );

    if (alreadySelectedBy) {
      alert("This seat is already assigned to another passenger.");
      return;
    }

    // Assign the seat to the current passenger.
    setSelectedSeats((previousSeats) => ({
      ...previousSeats,
      [currentPassengerId]: seatId,
    }));

    setSkipped(false);

    // Automatically move to the next passenger.
    if (activePassenger < passengerList.length - 1) {
      setActivePassenger((previousIndex) => previousIndex + 1);
    }
  };

  // Assign a different available seat to every passenger.
  const autoAssign = () => {
    const availableSeats = [];

    rows.forEach((row) => {
      [...leftSeats, ...rightSeats].forEach((letter) => {
        const seatId = `${row}${letter}`;

        if (!occupiedSeats.includes(seatId)) {
          availableSeats.push(seatId);
        }
      });
    });

    if (availableSeats.length < passengerList.length) {
      alert("There are not enough available seats for all passengers.");
      return;
    }

    const assignments = {};

    passengerList.forEach((passenger, index) => {
      assignments[passenger.id] = availableSeats[index];
    });

    setSelectedSeats(assignments);
    setSkipped(false);
  };

  // Count passengers who have an assigned seat.
  const assignedCount = passengerList.filter(
    (passenger) => selectedSeats[passenger.id]
  ).length;

  // Continue to payment.
  const handleContinue = () => {
    if (!skipped && assignedCount < passengerList.length) {
      alert(
        `Please assign seats for all ${passengerList.length} passengers or choose to skip.`
      );
      return;
    }

    dispatch({
      type: "SET_SEATS",
      payload: skipped ? {} : selectedSeats,
    });

    navigate("/flights/payment");
  };

  // Determine how each seat should appear.
  const getSeatStatus = (seatId) => {
    if (occupiedSeats.includes(seatId)) {
      return "occupied";
    }

    const selectedBy = Object.keys(selectedSeats).find(
      (passengerId) => selectedSeats[passengerId] === seatId
    );

    if (selectedBy) {
      if (selectedBy === currentPassenger?.id) {
        return "selected-current";
      }

      return "selected-other";
    }

    return "available";
  };

  // Clear all seat assignments.
  const handleSkip = () => {
    setSkipped(true);
    setSelectedSeats({});
  };

  // Handle the case where no flight has been selected.
  if (!selectedFlight) {
    return (
      <div className="seat-page">
        <div className="seat-container">
          <div className="seat-empty card">
            <div className="empty-icon-wrap">
              <Plane size={44} />
            </div>

            <h2>No flight selected</h2>

            <p>
              Please select a flight before choosing your cabin seats.
            </p>

            <button
              type="button"
              className="btn btn-primary"
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
    <div className="seat-page">
      <div className="seat-container">
        {/* Header */}
        <div className="seat-header-row">
          <div>
            <span className="flight-badge-label">
              AIRCRAFT CABIN SEAT MAP
            </span>

            <h1>Select Your Preferred Seats</h1>

            <p className="seat-subtext">
              Choose your window, aisle, or extra-legroom seats on the{" "}
              {selectedFlight.airline} Boeing 787.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline auto-assign-btn"
            onClick={autoAssign}
          >
            <Sparkles size={14} />
            Auto-Assign All Seats
          </button>
        </div>

        {/* Passenger Tabs */}
        <div className="passenger-seat-tabs-bar">
          {passengerList.map((passenger, index) => {
            const seat = selectedSeats[passenger.id];
            const isCurrent = activePassenger === index;

            return (
              <button
                type="button"
                key={passenger.id}
                className={`passenger-seat-tab${
                  isCurrent ? " active" : ""
                }`}
                onClick={() => {
                  setActivePassenger(index);
                  setSkipped(false);
                }}
              >
                <div className="tab-user-info">
                  <User size={15} />

                  <span>
                    {passenger.firstName || `Passenger ${index + 1}`}{" "}
                    {passenger.lastName || ""}
                  </span>
                </div>

                <span
                  className={`tab-seat-code${seat ? " assigned" : ""}`}
                >
                  {seat ? `Seat ${seat}` : "Pick Seat"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="seat-main-grid">
          {/* Aircraft Cabin */}
          <div className="aircraft-cabin-pane card">
            <div className="aircraft-nose">
              <span className="nose-label">FRONT · COCKPIT</span>
            </div>

            <div className="cabin-seating-grid">
              {rows.map((row) => {
                const isExtraLegroom = extraLegroomRows.includes(row);

                return (
                  <div
                    className={`cabin-row${
                      isExtraLegroom ? " extra-legroom" : ""
                    }`}
                    key={row}
                  >
                    {/* Left Seats: A, B, C */}
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
                            aria-label={`Seat ${seatId}, ${status}`}
                          >
                            <span className="seat-letter">
                              {letter}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Center Aisle */}
                    <div className="cabin-aisle">
                      <span className="row-num">{row}</span>
                    </div>

                    {/* Right Seats: D, E, F */}
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
                            aria-label={`Seat ${seatId}, ${status}`}
                          >
                            <span className="seat-letter">
                              {letter}
                            </span>
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

          {/* Sidebar */}
          <aside className="seat-sidebar-pane">
            {/* Seat Legend */}
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

            {/* Assigned Seats Summary */}
            <div className="selected-seats-summary-card card">
              <h3>Assigned Seats</h3>

              <div className="assigned-passengers-list">
                {passengerList.map((passenger, index) => {
                  const seat = selectedSeats[passenger.id];

                  return (
                    <div
                      className="assigned-p-row"
                      key={passenger.id}
                    >
                      <span>
                        {passenger.firstName ||
                          `Passenger ${index + 1}`}{" "}
                        {passenger.lastName || ""}
                      </span>

                      <strong className="seat-tag-assigned">
                        {seat || "Not assigned"}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* Seat Price */}
              <div className="seat-pricing-total">
                <div className="pricing-line">
                  <span>Seat Fee (₹250 × {assignedCount})</span>

                  <strong>
                    ₹{(assignedCount * 250).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className="seat-action-buttons">
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={handleSkip}
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
