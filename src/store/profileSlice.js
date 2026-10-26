/**
 * profileSlice.js
 * Redux Toolkit slice for Profile Travel Vault, Documents, Emergency Contacts,
 * Rewards Wallet & Bucket List.
 */
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'globego_redux_profile';

const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialDefaultState = {
  // Travel Documents & Passports / Visas
  documents: [
    {
      id: 'doc-1',
      type: 'Passport',
      number: 'Z9823144',
      issuingCountry: 'India',
      expiryDate: '2032-08-15',
      verified: true,
      notes: 'Biometric 36-page booklet',
    },
    {
      id: 'doc-2',
      type: 'Schengen Visa',
      number: 'FR-9082311-V',
      issuingCountry: 'France',
      expiryDate: '2026-12-31',
      verified: true,
      notes: 'Multi-entry 90-day tourist visa',
    },
    {
      id: 'doc-3',
      type: 'International Driving Permit',
      number: 'IDP-2024-4401',
      issuingCountry: 'Automobile Assoc.',
      expiryDate: '2025-11-20',
      verified: false,
      notes: 'For car rentals in EU & Bali',
    },
  ],

  // Travel Companions & Emergency Contacts
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Rohan Sharma',
      relationship: 'Spouse / Travel Partner',
      phone: '+91 98765 43210',
      email: 'rohan.sharma@example.com',
      isPrimary: true,
    },
    {
      id: 'ec-2',
      name: 'Priya Mehta',
      relationship: 'Family Member',
      phone: '+91 91234 56789',
      email: 'priya.mehta@example.com',
      isPrimary: false,
    },
  ],

  // Rewards Wallet & Redemptions
  rewardWallet: {
    milesBalance: 12450,
    lifetimeEarned: 35000,
    tier: 'Gold Voyager',
    dailyCheckinClaimed: false,
    history: [
      { id: 'tx-1', title: 'Welcome Voyager Bonus', amount: 5000, type: 'credit', date: '2025-01-10' },
      { id: 'tx-2', title: 'Flight DEL -> GOI Booking', amount: 1450, type: 'credit', date: '2025-02-14' },
      { id: 'tx-3', title: 'VIP Airport Lounge Pass', amount: -2000, type: 'debit', date: '2025-02-15' },
      { id: 'tx-4', title: 'Hotel Stay Taj Exotica', amount: 8000, type: 'credit', date: '2025-03-01' },
    ],
  },

  // Dream Travel Bucket List
  bucketList: [
    { id: 'bl-1', destination: 'Kyoto & Tokyo', country: 'Japan', targetYear: 2026, priority: 'High', visited: false },
    { id: 'bl-2', destination: 'Northern Lights in Tromsø', country: 'Norway', targetYear: 2026, priority: 'High', visited: false },
    { id: 'bl-3', destination: 'Santorini Sunset Caldera', country: 'Greece', targetYear: 2027, priority: 'Medium', visited: true },
    { id: 'bl-4', destination: 'Banff National Park', country: 'Canada', targetYear: 2027, priority: 'Low', visited: false },
  ],

  // Redux-Managed Profile Preferences & Toggles
  preferences: {
    twoFactorAuth: true,
    priceDropAlerts: true,
    flightStatusSMS: true,
    autoCheckIn: true,
    shareStatsPublicly: false,
    currency: 'INR',
  },

  // Telemetry for user feedback on Redux dispatching
  lastAction: {
    type: '@@INIT',
    timestamp: new Date().toLocaleTimeString(),
    message: 'Redux Toolkit Store Initialized',
  },
};

const savedState = loadSavedState();
const initialState = savedState ? { ...initialDefaultState, ...savedState } : initialDefaultState;

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Documents
    addDocument: (state, action) => {
      const newDoc = {
        id: `doc-${Date.now()}`,
        verified: false,
        ...action.payload,
      };
      state.documents.unshift(newDoc);
      state.lastAction = {
        type: 'profile/addDocument',
        timestamp: new Date().toLocaleTimeString(),
        message: `Added document: ${newDoc.type} (${newDoc.number})`,
      };
    },
    removeDocument: (state, action) => {
      const doc = state.documents.find((d) => d.id === action.payload);
      state.documents = state.documents.filter((d) => d.id !== action.payload);
      state.lastAction = {
        type: 'profile/removeDocument',
        timestamp: new Date().toLocaleTimeString(),
        message: `Removed document ${doc ? doc.type : ''}`,
      };
    },
    toggleDocumentVerified: (state, action) => {
      const doc = state.documents.find((d) => d.id === action.payload);
      if (doc) {
        doc.verified = !doc.verified;
        state.lastAction = {
          type: 'profile/toggleDocumentVerified',
          timestamp: new Date().toLocaleTimeString(),
          message: `${doc.verified ? 'Verified' : 'Unverified'} ${doc.type}`,
        };
      }
    },

    // Emergency Contacts
    addEmergencyContact: (state, action) => {
      const newContact = {
        id: `ec-${Date.now()}`,
        isPrimary: state.emergencyContacts.length === 0,
        ...action.payload,
      };
      state.emergencyContacts.push(newContact);
      state.lastAction = {
        type: 'profile/addEmergencyContact',
        timestamp: new Date().toLocaleTimeString(),
        message: `Added companion/contact: ${newContact.name}`,
      };
    },
    removeEmergencyContact: (state, action) => {
      state.emergencyContacts = state.emergencyContacts.filter((c) => c.id !== action.payload);
      state.lastAction = {
        type: 'profile/removeEmergencyContact',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Emergency contact removed',
      };
    },
    setPrimaryContact: (state, action) => {
      state.emergencyContacts.forEach((c) => {
        c.isPrimary = c.id === action.payload;
      });
      state.lastAction = {
        type: 'profile/setPrimaryContact',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Updated primary emergency contact',
      };
    },

    // Rewards Wallet
    claimDailyReward: (state) => {
      if (!state.rewardWallet.dailyCheckinClaimed) {
        const bonus = 250;
        state.rewardWallet.milesBalance += bonus;
        state.rewardWallet.lifetimeEarned += bonus;
        state.rewardWallet.dailyCheckinClaimed = true;
        state.rewardWallet.history.unshift({
          id: `tx-${Date.now()}`,
          title: 'Daily Voyager Check-in Bonus',
          amount: bonus,
          type: 'credit',
          date: new Date().toISOString().split('T')[0],
        });
        state.lastAction = {
          type: 'profile/claimDailyReward',
          timestamp: new Date().toLocaleTimeString(),
          message: `Claimed +${bonus} Daily Voyager Miles!`,
        };
      }
    },
    redeemBenefit: (state, action) => {
      const { title, cost } = action.payload;
      if (state.rewardWallet.milesBalance >= cost) {
        state.rewardWallet.milesBalance -= cost;
        state.rewardWallet.history.unshift({
          id: `tx-${Date.now()}`,
          title: `Redeemed: ${title}`,
          amount: -cost,
          type: 'debit',
          date: new Date().toISOString().split('T')[0],
        });
        state.lastAction = {
          type: 'profile/redeemBenefit',
          timestamp: new Date().toLocaleTimeString(),
          message: `Redeemed ${title} for -${cost} miles`,
        };
      }
    },

    // Bucket List
    addBucketListItem: (state, action) => {
      const item = {
        id: `bl-${Date.now()}`,
        visited: false,
        priority: 'Medium',
        ...action.payload,
      };
      state.bucketList.push(item);
      state.lastAction = {
        type: 'profile/addBucketListItem',
        timestamp: new Date().toLocaleTimeString(),
        message: `Added ${item.destination} to dream bucket list`,
      };
    },
    toggleBucketVisited: (state, action) => {
      const item = state.bucketList.find((b) => b.id === action.payload);
      if (item) {
        item.visited = !item.visited;
        state.lastAction = {
          type: 'profile/toggleBucketVisited',
          timestamp: new Date().toLocaleTimeString(),
          message: `Marked ${item.destination} as ${item.visited ? 'Visited 🎉' : 'Planned'}`,
        };
      }
    },
    removeBucketListItem: (state, action) => {
      state.bucketList = state.bucketList.filter((b) => b.id !== action.payload);
      state.lastAction = {
        type: 'profile/removeBucketListItem',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Removed item from bucket list',
      };
    },

    // Preferences
    togglePreference: (state, action) => {
      const key = action.payload;
      if (key in state.preferences) {
        state.preferences[key] = !state.preferences[key];
        state.lastAction = {
          type: 'profile/togglePreference',
          timestamp: new Date().toLocaleTimeString(),
          message: `Updated preference: ${key} = ${state.preferences[key]}`,
        };
      }
    },
  },
});

export const {
  addDocument,
  removeDocument,
  toggleDocumentVerified,
  addEmergencyContact,
  removeEmergencyContact,
  setPrimaryContact,
  claimDailyReward,
  redeemBenefit,
  addBucketListItem,
  toggleBucketVisited,
  removeBucketListItem,
  togglePreference,
} = profileSlice.actions;

export default profileSlice.reducer;
