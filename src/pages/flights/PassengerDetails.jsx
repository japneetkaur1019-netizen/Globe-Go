import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFlightBooking } from "../../context/FlightBookingContext";

import "./PassengerDetails.css";

function PassengerDetails() {

  const navigate = useNavigate();

  const { state, dispatch } = useFlightBooking();

  const {
    search,
    selectedFlight
  } = state;

  // If no flight was selected
  if (!selectedFlight) {
    return (
      <div className="passenger-page">
        <div className="passenger-container">
          <div className="passenger-empty card">

            <h2>No flight selected</h2>

            <p>
              Please select a flight before
              entering passenger details.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate("/flights")
              }
            >
              Search Flights
            </button>

          </div>
        </div>
      </div>
    );
  }


  /*
    Create passenger objects based
    on number of adults, children
    and infants.
  */

  const createPassengers = () => {

    const passengers = [];

    for (let i = 0; i < search.adults; i++) {

      passengers.push({
        id: `adult-${i + 1}`,
        type: "Adult",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        nationality: ""
      });

    }

    for (let i = 0; i < search.children; i++) {

      passengers.push({
        id: `child-${i + 1}`,
        type: "Child",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        nationality: ""
      });

    }

    for (let i = 0; i < search.infants; i++) {

      passengers.push({
        id: `infant-${i + 1}`,
        type: "Infant",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        nationality: ""
      });

    }

    return passengers;
  };


  const [passengers, setPassengers] =
    useState(createPassengers);

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [error, setError] =
    useState("");


  /*
    Update passenger information
  */

  function handlePassengerChange(
    id,
    field,
    value
  ) {

    setPassengers((currentPassengers) =>
      currentPassengers.map((passenger) =>
        passenger.id === id
          ? {
              ...passenger,
              [field]: value
            }
          : passenger
      )
    );

  }


  /*
    Validate the form
  */

  function validateForm() {

    if (!email) {
      setError(
        "Please enter your email address."
      );

      return false;
    }

    if (!email.includes("@")) {
      setError(
        "Please enter a valid email address."
      );

      return false;
    }

    if (!phone) {
      setError(
        "Please enter your phone number."
      );

      return false;
    }

    for (const passenger of passengers) {

      if (!passenger.firstName) {
        setError(
          `Please enter first name for ${passenger.type}.`
        );

        return false;
      }

      if (!passenger.lastName) {
        setError(
          `Please enter last name for ${passenger.type}.`
        );

        return false;
      }

      if (!passenger.dob) {
        setError(
          `Please enter date of birth for ${passenger.type}.`
        );

        return false;
      }

      if (!passenger.gender) {
        setError(
          `Please select gender for ${passenger.type}.`
        );

        return false;
      }

      if (!passenger.nationality) {
        setError(
          `Please enter nationality for ${passenger.type}.`
        );

        return false;
      }

    }

    return true;
  }


  /*
    Continue to next step
  */

  function handleContinue() {

    setError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    dispatch({
      type: "SET_PASSENGERS",
      payload: passengers
    });

    navigate("/flights/seats");

  }


  return (

    <div className="passenger-page">

      <div className="passenger-container">

        {/* Heading */}

        <div className="passenger-header">

          <p className="flight-label">
            PASSENGER DETAILS
          </p>

          <h1>
            Who's travelling?
          </h1>

          <p>
            Enter the details of everyone
            travelling on this flight.
          </p>

        </div>


        {/* Flight summary */}

        <div className="flight-summary card">

          <div>

            <strong>
              {search.origin.city}
              {" → "}
              {search.destination.city}
            </strong>

            <span>
              {search.departDate}
            </span>

          </div>

          <div>

            <strong>
              {selectedFlight.airline}
            </strong>

            <span>
              {selectedFlight.flightNumber}
            </span>

          </div>

          <div>

            <strong>
              ₹
              {selectedFlight.price.toLocaleString(
                "en-IN"
              )}
            </strong>

            <span>
              per passenger
            </span>

          </div>

        </div>


        {/* Contact Details */}

        <div className="passenger-section card">

          <h2>
            Contact Information
          </h2>

          <p className="section-description">
            Your booking confirmation will
            be sent to these details.
          </p>

          <div className="contact-grid">

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

            </div>

          </div>

        </div>


        {/* Passenger Forms */}

        {passengers.map(
          (passenger, index) => (

            <div
              className="passenger-section card"
              key={passenger.id}
            >

              <div className="passenger-title">

                <div>

                  <h2>
                    Passenger {index + 1}
                  </h2>

                  <span>
                    {passenger.type}
                  </span>

                </div>

              </div>


              <div className="passenger-grid">

                {/* First Name */}

                <div className="form-group">

                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="First name"
                    value={
                      passenger.firstName
                    }
                    onChange={(e) =>
                      handlePassengerChange(
                        passenger.id,
                        "firstName",
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* Last Name */}

                <div className="form-group">

                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Last name"
                    value={
                      passenger.lastName
                    }
                    onChange={(e) =>
                      handlePassengerChange(
                        passenger.id,
                        "lastName",
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* DOB */}

                <div className="form-group">

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    value={
                      passenger.dob
                    }
                    onChange={(e) =>
                      handlePassengerChange(
                        passenger.id,
                        "dob",
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* Gender */}

                <div className="form-group">

                  <label>
                    Gender
                  </label>

                  <select
                    value={
                      passenger.gender
                    }
                    onChange={(e) =>
                      handlePassengerChange(
                        passenger.id,
                        "gender",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select gender
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


                {/* Nationality */}

                <div className="form-group">

                  <label>
                    Nationality
                  </label>

                  <input
                    type="text"
                    placeholder="Indian"
                    value={
                      passenger.nationality
                    }
                    onChange={(e) =>
                      handlePassengerChange(
                        passenger.id,
                        "nationality",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </div>

          )
        )}


        {/* Error */}

        {error && (

          <div className="passenger-error">
            {error}
          </div>

        )}


        {/* Continue */}

        <div className="passenger-actions">

          <button
            className="btn btn-outline"
            onClick={() =>
              navigate("/flights/results")
            }
          >
            ← Back
          </button>

          <button
            className="btn btn-primary"
            onClick={handleContinue}
          >
            Continue to Seat Selection →
          </button>

        </div>

      </div>

    </div>

  );
}

export default PassengerDetails;