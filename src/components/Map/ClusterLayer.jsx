import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import { getCrimeColor } from '../../constants/crimeTypes.js'
import useCrimeStore from '../../store/crimeStore.js'

const iconCache = {}
const getIcon = (color) => {
  if (iconCache[color]) return iconCache[color]
  iconCache[color] = L.divIcon({
    html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:1.5px solid rgba(255,255,255,0.7)"></div>`,
    className: '',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  })
  return iconCache[color]
}

export default function ClusterLayer({ incidents }) {
  const map = useMap()
  const selectIncident = useCrimeStore(s => s.selectIncident)
  const clusterRef = useRef(null)

  useEffect(() => {
    if (!clusterRef.current) {
      clusterRef.current = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        animate: true,
        animateAddingMarkers: false,
      })
      map.addLayer(clusterRef.current)
    }

    const cluster = clusterRef.current
    cluster.clearLayers()

    const markers = incidents.map(incident => {
      const color = getCrimeColor(incident.type)
      const marker = L.marker([incident.lat, incident.lng], { icon: getIcon(color) })
      marker.on('click', () => selectIncident(incident))
      return marker
    })

    cluster.addLayers(markers)

    return () => {}
  }, [incidents])

  useEffect(() => {
    return () => {
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current)
        clusterRef.current = null
      }
    }
  }, [map])

  return null
}
