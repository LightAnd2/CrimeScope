import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

export default function HeatmapLayer({ incidents }) {
  const map = useMap()
  const layerRef = useRef(null)

  useEffect(() => {
    const points = incidents
      .filter(i => i.lat && i.lng)
      .map(i => [i.lat, i.lng, 1])

    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    if (points.length) {
      layerRef.current = L.heatLayer(points, {
        radius: 18,
        blur: 22,
        maxZoom: 16,
        gradient: {
          0.2: '#0000ff',
          0.4: '#00ffff',
          0.6: '#00ff00',
          0.8: '#ffff00',
          1.0: '#ff0000',
        },
      })
      layerRef.current.addTo(map)

      const canvas = layerRef.current._canvas
      if (canvas) {
        canvas.style.pointerEvents = 'none'
        canvas.setAttribute('aria-hidden', 'true')
      }
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
      }
    }
  }, [incidents, map])

  return null
}
