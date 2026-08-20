import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFlightBooking } from "../../context/FlightBookingContext";

import "./SeatSelection.css";

function SeatSelection() {
  const navigate = useNavigate();

  const { state, dispatch } = useFlightBooking();

  const passengers = state.passengers || [];

  const [selectedSeats, setSelectedSeats] = useState({});
  const [activePassenger, setActivePassenger] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Some seats are already occupied
  const occupiedSeats = [
    "2A",
    "2B",
    "4C",
    "5D",
    "7A",
    "8F",
    "10B"
  ];

  // Generate seats
  const rows = Array.from(
    { length: 12 },
    (_, index) => index + 1
  );

  const seatLetters = ["A", "B", "C", "D", "E", "F"];

  function selectSeat(seatId) {
    if (occupiedSeats.includes(seatId)) {
      return;
    }

    // Check whether another passenger already has this seat
    const alreadySelectedBy = Object.keys(
      selectedSeats
    ).find(
      (passengerId) =>
        selectedSeats[passengerId] === seatId
    );

    if (
      alreadySelectedBy &&
      alreadySelectedBy !==
        passengers[activePassenger]?.id
    ) {
      return;
    }

    const passengerId =
      passengers[activePassenger]?.id;

    setSelectedSeats((current) => ({
      ...current,
      [passengerId]: seatId
    }));

    // Automatically move to next passenger
    if (
      activePassenger <
      passengers.length - 1
    ) {
      setActivePassenger(
        activePassenger + 1
      );
    }
  }

  function autoAssign() {
    const availableSeats = [];

    rows.forEach((row) => {
      seatLetters.forEach((letter) => {
        const seat = `${row}${letter}`;

        if (!occupiedSeats.includes(seat)) {
          availableSeats.push(seat);
        }
      });
    });

    const assignments = {};

    passengers.forEach(
      (passenger, index) => {
        assignments[passenger.id] =
          availableSeats[index];
      }
    );

    setSelectedSeats(assignments);
    setSkipped(false);
  }

  function handleContinue() {
    if (
      !skipped &&
      Object.keys(selectedSeats).length !==
        passengers.length
    ) {
      alert(
        "Please select a seat for every passenger or skip seat selection."
      );
      return;
    }

    dispatch({
      type: "SET_SEATS",
      payload: skipped
        ? {}
        : selectedSeats
    });

    navigate("/flights/summary");
  }

  function getSeatStatus(seatId) {
    if (occupiedSeats.includes(seatId)) {
      return "occupied";
    }

    const selectedBy = Object.keys(
      selectedSeats
    ).find(
      (passengerId) =>
        selectedSeats[passengerId] === seatId
    );

    if (selectedBy) {
      return "selected";
    }

    return "available";
  }

  if (passengers.length === 0) {
    return (
      <div className="seat-page">
        <div className="seat-container">
          <div className="seat-empty card">
            <h2>No passenger information</h2>

            <p>
              Please enter passenger details
              first.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(
                  "/flights/passengers"
                )
              }
            >
              Passenger Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-page">
      <div className="seat-container">

        <div className="seat-header">
          <p className="flight-label">
            SEAT SELECTION
          </p>

          <h1>
            Choose your seats
          </h1>

          <p>
            Select a seat for each passenger.
          </p>
        </div>

        {/* Passenger tabs */}

        <div className="passenger-tabs">
          {passengers.map(
            (passenger, index) => (
              <button
                key={passenger.id}
                className={
                  activePassenger === index
                    ? "passenger-tab active"
                    : "passenger-tab"
                }
                onClick={() =>
                  setActivePassenger(index)
                }
              >
                Passenger {index + 1}

                {selectedSeats[
                  passenger.id
                ] && (
                  <span>
                    {
                      selectedSeats[
                        passenger.id
                      ]
                    }
                  </span>
                )}
              </button>
            )
          )}
        </div>

        <div className="seat-layout">

          {/* Legend */}

          <div className="seat-legend card">
            <div>
              <span className="legend-box available-box"></span>
              Available
            </div>

            <div>
              <span className="legend-box selected-box"></span>
              Selected
            </div>

            <div>
              <span className="legend-box occupied-box"></span>
              Occupied
            </div>
          </div>

          {/* Airplane */}

          <div className="airplane">

            <div className="cockpit">
              ✈️
            </div>

            <div className="cabin">

              {rows.map((row) => (
                <div
                  className="seat-row"
                  key={row}
                >

                  <span className="row-number">
                    {row}
                  </span>

                  {seatLetters.map(
                    (letter, index) => {

                      const seatId =
                        `${row}${letter}`;

                      const status =
                        getSeatStatus(
                          seatId
                        );

                      return (
                        <div
                          key={seatId}
                          className="seat-wrapper"
                        >

                          <button
                            className={`seat ${status}`}
                            onClick={() =>
                              selectSeat(
                                seatId
                              )
                            }
                            disabled={
                              status ===
                              "occupied"
                            }
                          >
                            {letter}
                          </button>

                          {index === 2 && (
                            <span className="aisle"></span>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              ))}

            </div>
          </div>

        </div>

        {/* Actions */}

        <div className="seat-actions">

          <button
            className="btn btn-outline"
            onClick={() =>
              setSkipped(!skipped)
            }
          >
            {skipped
              ? "Select Seats"
              : "Skip Seat Selection"}
          </button>

          <button
            className="btn btn-outline"
            onClick={autoAssign}
          >
            Auto Assign
          </button>

          <button
            className="btn btn-primary"
            onClick={handleContinue}
          >
            Continue →
          </button>

        </div>

      </div>
    </div>
  );
}

export default SeatSelection;