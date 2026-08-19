import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PREFERENCES, getPreferences, savePreferences as persistPreferences } from '../utils/preferenceEngine.js';

const SAVED_TRIPS_KEY = 'savedTrips';
const NOTIFICATIONS_KEY = 'notifications';
const THEME_KEY = 'theme';

// Baseline demo numbers so the Member dashboard looks populated and realistic
export const BASELINE_STATS = { trips: 4, destinations: 9, wishlist: 14, totalSpent: 185000 };

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

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [preferences, setPreferencesState] = useState(() => getPreferences());
  const [savedTrips, setSavedTrips] = useState(() => readJSON(SAVED_TRIPS_KEY, []));
  const [notifications, setNotifications] = useState(() => readJSON(NOTIFICATIONS_KEY, [
    {
      id: 1,
      iconType: 'Sparkles',
      title: 'Welcome to GlobeGo',
      body: 'Your AI travel planner is configured with member privileges and instant itineraries.',
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 2,
      iconType: 'Tag',
      title: 'Member Price Unlocked',
      body: 'Save an extra 20% on top luxury resort selections across Tokyo and Bali.',
      time: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
  ]));
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || DEFAULT_PREFERENCES.theme);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const updatePreferences = useCallback((patch) => {
    const merged = persistPreferences(patch);
    setPreferencesState(merged);
    return merged;
  }, []);

  const setTheme = useCallback((next) => {
    localStorage.setItem(THEME_KEY, next);
    setThemeState(next);
    updatePreferences({ theme: next });
  }, [updatePreferences]);

  const showToast = useCallback((title, body, iconType = 'CheckCircle') => {
    setToast({ id: Date.now(), title, body, iconType });
  }, []);

  const addNotification = useCallback((iconType, title, body) => {
    setNotifications((prev) => {
      const next = [
        { id: Date.now() + Math.random(), iconType, title, body, time: new Date().toISOString(), read: false },
        ...prev,
      ].slice(0, 30);
      writeJSON(NOTIFICATIONS_KEY, next);
      return next;
    });
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      writeJSON(NOTIFICATIONS_KEY, next);
      return next;
    });
  }, []);

  const saveTrip = useCallback((trip) => {
    const record = {
      id: `trip_${Date.now()}`,
      savedAt: new Date().toISOString(),
      status: 'upcoming',
      ...trip,
    };
    setSavedTrips((prev) => {
      const next = [record, ...prev];
      writeJSON(SAVED_TRIPS_KEY, next);
      return next;
    });
    addNotification('BookmarkCheck', 'Trip Saved', `Your ${trip.destination} itinerary has been saved to your dashboard.`);
    showToast('Trip Saved', `Your ${trip.destination} itinerary is now in your dashboard.`, 'Heart');
    return record;
  }, [addNotification, showToast]);

  const removeTrip = useCallback((id) => {
    setSavedTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      writeJSON(SAVED_TRIPS_KEY, next);
      return next;
    });
  }, []);

  const notifyTripUpdated = useCallback((destination) => {
    addNotification('Calendar', 'Trip Updated', `Your ${destination} itinerary has been refreshed.`);
    showToast('Trip Updated', `Your ${destination} itinerary was refreshed.`, 'RefreshCw');
  }, [addNotification, showToast]);

  const notifyBudgetUpdated = useCallback((destination, newTotal) => {
    addNotification('DollarSign', 'Budget Optimized', `Your ${destination} trip has been optimized to ₹${Math.round(newTotal).toLocaleString('en-IN')}.`);
    showToast('Budget Optimized', `Optimized to ₹${Math.round(newTotal).toLocaleString('en-IN')}.`, 'TrendingDown');
  }, [addNotification, showToast]);

  const stats = useMemo(() => {
    const savedDestinations = new Set(savedTrips.map((t) => t.destination));
    const extraSpent = savedTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
    return {
      trips: BASELINE_STATS.trips + savedTrips.length,
      destinations: BASELINE_STATS.destinations + savedDestinations.size,
      wishlist: BASELINE_STATS.wishlist,
      totalSpent: BASELINE_STATS.totalSpent + extraSpent,
    };
  }, [savedTrips]);

  const value = useMemo(() => ({
    preferences,
    updatePreferences,
    theme,
    setTheme,
    savedTrips,
    saveTrip,
    removeTrip,
    notifications,
    addNotification,
    markNotificationsRead,
    notifyTripUpdated,
    notifyBudgetUpdated,
    toast,
    showToast,
    stats,
  }), [preferences, updatePreferences, theme, setTheme, savedTrips, saveTrip, removeTrip, notifications, addNotification, markNotificationsRead, notifyTripUpdated, notifyBudgetUpdated, toast, showToast, stats]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
