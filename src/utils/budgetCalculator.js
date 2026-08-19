// Budget estimation logic, kept separate from UI and from the AI engine
// so the math can be tuned or replaced independently.

const FLIGHT_BASE_INR = {
  japan: 32000, bali: 19000, paris: 46000, london: 48000, dubai: 16000,
  thailand: 14000, singapore: 15500, switzerland: 50000, 'new york': 55000,
  maldives: 21000,
};

const CATEGORY_SPLIT = {
  flights: 0, // filled from FLIGHT_BASE_INR, not a percentage of the rest
  hotels: 0.4,
  food: 0.19,
  transport: 0.14,
  activities: 0.17,
  misc: 0.1,
};

export function estimateFlightCost(destId, travelers = 1) {
  const base = FLIGHT_BASE_INR[destId] || 30000;
  return Math.round(base * Math.max(1, travelers) * 0.92); // rough multi-pax discount
}

/**
 * Produces a category breakdown for a trip. Ground costs (hotels, food,
 * transport, activities, misc) scale with destination daily cost and
 * trip length; flights are a flat round-trip estimate.
 */
export function computeBudgetBreakdown({ destination, duration, travelers = 1 }) {
  const nights = Math.max(1, duration - 1);
  const dailyCost = destination.avgDailyCostINR;
  const groundTotal = dailyCost * nights * (0.6 + Math.max(0, travelers - 1) * 0.35);

  const flights = estimateFlightCost(destination.id, travelers);
  const hotels = Math.round(groundTotal * CATEGORY_SPLIT.hotels);
  const food = Math.round(groundTotal * CATEGORY_SPLIT.food);
  const transport = Math.round(groundTotal * CATEGORY_SPLIT.transport);
  const activities = Math.round(groundTotal * CATEGORY_SPLIT.activities);
  const misc = Math.round(groundTotal * CATEGORY_SPLIT.misc);

  const total = flights + hotels + food + transport + activities + misc;

  return {
    flights, hotels, food, transport, activities, misc, total,
  };
}

export function scaleBreakdownToTarget(breakdown, targetTotal, protectFlights = true) {
  const scalableKeys = protectFlights
    ? ['hotels', 'food', 'transport', 'activities', 'misc']
    : ['flights', 'hotels', 'food', 'transport', 'activities', 'misc'];

  const protectedTotal = protectFlights ? breakdown.flights : 0;
  const scalableTotal = scalableKeys.reduce((sum, k) => sum + breakdown[k], 0);
  const availableForScalables = Math.max(targetTotal - protectedTotal, scalableTotal * 0.4);
  const ratio = scalableTotal > 0 ? availableForScalables / scalableTotal : 1;

  const next = { ...breakdown };
  scalableKeys.forEach((k) => {
    next[k] = Math.max(500, Math.round(breakdown[k] * ratio));
  });
  next.total = Object.entries(next)
    .filter(([k]) => k !== 'total')
    .reduce((sum, [, v]) => sum + v, 0);

  return next;
}

export function formatINR(amount) {
  if (amount == null || Number.isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function budgetStatus(breakdownTotal, userBudget) {
  if (!userBudget) return { overBudget: false, diff: 0 };
  const diff = breakdownTotal - userBudget;
  return { overBudget: diff > 0, diff: Math.abs(diff) };
}
