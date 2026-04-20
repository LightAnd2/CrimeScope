import { useState, useCallback } from 'react'

export const useMapBounds = () => {
  const [bounds, setBounds] = useState(null)

  const onBoundsChange = useCallback((map) => {
    if (!map) return
    setBounds(map.getBounds())
  }, [])

  return { bounds, onBoundsChange }
}
