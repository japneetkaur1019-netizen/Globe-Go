/**
 * WishlistContext.jsx
 *
 * Provides global wishlist state via Context API + useReducer.
 * Persists to localStorage automatically on every state change.
 *
 * Exposed via useWishlist():
 *  - wishlist          : Destination[]             – saved destinations
 *  - cardMeta          : { [id]: { priority, note } }
 *  - addToWishlist     : (destination) => void
 *  - removeFromWishlist: (id) => void
 *  - clearWishlist     : () => void
 *  - isInWishlist      : (id) => boolean
 *  - setCardMeta       : (id, patch) => void       – set priority / note
 *  - clearCardMeta     : (id) => void
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import {
  WISHLIST_ACTIONS,
  initialWishlistState,
  wishlistReducer,
} from '../reducers/wishlistReducer';

// ─── localStorage keys ─────────────────────────────────────────────────────
const LS_ITEMS_KEY    = 'wishlist';
const LS_META_KEY     = 'wl_meta';

// ─── Helpers ───────────────────────────────────────────────────────────────
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* localStorage unavailable */
  }
}

// ─── Context ───────────────────────────────────────────────────────────────
const WishlistContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────
export function WishlistProvider({ children }) {

  // Hydrate initial state from localStorage
  const [state, dispatch] = useReducer(
    wishlistReducer,
    initialWishlistState,
    () => ({
      items:    readJSON(LS_ITEMS_KEY, []),
      cardMeta: readJSON(LS_META_KEY,  {}),
    }),
  );

  // Persist items to localStorage on every change
  useEffect(() => {
    writeJSON(LS_ITEMS_KEY, state.items);
  }, [state.items]);

  // Persist cardMeta to localStorage on every change
  useEffect(() => {
    writeJSON(LS_META_KEY, state.cardMeta);
  }, [state.cardMeta]);

  // ── Action dispatchers ────────────────────────────────────────────────
  const addToWishlist = useCallback((destination) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD, payload: destination });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE, payload: id });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR });
  }, []);

  const setCardMeta = useCallback((id, patch) => {
    dispatch({ type: WISHLIST_ACTIONS.SET_META, payload: { id, patch } });
  }, []);

  const clearCardMeta = useCallback((id) => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_META, payload: id });
  }, []);

  // ── Derived helpers ───────────────────────────────────────────────────
  const isInWishlist = useCallback(
    (id) => state.items.some((item) => item.id === id),
    [state.items],
  );

  // ── Memoised context value ────────────────────────────────────────────
  const value = useMemo(() => ({
    wishlist:           state.items,
    cardMeta:           state.cardMeta,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    setCardMeta,
    clearCardMeta,
  }), [
    state.items,
    state.cardMeta,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    setCardMeta,
    clearCardMeta,
  ]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}