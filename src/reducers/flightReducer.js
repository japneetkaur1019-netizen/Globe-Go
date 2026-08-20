const initialState = {
  search: {
    tripType: "round-trip",
    origin: null,
    destination: null,
    departDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabin: "Economy"
  },

  selectedFlight: null,

  passengers: [],

  seats: {},

  payment: {
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  },

  booking: null
};

function flightReducer(state, action) {
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

    case "RESET_BOOKING":
      return initialState;

    default:
      return state;
  }
}

export {
  initialState,
  flightReducer
};