// Flight search proxy. Duffel credentials stay on the server.

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load local development secrets without adding a dotenv dependency.
try {
  const envText = await readFile(join(__dirname, '.env'), 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !Object.hasOwn(process.env, match[1])) {
      process.env[match[1]] = match[2].replace(/^(?:"([^"]*)"|'([^']*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted);
    }
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const PORT = process.env.PORT || 4000;
const CABIN_CLASSES = {
  Economy: 'economy',
  'Premium Economy': 'premium_economy',
  Business: 'business',
  First: 'first',
};

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 32_000) {
        reject(Object.assign(new Error('Request body is too large.'), { status: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(Object.assign(new Error('Request body must be valid JSON.'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isoDurationMinutes(value = '') {
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);
  return match ? Number(match[1] || 0) * 60 + Number(match[2] || 0) : 0;
}

function formatDuration(value = '') {
  const minutes = isoDurationMinutes(value);
  return minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : value;
}

function toFlight(offer, origin, destination, passengerCount) {
  const slices = offer.slices || [];
  const segments = slices[0]?.segments || [];
  const first = segments[0];
  const last = segments.at(-1);
  if (!first || !last) return null;

  const departure = first.departing_at || '';
  const arrival = last.arriving_at || '';
  const amount = Number(offer.total_amount);
  const currency = offer.total_currency || 'INR';
  const airline = first.operating_carrier?.name || first.marketing_carrier?.name || offer.owner?.name || 'Airline';
  const flightNumber = segments.map((segment) =>
    `${segment.marketing_carrier?.iata_code || segment.operating_carrier?.iata_code || ''}${segment.marketing_carrier_flight_number || ''}`
  ).filter(Boolean).join(' / ');
  const returnSegments = slices[1]?.segments || [];
  const returnFirst = returnSegments[0];
  const returnLast = returnSegments.at(-1);
  const returnFlight = returnFirst && returnLast ? {
    from: returnFirst.origin?.iata_code || destination,
    to: returnLast.destination?.iata_code || origin,
    departure: (returnFirst.departing_at || '').slice(11, 16),
    arrival: (returnLast.arriving_at || '').slice(11, 16),
    date: (returnFirst.departing_at || '').slice(0, 10),
    flightNumber: returnSegments.map((segment) =>
      `${segment.marketing_carrier?.iata_code || segment.operating_carrier?.iata_code || ''}${segment.marketing_carrier_flight_number || ''}`
    ).filter(Boolean).join(' / '),
  } : null;

  return {
    id: offer.id,
    duffelOfferId: offer.id,
    isLiveOffer: true,
    airline,
    flightNumber: flightNumber || offer.id,
    from: first.origin?.iata_code || origin,
    to: last.destination?.iata_code || destination,
    departure: departure.slice(11, 16),
    arrival: arrival.slice(11, 16),
    duration: formatDuration(slices[0]?.duration),
    durationMinutes: isoDurationMinutes(slices[0]?.duration),
    stops: Math.max(0, segments.length - 1),
    price: amount / passengerCount,
    totalPrice: amount,
    currency,
    returnFlight,
    rating: null,
    refundable: false,
  };
}

async function searchDuffelFlights(search) {
  const token = process.env.DUFFEL_ACCESS_TOKEN;
  if (!token) {
    return { source: 'demo', message: 'Live flight search is not configured. Add DUFFEL_ACCESS_TOKEN to .env to enable it.', data: [] };
  }

  const origin = String(search.origin || '').toUpperCase();
  const destination = String(search.destination || '').toUpperCase();
  const adults = Number(search.adults || 1);
  const children = Number(search.children || 0);
  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination) || origin === destination) {
    throw Object.assign(new Error('Choose two different valid airport codes.'), { status: 400 });
  }
  if (!validDate(search.departDate) || (search.returnDate && !validDate(search.returnDate))) {
    throw Object.assign(new Error('Choose valid departure and return dates.'), { status: 400 });
  }
  if (!Number.isInteger(adults) || adults < 1 || adults > 9 || !Number.isInteger(children) || children < 0 || adults + children > 9) {
    throw Object.assign(new Error('Duffel searches support 1–9 passengers per request.'), { status: 400 });
  }

  const slices = [{ origin, destination, departure_date: search.departDate }];
  if (search.returnDate) slices.push({ origin: destination, destination: origin, departure_date: search.returnDate });
  const passengers = [
    ...Array.from({ length: adults }, () => ({ type: 'adult' })),
    ...Array.from({ length: children }, () => ({ type: 'child' })),
  ];
  const response = await fetch('https://api.duffel.com/air/offer_requests?return_offers=true&supplier_timeout=20000', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Duffel-Version': 'v2',
    },
    body: JSON.stringify({ data: {
      slices,
      passengers,
      cabin_class: CABIN_CLASSES[search.cabin] || 'economy',
      max_connections: 2,
    } }),
    signal: AbortSignal.timeout(45_000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.errors?.map((item) => item.message).filter(Boolean).join(' ') || `Duffel flight search failed (${response.status}).`;
    throw Object.assign(new Error(message), { status: response.status >= 500 ? 502 : response.status });
  }
  const offers = payload.data?.offers || [];
  return {
    source: 'duffel',
    message: offers.length ? '' : 'Duffel returned no offers for these dates and airports.',
    data: offers.map((offer) => toFlight(offer, origin, destination, passengers.length)).filter(Boolean),
  };
}

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'POST' && url.pathname === '/api/flights/search') {
    try {
      const result = await searchDuffelFlights(await readRequestBody(req));
      sendJson(res, 200, result);
    } catch (error) {
      sendJson(res, error.status || 502, { error: error.message || 'Flight search failed.' });
    }
    return;
  }
  sendJson(res, 404, { error: 'Not found' });
}).listen(PORT, () => {
  console.log(`Flight API listening on http://localhost:${PORT}`);
});
