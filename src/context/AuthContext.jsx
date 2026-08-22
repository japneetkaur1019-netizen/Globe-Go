import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from './AppContext.jsx';

const AUTH_USER_KEY = 'globego_auth_user';

export const DEMO_ACCOUNTS = [
  {
    id: 'usr_platinum',
    name: 'Alex Morgan',
    email: 'alex.morgan@globego.travel',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    membershipTier: 'Platinum Voyager',
    memberSince: 'March 2024',
    points: 14250,
    tierProgress: 78,
    passportNumber: 'P98765432A',
    nationality: 'United States',
    homeAirport: 'DEL - Indira Gandhi Intl, Delhi',
    preferredAirline: 'Air India / Emirates',
    dietaryPreference: 'Vegetarian',
    seatPreference: 'Window (Front)',
    bio: 'Passionate travel photographer & culture seeker. Always on the lookout for hidden architectural gems and scenic train rides.'
  },
  {
    id: 'usr_gold',
    name: 'Priya Sharma',
    email: 'priya.sharma@traveler.io',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    membershipTier: 'Gold Explorer',
    memberSince: 'August 2024',
    points: 8400,
    tierProgress: 52,
    passportNumber: 'Z12345678B',
    nationality: 'India',
    homeAirport: 'BOM - Chhatrapati Shivaji Intl, Mumbai',
    preferredAirline: 'IndiGo / Vistara',
    dietaryPreference: 'Jain / Pure Veg',
    seatPreference: 'Aisle',
    bio: 'Food enthusiast, solo traveler, and weekend explorer. Lover of serene coastal sunsets and spicy street food.'
  },
  {
    id: 'usr_silver',
    name: 'Liam Chen',
    email: 'liam.chen@adventure.net',
    phone: '+65 9123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    membershipTier: 'Silver Member',
    memberSince: 'January 2025',
    points: 3600,
    tierProgress: 35,
    passportNumber: 'E55667788C',
    nationality: 'Singapore',
    homeAirport: 'SIN - Changi Airport, Singapore',
    preferredAirline: 'Singapore Airlines',
    dietaryPreference: 'Standard / No Restriction',
    seatPreference: 'Extra Legroom',
    bio: 'Tech nomad exploring Southeast Asia & Europe one coffee shop at a time.'
  }
];

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { showToast, addNotification } = useApp();

  // Load persisted user or default to Alex Morgan
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : DEMO_ACCOUNTS[0];
    } catch {
      return DEMO_ACCOUNTS[0];
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  // Persist user on changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch {
      // ignore localStorage errors
    }
  }, [user]);

  const openLoginModal = useCallback(() => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  }, []);

  const openSignupModal = useCallback(() => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  // Login handler
  const login = useCallback((email, _password) => {
    // Check if matches one of our demo accounts
    const match = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
    );

    const loggedInUser = match || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email.trim(),
      phone: '+1 (555) 019-2834',
      avatar: AVATAR_PRESETS[0],
      membershipTier: 'Silver Member',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      points: 2500,
      tierProgress: 25,
      passportNumber: 'A12345678',
      nationality: 'International',
      homeAirport: 'DEL - Delhi Airport',
      preferredAirline: 'Air India',
      dietaryPreference: 'Standard',
      seatPreference: 'Window',
      bio: 'GlobeGo explorer.'
    };

    setUser(loggedInUser);
    setAuthModalOpen(false);
    showToast('Signed In', `Welcome back, ${loggedInUser.name}!`, 'User');
    addNotification('User', 'Sign In Successful', `Logged in as ${loggedInUser.name} (${loggedInUser.membershipTier}).`);
    return loggedInUser;
  }, [showToast, addNotification]);

  // Signup handler
  const signup = useCallback((userData) => {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'New Traveler',
      email: userData.email,
      phone: userData.phone || '+1 (555) 000-0000',
      avatar: userData.avatar || AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      membershipTier: 'Gold Explorer (Welcome Bonus)',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      points: 500, // Welcome bonus points
      tierProgress: 10,
      passportNumber: userData.passportNumber || '',
      nationality: userData.nationality || 'International',
      homeAirport: userData.homeAirport || 'DEL - Indira Gandhi Intl',
      preferredAirline: userData.preferredAirline || 'Any',
      dietaryPreference: userData.dietaryPreference || 'Standard',
      seatPreference: userData.seatPreference || 'Window',
      bio: userData.bio || 'New member exploring the world with GlobeGo.'
    };

    setUser(newUser);
    setAuthModalOpen(false);
    showToast('Account Created!', 'Welcome to GlobeGo! 500 bonus reward points added.', 'Sparkles');
    addNotification('Award', 'Welcome Bonus Credited', '500 bonus miles credited to your GlobeGo account.');
    return newUser;
  }, [showToast, addNotification]);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    showToast('Signed Out', 'You have been signed out safely.', 'ShieldCheck');
    addNotification('ShieldCheck', 'Signed Out', 'Your session was terminated safely.');
  }, [showToast, addNotification]);

  // Update profile fields
  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...patch };
      showToast('Profile Updated', 'Your profile details have been saved.', 'CheckCircle');
      addNotification('CheckCircle', 'Profile Updated', 'Personal and travel preferences updated.');
      return updated;
    });
  }, [showToast, addNotification]);

  // Switch demo account
  const switchDemoAccount = useCallback((id) => {
    const target = DEMO_ACCOUNTS.find((acc) => acc.id === id) || DEMO_ACCOUNTS[0];
    setUser(target);
    setAuthModalOpen(false);
    showToast('Profile Switched', `Active user is now ${target.name} (${target.membershipTier}).`, 'User');
    addNotification('User', 'Account Switched', `Switched active profile to ${target.name}.`);
  }, [showToast, addNotification]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    updateProfile,
    switchDemoAccount,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openLoginModal,
    openSignupModal,
    closeAuthModal,
    demoAccounts: DEMO_ACCOUNTS,
    avatarPresets: AVATAR_PRESETS
  }), [
    user,
    login,
    signup,
    logout,
    updateProfile,
    switchDemoAccount,
    authModalOpen,
    authModalMode,
    openLoginModal,
    openSignupModal,
    closeAuthModal
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
