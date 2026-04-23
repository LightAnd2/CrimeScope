import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import ClusterLayer from './ClusterLayer.jsx'
import HeatmapLayer from './HeatmapLayer.jsx'
import { useCrimeData } from '../../hooks/useCrimeData.js'
import useCrimeStore from '../../store/crimeStore.js'
import { CITIES } from '../../constants/cities.js'

function MapClickHandler() {
  const clearSelectedIncident = useCrimeStore(s => s.clearSelectedIncident)
  useMapEvents({ click: () => clearSelectedIncident() })
  return null
}

function MapController() {
  const map = useMap()
  const cityId = useCrimeStore(s => s.city)
  const recenterKey = useCrimeStore(s => s.recenterKey)
  const mountedRef = useRef(false)

  useEffect(() => {
    const city = CITIES[cityId]
    if (!city) return

    map.stop()

    if (mountedRef.current) {
      map.flyTo(city.center, city.zoom, { duration: 1.2 })
    } else {
      map.setView(city.center, city.zoom)
      mountedRef.current = true
    }

    return () => { map.stop() }
  }, [cityId, recenterKey, map])

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
      <MapClickHandler />
      {viewMode === 'pins' && <ClusterLayer incidents={incidents} />}
      {viewMode === 'heatmap' && <HeatmapLayer incidents={incidents} />}
    </MapContainer>
  )
}
