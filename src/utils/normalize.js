import { normalizeType, getSeverity } from '../constants/crimeTypes.js'
import { getChicagoNeighborhood } from '../constants/chicagoAreas.js'

const titleize = (value) => value
  .toLowerCase()
  .split(/[\s_-]+/)
  .filter(Boolean)
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ')

const getDallasNeighborhood = (value) => {
  const normalized = String(value || '').trim().toUpperCase()

  switch (normalized) {
    case 'CBD':
    case 'CENTRAL':
      return 'Downtown Dallas'
    case 'NORTH CENTRAL':
      return 'North Dallas'
    case 'NORTHEAST':
      return 'Northeast Dallas'
    case 'NORTHWEST':
      return 'Northwest Dallas'
    case 'SOUTH CENTRAL':
      return 'South Dallas'
    case 'SOUTHEAST':
      return 'Southeast Dallas'
    case 'SOUTHWEST':
      return 'Southwest Dallas'
    default:
      return titleize(normalized)
  }
}

export const normalizeIncident = (raw, city) => {
  const f = city.fields

  let lat, lng
  if (city.coordNested) {
    lat = parseFloat(raw.geocoded_column?.latitude)
    lng = parseFloat(raw.geocoded_column?.longitude)
  } else if (city.coordGeoJson) {
    // GeoJSON Point: { coordinates: [lng, lat] }
    lat = raw[f.lat]?.coordinates?.[1]
    lng = raw[f.lat]?.coordinates?.[0]
  } else {
    lat = parseFloat(raw[f.lat])
    lng = parseFloat(raw[f.lng])
  }

  if (isNaN(lat) || isNaN(lng)) return null

  const rawDate = raw[f.date]
  const date = typeof rawDate === 'number'
    ? new Date(rawDate)
    : new Date(rawDate)

  if (isNaN(date.getTime())) return null
  if (city.maxFutureDays != null) {
    const maxFutureTime = Date.now() + city.maxFutureDays * 24 * 60 * 60 * 1000
    if (date.getTime() > maxFutureTime) return null
  }

  let neighborhood = raw[f.neighborhood] || ''
  if (city.neighborhoodTransform === 'chicago_community_area') {
    neighborhood = getChicagoNeighborhood(neighborhood)
  } else if (city.neighborhoodTransform === 'dallas_division') {
    neighborhood = getDallasNeighborhood(neighborhood)
  }

  const type = normalizeType(raw[f.type])

  return {
    id: raw[f.id] || String(Math.random()),
    type,
    severity: getSeverity(type),
    rawType: raw[f.type] || '',
    description: raw[f.description] || '',
    lat,
    lng,
    date,
    address: raw[f.address] || '',
    neighborhood,
    district: raw[f.district] || '',
    caseNumber: raw[f.caseNumber] || '',
    city: city.id,
  }
}
