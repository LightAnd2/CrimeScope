import { formatISODate } from '../utils/formatDate.js'

const BASE = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json'

export const fetchChicago = async (dateRange) => {
  const start = formatISODate(dateRange.start)
  const params = new URLSearchParams({
    '$where': `date >= '${start}' AND latitude IS NOT NULL`,
    '$limit': '50000',
    '$order': 'date DESC',
    '$select': 'id,primary_type,description,date,block,latitude,longitude,community_area,district,case_number',
  })

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`Chicago API error: ${res.status}`)
  return res.json()
}
