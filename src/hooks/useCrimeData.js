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

// Compute the effective date range anchored to the latest available data
const getEffectiveDateRange = (normalized) => {
  if (!normalized.length) return null
  const maxTime = Math.max(...normalized.map(i => i.date.getTime()))
  const maxDate = new Date(maxTime)
  // Always anchor to the actual latest data so presets always show a full window
  return { start: subDays(maxDate, 30), end: maxDate, ref: maxDate }
}

export const useCrimeData = () => {
  const cityId = useCrimeStore(s => s.city)
  const dateRange = useCrimeStore(s => s.dateRange)
  const filters = useCrimeStore(s => s.filters)
  const selectedIncident = useCrimeStore(s => s.selectedIncident)
  const clearSelectedIncident = useCrimeStore(s => s.clearSelectedIncident)
  const setAllIncidents = useCrimeStore(s => s.setAllIncidents)
  const setIncidents = useCrimeStore(s => s.setIncidents)
  const setLoading = useCrimeStore(s => s.setLoading)
  const setDataAsOf = useCrimeStore(s => s.setDataAsOf)
  const setDateRange = useCrimeStore(s => s.setDateRange)
  const cache = useRef({})

  const syncFilteredIncidents = (source, activeFilters, activeDateRange) => {
    const filtered = applyFilters(source, activeFilters, activeDateRange)
    setAllIncidents(source)
    setIncidents(filtered)

    if (selectedIncident) {
      const stillVisible = filtered.some(i =>
        i.id === selectedIncident.id && i.city === selectedIncident.city
      )
      if (!stillVisible) clearSelectedIncident()
    }
  }

  // Fetch when city changes — no date param, always get most recent data
  useEffect(() => {
    const cityConfig = CITIES[cityId]
    if (!cityConfig) return

    const cacheKey = cityId

    if (cache.current[cacheKey]) {
      // Cache hit: reset date range for this city, then filter
      const cached = cache.current[cacheKey]
      const effectiveDateRange = getEffectiveDateRange(cached)
      if (effectiveDateRange) {
        setDataAsOf(effectiveDateRange.ref)
        setDateRange({ start: effectiveDateRange.start, end: effectiveDateRange.end })
        syncFilteredIncidents(cached, filters, effectiveDateRange)
      } else {
        syncFilteredIncidents(cached, filters, dateRange)
      }
      return
    }

    let cancelled = false

    const fetchData = async () => {
      setLoading(true)
      try {
        let raw
        if (cityId === 'detroit') {
          raw = await fetchDetroit()
        } else if (cityConfig.type === 'arcgis') {
          raw = await fetchArcgis(cityConfig)
        } else {
          raw = await fetchSoda(cityConfig)
        }

        let normalized = raw
          .map(r => normalizeIncident(r, cityConfig))
          .filter(Boolean)

        if (cityConfig.neighborhoodBoundary) {
          normalized = await enrichNeighborhoods(normalized, cityConfig)
        }

        if (!cancelled) {
          cache.current[cacheKey] = normalized
          setAllIncidents(normalized)

          // Always reset date range when city loads, relative to data freshness
          const effectiveDateRange = getEffectiveDateRange(normalized)
          if (effectiveDateRange) {
            setDataAsOf(effectiveDateRange.ref)
            setDateRange({ start: effectiveDateRange.start, end: effectiveDateRange.end })
          }

          syncFilteredIncidents(normalized, filters, effectiveDateRange ?? dateRange)
        }
      } catch (err) {
        console.error(`[${cityId}] fetch error:`, err)
        if (!cancelled) {
          setAllIncidents([])
          setIncidents([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [cityId])

  // Re-filter when filters or date range changes (no re-fetch)
  useEffect(() => {
    const cacheKey = cityId
    if (cache.current[cacheKey]) {
      syncFilteredIncidents(cache.current[cacheKey], filters, dateRange)
    }
  }, [cityId, filters, dateRange, selectedIncident])
}
