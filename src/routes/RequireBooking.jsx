import { Navigate, Outlet } from "react-router-dom";
import { useFlightBooking } from "../context/FlightBookingContext";
export default function RequireBooking({ need = "flight" }) {
  const { state } = useFlightBooking();
  const { search, selectedFlight, passengers } = state;

  if (!search?.origin || !search?.destination) {
    return <Navigate to="/flights" replace />;
  }
  if (need !== "search" && !selectedFlight) {
    return <Navigate to="/flights/results" replace />;
  }
  if (need === "passengers" && (!passengers || passengers.length === 0)) {
    return <Navigate to="/flights/passengers" replace />;
  }
  return <Outlet />;
}
