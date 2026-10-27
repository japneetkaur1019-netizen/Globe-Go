export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function defaultSearchValues() {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { whereTo: '', dates: `${localDate(start)} to ${localDate(end)}`, travelers: '2 travelers, 1 room', addFlight: false, addCar: false };
}

export function parseDates(value) {
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  if (!match) return null;
  const valid = match.slice(1).every((part) => {
    const date = new Date(`${part}T12:00:00`);
    return !Number.isNaN(date.getTime()) && localDate(date) === part;
  });
  return valid ? { startDate: match[1], endDate: match[2] } : null;
}

export function parseTravelers(value) {
  const match = value.trim().match(/^(\d+)\s+travelers?,\s*(\d+)\s+rooms?$/i);
  return match ? { guests: Number(match[1]), rooms: Number(match[2]) } : null;
}

export function validateSearch(values, today = localDate()) {
  const errors = {};
  if (!values.whereTo.trim()) errors.whereTo = 'Enter a destination, city or resort.';
  const dates = parseDates(values.dates);
  if (!dates) errors.dates = 'Use YYYY-MM-DD to YYYY-MM-DD with valid dates.';
  else if (dates.startDate < today) errors.dates = 'Choose today or a future departure date.';
  else if (dates.endDate <= dates.startDate) errors.dates = 'The return date must be after departure.';
  const travelers = parseTravelers(values.travelers);
  if (!travelers || travelers.guests < 1 || travelers.guests > 9 || travelers.rooms < 1 || travelers.rooms > travelers.guests) {
    errors.travelers = 'Use 1–9 travelers and 1 room per traveler at most (e.g. 2 travelers, 1 room).';
  }
  return errors;
}
