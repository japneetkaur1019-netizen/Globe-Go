// The mock AI travel-planning engine.
// Produces rich structured trip data with verified photography, Lucide icon keys, and zero emojis.

import { DESTINATIONS, findDestination, suggestDestinations } from './destinations.js';
import { getHotels } from './hotels.js';
import { getActivitiesForStyles } from './activities.js';
import { getFood } from './food.js';
import { parseTripRequest } from '../utils/tripParser.js';
import { computeBudgetBreakdown, budgetStatus, formatINR } from '../utils/budgetCalculator.js';
import { scoreDestinationForPreferences, personalizationBlurb } from '../utils/preferenceEngine.js';

const GENERIC_TIPS = [
  { iconType: 'Wallet', text: 'Carry a small reserve of local currency for transit cards and traditional markets.' },
  { iconType: 'MapPin', text: 'Download offline digital maps and transit routes prior to your departure.' },
  { iconType: 'Ticket', text: 'Pre-book premier attractions and museum passes in advance to skip ticket queues.' },
  { iconType: 'FileText', text: 'Maintain secure digital and offline copies of your passport, visas and booking confirmations.' },
  { iconType: 'CloudSun', text: 'Check the real-time weather forecasts before finalizing outdoor excursions.' },
  { iconType: 'Zap', text: 'Pack a universal travel power adapter compatible with regional plug types.' },
  { iconType: 'ShieldCheck', text: 'Carry essential travel insurance details and a compact first-aid kit.' },
];

const CLIMATE_TIPS = {
  hot: { iconType: 'Sun', text: 'Pack high-SPF sunscreen, polarized sunglasses and breathable UV-protection fabrics.' },
  warm: { iconType: 'SunMedium', text: 'Light breathable cottons and linens work best, with a light sweater for air-conditioned venues.' },
  cool: { iconType: 'Wind', text: 'Pack a lightweight insulated jacket and versatile layers for crisp mornings.' },
  cold: { iconType: 'ThermometerSnowflake', text: 'Pack thermal base layers, fleece mid-layers, water-resistant gloves and insulated boots.' },
  mild: { iconType: 'CloudSun', text: 'Pack versatile layering garments suitable for variable day-to-night temperatures.' },
};

export function getTravelTips(destination) {
  const climateTip = CLIMATE_TIPS[destination.climate] || CLIMATE_TIPS.mild;
  const destTip = {
    iconType: 'Compass',
    text: `${destination.name} is ideally suited for ${destination.bestFor.toLowerCase()} — book priority dining and transfers ahead.`,
  };
  return [climateTip, ...GENERIC_TIPS.slice(0, 4), destTip];
}

/**
 * Builds a day-by-day itinerary using each destination's highlight pool.
 */
function buildItinerary(destination, duration, dailyBudget, seedOffset = 0) {
  const morning = destination.highlights.filter((h) => h.time === 'morning');
  const afternoon = destination.highlights.filter((h) => h.time === 'afternoon');
  const evening = destination.highlights.filter((h) => h.time === 'evening');

  const days = [];
  for (let i = 0; i < duration; i += 1) {
    const idx = i + seedOffset;
    const m = morning[idx % morning.length];
    const a = afternoon[idx % afternoon.length];
    const e = evening[idx % evening.length];
    const variance = 0.85 + ((idx * 37) % 30) / 100;
    const cost = Math.round((dailyBudget * variance) / 100) * 100;

    days.push({
      day: i + 1,
      city: m?.city || destination.cities[i % destination.cities.length],
      morning: m || { iconType: 'Compass', name: 'Morning leisure and cultural exploration', city: destination.cities[0], image: destination.coverImage },
      afternoon: a || { iconType: 'Camera', name: 'Afternoon city sights and museum visit', city: destination.cities[0], image: destination.image },
      evening: e || { iconType: 'Utensils', name: 'Gourmet dinner at an acclaimed regional restaurant', city: destination.cities[0], image: destination.coverImage },
      cost: Math.max(2500, cost),
    });
  }
  return days;
}

function buildAISummary({ destination, duration, budget, preferences }) {
  const styles = (preferences.travelStyle || []).slice(0, 3).join(', ') || 'your travel preferences';
  const cities = destination.cities.slice(0, 3).join(', ');
  const budgetPhrase = budget
    ? `maintaining your estimated spending target of ${formatINR(budget)}`
    : `aligning with your ${preferences.budget || 'moderate'} budget target`;
  return `${destination.name} is an ideal match for your ${styles} profile. We have curated a ${duration}-day itinerary exploring ${cities} while ${budgetPhrase}.`;
}

/**
 * Core AI generation logic.
 */
export function generateTrip({ destinationId, duration = 5, budget = null, currency = 'INR', travelers = 2, preferences = {}, seedOffset = 0 }) {
  const destination = DESTINATIONS[destinationId] || DESTINATIONS.japan;
  const safeDuration = Math.min(Math.max(duration || 5, 1), 14);

  const breakdown = computeBudgetBreakdown({ destination, duration: safeDuration, travelers });
  const dailyBudget = breakdown.total / safeDuration;
  const itinerary = buildItinerary(destination, safeDuration, dailyBudget, seedOffset);

  const effectiveBudget = budget || breakdown.total;
  const status = budgetStatus(breakdown.total, effectiveBudget);

  const hotels = getHotels(destination.id);
  const activities = getActivitiesForStyles(destination, preferences.travelStyle);
  const food = getFood(destination.id);
  const tips = getTravelTips(destination);

  return {
    destination: destination.name,
    destinationId: destination.id,
    code: destination.code,
    country: destination.country,
    image: destination.image,
    coverImage: destination.coverImage,
    tone: destination.tone,
    duration: safeDuration,
    budget: effectiveBudget,
    currency,
    travelers: travelers || 2,
    climate: destination.climate,
    travelStyle: preferences.travelStyle || [],
    personalized: Boolean(preferences.travelStyle?.length || preferences.climate || preferences.budget),
    personalizationNote: personalizationBlurb({
      travelStyle: preferences.travelStyle || [],
      budget: preferences.budget || 'moderate',
      climate: preferences.climate || destination.climate,
    }),
    aiSummary: buildAISummary({ destination, duration: safeDuration, budget: effectiveBudget, preferences, breakdown }),
    itinerary,
    budgetBreakdown: breakdown,
    budgetStatus: status,
    hotels,
    activities,
    food,
    tips,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Parses free text and generates a trip in one call.
 */
export function planFromText(text, preferences = {}) {
  const parsed = parseTripRequest(text);

  if (!parsed.isValid) {
    return { ok: false, parsed, message: 'I can help you plan your itinerary. Try: "Plan a 5-day Bali trip under ₹50,000."' };
  }

  const destinationId = parsed.destinationId || pickDefaultDestination(preferences);
  const duration = parsed.duration || 5;
  const budget = parsed.budget || null;
  const travelers = parsed.travelers || 2;

  const trip = generateTrip({
    destinationId,
    duration,
    budget,
    currency: parsed.currency || 'INR',
    travelers,
    preferences,
  });

  return {
    ok: true,
    parsed,
    trip,
    usedDefaults: {
      destination: !parsed.destinationId,
      duration: !parsed.duration,
      budget: !parsed.budget,
    },
  };
}

function pickDefaultDestination(preferences) {
  const best = suggestDestinations(
    { climate: preferences.climate, styles: preferences.travelStyle, budgetLevel: preferences.budget },
    1
  )[0];
  return best ? best.id : 'japan';
}

/* ---------------------------------------------------------------------- */
/* Suggest Destination mode                                               */
/* ---------------------------------------------------------------------- */

export function generateDestinationSuggestions({ budget, duration, climate, style, region }, limit = 3) {
  const prefs = { climate, travelStyle: style ? [style] : [], budget };
  let pool = Object.values(DESTINATIONS);
  if (region) {
    pool = pool.filter((d) => d.name.toLowerCase().includes(region.toLowerCase()) || d.cities.some((c) => c.toLowerCase().includes(region.toLowerCase())));
    if (!pool.length) pool = Object.values(DESTINATIONS);
  }
  const scored = pool
    .map((dest) => ({ dest, score: scoreDestinationForPreferences(dest, prefs) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ dest }) => ({
    id: dest.id,
    name: dest.name,
    code: dest.code,
    country: dest.country,
    image: dest.image,
    coverImage: dest.coverImage,
    tone: dest.tone,
    why: `Matches your interest in ${(prefs.travelStyle[0] || dest.styles[0])} experiences and ${climate || dest.climate} climates. ${dest.description}`,
    estimatedBudget: Math.round(dest.avgDailyCostINR * (duration || 5) * 1.15),
    bestFor: dest.bestFor,
  }));
}

/* ---------------------------------------------------------------------- */
/* Budget Advice mode                                                     */
/* ---------------------------------------------------------------------- */

const BUDGET_ADVICE_SPLIT = {
  flights: 0.417,
  accommodation: 0.25,
  food: 0.133,
  transport: 0.083,
  activities: 0.067,
  emergency: 0.05,
};

export function generateBudgetAdvice({ budget, duration, destinationText }) {
  const keys = Object.keys(BUDGET_ADVICE_SPLIT);
  const raw = {};
  let runningTotal = 0;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      raw[k] = budget - runningTotal;
    } else {
      const val = Math.round((budget * BUDGET_ADVICE_SPLIT[k]) / 500) * 500;
      raw[k] = val;
      runningTotal += val;
    }
  });

  return {
    budget,
    duration: duration || null,
    destinationText: destinationText || null,
    strategy: raw,
    suggestions: [
      'Travel during shoulder season for reduced flight and accommodation rates.',
      'Book flexible cancellation hotel options early to secure low member rates.',
      'Utilize express rail and high-speed metro passes over private airport cabs.',
      'Reserve direct airline bookings 6-8 weeks prior to flight departure.',
      'Take advantage of combo city attraction passes with skip-the-line privileges.',
    ],
  };
}

/* ---------------------------------------------------------------------- */
/* Travel Questions mode                                                  */
/* ---------------------------------------------------------------------- */

const QA_PAIRS = [
  {
    keywords: ['pack', 'packing', 'wear', 'bring'],
    destinationKeywords: ['japan'],
    answer: 'For Japan, pack supportive walking footwear, comfortable breathable layers, a pocket Wi-Fi device or eSIM, and a small reserve of cash for traditional temple entry and ramen ticket machines.',
  },
  {
    keywords: ['honeymoon', 'romantic'],
    destinationKeywords: ['bali'],
    answer: 'Bali offers world-class honeymoon experiences. Consider booking a private cliffside pool villa in Uluwatu or an over-river luxury sanctuary in Ubud, paired with private sunset dining and holistic spa rituals.',
  },
  {
    keywords: ['money', 'cost', 'budget', 'how much'],
    destinationKeywords: ['thailand'],
    answer: 'Thailand is highly budget-efficient. A mid-range traveler typically averages ₹4,500 to ₹6,500 per day covering boutique hotel stays, gourmet street dining and island boat transfers.',
  },
  {
    keywords: ['best time', 'when to visit', 'season'],
    destinationKeywords: ['switzerland'],
    answer: 'For hiking, alpine meadows and mirror lakes, visit Switzerland between June and September. For winter sports and snow-covered chalets, December through March is optimal.',
  },
  {
    keywords: ['visa'],
    destinationKeywords: [],
    answer: 'Visa requirements depend on your nationality and destination. Please check the official government immigration portal or embassy site for official electronic visa (eVisa) or visa-on-arrival guidelines.',
  },
  {
    keywords: ['safe', 'safety'],
    destinationKeywords: [],
    answer: 'All featured destinations are rated high for international tourist safety. As best practice, keep personal valuables secure, use licensed rideshare/cabs, and maintain emergency digital contact info.',
  },
  {
    keywords: ['currency', 'exchange'],
    destinationKeywords: [],
    answer: 'Using a zero-forex debit or credit card at local bank ATMs typically yields the lowest foreign exchange rate compared to airport currency exchange counters.',
  },
  {
    keywords: ['pack', 'packing', 'wear', 'bring'],
    destinationKeywords: [],
    answer: 'Essential international packing list: weather-appropriate clothing, comfortable walking footwear, universal plug adapter, power bank, photocopies of travel documents and necessary prescription medication.',
  },
];

export const QUESTION_PRESETS = [
  'What should I pack for Japan?',
  'Is Bali good for a honeymoon?',
  'How much money do I need for Thailand?',
  'What is the best time to visit Switzerland?',
];

export function answerTravelQuestion(question) {
  const lower = question.toLowerCase();
  const dest = findDestination(lower);

  const destMatch = QA_PAIRS.find(
    (qa) => qa.destinationKeywords.some((k) => lower.includes(k)) && qa.keywords.some((k) => lower.includes(k))
  );
  if (destMatch) return destMatch.answer;

  const generalMatch = QA_PAIRS.find((qa) => qa.destinationKeywords.length === 0 && qa.keywords.some((k) => lower.includes(k)));
  if (generalMatch) return generalMatch.answer;

  if (dest) {
    return `${dest.name} is known for: ${dest.description}. Best for ${dest.bestFor.toLowerCase()}. Feel free to ask about packing tips, budget estimates, climate or the best time to visit.`;
  }

  return 'I can provide expert assistance with packing guides, budget optimization, seasonal timing and destination advice. Try asking: "What should I pack for Japan?" or "What is the best time to visit Switzerland?"';
}
