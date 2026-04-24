const boundaryCache = new Map()
const CELL_SIZE = 0.02

const ringContainsPoint = (ring, lng, lat) => {
  let inside = false

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]

    const intersects = ((yi > lat) !== (yj > lat))
      && (lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi)

    if (intersects) inside = !inside
  }

  return inside
}

const polygonContainsPoint = (polygon, lng, lat) => {
  if (!polygon?.length) return false
  if (!ringContainsPoint(polygon[0], lng, lat)) return false

  for (let i = 1; i < polygon.length; i++) {
    if (ringContainsPoint(polygon[i], lng, lat)) return false
  }

  return true
}

const geometryContainsPoint = (geometry, lng, lat) => {
  if (!geometry) return false

  if (geometry.type === 'Polygon') {
    return polygonContainsPoint(geometry.coordinates, lng, lat)
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some(polygon => polygonContainsPoint(polygon, lng, lat))
  }

  return false
}

const getBoundingBox = (geometry) => {
  const bounds = {
    minLng: Infinity,
    minLat: Infinity,
    maxLng: -Infinity,
    maxLat: -Infinity,
  }

  const visit = (coords) => {
    if (!Array.isArray(coords)) return

    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      const [lng, lat] = coords
      bounds.minLng = Math.min(bounds.minLng, lng)
      bounds.minLat = Math.min(bounds.minLat, lat)
      bounds.maxLng = Math.max(bounds.maxLng, lng)
      bounds.maxLat = Math.max(bounds.maxLat, lat)
      return
    }

    coords.forEach(visit)
  }

  visit(geometry.coordinates)
  return bounds
}

const pointInBounds = (bounds, lng, lat) =>
  lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat

const getCellCoord = (value) => Math.floor(value / CELL_SIZE)

const getBoundaryCellKeys = (bounds) => {
  const keys = []
  const minLngCell = getCellCoord(bounds.minLng)
  const maxLngCell = getCellCoord(bounds.maxLng)
  const minLatCell = getCellCoord(bounds.minLat)
  const maxLatCell = getCellCoord(bounds.maxLat)

  for (let lngCell = minLngCell; lngCell <= maxLngCell; lngCell++) {
    for (let latCell = minLatCell; latCell <= maxLatCell; latCell++) {
      keys.push(`${lngCell}:${latCell}`)
    }
  }

  return keys
}

const getPointCellKey = (lng, lat) => `${getCellCoord(lng)}:${getCellCoord(lat)}`

const loadNeighborhoodBoundaries = async (config) => {
  if (!config?.url) return []
  if (boundaryCache.has(config.url)) return boundaryCache.get(config.url)

  const promise = fetch(config.url)
    .then(async (res) => {
      if (!res.ok) throw new Error(`Neighborhood boundary API error: ${res.status}`)
      const geojson = await res.json()

      return (geojson.features || [])
        .map((feature) => {
          const name = feature.properties?.[config.property]
          if (!name || !feature.geometry) return null

          const bounds = getBoundingBox(feature.geometry)

          return {
            name,
            geometry: feature.geometry,
            bounds,
            cellKeys: getBoundaryCellKeys(bounds),
          }
        })
        .filter(Boolean)
    })
    .catch((err) => {
      boundaryCache.delete(config.url)
      throw err
    })

  boundaryCache.set(config.url, promise)
  return promise
}

export const enrichNeighborhoods = async (incidents, city) => {
  const config = city.neighborhoodBoundary
  if (!config?.url || !incidents.length) return incidents

  let boundaries
  try {
    boundaries = await loadNeighborhoodBoundaries(config)
  } catch (err) {
    console.warn(`[${city.id}] neighborhood enrichment unavailable:`, err)
    return incidents
  }

  if (!boundaries.length) return incidents

  const cellMap = new Map()
  for (const boundary of boundaries) {
    for (const key of boundary.cellKeys) {
      if (!cellMap.has(key)) cellMap.set(key, [])
      cellMap.get(key).push(boundary)
    }
  }

  return incidents.map((incident) => {
    const candidates = cellMap.get(getPointCellKey(incident.lng, incident.lat)) || boundaries
    const match = candidates.find(boundary =>
      pointInBounds(boundary.bounds, incident.lng, incident.lat)
      && geometryContainsPoint(boundary.geometry, incident.lng, incident.lat)
    )

    return match ? { ...incident, neighborhood: match.name } : incident
  })
}
