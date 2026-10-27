// Public destination coordinates only; this never requests the user's location.
export async function getCurrentWeather({ latitude, longitude }, { signal, fetchImpl = fetch } = {}) {
  const query = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude),
    current: 'temperature_2m', temperature_unit: 'celsius', timezone: 'auto',
  });
  const timeout = AbortSignal.timeout(10000);
  const response = await fetchImpl(`https://api.open-meteo.com/v1/forecast?${query}`, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new Error(`Weather service returned HTTP ${response.status}.`);
  const data = await response.json();
  if (!Number.isFinite(data.current?.temperature_2m) || typeof data.current?.time !== 'string') {
    throw new Error('Weather service returned invalid data.');
  }
  return { temperature: data.current.temperature_2m, time: data.current.time };
}
