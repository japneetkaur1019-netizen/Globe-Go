import { createContext, useContext, useReducer } from "react";

import {
  initialState,
  flightReducer
} from "../reducers/flightReducer";

const FlightBookingContext = createContext(null);

export function FlightBookingProvider({ children }) {

  const [state, dispatch] = useReducer(
    flightReducer,
    initialState
  );

  return (
    <FlightBookingContext.Provider
      value={{ state, dispatch }}
    >
      {children}
    </FlightBookingContext.Provider>
  );
}

export function useFlightBooking() {

  const context = useContext(
    FlightBookingContext
  );

  if (!context) {
    throw new Error(
      "useFlightBooking must be used inside FlightBookingProvider"
    );
  }

  return context;
}