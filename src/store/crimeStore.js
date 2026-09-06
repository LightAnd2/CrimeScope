import { create } from 'zustand'
import { subDays, differenceInDays } from 'date-fns'

const DEFAULT_FILTERS = {
  types: [],
  specificTypes: [],
  timeRange: [0, 24],
}

const useCrimeStore = create((set) => ({
  city: 'chicago',
  selectedIncident: null,
  dataAsOf: null,         // latest date in the currently loaded dataset
  dateRange: {
    start: subDays(new Date(), 30),
    end: new Date(),
  },
  filters: DEFAULT_FILTERS,
  viewMode: 'pins',
  recenterKey: 0,
  allIncidents: [],
  incidents: [],
  loading: false,
  error: null,
  reloadKey: 0,
  presetDays: 30,
  retry: () => set(s => ({ reloadKey: s.reloadKey + 1 })),

  setCity: (cityId) => set(s => s.city === cityId ? {} : ({
    city: cityId,
    error: null,
    loading: true,
    selectedIncident: null,
    dataAsOf: null,
    allIncidents: [],
    incidents: [],
    filters: DEFAULT_FILTERS,
  })),
  triggerRecenter: () => set(s => ({ recenterKey: s.recenterKey + 1 })),
  selectIncident: (incident) => set({ selectedIncident: incident }),
  clearSelectedIncident: () => set({ selectedIncident: null }),
  setDateRange: (dateRange) => set({ dateRange, presetDays: differenceInDays(dateRange.end, dateRange.start) }),
  setDataAsOf: (date) => set({ dataAsOf: date }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  setViewMode: (viewMode) => set({ viewMode }),
  setAllIncidents: (allIncidents) => set({ allIncidents }),
  setIncidents: (incidents) => set({ incidents }),
  setLoading: (loading) => set({ loading }),
}))

export default useCrimeStore
