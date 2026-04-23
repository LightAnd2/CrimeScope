import { create } from 'zustand'
import { subDays } from 'date-fns'

const useCrimeStore = create((set) => ({
  city: 'chicago',
  selectedIncident: null,
  dataAsOf: null,         // latest date in the currently loaded dataset
  dateRange: {
    start: subDays(new Date(), 30),
    end: new Date(),
  },
  filters: {
    types: [],        // severity buckets
    specificTypes: [], // granular type override
    timeRange: [0, 23],
  },
  viewMode: 'pins',
  recenterKey: 0,
  incidents: [],
  loading: false,

  setCity: (cityId) => set({ city: cityId, selectedIncident: null, incidents: [], dataAsOf: null }),
  triggerRecenter: () => set(s => ({ recenterKey: s.recenterKey + 1 })),
  selectIncident: (incident) => set({ selectedIncident: incident }),
  clearSelectedIncident: () => set({ selectedIncident: null }),
  setDateRange: (dateRange) => set({ dateRange }),
  setDataAsOf: (date) => set({ dataAsOf: date }),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  setViewMode: (viewMode) => set({ viewMode }),
  setIncidents: (incidents) => set({ incidents }),
  setLoading: (loading) => set({ loading }),
}))

export default useCrimeStore
