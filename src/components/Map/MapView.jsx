import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import ClusterLayer from './ClusterLayer.jsx'
import HeatmapLayer from './HeatmapLayer.jsx'
import { useCrimeData } from '../../hooks/useCrimeData.js'
import useCrimeStore from '../../store/crimeStore.js'
import { CITIES } from '../../constants/cities.js'

function MapController() {
  const map = useMap()
  const cityId = useCrimeStore(s => s.city)
  const mountedRef = useRef(false)

  useEffect(() => {
    const city = CITIES[cityId]
    if (!city) return

    // Stop any in-progress animation before moving
    map.stop()

    if (mountedRef.current) {
      map.flyTo(city.center, city.zoom, { duration: 1.2 })
    } else {
      map.setView(city.center, city.zoom)
      mountedRef.current = true
    }

    return () => { map.stop() }
  }, [cityId, map])

  return null
}

export default function MapView() {
  useCrimeData()

  const incidents = useCrimeStore(s => s.incidents)
  const viewMode = useCrimeStore(s => s.viewMode)

  return (
    <MapContainer
      center={CITIES.chicago.center}
      zoom={CITIES.chicago.zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />
      <MapController />
      {viewMode === 'pins' && <ClusterLayer incidents={incidents} />}
      {viewMode === 'heatmap' && <HeatmapLayer incidents={incidents} />}
    </MapContainer>
  )
}
