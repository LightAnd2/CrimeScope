export const fetchSoda = async (city) => {
  const { nullCheck, dateField, fields } = city

  const selectFields = [...new Set([
    fields.id, fields.type, fields.description, fields.date,
    city.coordNested ? 'geocoded_column' : fields.lat,
    city.coordNested ? null : fields.lng,
    fields.address, fields.neighborhood, fields.district, fields.caseNumber,
  ])].filter(Boolean).join(',')

  // No date filter — fetch the most recent 50k records regardless of data lag
  // Date filtering is done client-side so stale city portals still show data
  const params = new URLSearchParams({
    '$where': `${nullCheck} IS NOT NULL`,
    '$limit': '50000',
    '$order': `${dateField} DESC`,
    '$select': selectFields,
  })

  const res = await fetch(`${city.endpoint}?${params}`)
  if (!res.ok) throw new Error(`${city.name} API error: ${res.status}`)
  return res.json()
}
