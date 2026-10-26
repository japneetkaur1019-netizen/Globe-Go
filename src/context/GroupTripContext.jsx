/**
 * GroupTripContext.jsx
 *
 * Shared state for the entire Group Trip Planner feature.
 * All sub-routes (Overview, Expenses, Itinerary, Polls) read/write
 * from this single context so navigating between tabs preserves state.
 *
 * Persisted to localStorage under "groupTrip".
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

/* ── localStorage helpers ─────────────────────────────────── */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

const LS_KEY = "groupTrip";

/* ── Initial state ───────────────────────────────────────── */
const ACTIVITY_TYPES = [
  "🏨 Accommodation", "✈️ Travel", "🍽️ Dining", "🎭 Activity",
  "🛍️ Shopping", "🚌 Transport", "📸 Sightseeing", "💆 Wellness",
];

const defaultState = {
  groupName:   "Goa Annual Getaway",
  destination: "Goa, India",
  budget:      "45000",
  startDate:   "2025-12-20",
  endDate:     "2025-12-27",
  members:     ["Alex", "Priya", "Rahul"],
  expenses: [
    { id: 1, person: "Alex",  title: "Resort Stay",      category: "Hotels & Stays",     amount: 18000, settled: false },
    { id: 2, person: "Priya", title: "Flight Tickets",   category: "Flights & Travel",   amount: 14500, settled: false },
    { id: 3, person: "Rahul", title: "Beachside Dinner", category: "Food & Dining",       amount: 4800,  settled: false },
  ],
  itinerary: [
    {
      id: 1, date: "2025-12-20", label: "Day 1 — Arrival", expanded: true,
      activities: [
        { id: 11, time: "14:00", type: "✈️ Travel",       title: "Fly to Goa",       notes: "Flight GoI-301" },
        { id: 12, time: "18:00", type: "🏨 Accommodation", title: "Check-in Resort",  notes: "Taj Resort" },
        { id: 13, time: "20:00", type: "🍽️ Dining",        title: "Welcome Dinner",   notes: "Beach shack" },
      ],
    },
    {
      id: 2, date: "2025-12-21", label: "Day 2 — Beach & Explore", expanded: false,
      activities: [
        { id: 21, time: "10:00", type: "📸 Sightseeing", title: "Calangute Beach",     notes: "" },
        { id: 22, time: "14:00", type: "🛍️ Shopping",    title: "Anjuna Flea Market",  notes: "" },
      ],
    },
  ],
  polls: [
    {
      id: 1,
      question: "Which accommodation do you prefer?",
      options: [
        { id: "a", label: "Beach Resort", votes: ["Alex"] },
        { id: "b", label: "Airbnb Villa", votes: ["Priya", "Rahul"] },
        { id: "c", label: "Budget Hostel", votes: [] },
      ],
      createdBy: "Alex",
      closed: false,
    },
  ],
};

/* ── Reducer ─────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {
    /* Trip details */
    case "SET_TRIP_FIELD":
      return { ...state, [action.field]: action.value };

    /* Members */
    case "ADD_MEMBER":
      if (!action.name || state.members.includes(action.name)) return state;
      return { ...state, members: [...state.members, action.name] };
    case "REMOVE_MEMBER":
      return {
        ...state,
        members:  state.members.filter((_, i) => i !== action.index),
        expenses: state.expenses.filter((e) => e.person !== state.members[action.index]),
      };

    /* Expenses */
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.expense] };
    case "REMOVE_EXPENSE":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.id) };
    case "TOGGLE_SETTLED":
      return {
        ...state,
        expenses: state.expenses.map((e) => e.id === action.id ? { ...e, settled: !e.settled } : e),
      };

    /* Itinerary — days */
    case "ADD_DAY":
      return { ...state, itinerary: [...state.itinerary, action.day] };
    case "REMOVE_DAY":
      return { ...state, itinerary: state.itinerary.filter((d) => d.id !== action.id) };
    case "TOGGLE_DAY":
      return {
        ...state,
        itinerary: state.itinerary.map((d) => d.id === action.id ? { ...d, expanded: !d.expanded } : d),
      };

    /* Itinerary — activities */
    case "ADD_ACTIVITY":
      return {
        ...state,
        itinerary: state.itinerary.map((d) =>
          d.id === action.dayId
            ? { ...d, activities: [...d.activities, action.activity] }
            : d
        ),
      };
    case "REMOVE_ACTIVITY":
      return {
        ...state,
        itinerary: state.itinerary.map((d) =>
          d.id === action.dayId
            ? { ...d, activities: d.activities.filter((a) => a.id !== action.actId) }
            : d
        ),
      };

    /* Polls */
    case "ADD_POLL":
      return { ...state, polls: [...state.polls, action.poll] };
    case "VOTE_POLL":
      return {
        ...state,
        polls: state.polls.map((p) => {
          if (p.id !== action.pollId || p.closed) return p;
          return {
            ...p,
            options: p.options.map((o) => ({
              ...o,
              votes: o.id === action.optionId
                ? o.votes.includes(action.voter) ? o.votes : [...o.votes, action.voter]
                : o.votes.filter((v) => v !== action.voter),
            })),
          };
        }),
      };
    case "CLOSE_POLL":
      return { ...state, polls: state.polls.map((p) => p.id === action.id ? { ...p, closed: true } : p) };
    case "DELETE_POLL":
      return { ...state, polls: state.polls.filter((p) => p.id !== action.id) };

    /* Hydrate from localStorage */
    case "HYDRATE":
      return { ...defaultState, ...action.payload };

    default:
      return state;
  }
}

/* ── Context ─────────────────────────────────────────────── */
const GroupTripContext = createContext(null);

export function GroupTripProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    defaultState,
    () => ({ ...defaultState, ...readJSON(LS_KEY, {}) }),
  );

  /* Persist entire state on any change */
  useEffect(() => { writeJSON(LS_KEY, state); }, [state]);

  /* ── Convenience dispatchers ─────────────────────────── */
  const setTripField    = useCallback((field, value) => dispatch({ type: "SET_TRIP_FIELD", field, value }), []);
  const addMember       = useCallback((name)  => dispatch({ type: "ADD_MEMBER",    name }),   []);
  const removeMember    = useCallback((index) => dispatch({ type: "REMOVE_MEMBER", index }),  []);

  const addExpense      = useCallback((expense) => dispatch({ type: "ADD_EXPENSE",    expense }), []);
  const removeExpense   = useCallback((id)      => dispatch({ type: "REMOVE_EXPENSE", id }),      []);
  const toggleSettled   = useCallback((id)      => dispatch({ type: "TOGGLE_SETTLED", id }),      []);

  const addDay          = useCallback((day)     => dispatch({ type: "ADD_DAY",       day }),    []);
  const removeDay       = useCallback((id)      => dispatch({ type: "REMOVE_DAY",    id }),     []);
  const toggleDay       = useCallback((id)      => dispatch({ type: "TOGGLE_DAY",    id }),     []);
  const addActivity     = useCallback((dayId, activity) => dispatch({ type: "ADD_ACTIVITY",    dayId, activity }), []);
  const removeActivity  = useCallback((dayId, actId)    => dispatch({ type: "REMOVE_ACTIVITY", dayId, actId }),    []);

  const addPoll         = useCallback((poll)   => dispatch({ type: "ADD_POLL",    poll }),  []);
  const votePoll        = useCallback((pollId, optionId, voter) => dispatch({ type: "VOTE_POLL",  pollId, optionId, voter }), []);
  const closePoll       = useCallback((id)     => dispatch({ type: "CLOSE_POLL", id }),   []);
  const deletePoll      = useCallback((id)     => dispatch({ type: "DELETE_POLL", id }),  []);

  /* ── Derived values (memoised) ──────────────────────── */
  const totalExpenses = useMemo(() => state.expenses.reduce((s, e) => s + e.amount, 0), [state.expenses]);
  const avgExpense    = state.members.length > 0 ? totalExpenses / state.members.length : 0;
  const budgetNum     = Number(state.budget) || 0;
  const budgetPct     = budgetNum > 0 ? Math.min((totalExpenses / budgetNum) * 100, 100) : 0;

  const balances = useMemo(() =>
    state.members.map((m) => {
      const paid = state.expenses.filter((e) => e.person === m).reduce((s, e) => s + e.amount, 0);
      return { member: m, paid, balance: paid - avgExpense };
    }),
    [state.members, state.expenses, avgExpense]
  );

  const settlements = useMemo(() => {
    const result    = [];
    const debtors   = balances.filter((p) => p.balance < -1).map((p) => ({ ...p, owe: Math.abs(p.balance) }));
    const creditors = balances.filter((p) => p.balance > 1).map((p) => ({ ...p, get: p.balance }));
    debtors.forEach((d) => {
      creditors.forEach((c) => {
        if (d.owe > 0 && c.get > 0) {
          const amt = Math.min(d.owe, c.get);
          result.push({ from: d.member, to: c.member, amount: amt });
          d.owe -= amt; c.get -= amt;
        }
      });
    });
    return result;
  }, [balances]);

  const catBreakdown = useMemo(() => {
    const map = {};
    state.expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [state.expenses]);

  const value = useMemo(() => ({
    /* raw state */
    ...state,
    /* dispatchers */
    setTripField, addMember, removeMember,
    addExpense, removeExpense, toggleSettled,
    addDay, removeDay, toggleDay, addActivity, removeActivity,
    addPoll, votePoll, closePoll, deletePoll,
    /* derived */
    totalExpenses, avgExpense, budgetNum, budgetPct,
    balances, settlements, catBreakdown,
    ACTIVITY_TYPES,
  }), [
    state, setTripField, addMember, removeMember,
    addExpense, removeExpense, toggleSettled,
    addDay, removeDay, toggleDay, addActivity, removeActivity,
    addPoll, votePoll, closePoll, deletePoll,
    totalExpenses, avgExpense, budgetNum, budgetPct,
    balances, settlements, catBreakdown,
  ]);

  return <GroupTripContext.Provider value={value}>{children}</GroupTripContext.Provider>;
}

export function useGroupTrip() {
  const ctx = useContext(GroupTripContext);
  if (!ctx) throw new Error("useGroupTrip must be used within GroupTripProvider");
  return ctx;
}
