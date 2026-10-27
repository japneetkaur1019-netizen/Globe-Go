/**
 * wishlistReducer.js
 *
 * Pure reducer for the Wishlist feature.
 * State shape:
 *  {
 *    items:    Destination[],          // saved destinations
 *    cardMeta: { [id]: { priority, note } },  // per-card metadata
 *  }
 */

export const WISHLIST_ACTIONS = {
  ADD:           'WISHLIST_ADD',
  REMOVE:        'WISHLIST_REMOVE',
  CLEAR:         'WISHLIST_CLEAR',
  SET_META:      'WISHLIST_SET_META',
  CLEAR_META:    'WISHLIST_CLEAR_META',
  HYDRATE:       'WISHLIST_HYDRATE',    // restore from localStorage on init
};

export const initialWishlistState = {
  items:    [],
  cardMeta: {},
};

/**
 * @param {typeof initialWishlistState} state
 * @param {{ type: string, payload?: any }} action
 */
export function wishlistReducer(state, action) {
  switch (action.type) {

    /* ── Add a destination (no duplicates) ──────────────── */
    case WISHLIST_ACTIONS.ADD: {
      const dest = action.payload;
      const alreadyExists = state.items.some((item) => item.id === dest.id);
      if (alreadyExists) return state;
      return { ...state, items: [...state.items, dest] };
    }

    /* ── Remove a destination by id ─────────────────────── */
    case WISHLIST_ACTIONS.REMOVE: {
      const filteredItems = state.items.filter((item) => item.id !== action.payload);
      const { [action.payload]: _removed, ...restMeta } = state.cardMeta;
      return { ...state, items: filteredItems, cardMeta: restMeta };
    }

    /* ── Clear all destinations ──────────────────────────── */
    case WISHLIST_ACTIONS.CLEAR:
      return { ...state, items: [], cardMeta: {} };

    /* ── Patch card-level meta (priority / note) ─────────── */
    case WISHLIST_ACTIONS.SET_META: {
      const { id, patch } = action.payload;
      return {
        ...state,
        cardMeta: {
          ...state.cardMeta,
          [id]: { ...(state.cardMeta[id] || {}), ...patch },
        },
      };
    }

    /* ── Remove meta for a specific card ─────────────────── */
    case WISHLIST_ACTIONS.CLEAR_META: {
      const { [action.payload]: _drop, ...rest } = state.cardMeta;
      return { ...state, cardMeta: rest };
    }

    /* ── Hydrate from localStorage (initial load) ─────────── */
    case WISHLIST_ACTIONS.HYDRATE:
      return { ...initialWishlistState, ...action.payload };

    default:
      return state;
  }
}
