const PAGE_SIZE = 2000
const DEFAULT_MAX_RECORDS = 10000

export const fetchArcgis = async (city) => {
  const all = []
  let offset = 0
  const maxRecords = city.maxRecords ?? DEFAULT_MAX_RECORDS

  while (true) {
    const params = new URLSearchParams({
      where: city.where ?? '1=1',
      outFields: city.outFields,
      f: 'json',
      resultRecordCount: String(PAGE_SIZE),
      resultOffset: String(offset),
      orderByFields: `${city.dateField} DESC`,
      returnGeometry: 'false',
    })

    const res = await fetch(`${city.endpoint}?${params}`)
    if (!res.ok) throw new Error(`${city.name} API error: ${res.status}`)

    const data = await res.json()
    if (data.error) throw new Error(`${city.name} API: ${data.error.message}`)

    const features = data.features || []
    all.push(...features.map(feature => feature.attributes))

    if (features.length < PAGE_SIZE || all.length >= maxRecords) break
    offset += PAGE_SIZE
  }

  return all
}
