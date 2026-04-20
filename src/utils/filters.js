export const applyFilters = (incidents, filters, dateRange) => {
  return incidents.filter(incident => {
    // Date range filter
    if (dateRange?.start && incident.date < dateRange.start) return false
    if (dateRange?.end && incident.date > dateRange.end) return false

    // Crime type filter
    if (filters.types.length > 0 && !filters.types.includes(incident.type))
      return false

    // Hour of day filter
    const hour = incident.date.getHours()
    if (hour < filters.timeRange[0] || hour > filters.timeRange[1])
      return false

    return true
  })
}
