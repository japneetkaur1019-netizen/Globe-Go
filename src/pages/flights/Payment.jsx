import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Sparkles,
  Plane,
  Check,
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import { useFormValidation } from "../../hooks/useFormValidation";
import FieldError from "../../components/FieldError.jsx";
import "./Payment.css";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   VALIDATION RULE SETS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CARD_RULES = {
  cardName: (v) => {
    if (!v.trim()) return "Cardholder name is required.";
    if (v.trim().length < 3) return "Enter full name as on card.";
    return "";
  },
  cardNumber: (v) => {
    const digits = v.replace(/\s/g, "");
    if (!digits) return "Card number is required.";
    if (digits.length < 15) return "Enter a valid 15 or 16-digit card number.";
    return "";
  },
  expiry: (v) => {
    if (!v) return "Expiry date is required.";
    if (!v.includes("/") || v.length < 5) return "Enter expiry as MM/YY.";
    const [mm, yy] = v.split("/").map(Number);
    if (mm < 1 || mm > 12) return "Invalid month (01â€“12).";
    const now = new Date();
    const exp = new Date(2000 + yy, mm - 1);
    if (exp <= now) return "Card has expired.";
    return "";
  },
  cvv: (v) => {
    if (!v) return "CVV is required.";
    if (v.length < 3) return "Enter a 3 or 4-digit CVV.";
    return "";
  },
};

const UPI_RULES = {
  upiId: (v) => {
    if (!v.trim()) return "UPI ID is required.";
    if (!v.includes("@")) return "Enter a valid UPI ID (e.g. name@upi).";
    return "";
  },
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   HELPERS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const formatCardNum = (raw) =>
  raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const BANKS = ["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National"];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   COMPONENT
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function Payment() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const { search, selectedFlight, passengers, seats } = state;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing,    setProcessing]    = useState(false);

  /* â”€â”€ Card form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const card = useFormValidation(
    { cardName: "John Doe", cardNumber: "4532 8892 1045 7789", expiry: "12/28", cvv: "889" },
    CARD_RULES,
  );

  /* â”€â”€ UPI form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const upi = useFormValidation(
    { upiId: "traveler@okhdfcbank" },
    UPI_RULES,
  );

  /* â”€â”€ Guard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (!selectedFlight || !search?.origin || !search?.destination) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-empty card">
            <div className="empty-icon-wrap"><Plane size={44} /></div>
            <h2>No active flight booking found</h2>
            <p>Please search and select a flight before proceeding to checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate("/flights")}>Search Flights</button>
          </div>
        </div>
      </div>
    );
  }

  /* â”€â”€ Fare calculation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (selectedFlight.isLiveOffer) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-empty card">
            <div className="empty-icon-wrap"><Plane size={44} /></div>
            <h2>Live offer selected</h2>
            <p>This app can search Duffel offers, but its booking and payment integration is not configured. Your offer has not been booked and you will not be charged.</p>
            <button className="btn btn-primary" onClick={() => navigate("/flights/results")}>Back to flight results</button>
          </div>
        </div>
      </div>
    );
  }

  const passengerCount = passengers?.length || Math.max(1, search.adults + (search.children || 0));
  const isLiveOffer = Boolean(selectedFlight.isLiveOffer);
  const currency = selectedFlight.currency || "INR";
  const formatPrice = (amount) => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  const baseFare  = isLiveOffer ? selectedFlight.totalPrice : selectedFlight.price * passengerCount;
  const seatCount = seats ? Object.keys(seats).length : 0;
  const seatFee   = !isLiveOffer && currency === "INR" ? seatCount * 250 : 0;
  const taxes     = isLiveOffer ? 0 : Math.round(baseFare * 0.12);
  const total     = baseFare + seatFee + taxes;

  /* â”€â”€ Expiry mask â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const handleExpiryInput = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    // Fake a synthetic event shape for our hook
    card.setFieldValue("expiry", val);
  };

  /* â”€â”€ Demo autofill â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const autofillDemoPayment = () => {
    card.setFieldValue("cardName",   "Alex Henderson");
    card.setFieldValue("cardNumber", "4242 4242 4242 4242");
    card.setFieldValue("expiry",     "08/29");
    card.setFieldValue("cvv",        "314");
  };

  /* â”€â”€ Submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const handlePaymentSubmit = (e) => {
    if (e) e.preventDefault();

    let isValid = false;
    if (paymentMethod === "card")       isValid = card.validate();
    else if (paymentMethod === "upi")   isValid = upi.validate();
    else if (paymentMethod === "netbanking") isValid = true; // bank redirect

    if (!isValid) return;

    setProcessing(true);
    dispatch({
      type: "SET_PAYMENT",
      payload: { method: paymentMethod, cardName: card.values.cardName, totalAmount: total },
    });

    setTimeout(() => {
      setProcessing(false);
      navigate("/flights/confirmation");
    }, 1200);
  };

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     RENDER
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <div className="payment-page">
      <div className="payment-container">


        {/* Stepper */}
        <div className="flight-stepper-bar">
          {["Search", "Select Flight", "Passengers", "Seats"].map((label) => (
            <><div className="step-node completed"><span className="step-num"><Check size={14} /></span><span className="step-label">{label}</span></div><div className="step-line completed" /></>
          ))}
          <div className="step-node active"><span className="step-num">5</span><span className="step-label">Payment</span></div>
        </div>

        {/* Header */}
        <div className="payment-header-row">
          <div>
            <span className="flight-badge-label">PAYMENT PREVIEW</span>
            <h1>Demo checkout</h1>
            <p className="payment-subtext">Demo only — no payment is processed and no ticket is issued.</p>
          </div>
          <button type="button" className="btn btn-outline demo-fill-btn" onClick={autofillDemoPayment}>
            <Sparkles size={14} /> Fill Demo Test Card
          </button>
        </div>

        <div className="payment-main-grid">

          {/* â”€â”€ LEFT: Payment Method Forms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="payment-forms-pane">

            {/* Method Tabs */}
            <div className="payment-tabs-card card">
              <div className="payment-method-selector">
                {[
                  { id: "card",       icon: <CreditCard size={18} />, label: "Credit / Debit Card" },
                  { id: "upi",        icon: <QrCode size={18} />,     label: "UPI / QR" },
                  { id: "netbanking", icon: <Building2 size={18} />,  label: "Net Banking" },
                ].map(({ id, icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={`method-tab-btn${paymentMethod === id ? " active" : ""}`}
                    onClick={() => setPaymentMethod(id)}
                  >
                    {icon}<span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* â”€â”€ CARD FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {paymentMethod === "card" && (
              <form onSubmit={handlePaymentSubmit} className="payment-card-form card" noValidate>

                {/* Visual card preview */}
                <div className="credit-card-preview">
                  <div className="card-top-row">
                    <span className="card-brand">GlobeGo Member Pay</span>
                    <div className="card-chip-box" />
                  </div>
                  <div className="card-number-display">{card.values.cardNumber || "â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢"}</div>
                  <div className="card-bottom-row">
                    <div>
                      <span className="card-label">CARDHOLDER</span>
                      <strong>{card.values.cardName.toUpperCase() || "YOUR NAME"}</strong>
                    </div>
                    <div>
                      <span className="card-label">EXPIRES</span>
                      <strong>{card.values.expiry || "MM/YY"}</strong>
                    </div>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className={`form-group ${card.touched.cardName && card.errors.cardName ? "has-error" : ""}`}>
                  <label htmlFor="cardName">Cardholder Name <span className="req-star">*</span></label>
                  <input
                    id="cardName"
                    name="cardName"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={card.values.cardName}
                    onChange={card.handleChange}
                    onBlur={card.handleBlur}
                    aria-invalid={!!card.errors.cardName}
                  />
                  <FieldError message={card.touched.cardName ? card.errors.cardName : ""} />
                </div>

                {/* Card Number */}
                <div className={`form-group ${card.touched.cardNumber && card.errors.cardNumber ? "has-error" : ""}`}>
                  <label htmlFor="cardNumber">Card Number <span className="req-star">*</span></label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={card.values.cardNumber}
                    onChange={(e) => card.setFieldValue("cardNumber", formatCardNum(e.target.value))}
                    onBlur={card.handleBlur}
                    maxLength={19}
                    aria-invalid={!!card.errors.cardNumber}
                  />
                  <FieldError message={card.touched.cardNumber ? card.errors.cardNumber : ""} />
                </div>

                <div className="form-two-col">
                  {/* Expiry */}
                  <div className={`form-group ${card.touched.expiry && card.errors.expiry ? "has-error" : ""}`}>
                    <label htmlFor="expiry">Expiry Date <span className="req-star">*</span></label>
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={card.values.expiry}
                      onChange={handleExpiryInput}
                      onBlur={card.handleBlur}
                      maxLength={5}
                      aria-invalid={!!card.errors.expiry}
                    />
                    <FieldError message={card.touched.expiry ? card.errors.expiry : ""} />
                  </div>

                  {/* CVV */}
                  <div className={`form-group ${card.touched.cvv && card.errors.cvv ? "has-error" : ""}`}>
                    <label htmlFor="cvv">CVV / CVC <span className="req-star">*</span></label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="â€¢â€¢â€¢"
                      value={card.values.cvv}
                      onChange={(e) => card.setFieldValue("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      onBlur={card.handleBlur}
                      maxLength={4}
                      aria-invalid={!!card.errors.cvv}
                    />
                    <FieldError message={card.touched.cvv ? card.errors.cvv : ""} />
                  </div>
                </div>

                <div className="payment-actions-row">
                  <button type="button" className="btn btn-outline" onClick={() => navigate("/flights/seats")} disabled={processing}>
                    <ArrowLeft size={16} /> Back to Seats
                  </button>
                  <button type="submit" className="btn btn-primary pay-now-btn" disabled={processing}>
                    {processing
                      ? <span className="processing-spinner"><span className="spinner" /> Processing {formatPrice(total)}...</span>
                      : <><Lock size={16} /> Pay {formatPrice(total)}</>
                    }
                  </button>
                </div>
              </form>
            )}

            {/* â”€â”€ UPI FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {paymentMethod === "upi" && (
              <form onSubmit={handlePaymentSubmit} className="payment-card-form card" noValidate>
                <div className="upi-notice-box">
                  <QrCode size={32} color="var(--expedia-blue)" />
                  <div>
                    <h4>Instant UPI Payment</h4>
                    <p>Enter your VPA / UPI ID or scan QR from Google Pay, PhonePe, Paytm, or CRED.</p>
                  </div>
                </div>

                <div className={`form-group ${upi.touched.upiId && upi.errors.upiId ? "has-error" : ""}`} style={{ marginTop: 20 }}>
                  <label htmlFor="upiId">UPI ID / VPA <span className="req-star">*</span></label>
                  <input
                    id="upiId"
                    name="upiId"
                    type="text"
                    placeholder="e.g. username@okhdfcbank"
                    value={upi.values.upiId}
                    onChange={upi.handleChange}
                    onBlur={upi.handleBlur}
                    aria-invalid={!!upi.errors.upiId}
                  />
                  <FieldError message={upi.touched.upiId ? upi.errors.upiId : ""} />
                </div>

                <div className="payment-actions-row">
                  <button type="button" className="btn btn-outline" onClick={() => navigate("/flights/seats")} disabled={processing}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" className="btn btn-primary pay-now-btn" disabled={processing}>
                    {processing ? "Confirming UPI Request..." : `Verify & Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </form>
            )}

            {/* â”€â”€ NET BANKING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {paymentMethod === "netbanking" && (
              <form onSubmit={handlePaymentSubmit} className="payment-card-form card" noValidate>
                <div className="netbanking-grid">
                  {BANKS.map((b) => (
                    <button key={b} type="button" className="bank-pill-btn">
                      <Building2 size={16} /><span>{b}</span>
                    </button>
                  ))}
                </div>
                <div className="payment-actions-row" style={{ marginTop: 24 }}>
                  <button type="button" className="btn btn-outline" onClick={() => navigate("/flights/seats")} disabled={processing}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" className="btn btn-primary pay-now-btn" disabled={processing}>
                    {processing ? "Connecting Bank Gateway..." : `Proceed to Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* â”€â”€ RIGHT: Fare Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <aside className="payment-summary-col">
            <div className="fare-breakdown-card card">
              <div className="fare-header">
                <h3>Order Summary</h3>
                <span className="airline-tag">{selectedFlight.airline} Â· {selectedFlight.flightNumber}</span>
              </div>

              <div className="fare-flight-route">
                <div>
                  <strong>{selectedFlight.departure}</strong>
                  <span>{search.origin.city} ({search.origin.code})</span>
                </div>
                <div className="route-arrow-icon"><Plane size={15} /></div>
                <div className="text-right">
                  <strong>{selectedFlight.arrival}</strong>
                  <span>{search.destination.city} ({search.destination.code})</span>
                </div>
              </div>

              <div className="fare-divider" />

              <div className="fare-rows-list">
                <div className="fare-row">
                  <span>{isLiveOffer ? "Duffel offer total (includes taxes)" : `Base Fare (${passengerCount} travelers)`}</span>
                  <strong>{formatPrice(baseFare)}</strong>
                </div>
                {seatFee > 0 && (
                  <div className="fare-row">
                    <span>Assigned Seats ({seatCount} seats)</span>
                    <strong>{formatPrice(seatFee)}</strong>
                  </div>
                )}
                {!isLiveOffer && <div className="fare-row">
                  <span>Airport Taxes &amp; GST</span>
                  <strong>{formatPrice(taxes)}</strong>
                </div>}
                <div className="fare-divider" />
                <div className="fare-row total-fare-row">
                  <span>Total Amount Payable</span>
                  <strong className="total-val">{formatPrice(total)}</strong>
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
