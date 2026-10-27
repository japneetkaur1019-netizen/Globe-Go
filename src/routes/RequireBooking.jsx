import { Navigate, Outlet } from "react-router-dom";
import { useFlightBooking } from "../context/FlightBookingContext";
import { getBookingRedirect } from "../reducers/flightReducer.js";

export default function RequireBooking({ need = "flight" }) {
  const { state } = useFlightBooking();
  const redirect = getBookingRedirect(state, need);
  return redirect ? <Navigate to={redirect} replace /> : <Outlet />;
}
