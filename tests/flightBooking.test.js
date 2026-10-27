import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, flightReducer, getPassengerCount, getBookingRedirect } from '../src/reducers/flightReducer.js';

const search = { origin: { code: 'DEL' }, destination: { code: 'BOM' }, adults: 2, children: 1 };
const selectedFlight = { id: 'demo-1', price: 5000 };
const passengers = [{ id: 'adult-1' }, { id: 'adult-2' }, { id: 'child-1' }];
const ready = { ...initialState, search, selectedFlight, passengers };
const completed = { ...ready, payment: { status: 'completed', flightId: 'demo-1' }, seats: { 'adult-1': '1A' }, booking: { reference: 'old' } };

test('searched party count includes children and rejects invalid counts', () => {
  assert.equal(getPassengerCount(search), 3);
  assert.equal(getPassengerCount({ adults: 2, children: 0 }), 2);
  assert.equal(getPassengerCount({ adults: 0, children: 1 }), 0);
  assert.equal(getPassengerCount({ adults: 8, children: 2 }), 0);
  assert.equal(getPassengerCount({ adults: 1.5 }), 0);
});

test('booking steps redirect incomplete search, flight or traveler details', () => {
  assert.equal(getBookingRedirect(initialState, 'search'), '/flights');
  assert.equal(getBookingRedirect({ ...initialState, search }, 'flight'), '/flights/results');
  assert.equal(getBookingRedirect({ ...ready, passengers: passengers.slice(0, 1) }, 'passengers'), '/flights/passengers');
  assert.equal(getBookingRedirect({ ...ready, passengers: [...passengers, { id: 'extra' }] }, 'passengers'), '/flights/passengers');
  assert.equal(getBookingRedirect(ready, 'passengers'), null);
});

test('confirmation requires completed checkout for this demo flight and excludes live offers', () => {
  assert.equal(getBookingRedirect(ready, 'confirmation'), '/flights/payment');
  assert.equal(getBookingRedirect({ ...completed, payment: { status: 'processing', flightId: 'demo-1' } }, 'confirmation'), '/flights/payment');
  assert.equal(getBookingRedirect({ ...completed, payment: { status: 'completed', flightId: 'old-flight' } }, 'confirmation'), '/flights/payment');
  assert.equal(getBookingRedirect({ ...completed, selectedFlight: { ...selectedFlight, isLiveOffer: true } }, 'confirmation'), '/flights/results');
  assert.equal(getBookingRedirect(completed, 'confirmation'), null);
});

test('new search clears the previous flight, travelers, seats and checkout', () => {
  const next = flightReducer(completed, { type: 'SET_SEARCH', payload: { ...search, destination: { code: 'HND' } } });
  assert.equal(next.selectedFlight, null);
  assert.deepEqual(next.passengers, []);
  assert.deepEqual(next.seats, {});
  assert.equal(next.payment, null);
  assert.equal(next.booking, null);
  assert.equal(getBookingRedirect(next, 'confirmation'), '/flights/results');
});

test('changing flight, passengers or seats invalidates completed checkout', () => {
  for (const action of [
    { type: 'SELECT_FLIGHT', payload: { ...selectedFlight, id: 'demo-2' } },
    { type: 'SET_PASSENGERS', payload: passengers },
    { type: 'SET_SEAT', payload: { passengerId: 'adult-1', seatId: '2B' } },
    { type: 'SET_SEATS', payload: { 'adult-1': '2B' } },
  ]) {
    const next = flightReducer(completed, action);
    assert.equal(next.payment, null);
    assert.equal(next.booking, null);
    assert.equal(getBookingRedirect(next, 'confirmation'), '/flights/payment');
  }
  assert.equal(completed.payment.status, 'completed');
});

test('demo payment state transitions from processing to completed', () => {
  const processing = flightReducer(ready, { type: 'SET_PAYMENT', payload: { status: 'processing', flightId: selectedFlight.id, totalAmount: 15000 } });
  assert.equal(getBookingRedirect(processing, 'confirmation'), '/flights/payment');
  const paid = flightReducer(processing, { type: 'SET_PAYMENT', payload: { status: 'completed', flightId: selectedFlight.id } });
  assert.equal(paid.payment.totalAmount, 15000);
  assert.equal(getBookingRedirect(paid, 'confirmation'), null);
});
