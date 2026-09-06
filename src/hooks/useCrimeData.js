import { useEffect, useRef } from 'react'
import { subDays } from 'date-fns'
import { CITIES } from '../constants/cities.js'
import { fetchArcgis } from '../services/arcgis.js'
import { fetchSoda } from '../services/soda.js'
import { fetchDetroit } from '../services/detroit.js'
import { enrichNeighborhoods } from '../services/neighborhoods.js'
import { normalizeIncident } from '../utils/normalize.js'
import { applyFilters } from '../utils/filters.js'
import useCrimeStore from '../store/crimeStore.js'

export const useCrimeData = () => {
  const cityId = useCrimeStore(s => s.city)
  const reloadKey = useCrimeStore(s => s.reloadKey)
  const dateRange = useCrimeStore(s => s.dateRange)
  const filters = useCrimeStore(s => s.filters)
  const cache = useRef({})

  useEffect(() => {
    const city = CITIES[cityId]
    if (!city) return
    const controller = new AbortController()
    let cancelled = false
    const publish = (source) => {
      if (cancelled) return
      const state = useCrimeStore.getState()
      const latest = source.reduce((max, i) => Math.max(max, i.date.getTime()), -Infinity)
      const dataAsOf = Number.isFinite(latest) ? new Date(latest) : null
      const range = dataAsOf
        ? { start: subDays(dataAsOf, state.presetDays), end: dataAsOf }
        : state.dateRange
      useCrimeStore.setState({
        allIncidents: source, incidents: applyFilters(source, state.filters, range),
        dateRange: range, dataAsOf, loading: false, error: null,
      })
    }
    useCrimeStore.setState({ loading: true, error: null })
    const fetchData = async () => {
      try {
        const cached = cache.current[cityId]
        if (cached && cached.reloadKey === reloadKey) {
          publish(cached.incidents)
          return
        }
        const options = { signal: controller.signal }
        const raw = cityId === 'detroit' ? await fetchDetroit(options)
          : city.type === 'arcgis' ? await fetchArcgis(city, options)
          : await fetchSoda(city, options)
        if (cancelled) return
        let incidents = raw.map(r => normalizeIncident(r, city)).filter(Boolean)
        if (city.neighborhoodBoundary) incidents = await enrichNeighborhoods(incidents, city)
        if (cancelled) return
        cache.current[cityId] = { incidents, reloadKey }
        publish(incidents)
      } catch (err) {
        if (cancelled) return
        useCrimeStore.setState({
          loading: false, error: `Unable to load ${city.name} data. Please try again.`,
          allIncidents: [], incidents: [], dataAsOf: null, selectedIncident: null,
        })
      }
    }
    fetchData()
    return () => { cancelled = true; controller.abort() }
  }, [cityId, reloadKey])

  useEffect(() => {
    const state = useCrimeStore.getState()
    const incidents = applyFilters(state.allIncidents, filters, dateRange)
    const selected = state.selectedIncident
    useCrimeStore.setState({
      incidents,
      selectedIncident: selected && incidents.some(i => i.id === selected.id && i.city === selected.city)
        ? selected : null,
    })
  }, [cityId, filters, dateRange])
}
