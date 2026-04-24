import { create } from 'zustand'
import { subDays } from 'date-fns'

const DEFAULT_FILTERS = {
  types: [],
  specificTypes: [],
  timeRange: [0, 23],
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

  setCity: (cityId) => set({
    city: cityId,
    selectedIncident: null,
    dataAsOf: null,
    allIncidents: [],
    incidents: [],
    filters: DEFAULT_FILTERS,
  }),
  triggerRecenter: () => set(s => ({ recenterKey: s.recenterKey + 1 })),
  selectIncident: (incident) => set({ selectedIncident: incident }),
  clearSelectedIncident: () => set({ selectedIncident: null }),
  setDateRange: (dateRange) => set({ dateRange }),
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
