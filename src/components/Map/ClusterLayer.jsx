import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import { SEVERITY_COLORS } from '../../constants/crimeTypes.js'
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
        iconCreateFunction: (cluster) => {
          const children = cluster.getAllChildMarkers()
          const counts = {}
          children.forEach(m => {
            const sev = m.options.severity || 'OTHER'
            counts[sev] = (counts[sev] || 0) + 1
          })
          const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'OTHER'
          const color = SEVERITY_COLORS[dominant] || '#718096'
          const count = children.length
          const size = count < 10 ? 28 : count < 100 ? 34 : 40
          return L.divIcon({
            html: `<div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:${color}22;
              border:2px solid ${color};
              color:#fff;font-size:11px;font-weight:700;
              display:flex;align-items:center;justify-content:center;
            ">${count}</div>`,
            className: '',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          })
        },
      })
      map.addLayer(clusterRef.current)
    }

    const cluster = clusterRef.current
    cluster.clearLayers()

    const markers = incidents.map(incident => {
      const color = SEVERITY_COLORS[incident.severity] ?? '#718096'
      const marker = L.marker([incident.lat, incident.lng], { icon: getIcon(color), severity: incident.severity })
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
