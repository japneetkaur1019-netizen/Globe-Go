import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Plane,
  Calendar,
  Users,
  Printer,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck,
  CreditCard,
  Luggage,
  MapPin,
  Clock
} from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import { useApp } from "../../context/AppContext";
import "./BookingConfirmation.css";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { state } = useFlightBooking();
  const { saveTrip, showToast } = useApp();

  const {
    search,
    selectedFlight,
    passengers,
    seats
  } = state;

  // Generate a demo booking reference
  const bookingReference = useMemo(() => {
    return (
      "GG-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );
  }, []);

  // Safety check
  if (!selectedFlight || !search?.origin || !search?.destination) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-empty card">
            <div className="empty-icon-wrap">
              <Plane size={48} className="text-muted" />
            </div>
            <h2>No Active Booking Found</h2>
            <p>
              Your booking information is not available or the session has expired.
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

  const passengerList = passengers && passengers.length > 0
    ? passengers
    : [{ id: 1, firstName: "Lead", lastName: "Passenger", type: "Adult" }];

  const passengerCount = passengerList.length;

  const seatCount = seats ? Object.keys(seats).length : 0;
  const baseFare = selectedFlight.price * passengerCount;
  const seatFee = seatCount * 250;
  const taxes = Math.round(baseFare * 0.12);
  const total = baseFare + seatFee + taxes;

  const handleSaveToDashboard = () => {
    saveTrip({
      destination: search.destination.city,
      country: search.destination.country,
      origin: search.origin.city,
      days: 5,
      budget: total,
      airline: selectedFlight.airline,
      flightNumber: selectedFlight.flightNumber,
      departDate: search.departDate || new Date().toISOString().split("T")[0],
      type: "flight_booking",
      bookingRef: bookingReference,
    });
    showToast("Trip Saved to Dashboard", `Flight to ${search.destination.city} added.`, "BookmarkCheck");
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">

        {/* Success Header */}
        <div className="confirmation-success">
          <div className="success-icon-badge">
            <CheckCircle size={42} strokeWidth={2.2} />
          </div>
          <p className="flight-badge-label">
            BOOKING CONFIRMED &amp; ISSUED
          </p>
          <h1>Your flight is confirmed!</h1>
          <p className="success-subtext">
            We've sent your e-ticket receipt and confirmation to your registered email.
          </p>
        </div>

        {/* Quick Booking Ref Banner */}
        <div className="booking-reference-card">
          <div className="ref-left">
            <span className="ref-label">Booking Reference (PNR)</span>
            <strong className="ref-code">{bookingReference}</strong>
          </div>
          <div className="ref-right">
            <span className="ref-status">
              <ShieldCheck size={16} /> Verified &amp; Confirmed
            </span>
          </div>
        </div>

        {/* Boarding Pass Style Card */}
        <div className="boarding-pass-card">
          <div className="boarding-pass-header">
            <div className="airline-info">
              <div className="airline-badge">{selectedFlight.airline.slice(0, 2).toUpperCase()}</div>
              <div>
                <h3>{selectedFlight.airline}</h3>
                <span className="flight-num-badge">Flight {selectedFlight.flightNumber} · {search.cabin || "Economy"}</span>
              </div>
            </div>
            <div className="ticket-class-badge">
              <span>BOARDING PASS</span>
            </div>
          </div>

          <div className="boarding-route-grid">
            <div className="route-node">
              <span className="node-city">{search.origin.city}</span>
              <span className="node-code">{search.origin.code}</span>
              <span className="node-time"><Clock size={14} /> {selectedFlight.departure}</span>
            </div>

            <div className="route-connector">
              <span className="duration-pill">{selectedFlight.duration}</span>
              <div className="flight-line">
                <span className="dot start"></span>
                <div className="line"></div>
                <Plane size={18} className="plane-icon" />
                <div className="line"></div>
                <span className="dot end"></span>
              </div>
              <span className="stops-label">
                {selectedFlight.stops === 0 ? "Non-stop" : `${selectedFlight.stops} Stop`}
              </span>
            </div>

            <div className="route-node text-right">
              <span className="node-city">{search.destination.city}</span>
              <span className="node-code">{search.destination.code}</span>
              <span className="node-time"><Clock size={14} /> {selectedFlight.arrival}</span>
            </div>
          </div>

          <div className="boarding-meta-grid">
            <div className="meta-box">
              <span className="meta-label"><Calendar size={14} /> Travel Date</span>
              <strong className="meta-val">{search.departDate || "Upcoming Date"}</strong>
            </div>
            <div className="meta-box">
              <span className="meta-label"><Luggage size={14} /> Baggage Included</span>
              <strong className="meta-val">15 kg Check-in + 7 kg Cabin</strong>
            </div>
            <div className="meta-box">
              <span className="meta-label"><MapPin size={14} /> Departure Terminal</span>
              <strong className="meta-val">Terminal 3, Gate 14B</strong>
            </div>
          </div>

          {/* Passenger & Seat details */}
          <div className="boarding-passengers-section">
            <h4><Users size={16} /> Passengers &amp; Seat Assignments</h4>
            <div className="passengers-ticket-list">
              {passengerList.map((p, idx) => {
                const assignedSeat = seats?.[p.id] || `Seat ${idx + 1}A (Auto)`;
                return (
                  <div className="passenger-ticket-row" key={p.id || idx}>
                    <div className="passenger-name-wrap">
                      <span className="passenger-idx">{idx + 1}</span>
                      <div>
                        <strong>{p.title || ""} {p.firstName || "Passenger"} {p.lastName || ""}</strong>
                        <span className="passenger-tag">{p.type || "Adult"}</span>
                      </div>
                    </div>
                    <div className="passenger-seat-badge">
                      <span className="seat-label">Seat</span>
                      <span className="seat-code">{assignedSeat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barcode / Stub section */}
          <div className="boarding-stub-footer">
            <div className="stub-info">
              <span>Electronic Ticket Passenger Coupon</span>
              <code>{bookingReference}-ETKT-2026-GG</code>
            </div>
            <div className="barcode-mock">
              <div className="barcode-lines"></div>
            </div>
          </div>
        </div>

        {/* Fare & Payment Breakdown */}
        <div className="fare-receipt-card card">
          <h3><CreditCard size={18} /> Payment Receipt</h3>
          <div className="receipt-items">
            <div className="receipt-row">
              <span>Base Fare ({passengerCount} × ₹{selectedFlight.price.toLocaleString("en-IN")})</span>
              <strong>₹{baseFare.toLocaleString("en-IN")}</strong>
            </div>
            {seatFee > 0 && (
              <div className="receipt-row">
                <span>Seat Selection ({seatCount} seats)</span>
                <strong>₹{seatFee.toLocaleString("en-IN")}</strong>
              </div>
            )}
            <div className="receipt-row">
              <span>Taxes, GST &amp; Airport Security Fees</span>
              <strong>₹{taxes.toLocaleString("en-IN")}</strong>
            </div>
            <div className="receipt-divider"></div>
            <div className="receipt-row total-row">
              <span>Total Paid</span>
              <strong className="total-amount">₹{total.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Ticket / Save PDF
          </button>

          <button
            type="button"
            className="btn btn-secondary-save"
            onClick={handleSaveToDashboard}
          >
            <BookmarkCheck size={16} /> Save to Dashboard
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Explore More Trips <ArrowRight size={16} />
          </button>
        </div>

        <p className="confirmation-note">
          Need support or trip modifications? Contact 24/7 Member Care at support@globego.travel.
        </p>

      </div>
    </div>
  );
}
