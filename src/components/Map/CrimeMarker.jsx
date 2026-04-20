import React from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'
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

export default function CrimeMarker({ incident }) {
  const selectIncident = useCrimeStore(s => s.selectIncident)
  const color = getCrimeColor(incident.type)
  const icon = getIcon(color)

  return (
    <Marker
      position={[incident.lat, incident.lng]}
      icon={icon}
      eventHandlers={{ click: () => selectIncident(incident) }}
    />
  )
}
