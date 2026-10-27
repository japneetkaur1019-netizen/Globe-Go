import test from 'node:test';
import assert from 'node:assert/strict';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchDestinationWeather } from '../src/store/weatherSlice.js';
import { getCurrentWeather } from '../src/services/weatherApi.js';

const destination = { id: 'kyoto', latitude: 35.0116, longitude: 135.7681 };
const success = () => Promise.resolve({ ok: true, json: async () => ({ current: { temperature_2m: 21.4, time: '2026-10-26T12:00' } }) });

test('weather API sends correct coordinates and parses temperature', async () => {
  const result = await getCurrentWeather(destination, { fetchImpl: async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://api.open-meteo.com');
    assert.equal(parsed.searchParams.get('latitude'), '35.0116');
    assert.equal(parsed.searchParams.get('current'), 'temperature_2m');
    assert.ok(options.signal);
    return success();
  } });
  assert.equal(result.temperature, 21.4);
});

test('weather API rejects HTTP errors, missing fields and network failures', async () => {
  await assert.rejects(getCurrentWeather(destination, { fetchImpl: async () => ({ ok: false, status: 429 }) }), /429/);
  await assert.rejects(getCurrentWeather(destination, { fetchImpl: async () => ({ ok: true, json: async () => ({ current: {} }) }) }), /invalid data/);
  await assert.rejects(getCurrentWeather(destination, { fetchImpl: async () => { throw new Error('offline'); } }), /offline/);
});

test('Redux exposes loading/success, deduplicates requests and caches results', async (t) => {
  let resolveRequest;
  let count = 0;
  t.mock.method(globalThis, 'fetch', () => { count++; return new Promise((resolve) => { resolveRequest = resolve; }); });
  const store = configureStore({ reducer: { weather: reducer } });
  const request = store.dispatch(fetchDestinationWeather(destination));
  assert.equal(store.getState().weather.byDestination.kyoto.status, 'loading');
  await store.dispatch(fetchDestinationWeather(destination));
  assert.equal(count, 1);
  resolveRequest(await success());
  await request;
  assert.equal(store.getState().weather.byDestination.kyoto.temperature, 21.4);
  await store.dispatch(fetchDestinationWeather(destination));
  assert.equal(count, 1);
});

test('failed weather can be retried and other destination responses remain independent', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => { throw new Error('offline'); });
  const store = configureStore({ reducer: { weather: reducer } });
  await store.dispatch(fetchDestinationWeather(destination));
  assert.equal(store.getState().weather.byDestination.kyoto.status, 'failed');
  assert.match(store.getState().weather.byDestination.kyoto.error, /retry/);
  mock.mock.mockImplementation(success);
  await store.dispatch(fetchDestinationWeather(destination));
  await store.dispatch(fetchDestinationWeather({ ...destination, id: 'another-city' }));
  assert.equal(store.getState().weather.byDestination.kyoto.status, 'succeeded');
  assert.equal(store.getState().weather.byDestination['another-city'].status, 'succeeded');
});
