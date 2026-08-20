import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import flights from "../../data/flights";
import { useFlightBooking } from "../../context/FlightBookingContext";

import "./FlightResults.css";

function FlightResults() {

  const navigate = useNavigate();

  const { state, dispatch } = useFlightBooking();

  const { search } = state;

  const [selectedAirlines, setSelectedAirlines] =
    useState([]);

  const [stops, setStops] = useState("all");

  const [sortBy, setSortBy] =
    useState("price");


  /* ============================
     AVAILABLE AIRLINES
     ============================ */

  const airlines = [
    ...new Set(
      flights
        .filter(
          (flight) =>
            flight.from === search.origin?.code &&
            flight.to === search.destination?.code
        )
        .map((flight) => flight.airline)
    )
  ];


  /* ============================
     FILTER + SORT
     ============================ */

  const filteredFlights = useMemo(() => {

    let result = flights.filter(
      (flight) =>
        flight.from === search.origin?.code &&
        flight.to === search.destination?.code
    );


    // Airline filter

    if (selectedAirlines.length > 0) {

      result = result.filter((flight) =>
        selectedAirlines.includes(
          flight.airline
        )
      );

    }


    // Stops filter

    if (stops !== "all") {

      result = result.filter(
        (flight) =>
          flight.stops === Number(stops)
      );

    }


    // Sorting

    if (sortBy === "price") {

      result.sort(
        (a, b) => a.price - b.price
      );

    }


    if (sortBy === "duration") {

      result.sort(
        (a, b) =>
          a.durationMinutes -
          b.durationMinutes
      );

    }


    if (sortBy === "departure") {

      result.sort(
        (a, b) =>
          a.departure.localeCompare(
            b.departure
          )
      );

    }


    return result;

  }, [
    search,
    selectedAirlines,
    stops,
    sortBy
  ]);


  /* ============================
     AIRLINE TOGGLE
     ============================ */

  function toggleAirline(airline) {

    if (
      selectedAirlines.includes(airline)
    ) {

      setSelectedAirlines(
        selectedAirlines.filter(
          (item) => item !== airline
        )
      );

    } else {

      setSelectedAirlines([
        ...selectedAirlines,
        airline
      ]);

    }

  }


  /* ============================
     SELECT FLIGHT
     ============================ */

  function selectFlight(flight) {

    dispatch({
      type: "SELECT_FLIGHT",
      payload: flight
    });

    navigate("/flights/passengers");

  }


  /* ============================
     NO SEARCH
     ============================ */

  if (
    !search.origin ||
    !search.destination
  ) {

    return (

      <div className="results-page">

        <div className="results-container">

          <div className="results-empty">

            <div className="results-empty-icon">
              ✈
            </div>

            <h2>
              No flight search found
            </h2>

            <p>
              Please search for a flight first.
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


  return (

    <div className="results-page">

      <div className="results-container">


        {/* ============================
            HEADER
            ============================ */}

        <div className="results-header">

          <button
            className="results-back"
            onClick={() =>
              navigate("/flights")
            }
          >
            ← Back to flight search
          </button>


          <h1>
            {search.origin.city}
            {" → "}
            {search.destination.city}
          </h1>


          <p className="results-subtitle">
            {search.departDate}
            {" • "}
            {search.adults} adult
            {search.adults > 1
              ? "s"
              : ""}
            {" • "}
            {search.cabin || "Economy"}
          </p>

        </div>
        {/* ============================
            RESULTS BANNER
            ============================ */}

        <div className="flight-results-banner">

          <div className="flight-results-banner-content">

            <span className="flight-results-banner-eyebrow">
              ✈ YOUR JOURNEY STARTS HERE
            </span>

            <h2>
              Find the flight that fits your journey
            </h2>

            <p>
              Compare prices, airlines, stops and travel
              times to choose the best flight for you.
            </p>

          </div>

          <div className="flight-results-banner-route">

            <span>
              {search.origin.code}
            </span>

            <strong>
              ✈
            </strong>

            <span>
              {search.destination.code}
            </span>

          </div>

        </div>

        {/* ============================
            SEARCH SUMMARY
            ============================ */}

        <div className="search-summary">

          <div className="route-summary">

            <div className="route-airport">

              <strong>
                {search.origin.code}
              </strong>

              <span>
                {search.origin.city}
              </span>

            </div>


            <span className="route-arrow">
              →
            </span>


            <div className="route-airport">

              <strong>
                {search.destination.code}
              </strong>

              <span>
                {search.destination.city}
              </span>

            </div>

          </div>


          <div className="search-info">

            <span>
              📅 {search.departDate}
            </span>

            <span>
              👤 {search.adults} passenger
              {search.adults > 1
                ? "s"
                : ""}
            </span>

            <span>
              💺 {search.cabin || "Economy"}
            </span>

          </div>


          <button
            className="btn btn-outline"
            onClick={() =>
              navigate("/flights")
            }
          >
            Modify Search
          </button>

        </div>


        {/* ============================
            MAIN CONTENT
            ============================ */}

        <div className="results-layout">


          {/* ============================
              FILTER SIDEBAR
              ============================ */}

          <aside className="filters-panel">

            <div className="filters-header">

              <h2>
                Filters
              </h2>

              <button
                className="clear-filters"
                onClick={() => {

                  setSelectedAirlines([]);
                  setStops("all");

                }}
              >
                Clear
              </button>

            </div>


            {/* Airlines */}

            <div className="filter-section">

              <h3 className="filter-title">
                Airlines
              </h3>


              {airlines.length === 0 ? (

                <p className="results-subtitle">
                  No airlines available
                </p>

              ) : (

                airlines.map(
                  (airline) => (

                    <label
                      className="filter-option"
                      key={airline}
                    >

                      <input
                        type="checkbox"
                        checked={
                          selectedAirlines.includes(
                            airline
                          )
                        }
                        onChange={() =>
                          toggleAirline(
                            airline
                          )
                        }
                      />

                      <span>
                        {airline}
                      </span>

                    </label>

                  )
                )

              )}

            </div>


            {/* Stops */}

            <div className="filter-section">

              <h3 className="filter-title">
                Stops
              </h3>


              <label className="filter-option">

                <input
                  type="radio"
                  name="stops"
                  checked={
                    stops === "all"
                  }
                  onChange={() =>
                    setStops("all")
                  }
                />

                <span>
                  All flights
                </span>

              </label>


              <label className="filter-option">

                <input
                  type="radio"
                  name="stops"
                  checked={
                    stops === "0"
                  }
                  onChange={() =>
                    setStops("0")
                  }
                />

                <span>
                  Non-stop
                </span>

              </label>


              <label className="filter-option">

                <input
                  type="radio"
                  name="stops"
                  checked={
                    stops === "1"
                  }
                  onChange={() =>
                    setStops("1")
                  }
                />

                <span>
                  1 Stop
                </span>

              </label>

            </div>

          </aside>


          {/* ============================
              FLIGHT RESULTS
              ============================ */}

          <section className="results-area">


            {/* Top bar */}

            <div className="results-topbar">

              <div>

                <strong>
                  {filteredFlights.length}
                  {" "}
                  {filteredFlights.length === 1
                    ? "flight"
                    : "flights"}
                </strong>

                <span className="results-count">
                  {" "}available
                </span>

              </div>


              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
              >

                <option value="price">
                  Cheapest
                </option>

                <option value="duration">
                  Fastest
                </option>

                <option value="departure">
                  Earliest Departure
                </option>

              </select>

            </div>


            {/* Empty */}

            {filteredFlights.length === 0 ? (

              <div className="results-empty">

                <div className="results-empty-icon">
                  🔍
                </div>

                <h2>
                  No flights found
                </h2>

                <p>
                  Try changing your filters
                  to find more flights.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => {

                    setSelectedAirlines([]);
                    setStops("all");

                  }}
                >
                  Reset Filters
                </button>

              </div>

            ) : (


              /* ============================
                 FLIGHT LIST
                 ============================ */

              <div className="flight-list">

                {filteredFlights.map(
                  (flight) => (

                    <article
                      className="flight-card"
                      key={flight.id}
                    >


                      {/* Airline + Price */}

                      <div className="flight-top">

                        <div className="airline-info">

                          <div className="airline-logo">

                            {flight.airline
                              .substring(0, 2)
                              .toUpperCase()}

                          </div>


                          <div className="airline-name">

                            <strong>
                              {flight.airline}
                            </strong>

                            <span>
                              {flight.flightNumber}
                            </span>

                          </div>

                        </div>


                        <div className="flight-price">

                          <strong>
                            ₹
                            {flight.price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span>
                            per passenger
                          </span>

                        </div>

                      </div>


                      {/* Route */}

                      <div className="flight-route">


                        {/* Departure */}

                        <div className="flight-time">

                          <strong>
                            {flight.departure}
                          </strong>

                          <span>
                            {flight.from}
                          </span>

                        </div>


                        {/* Duration */}

                        <div className="flight-duration">

                          <span>
                            {flight.duration}
                          </span>


                          <div className="flight-duration-line">

                            <span className="flight-plane">
                              ✈
                            </span>

                          </div>


                          <span>

                            {flight.stops === 0
                              ? "Non-stop"
                              : `${flight.stops} stop`}

                          </span>

                        </div>


                        {/* Arrival */}

                        <div className="flight-time">

                          <strong>
                            {flight.arrival}
                          </strong>

                          <span>
                            {flight.to}
                          </span>

                        </div>

                      </div>


                      {/* Footer */}

                      <div className="flight-footer">

                        <div className="flight-details">

                          <span className="flight-detail">
                            💺
                            <strong>
                              {search.cabin ||
                                "Economy"}
                            </strong>
                          </span>

                          <span className="flight-detail">
                            🧳
                            <strong>
                              15 kg
                            </strong>
                            baggage
                          </span>

                          {flight.stops === 0 && (

                            <span className="flight-detail">
                              ⚡
                              <strong>
                                Non-stop
                              </strong>
                            </span>

                          )}

                        </div>


                        <button
                          className="btn btn-primary select-flight-btn"
                          onClick={() =>
                            selectFlight(
                              flight
                            )
                          }
                        >
                          Select →
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </div>

    </div>

  );
}

export default FlightResults;