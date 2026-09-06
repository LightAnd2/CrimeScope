const PAGE_SIZE = 2000
const DEFAULT_MAX_RECORDS = 10000

export const fetchArcgis = async (city, { signal } = {}) => {
  const all = []
  let offset = 0
  const maxRecords = city.maxRecords ?? DEFAULT_MAX_RECORDS

  while (true) {
    const params = new URLSearchParams({
      where: city.where ?? '1=1',
      outFields: city.outFields,
      f: 'json',
      resultRecordCount: String(Math.min(PAGE_SIZE, maxRecords - all.length)),
      resultOffset: String(offset),
      orderByFields: `${city.orderByField ?? city.dateField} DESC`,
      returnGeometry: city.coordGeometry ? 'true' : 'false',
    })

    if (city.coordGeometry) {
      params.set('outSR', '4326')
    }

    const res = await fetch(`${city.endpoint}?${params}`, { signal })
    if (!res.ok) throw new Error(`${city.name} API error: ${res.status}`)

    const data = await res.json()
    if (data.error) throw new Error(`${city.name} API: ${data.error.message}`)

    const features = data.features || []

    if (city.coordGeometry) {
      all.push(...features.map(f => ({
        ...f.attributes,
        _geo_lat: f.geometry?.y,
        _geo_lng: f.geometry?.x,
      })))
    } else {
      all.push(...features.map(f => f.attributes))
    }

    if ((!data.exceededTransferLimit && features.length < PAGE_SIZE) || all.length >= maxRecords) break
    if (!features.length) break
    offset += features.length
  }

  return all.slice(0, maxRecords)
}
