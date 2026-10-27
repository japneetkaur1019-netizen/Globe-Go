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
  payment: null,
  booking: null,
};

// The searched party size remains the source of truth throughout checkout.
export function getPassengerCount(search = {}) {
  const adults = Number(search.adults ?? 1);
  const children = Number(search.children ?? 0);
  return Number.isInteger(adults) && adults >= 1 && Number.isInteger(children) && children >= 0
    && adults + children <= 9 ? adults + children : 0;
}

// Shared with RequireBooking so route decisions can be verified without a browser.
export function getBookingRedirect(state, need = 'flight') {
  const { search, selectedFlight, passengers, payment } = state;
  if (!search?.origin || !search?.destination) return '/flights';
  if (need !== 'search' && !selectedFlight) return '/flights/results';
  if (need === 'passengers' || need === 'confirmation') {
    const count = getPassengerCount(search);
    if (!count || !Array.isArray(passengers) || passengers.length !== count) return '/flights/passengers';
  }
  if (need === 'confirmation') {
    if (selectedFlight.isLiveOffer) return '/flights/results';
    if (payment?.status !== 'completed' || payment.flightId !== selectedFlight.id) return '/flights/payment';
  }
  return null;
}

/**
 * flightReducer Ã¢â‚¬â€œ handles actions related to flight data.
 * Only the actions required by the current codebase are implemented.
 */
export function flightReducer(state = initialState, action) {
  switch (action.type) {


    case "SET_SEARCH":
      return {
        ...state,
        flights: [],
        selectedFlight: null,
        passengers: [],
        contact: {},
        seats: {},
        payment: null,
        booking: null,
        search: {
          ...state.search,
          ...action.payload
        }
      };

    case "SELECT_FLIGHT":
      return {
        ...state,
        selectedFlight: action.payload,
        seats: {},
        payment: null,
        booking: null,
      };

    case "SET_PASSENGERS":
      return {
        ...state,
        passengers: action.payload,
        seats: {},
        payment: null,
        booking: null,
      };

    case "SET_SEAT":
      return {
        ...state,
        payment: null,
        booking: null,
        seats: {
          ...state.seats,
          [action.payload.passengerId]: action.payload.seatId
        }
      };

    case "SET_SEATS":
      return {
        ...state,
        seats: action.payload || {},
        payment: null,
        booking: null,
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
