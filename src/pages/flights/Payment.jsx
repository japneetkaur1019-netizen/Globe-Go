import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Check,
  Sparkles,
  Plane,
  Luggage,
  Calendar
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { search, selectedFlight, passengers, seats } = state;

  const [paymentMethod, setPaymentMethod] = useState("card"); // card, upi, netbanking
  const [cardName, setCardName] = useState("John Doe");
  const [cardNumber, setCardNumber] = useState("4532 8892 1045 7789");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("889");
  const [upiId, setUpiId] = useState("traveler@okhdfcbank");

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!selectedFlight || !search?.origin || !search?.destination) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-empty card">
            <div className="empty-icon-wrap">
              <Plane size={44} />
            </div>
            <h2>No active flight booking found</h2>
            <p>Please search and select a flight before proceeding to checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate("/flights")}>
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const passengerCount = passengers?.length || Math.max(1, search.adults + (search.children || 0));
  const baseFare = selectedFlight.price * passengerCount;
  const seatCount = seats ? Object.keys(seats).length : 0;
  const seatFee = seatCount * 250;
  const taxes = Math.round(baseFare * 0.12);
  const total = baseFare + seatFee + taxes;

  const formatCardNum = (value) => {
    const raw = value.replace(/\D/g, "").slice(0, 16);
    return raw.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleExpiryInput = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const autofillDemoPayment = () => {
    setCardName("Alex Henderson");
    setCardNumber("4242 4242 4242 4242");
    setExpiry("08/29");
    setCvv("314");
    setError("");
  };

  const handlePaymentSubmit = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (paymentMethod === "card") {
      if (!cardName.trim()) {
        setError("Please enter the name on your card.");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 15) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }
      if (!expiry.includes("/") || expiry.length < 5) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cvv.length < 3) {
        setError("Please enter a valid 3-digit CVV / CVC.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.includes("@")) {
        setError("Please enter a valid Virtual Payment Address (e.g. name@upi).");
        return;
      }
    }

    setProcessing(true);

    dispatch({
      type: "SET_PAYMENT",
      payload: {
        method: paymentMethod,
        cardName,
        totalAmount: total,
      }
    });

    setTimeout(() => {
      setProcessing(false);
      navigate("/flights/confirmation");
    }, 1200);
  };

  return (
    <div className="payment-page">
      <div className="payment-container">

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
          <div className="step-line completed"></div>
          <div className="step-node completed">
            <span className="step-num"><Check size={14} /></span>
            <span className="step-label">Seats</span>
          </div>
          <div className="step-line active"></div>
          <div className="step-node active">
            <span className="step-num">5</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {/* Header */}
        <div className="payment-header-row">
          <div>
            <span className="flight-badge-label">FINAL CHECKOUT</span>
            <h1>Review &amp; Complete Payment</h1>
            <p className="payment-subtext">
              Secure 256-bit SSL encrypted transaction with instant e-ticket issuance.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline demo-fill-btn"
            onClick={autofillDemoPayment}
          >
            <Sparkles size={14} /> Fill Demo Test Card
          </button>
        </div>

        <div className="payment-main-grid">

          {/* Left: Payment Method Forms */}
          <div className="payment-forms-pane">

            {/* Method Tabs */}
            <div className="payment-tabs-card card">
              <div className="payment-method-selector">
                <button
                  type="button"
                  className={`method-tab-btn${paymentMethod === "card" ? " active" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard size={18} />
                  <span>Credit / Debit Card</span>
                </button>
                <button
                  type="button"
                  className={`method-tab-btn${paymentMethod === "upi" ? " active" : ""}`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <QrCode size={18} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  className={`method-tab-btn${paymentMethod === "netbanking" ? " active" : ""}`}
                  onClick={() => setPaymentMethod("netbanking")}
                >
                  <Building2 size={18} />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="payment-error-alert card">
                <span>{error}</span>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === "card" && (
              <form onSubmit={handlePaymentSubmit} className="payment-card-form card">
                {/* Visual Card Preview */}
                <div className="credit-card-preview">
                  <div className="card-top-row">
                    <span className="card-brand">GlobeGo Member Pay</span>
                    <div className="card-chip-box"></div>
                  </div>
                  <div className="card-number-display">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-bottom-row">
                    <div>
                      <span className="card-label">CARDHOLDER</span>
                      <strong>{cardName.toUpperCase() || "YOUR NAME"}</strong>
                    </div>
                    <div>
                      <span className="card-label">EXPIRES</span>
                      <strong>{expiry || "MM/YY"}</strong>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNum(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="form-two-col">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryInput}
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="payment-actions-row">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("/flights/seats")}
                    disabled={processing}
                  >
                    <ArrowLeft size={16} /> Back to Seats
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary pay-now-btn"
                    disabled={processing}
                  >
                    {processing ? (
                      <span className="processing-spinner">
                        <span className="spinner"></span> Processing ₹{total.toLocaleString("en-IN")}...
                      </span>
                    ) : (
                      <>
                        <Lock size={16} /> Pay ₹{total.toLocaleString("en-IN")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* UPI Form */}
            {paymentMethod === "upi" && (
              <form onSubmit={handlePaymentSubmit} className="payment-card-form card">
                <div className="upi-notice-box">
                  <QrCode size={32} color="var(--expedia-blue)" />
                  <div>
                    <h4>Instant UPI Payment</h4>
                    <p>Enter your VPA / UPI ID or scan QR from Google Pay, PhonePe, Paytm, or CRED.</p>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 20 }}>
                  <label>UPI ID / VPA</label>
                  <input
                    type="text"
                    placeholder="e.g. username@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>

                <div className="payment-actions-row">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("/flights/seats")}
                    disabled={processing}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary pay-now-btn"
                    disabled={processing}
                  >
                    {processing ? "Confirming UPI Request..." : `Verify & Pay ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </form>
            )}

            {/* Net Banking */}
            {paymentMethod === "netbanking" && (
              <form onSubmit={handlePaymentSubmit} className="payment-card-form card">
                <div className="netbanking-grid">
                  {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      className="bank-pill-btn"
                      onClick={() => {}}
                    >
                      <Building2 size={16} />
                      <span>{b}</span>
                    </button>
                  ))}
                </div>

                <div className="payment-actions-row" style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => navigate("/flights/seats")}
                    disabled={processing}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary pay-now-btn"
                    disabled={processing}
                  >
                    {processing ? "Connecting Bank Gateway..." : `Proceed to Pay ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Right: Booking Fare Summary */}
          <aside className="payment-summary-col">
            <div className="fare-breakdown-card card">
              <div className="fare-header">
                <h3>Order Summary</h3>
                <span className="airline-tag">{selectedFlight.airline} · {selectedFlight.flightNumber}</span>
              </div>

              <div className="fare-flight-route">
                <div>
                  <strong>{selectedFlight.departure}</strong>
                  <span>{search.origin.city} ({search.origin.code})</span>
                </div>
                <div className="route-arrow-icon">
                  <Plane size={15} />
                </div>
                <div className="text-right">
                  <strong>{selectedFlight.arrival}</strong>
                  <span>{search.destination.city} ({search.destination.code})</span>
                </div>
              </div>

              <div className="fare-divider"></div>

              <div className="fare-rows-list">
                <div className="fare-row">
                  <span>Base Fare ({passengerCount} × ₹{selectedFlight.price.toLocaleString("en-IN")})</span>
                  <strong>₹{baseFare.toLocaleString("en-IN")}</strong>
                </div>

                {seatFee > 0 && (
                  <div className="fare-row">
                    <span>Assigned Seats ({seatCount} seats)</span>
                    <strong>₹{seatFee.toLocaleString("en-IN")}</strong>
                  </div>
                )}

                <div className="fare-row">
                  <span>Airport Taxes &amp; GST</span>
                  <strong>₹{taxes.toLocaleString("en-IN")}</strong>
                </div>

                <div className="fare-divider"></div>

                <div className="fare-row total-fare-row">
                  <span>Total Amount Payable</span>
                  <strong className="total-val">₹{total.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="trust-secure-badge">
                <ShieldCheck size={18} color="#107c41" />
                <div>
                  <strong>100% Safe &amp; Secure</strong>
                  <p>All flight bookings are backed by GlobeGo Price Assurance.</p>
                </div>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}