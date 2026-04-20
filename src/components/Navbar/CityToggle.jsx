import React from 'react'
import useCrimeStore from '../../store/crimeStore.js'

const cities = [
  { id: 'chicago', label: 'Chicago' },
  { id: 'detroit', label: 'Detroit' },
]

export default function CityToggle() {
  const city = useCrimeStore(s => s.city)
  const setCity = useCrimeStore(s => s.setCity)

  return (
    <div style={{ display: 'flex', gap: '2px', background: 'var(--bg)', borderRadius: '4px', padding: '2px' }}>
      {cities.map(c => (
        <button
          key={c.id}
          onClick={() => setCity(c.id)}
          style={{
            padding: '4px 14px',
            borderRadius: '3px',
            border: 'none',
            background: city === c.id ? '#fff' : 'transparent',
            color: city === c.id ? '#111' : 'var(--text-muted)',
            fontWeight: city === c.id ? 600 : 400,
            fontSize: '12px',
            transition: 'all 0.15s',
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
