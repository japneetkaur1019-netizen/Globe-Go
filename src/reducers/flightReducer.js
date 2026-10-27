// Flight reducer for managing flight search and selection state
// Exported constants are used by FlightBookingContext

export const initialState = {
  // List of flights returned from the API or generated dynamically
  flights: [],
  // Currently selected flight object
  selectedFlight: null,
  // Loading flag while fetching flights
  isLoading: false,
  // Error message if the fetch fails
  error: null,
  // Search parameters used by the UI
  search: {
    origin: null,
    destination: null,
    cabin: 'Economy',
    tripType: 'one-way',
  },
  // Passengers collected on the Passenger Details step
  passengers: [],
  // Contact info (email, phone) collected on the Passenger Details step
  contact: {},
  // Seat assignments (passengerId => seatId) collected on the Seat Selection step
  seats: {},
};

/**
 * flightReducer Ã¢â‚¬â€œ handles actions related to flight data.
 * Only the actions required by the current codebase are implemented.
 */
export function flightReducer(state = initialState, action) {
  switch (action.type) {


    case "SET_SEARCH":
      return {
        ...state,
        search: {
          ...state.search,
          ...action.payload
        }
      };

    case "SELECT_FLIGHT":
      return {
        ...state,
        selectedFlight: action.payload
      };

    case "SET_PASSENGERS":
      return {
        ...state,
        passengers: action.payload
      };

    case "SET_SEAT":
      return {
        ...state,
        seats: {
          ...state.seats,
          [action.payload.passengerId]: action.payload.seatId
        }
      };

    case "SET_SEATS":
      return {
        ...state,
        seats: action.payload || {}
      };

    case "SET_PAYMENT":
      return {
        ...state,
        payment: {
          ...state.payment,
          ...action.payload
        }
      };

    case "SET_BOOKING":
      return {
        ...state,
        booking: action.payload
      };

    case "SET_CONTACT":
      return {
        ...state,
        contact: {
          ...state.contact,
          ...action.payload
        }
      };

    case "RESET_BOOKING":
      return initialState;

    case 'SET_FLIGHTS':
      return { ...state, flights: action.payload, isLoading: false, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}
