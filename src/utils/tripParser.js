// Lightweight "NLP" for the mock AI. Extracts destination, duration,
// budget and currency from a free-text travel request. This is the only
// place that needs to change if a real NLU/LLM API is connected later —
// everything downstream just consumes the returned shape.

import { DESTINATION_LIST } from '../data/destinations.js';

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1,
};

const CITY_ALIASES = {
  tokyo: 'japan', kyoto: 'japan', osaka: 'japan',
  ubud: 'bali', seminyak: 'bali', uluwatu: 'bali',
  bangkok: 'thailand', phuket: 'thailand', 'chiang mai': 'thailand',
  zurich: 'switzerland', interlaken: 'switzerland', lucerne: 'switzerland',
  nyc: 'new york', manhattan: 'new york',
};

export function extractDestination(text) {
  const lower = text.toLowerCase();
  for (const dest of DESTINATION_LIST) {
    if (lower.includes(dest.name.toLowerCase())) return dest.id;
  }
  for (const [alias, destId] of Object.entries(CITY_ALIASES)) {
    if (lower.includes(alias)) return destId;
  }
  return null;
}

export function extractDuration(text) {
  const lower = text.toLowerCase();

  // "one week", "a week", "two weeks"
  const weekWordMatch = lower.match(/\b(one|two|three|four|a|an)\s+weeks?\b/);
  if (weekWordMatch) {
    return (NUMBER_WORDS[weekWordMatch[1]] || 1) * 7;
  }
  const weekNumMatch = lower.match(/(\d+)\s*weeks?/);
  if (weekNumMatch) return parseInt(weekNumMatch[1], 10) * 7;

  // "5 days", "5-day", "5 day trip"
  const dayNumMatch = lower.match(/(\d+)\s*[- ]?\s*days?/);
  if (dayNumMatch) return parseInt(dayNumMatch[1], 10);

  const dayWordMatch = lower.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+days?\b/);
  if (dayWordMatch) return NUMBER_WORDS[dayWordMatch[1]];

  // "5 nights" -> 6 days
  const nightNumMatch = lower.match(/(\d+)\s*nights?/);
  if (nightNumMatch) return parseInt(nightNumMatch[1], 10) + 1;

  return null;
}

const USD_TO_INR = 83;

export function extractBudget(text) {
  const lower = text.toLowerCase().replace(/,/g, '');

  // $1000 / usd 1000
  const usdMatch = lower.match(/\$\s*(\d+(?:\.\d+)?)(k)?/) || lower.match(/(\d+(?:\.\d+)?)(k)?\s*usd/);
  if (usdMatch) {
    let val = parseFloat(usdMatch[1]);
    if (usdMatch[2]) val *= 1000;
    return { amount: Math.round(val * USD_TO_INR), currency: 'INR', originalCurrency: 'USD' };
  }

  // ₹70,000 / rs 70000 / inr 70000 / 70k
  const inrMatch =
    lower.match(/[₹]\s*(\d+(?:\.\d+)?)(k)?/) ||
    lower.match(/rs\.?\s*(\d+(?:\.\d+)?)(k)?/) ||
    lower.match(/inr\s*(\d+(?:\.\d+)?)(k)?/) ||
    lower.match(/(\d+(?:\.\d+)?)\s*k\b/) ||
    lower.match(/budget[^\d]*(\d{4,7})/) ||
    lower.match(/(\d{4,7})/);

  if (inrMatch) {
    let val = parseFloat(inrMatch[1]);
    if (inrMatch[2]) val *= 1000;
    return { amount: Math.round(val), currency: 'INR', originalCurrency: 'INR' };
  }

  return null;
}

export function extractTravelers(text) {
  const lower = text.toLowerCase();
  const match = lower.match(/(\d+)\s*(travelers?|people|persons?|pax|adults?)/);
  if (match) return parseInt(match[1], 10);
  if (/\bcouple\b|\bhoneymoon\b|\bpartner\b/.test(lower)) return 2;
  if (/\bsolo\b|\balone\b|\bmyself\b/.test(lower)) return 1;
  return null;
}

/**
 * Parses a free-text trip request into a structured object.
 * Missing fields are left null so callers can apply defaults or ask
 * a clarifying follow-up question.
 */
export function parseTripRequest(text) {
  const destinationId = extractDestination(text);
  const duration = extractDuration(text);
  const budgetInfo = extractBudget(text);
  const travelers = extractTravelers(text);

  return {
    raw: text,
    destinationId,
    duration,
    budget: budgetInfo ? budgetInfo.amount : null,
    currency: budgetInfo ? budgetInfo.currency : 'INR',
    originalCurrency: budgetInfo ? budgetInfo.originalCurrency : null,
    travelers,
    isValid: Boolean(destinationId || duration || budgetInfo),
  };
}
