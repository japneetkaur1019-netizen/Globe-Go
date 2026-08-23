import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useFlightBooking } from "../../context/FlightBookingContext";

import "./BookingConfirmation.css";

function Confirmation() {
  const navigate = useNavigate();

  const { state } = useFlightBooking();

  const {
    search,
    selectedFlight,
    passengers,
    seats
  } = state;


  // Generate a demo booking reference
  const bookingReference = useMemo(() => {

    return (
      "TRV" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );

  }, []);


  // Safety check
  if (!selectedFlight) {

    return (
      <div className="confirmation-page">

        <div className="confirmation-container">

          <div className="confirmation-empty card">

            <h2>
              No booking found
            </h2>

            <p>
              Your booking information
              is not available.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/flights")
              }
            >
              Book a Flight
            </button>

          </div>

        </div>

      </div>
    );
  }


  const passengerCount =
    passengers?.length ||
    search.adults +
      search.children +
      search.infants;


  const seatCount =
    seats
      ? Object.keys(seats).length
      : 0;


  const baseFare =
    selectedFlight.price *
    passengerCount;


  const seatFee =
    seatCount * 250;


  const taxes =
    Math.round(
      baseFare * 0.12
    );


  const total =
    baseFare +
    seatFee +
    taxes;


  return (

    <div className="confirmation-page">

      <div className="confirmation-container">


        {/* Success */}

        <div className="confirmation-success">

          <div className="success-icon">
            ✓
          </div>

          <p className="flight-label">
            BOOKING CONFIRMED
          </p>

          <h1>
            Your trip is booked! 🎉
          </h1>

          <p>
            Your flight booking has been
            successfully completed.
          </p>

        </div>


        {/* Booking Reference */}

        <div className="booking-reference card">

          <span>
            Booking Reference
          </span>

          <strong>
            {bookingReference}
          </strong>

          <small>
            Keep this reference for
            your journey.
          </small>

        </div>


        {/* Flight */}

        <div className="confirmation-card card">

          <div className="confirmation-title">

            <h2>
              ✈️ Flight Details
            </h2>

            <span className="confirmed-badge">
              Confirmed
            </span>

          </div>


          <div className="confirmation-flight">

            <div className="confirmation-location">

              <strong>
                {selectedFlight.departure}
              </strong>

              <span>
                {search.origin.city}
                {" ("}
                {search.origin.code}
                {")"}
              </span>

            </div>


            <div className="confirmation-route">

              <span>
                {selectedFlight.duration}
              </span>

              <div>
                ───── ✈ ─────
              </div>

              <small>
                {selectedFlight.stops === 0
                  ? "Non-stop"
                  : `${selectedFlight.stops} stop`}
              </small>

            </div>


            <div className="confirmation-location">

              <strong>
                {selectedFlight.arrival}
              </strong>

              <span>
                {search.destination.city}
                {" ("}
                {search.destination.code}
                {")"}
              </span>

            </div>

          </div>


          <div className="confirmation-meta">

            <div>
              <span>Airline</span>

              <strong>
                {selectedFlight.airline}
              </strong>
            </div>


            <div>
              <span>Flight</span>

              <strong>
                {selectedFlight.flightNumber}
              </strong>
            </div>


            <div>
              <span>Date</span>

              <strong>
                {search.departDate}
              </strong>
            </div>


            <div>
              <span>Cabin</span>

              <strong>
                {search.cabin}
              </strong>
            </div>

          </div>

        </div>


        {/* Passengers */}

        <div className="confirmation-card card">

          <div className="confirmation-title">

            <h2>
              👤 Passengers
            </h2>

            <span>
              {passengerCount} passenger
              {passengerCount > 1
                ? "s"
                : ""}
            </span>

          </div>


          <div className="confirmed-passengers">

            {passengers?.map(
              (passenger, index) => (

                <div
                  className="confirmed-passenger"
                  key={passenger.id}
                >

                  <div className="confirmed-number">
                    {index + 1}
                  </div>

                  <div>

                    <strong>
                      {passenger.firstName}{" "}
                      {passenger.lastName}
                    </strong>

                    <span>
                      {passenger.type}
                    </span>

                  </div>


                  {seats?.[passenger.id] && (

                    <div className="confirmed-seat">

                      💺{" "}
                      {seats[
                        passenger.id
                      ]}

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        </div>


        {/* Price */}

        <div className="confirmation-card card">

          <div className="confirmation-title">

            <h2>
              💰 Payment Summary
            </h2>

            <span className="paid-badge">
              PAID
            </span>

          </div>


          <div className="confirmation-price">

            <div>
              <span>
                Flight fare
              </span>

              <strong>
                ₹
                {baseFare.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>


            <div>
              <span>
                Seat selection
              </span>

              <strong>
                ₹
                {seatFee.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>


            <div>
              <span>
                Taxes & fees
              </span>

              <strong>
                ₹
                {taxes.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>


          <div className="confirmation-total">

            <span>
              Total Paid
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>


        {/* Actions */}

        <div className="confirmation-actions">

          <button
            className="btn btn-outline"
            onClick={() =>
              window.print()
            }
          >
            🖨 Print Booking
          </button>


          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/")
            }
          >
            Back to Explore →
          </button>

        </div>


        <p className="confirmation-note">
          A confirmation of your booking
          would normally be sent to your
          registered email address.
        </p>

      </div>

    </div>
  );
}

export default Confirmation;