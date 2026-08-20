import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFlightBooking } from "../../context/FlightBookingContext";

import "./Payment.css";

function Payment() {
  const navigate = useNavigate();

  const { state } = useFlightBooking();

  const {
    search,
    selectedFlight,
    passengers,
    seats
  } = state;

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Safety check
  if (!selectedFlight) {
    return (
      <div className="payment-page">
        <div className="payment-container">

          <div className="payment-empty card">

            <h2>No booking found</h2>

            <p>
              Please select a flight first.
            </p>

            <button
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

  const passengerCount =
    passengers?.length ||
    search.adults +
      search.children +
      search.infants;

  const baseFare =
    selectedFlight.price * passengerCount;

  const seatCount = seats
    ? Object.keys(seats).length
    : 0;

  const seatFee = seatCount * 250;

  const taxes = Math.round(
    baseFare * 0.12
  );

  const total =
    baseFare +
    seatFee +
    taxes;


  function formatCardNumber(value) {
    const numbers = value
      .replace(/\D/g, "")
      .slice(0, 16);

    return numbers.replace(
      /(.{4})/g,
      "$1 "
    ).trim();
  }


  function handleCardNumber(e) {
    setCardNumber(
      formatCardNumber(e.target.value)
    );
  }


  function handleExpiry(e) {
    let value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (value.length >= 3) {
      value =
        value.slice(0, 2) +
        "/" +
        value.slice(2);
    }

    setExpiry(value);
  }


  function handlePayment(e) {
    e.preventDefault();

    setError("");

    const cleanCard =
      cardNumber.replace(/\s/g, "");

    if (!cardName.trim()) {
      setError(
        "Please enter the cardholder name."
      );
      return;
    }

    if (cleanCard.length !== 16) {
      setError(
        "Card number must contain 16 digits."
      );
      return;
    }

if (expiry.length !== 5) {
  setError("Please enter a valid expiry date.");
  return;
}

const [month, year] = expiry.split("/");

const currentDate = new Date();
const currentYear = currentDate.getFullYear() % 100;
const currentMonth = currentDate.getMonth() + 1;

if (
  Number(month) < 1 ||
  Number(month) > 12 ||
  Number(year) < currentYear ||
  (Number(year) === currentYear &&
    Number(month) < currentMonth)
) {
  setError("Please enter a valid expiry date.");
  return;
}

    if (cvv.length !== 3) {
      setError(
        "CVV must contain 3 digits."
      );
      return;
    }

    setProcessing(true);

    // Demo payment processing
    setTimeout(() => {
      setProcessing(false);

      navigate("/flights/confirmation");
    }, 1500);
  }


  return (
    <div className="payment-page">

      <div className="payment-container">

        {/* Header */}

        <div className="payment-header">

          <p className="flight-label">
            SECURE CHECKOUT
          </p>

          <h1>
            Complete your payment
          </h1>

          <p>
            You're almost ready for your journey.
          </p>

        </div>


        <div className="payment-layout">

          {/* Payment Form */}

          <form
            className="payment-form card"
            onSubmit={handlePayment}
          >

            <div className="payment-title">

              <h2>
                💳 Payment Details
              </h2>

              <span>
                🔒 Secure
              </span>

            </div>


            <div className="form-group">

              <label>
                Cardholder Name
              </label>

              <input
                type="text"
                placeholder="Enter cardholder name"
                value={cardName}
                onChange={(e) =>
                  setCardName(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Card Number
              </label>

              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumber}
                inputMode="numeric"
              />

            </div>


            <div className="payment-row">

              <div className="form-group">

                <label>
                  Expiry Date
                </label>

                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiry}
                  inputMode="numeric"
                />

              </div>


              <div className="form-group">

                <label>
                  CVV
                </label>

                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  maxLength="3"
                  onChange={(e) =>
                    setCvv(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  inputMode="numeric"
                />

              </div>

            </div>


            {error && (
              <div className="payment-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="btn btn-primary payment-btn"
              disabled={processing}
            >
              {processing
                ? "Processing Payment..."
                : `Pay ₹${total.toLocaleString("en-IN")}`}
            </button>


            <p className="demo-note">
              This is a demo payment system.
              No real payment will be processed.
            </p>

          </form>


          {/* Order Summary */}

          <div className="payment-summary card">

            <h2>
              Booking Summary
            </h2>


            <div className="payment-flight">

              <div>

                <strong>
                  {search.origin.city}
                </strong>

                <span>
                  {selectedFlight.departure}
                </span>

              </div>

              <span className="payment-arrow">
                →
              </span>

              <div>

                <strong>
                  {search.destination.city}
                </strong>

                <span>
                  {selectedFlight.arrival}
                </span>

              </div>

            </div>


            <div className="summary-info">

              <div>
                <span>Airline</span>
                <strong>
                  {selectedFlight.airline}
                </strong>
              </div>

              <div>
                <span>Passengers</span>
                <strong>
                  {passengerCount}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {search.departDate}
                </strong>
              </div>

            </div>


            <div className="payment-divider"></div>


            <div className="payment-price">

              <div>
                <span>Flight fare</span>

                <strong>
                  ₹{baseFare.toLocaleString("en-IN")}
                </strong>
              </div>


              <div>
                <span>Seat selection</span>

                <strong>
                  ₹{seatFee.toLocaleString("en-IN")}
                </strong>
              </div>


              <div>
                <span>Taxes & fees</span>

                <strong>
                  ₹{taxes.toLocaleString("en-IN")}
                </strong>
              </div>

            </div>


            <div className="payment-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Payment;