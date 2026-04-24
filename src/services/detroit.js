import { CITIES } from '../constants/cities.js'
import { fetchArcgis } from './arcgis.js'

export const fetchDetroit = async () => fetchArcgis({
  ...CITIES.detroit,
  where: 'latitude IS NOT NULL AND latitude <> 0',
  outFields: 'crime_id,offense_category,offense_description,incident_occurred_at,latitude,longitude,nearest_intersection,neighborhood,police_precinct,case_id',
  maxRecords: 10000,
})
