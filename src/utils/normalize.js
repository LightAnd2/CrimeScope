import { normalizeType } from '../constants/crimeTypes.js'
import { getChicagoNeighborhood } from '../constants/chicagoAreas.js'

export const normalizeIncident = (raw, city) => {
  const f = city.fields

  let lat, lng
  if (city.coordNested) {
    lat = parseFloat(raw.geocoded_column?.latitude)
    lng = parseFloat(raw.geocoded_column?.longitude)
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

  let neighborhood = raw[f.neighborhood] || ''
  if (city.neighborhoodTransform === 'chicago_community_area') {
    neighborhood = getChicagoNeighborhood(neighborhood)
  }

  return {
    id: raw[f.id] || String(Math.random()),
    type: normalizeType(raw[f.type]),
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
