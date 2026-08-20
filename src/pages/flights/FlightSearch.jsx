import { useState } from "react";
import { useNavigate } from "react-router-dom";

import airports from "../../data/airports";
import { useFlightBooking } from "../../context/FlightBookingContext";

import "./FlightSearch.css";

function FlightSearch() {

  const navigate = useNavigate();

  const { state, dispatch } =
    useFlightBooking();


  // ============================
  // Trip Type
  // ============================

  const [tripType, setTripType] = useState(
    state.search.tripType
  );


  // ============================
  // Airport Search
  // ============================

  const [originText, setOriginText] =
    useState("");

  const [destinationText, setDestinationText] =
    useState("");

  const [origin, setOrigin] = useState(
    state.search.origin
  );

  const [destination, setDestination] =
    useState(
      state.search.destination
    );


  // ============================
  // Dates
  // ============================

  const [departDate, setDepartDate] =
    useState(
      state.search.departDate
    );

  const [returnDate, setReturnDate] =
    useState(
      state.search.returnDate
    );


  // ============================
  // Passengers
  // ============================

  const [adults, setAdults] =
    useState(state.search.adults);

  const [children, setChildren] =
    useState(state.search.children);

  const [infants, setInfants] =
    useState(state.search.infants);


  // ============================
  // Cabin
  // ============================

  const [cabin, setCabin] =
    useState(state.search.cabin);


  const [error, setError] =
    useState("");


  // ============================
  // Airport Filtering
  // ============================

  const originResults =
    airports.filter((airport) =>
      airport.city
        .toLowerCase()
        .includes(
          originText.toLowerCase()
        )
    );


  const destinationResults =
    airports.filter((airport) =>
      airport.city
        .toLowerCase()
        .includes(
          destinationText.toLowerCase()
        )
    );


  // ============================
  // Search
  // ============================

  function handleSearch() {

    setError("");


    if (!origin) {

      setError(
        "Please select your departure airport."
      );

      return;
    }


    if (!destination) {

      setError(
        "Please select your destination airport."
      );

      return;
    }


    if (
      origin.code === destination.code
    ) {

      setError(
        "Departure and destination airports cannot be the same."
      );

      return;
    }


    if (!departDate) {

      setError(
        "Please select a departure date."
      );

      return;
    }


    if (
      tripType === "round-trip" &&
      !returnDate
    ) {

      setError(
        "Please select a return date."
      );

      return;
    }


    if (
      tripType === "round-trip" &&
      returnDate <= departDate
    ) {

      setError(
        "Return date must be after departure date."
      );

      return;
    }


    // Save to global state

    dispatch({

      type: "SET_SEARCH",

      payload: {

        tripType,

        origin,

        destination,

        departDate,

        returnDate:
          tripType === "one-way"
            ? ""
            : returnDate,

        adults,

        children,

        infants,

        cabin

      }

    });


    navigate("/flights/results");
  }


  return (

    <div className="flight-search-page">

      <div className="flight-search-container">


    {/* ============================
    FLIGHT BANNER
    ============================ */}

<div className="flight-banner">

  <div className="flight-banner-overlay">

    <div className="flight-banner-content">

      <span className="flight-banner-eyebrow">
        ✈ FLIGHT BOOKING
      </span>

      <h1>
        Where will you go next?
      </h1>

      <p>
        Discover amazing destinations, compare flights,
        and start your next adventure.
      </p>

      <div className="flight-banner-stats">

        <div className="banner-stat">
          <strong>500+</strong>
          <span>Destinations</span>
        </div>

        <div className="banner-stat">
          <strong>100+</strong>
          <span>Airlines</span>
        </div>

        <div className="banner-stat">
          <strong>24/7</strong>
          <span>Travel Support</span>
        </div>

      </div>

    </div>

  </div>

</div>

        {/* ============================
            SEARCH CARD
            ============================ */}

        <div className="flight-search-card">


          {/* ============================
              TRIP TYPE
              ============================ */}

          <div className="trip-type">

            <button
              type="button"
              className={
                tripType === "round-trip"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTripType("round-trip")
              }
            >
              ↔ Round Trip
            </button>


            <button
              type="button"
              className={
                tripType === "one-way"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTripType("one-way")
              }
            >
              → One Way
            </button>

          </div>


          {/* ============================
              MAIN SEARCH FIELDS
              ============================ */}

          <div className="search-fields">


            {/* FROM */}

            <div className="form-group airport-box">

              <label>
                From
              </label>

              <div className="location-field">

                <input
                  type="text"
                  placeholder="City or airport"
                  value={
                    origin
                      ? `${origin.city} (${origin.code})`
                      : originText
                  }
                  onChange={(e) => {

                    setOriginText(
                      e.target.value
                    );

                    setOrigin(null);

                  }}
                />

                {origin && (
                  <span className="location-code">
                    {origin.code}
                  </span>
                )}

              </div>


              {/* Suggestions */}

              {originText &&
                !origin && (

                  <div className="airport-results">

                    {originResults.length > 0 ? (

                      originResults.map(
                        (airport) => (

                          <div
                            key={airport.id}
                            className="airport-option"
                            onClick={() => {

                              setOrigin(
                                airport
                              );

                              setOriginText(
                                ""
                              );

                            }}
                          >

                            <strong>
                              {airport.city}
                            </strong>

                            <span>
                              {airport.code}
                              {" · "}
                              {airport.name}
                            </span>

                          </div>

                        )
                      )

                    ) : (

                      <div className="airport-no-results">
                        No airports found
                      </div>

                    )}

                  </div>

                )}

            </div>


            {/* TO */}

            <div className="form-group airport-box">

              <label>
                To
              </label>

              <div className="location-field">

                <input
                  type="text"
                  placeholder="City or airport"
                  value={
                    destination
                      ? `${destination.city} (${destination.code})`
                      : destinationText
                  }
                  onChange={(e) => {

                    setDestinationText(
                      e.target.value
                    );

                    setDestination(null);

                  }}
                />

                {destination && (
                  <span className="location-code">
                    {destination.code}
                  </span>
                )}

              </div>


              {/* Suggestions */}

              {destinationText &&
                !destination && (

                  <div className="airport-results">

                    {destinationResults.length > 0 ? (

                      destinationResults.map(
                        (airport) => (

                          <div
                            key={airport.id}
                            className="airport-option"
                            onClick={() => {

                              setDestination(
                                airport
                              );

                              setDestinationText(
                                ""
                              );

                            }}
                          >

                            <strong>
                              {airport.city}
                            </strong>

                            <span>
                              {airport.code}
                              {" · "}
                              {airport.name}
                            </span>

                          </div>

                        )
                      )

                    ) : (

                      <div className="airport-no-results">
                        No airports found
                      </div>

                    )}

                  </div>

                )}

            </div>


            {/* DEPARTURE */}

            <div className="form-group">

              <label>
                Departure
              </label>

              <input
                type="date"
                value={departDate}
                onChange={(e) =>
                  setDepartDate(
                    e.target.value
                  )
                }
              />

            </div>


            {/* RETURN */}

            <div className="form-group">

              <label>
                Return
              </label>

              <input
                type="date"
                disabled={
                  tripType === "one-way"
                }
                value={
                  tripType === "one-way"
                    ? ""
                    : returnDate
                }
                onChange={(e) =>
                  setReturnDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* ============================
              OPTIONS
              ============================ */}

          <div className="search-options">


            {/* CABIN */}

            <div className="form-group">

              <label>
                Cabin Class
              </label>

              <select
                value={cabin}
                onChange={(e) =>
                  setCabin(
                    e.target.value
                  )
                }
              >

                <option>
                  Economy
                </option>

                <option>
                  Premium Economy
                </option>

                <option>
                  Business
                </option>

                <option>
                  First Class
                </option>

              </select>

            </div>


            {/* ADULTS */}

            <div className="form-group">

              <label>
                Adults
              </label>

              <select
                value={adults}
                onChange={(e) =>
                  setAdults(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                <option value="1">
                  1 Adult
                </option>

                <option value="2">
                  2 Adults
                </option>

                <option value="3">
                  3 Adults
                </option>

                <option value="4">
                  4 Adults
                </option>

                <option value="5">
                  5 Adults
                </option>

                <option value="6">
                  6 Adults
                </option>

                <option value="7">
                  7 Adults
                </option>

                <option value="8">
                  8 Adults
                </option>

                <option value="9">
                  9 Adults
                </option>

              </select>

            </div>


            {/* CHILDREN */}

            <div className="form-group">

              <label>
                Children
              </label>

              <select
                value={children}
                onChange={(e) =>
                  setChildren(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                <option value="0">
                  0 Children
                </option>

                <option value="1">
                  1 Child
                </option>

                <option value="2">
                  2 Children
                </option>

                <option value="3">
                  3 Children
                </option>

              </select>

            </div>


            {/* INFANTS */}

            <div className="form-group">

              <label>
                Infants
              </label>

              <select
                value={infants}
                onChange={(e) =>
                  setInfants(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                <option value="0">
                  0 Infants
                </option>

                <option value="1">
                  1 Infant
                </option>

                <option value="2">
                  2 Infants
                </option>

              </select>

            </div>

          </div>


          {/* ============================
              ERROR
              ============================ */}

          {error && (

            <div className="flight-search-error">

              ⚠ {error}

            </div>

          )}


          {/* ============================
              SEARCH BUTTON
              ============================ */}

          <div className="search-action">

            <button
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Search Flights →
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default FlightSearch;