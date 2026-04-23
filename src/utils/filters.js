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

    // Hour of day filter
    const hour = incident.date.getHours()
    if (hour < filters.timeRange[0] || hour > filters.timeRange[1])
      return false

    return true
  })
}
