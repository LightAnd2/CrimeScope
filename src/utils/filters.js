export const applyFilters = (incidents, filters, dateRange) => {
  return incidents.filter(incident => {
    // Date range filter
    if (dateRange?.start && incident.date < dateRange.start) return false
    if (dateRange?.end && incident.date > dateRange.end) return false

    // Specific type filter (granular — overrides severity filter)
    if (filters.specificTypes?.length > 0) {
      if (!filters.specificTypes.includes(incident.type)) return false
    } else if (filters.types.length > 0) {
      // Severity filter (coarse)
      if (!filters.types.includes(incident.severity)) return false
    }

    // Hour of day filter — end is exclusive (1 AM–2 AM = only hour 1)
    // hTo=24 means "through midnight" (no upper cap)
    const hour = incident.date.getHours()
    const [hFrom, hTo] = filters.timeRange
    if (hFrom <= hTo) {
      if (hour < hFrom) return false
      if (hTo < 24 && hour >= hTo) return false
    } else {
      // overnight wrap (e.g. 10 PM → 2 AM): keep hour >= hFrom OR hour < hTo
      if (hour < hFrom && hour >= hTo) return false
    }

    return true
  })
}
