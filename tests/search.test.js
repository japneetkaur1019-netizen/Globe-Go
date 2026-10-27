import test from 'node:test';
import assert from 'node:assert/strict';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { serviceSelected, searchSubmitted } from '../src/store/searchSlice.js';
import { validateSearch, parseDates, parseTravelers, defaultSearchValues } from '../src/utils/searchValidation.js';

const valid = { whereTo: 'Tokyo', dates: '2027-01-01 to 2027-01-07', travelers: '2 travelers, 1 room' };
test('valid search parses all travel details', () => {
  assert.deepEqual(validateSearch(valid, '2026-10-26'), {});
  assert.deepEqual(parseDates(valid.dates), { startDate: '2027-01-01', endDate: '2027-01-07' });
  assert.deepEqual(parseTravelers(valid.travelers), { guests: 2, rooms: 1 });
});
test('rejects empty destination, past/reversed/impossible dates and invalid traveler counts', () => {
  assert.ok(validateSearch({ ...valid, whereTo: '  ' }).whereTo);
  for (const dates of ['2027-02-30 to 2027-03-04', '2027-01-07 to 2027-01-01', '2020-01-01 to 2020-01-07', '2027-01-01 to 2027-01-01', 'tomorrow']) {
    assert.ok(validateSearch({ ...valid, dates }, '2026-10-26').dates);
  }
  for (const travelers of ['0 travelers, 1 room', '10 travelers, 1 room', '2 travelers, 3 rooms', '2 travelers, 0 rooms', 'many']) {
    assert.ok(validateSearch({ ...valid, travelers }).travelers);
  }
});
test('generated defaults have future valid dates', () => {
  assert.deepEqual(validateSearch({ ...defaultSearchValues(), whereTo: 'Goa' }), {});
});
test('Redux switches services, rejects unknown tabs and retains submitted search without mutation', () => {
  const store = configureStore({ reducer: { search: reducer } });
  const before = store.getState();
  store.dispatch(serviceSelected('flights'));
  store.dispatch(serviceSelected('unknown'));
  store.dispatch(searchSubmitted({ destination: 'Tokyo', guests: 2, formValues: valid }));
  assert.equal(store.getState().search.activeService, 'flights');
  assert.equal(store.getState().search.lastSearch.destination, 'Tokyo');
  assert.equal(before.search.activeService, 'hotels');
  assert.equal(before.search.lastSearch, null);
});
