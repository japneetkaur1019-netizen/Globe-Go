// PassengerDetails component for collecting passenger information
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserRound, Trash2 } from "lucide-react";
import { useFlightBooking } from "../../context/FlightBookingContext";
import "./PassengerDetails.css";

const createPassenger = () => ({ id: crypto.randomUUID(), firstName: "", lastName: "", age: "", gender: "" });

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightBooking();
  const [passengers, setPassengers] = useState(() => state.passengers.length ? state.passengers : [createPassenger()]);
  const [errors, setErrors] = useState({});

  const updatePassenger = (index, field, value) => {
    setPassengers((current) => current.map((passenger, i) => i === index ? { ...passenger, [field]: value } : passenger));
    setErrors((current) => ({ ...current, [`${index}-${field}`]: "" }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    passengers.forEach((passenger, index) => {
      if (!passenger.firstName.trim()) nextErrors[`${index}-firstName`] = "First name is required.";
      if (!passenger.lastName.trim()) nextErrors[`${index}-lastName`] = "Last name is required.";
      const age = Number(passenger.age);
      if (!passenger.age || age < 1 || age > 120) nextErrors[`${index}-age`] = "Enter an age from 1 to 120.";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    dispatch({ type: "SET_PASSENGERS", payload: passengers });
    navigate("/flights/seats");
  };

  return (
    <div className="passenger-page">
      <div className="passenger-container">
        <header className="passenger-header">
          <span className="flight-label">Passenger information</span>
          <h1>Who’s traveling?</h1>
          <p>Add each traveler’s details as they appear on their government ID.</p>
        </header>
        <form onSubmit={submit}>
          <section className="passenger-section">
            <h2>Traveler details</h2>
            <p className="section-description">We need these details to prepare your booking.</p>
            {passengers.map((passenger, index) => (
              <div className="passenger-form-card" key={passenger.id}>
                <div className="passenger-card-header">
                  <div className="passenger-card-title"><UserRound size={20} /><h4>Passenger {index + 1}</h4></div>
                  {passengers.length > 1 && <button className="btn-secondary" type="button" onClick={() => setPassengers((current) => current.filter((_, i) => i !== index))}><Trash2 size={15} /> Remove</button>}
                </div>
                <div className="passenger-grid">
                  {[['firstName', 'First name'], ['lastName', 'Last name'], ['age', 'Age']].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label htmlFor={`${passenger.id}-${field}`}>{label}</label>
                      <input id={`${passenger.id}-${field}`} type={field === 'age' ? 'number' : 'text'} min={field === 'age' ? 1 : undefined} max={field === 'age' ? 120 : undefined} autoComplete={field === 'firstName' ? 'given-name' : field === 'lastName' ? 'family-name' : 'off'} value={passenger[field] || ''} onChange={(event) => updatePassenger(index, field, event.target.value)} aria-invalid={Boolean(errors[`${index}-${field}`])} />
                      {errors[`${index}-${field}`] && <span className="field-error" role="alert">{errors[`${index}-${field}`]}</span>}
                    </div>
                  ))}
                  <div className="form-group">
                    <label htmlFor={`${passenger.id}-gender`}>Gender</label>
                    <select id={`${passenger.id}-gender`} value={passenger.gender || ''} onChange={(event) => updatePassenger(index, 'gender', event.target.value)}>
                      <option value="">Select</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <div className="passenger-actions">
              <button className="btn-secondary" type="button" onClick={() => setPassengers((current) => [...current, createPassenger()])}>+ Add passenger</button>
              <button className="btn-primary" type="submit">Continue to seats <ArrowRight size={16} /></button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
