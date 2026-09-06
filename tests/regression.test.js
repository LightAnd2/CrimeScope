import test from 'node:test'
import assert from 'node:assert/strict'
import { applyFilters } from '../src/utils/filters.js'
import { normalizeIncident } from '../src/utils/normalize.js'
import { fetchArcgis } from '../src/services/arcgis.js'
import { fetchSoda } from '../src/services/soda.js'
import useCrimeStore from '../src/store/crimeStore.js'
import { subDays } from 'date-fns'

const filters = { types: [], specificTypes: [], timeRange: [0, 24] }
const incidents = [0, 1, 2, 12, 22, 23].map(hour => ({ id: hour, date: new Date(2026, 0, 10, hour), type: hour === 1 ? 'THEFT' : 'BATTERY', severity: hour === 1 ? 'property' : 'violent' }))
test('overnight hours wrap and exclude the end hour', () => {
  assert.deepEqual(applyFilters(incidents, { ...filters, timeRange: [22, 2] }).map(i => i.id), [0, 1, 22, 23])
  assert.equal(applyFilters(incidents, filters).length, 6)
})
test('specific types override severity and date boundaries remain inclusive', () => {
  assert.deepEqual(applyFilters(incidents, { ...filters, types: ['violent'], specificTypes: ['THEFT'] }).map(i => i.id), [1])
  assert.deepEqual(applyFilters(incidents, filters, { start: incidents[1].date, end: incidents[2].date }).map(i => i.id), [1, 2])
})
const city = { id: 'test', fields: { id: 'id', lat: 'lat', lng: 'lng', date: 'date', type: 'type' } }
const raw = { lat: '41.9', lng: '-87.6', date: '2026-01-10T12:00:00', type: 'THEFT' }
test('normalization rejects missing dates and invalid map coordinates', () => {
  for (const patch of [{ date: null }, { date: '' }, { date: 'bad' }, { lat: 'Infinity' }, { lat: '91' }, { lng: '-181' }, { lat: 0, lng: 0 }]) {
    assert.equal(normalizeIncident({ ...raw, ...patch }, city), null)
  }
  assert.equal(normalizeIncident(raw, city).id, normalizeIncident(raw, city).id)
  assert.equal(normalizeIncident({ ...raw, id: 0 }, city).id, 0)
})
test('city changes preserve date preset and clear old incidents and errors', () => {
  const end = new Date(2026, 0, 10)
  useCrimeStore.getState().setDateRange({ start: subDays(end, 60), end })
  useCrimeStore.setState({ incidents, allIncidents: incidents, error: 'failed', selectedIncident: incidents[0] })
  useCrimeStore.getState().setCity('detroit')
  const state = useCrimeStore.getState()
  assert.equal(state.presetDays, 60)
  assert.deepEqual(state.incidents, [])
  assert.equal(state.selectedIncident, null)
  assert.equal(state.error, null)
})
test('ArcGIS follows server-limited pages with correct offsets and record cap', async t => {
  const urls = []
  const signal = new AbortController().signal
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    urls.push(new URL(url))
    assert.equal(options.signal, signal)
    return { ok: true, json: async () => ({ exceededTransferLimit: true, features: [{ attributes: { id: urls.length } }] }) }
  })
  const result = await fetchArcgis({ name: 'Test', endpoint: 'https://example.com/query', dateField: 'date', outFields: '*', maxRecords: 3 }, { signal })
  assert.equal(result.length, 3)
  assert.deepEqual(urls.map(u => u.searchParams.get('resultOffset')), ['0', '1', '2'])
  assert.deepEqual(urls.map(u => u.searchParams.get('resultRecordCount')), ['3', '2', '1'])
})
test('ArcGIS surfaces API errors instead of publishing an empty dataset', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ error: { message: 'Unavailable' } }) }))
  await assert.rejects(fetchArcgis({ endpoint: 'https://example.com', dateField: 'date' }), /Unavailable/)
})
test('Socrata passes cancellation through to fetch', async t => {
  const signal = new AbortController().signal
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    assert.equal(options.signal, signal)
    throw new DOMException('Aborted', 'AbortError')
  })
  await assert.rejects(fetchSoda({ ...city, endpoint: 'https://example.com', nullCheck: 'lat', dateField: 'date' }, { signal }), { name: 'AbortError' })
})
