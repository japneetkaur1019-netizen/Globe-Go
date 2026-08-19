// Reads/writes saved travel preferences and turns them into
// personalization signals used across the AI planner.

const PREFS_KEY = 'travelPreferences';

export const DEFAULT_PREFERENCES = {
  budget: 'moderate', // 'budget' | 'moderate' | 'luxury'
  travelStyle: ['adventure', 'food', 'nature'],
  climate: 'warm', // 'warm' | 'cool' | 'cold' | 'mild' | 'hot'
  currency: 'INR',
  theme: 'light',
};

export function getPreferences() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(prefs) {
  const merged = { ...getPreferences(), ...prefs };
  localStorage.setItem(PREFS_KEY, JSON.stringify(merged));
  return merged;
}

export function formatStyleList(styles = []) {
  if (!styles.length) return 'a well-rounded mix of experiences';
  if (styles.length === 1) return styles[0];
  if (styles.length === 2) return `${styles[0]} and ${styles[1]}`;
  return `${styles.slice(0, -1).join(', ')} and ${styles[styles.length - 1]}`;
}

export function personalizationBlurb(prefs) {
  const styles = formatStyleList(prefs.travelStyle);
  return `Based on your travel preferences (${styles}, ${prefs.budget} budget, ${prefs.climate} climate), we've customized this trip.`;
}

/** Score a destination against saved preferences — higher is a better match. */
export function scoreDestinationForPreferences(dest, prefs) {
  let score = 0;
  if (prefs.climate && dest.climate === prefs.climate) score += 3;
  if (prefs.budget && dest.budgetLevel === prefs.budget) score += 2;
  (prefs.travelStyle || []).forEach((s) => {
    if (dest.styles.includes(s)) score += 2;
  });
  return score;
}

export const STYLE_OPTIONS = ['adventure', 'culture', 'nature', 'food', 'shopping', 'relax', 'luxury'];
export const CLIMATE_OPTIONS = ['warm', 'hot', 'cool', 'cold', 'mild'];
export const BUDGET_OPTIONS = ['budget', 'moderate', 'luxury'];
