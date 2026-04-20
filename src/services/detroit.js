const BASE = 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/RMS_Crime_Incidents/FeatureServer/0/query'
const PAGE_SIZE = 2000
const MAX_RECORDS = 10000 // ~2-3 weeks of Detroit data

export const fetchDetroit = async () => {
  // No date filter — get the most recent records, date filtering is client-side
  const where = `latitude IS NOT NULL AND latitude <> 0`
  const outFields = 'crime_id,offense_category,offense_description,incident_occurred_at,latitude,longitude,nearest_intersection,neighborhood,police_precinct,case_id'

  const all = []
  let offset = 0

  while (true) {
    const params = new URLSearchParams({
      where,
      outFields,
      f: 'json',
      resultRecordCount: String(PAGE_SIZE),
      resultOffset: String(offset),
      orderByFields: 'incident_occurred_at DESC',
      returnGeometry: 'false',
    })

    const res = await fetch(`${BASE}?${params}`)
    if (!res.ok) throw new Error(`Detroit API error: ${res.status}`)
    const data = await res.json()
    if (data.error) throw new Error(`Detroit API: ${data.error.message}`)

    const features = data.features || []
    all.push(...features.map(f => f.attributes))

    if (features.length < PAGE_SIZE || all.length >= MAX_RECORDS) break
    offset += PAGE_SIZE
  }

  return all
}
