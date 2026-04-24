import { useEffect, useRef } from 'react'
import { subDays, differenceInDays } from 'date-fns'
import useCrimeStore from '../store/crimeStore.js'
import { CITIES } from '../constants/cities.js'

const PRESET_DAYS = [14, 30, 60]

// Read URL params once on mount and apply to store
export function useUrlInit() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const p = new URLSearchParams(window.location.search)

    const cityId = p.get('city')
    if (cityId && CITIES[cityId]) {
      useCrimeStore.getState().setCity(cityId)
    }

    const days = parseInt(p.get('days'))
    if (PRESET_DAYS.includes(days)) {
      const ref = useCrimeStore.getState().dataAsOf ?? new Date()
      useCrimeStore.getState().setDateRange({
        start: subDays(ref, days),
        end: ref,
      })
    }

    const types = p.get('types')
    if (types) {
      useCrimeStore.getState().setFilter('types', types.split(',').filter(Boolean))
    }

    const from = p.get('from')
    const to   = p.get('to')
    if (from !== null && to !== null) {
      useCrimeStore.getState().setFilter('timeRange', [parseInt(from), parseInt(to)])
    }

    const mode = p.get('mode')
    if (mode === 'heatmap' || mode === 'pins') {
      useCrimeStore.getState().setViewMode(mode)
    }
  }, [])
}

// Keep URL in sync as store changes
export function useUrlSync() {
  useEffect(() => {
    return useCrimeStore.subscribe((state) => {
      const p = new URLSearchParams()

      p.set('city', state.city)

      // days preset or skip (default 30 is implicit)
      const ref = state.dataAsOf ?? new Date()
      const days = Math.round(differenceInDays(ref, state.dateRange.start))
      if (PRESET_DAYS.includes(days)) p.set('days', String(days))

      if (state.filters.types.length > 0) {
        p.set('types', state.filters.types.join(','))
      }

      const [from, to] = state.filters.timeRange
      if (from !== 0 || to !== 24) {
        p.set('from', String(from))
        p.set('to',   String(to))
      }

      if (state.viewMode !== 'pins') p.set('mode', state.viewMode)

      const qs = p.toString()
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
      window.history.replaceState(null, '', newUrl)
    })
  }, [])
}
