import React from 'react'
import { subDays, format } from 'date-fns'
import useCrimeStore from '../../store/crimeStore.js'

const PRESETS = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
]

export default function DateRangePicker() {
  const dateRange = useCrimeStore(s => s.dateRange)
  const setDateRange = useCrimeStore(s => s.setDateRange)

  const activePreset = PRESETS.find(p => {
    const expected = subDays(new Date(), p.days)
    return Math.abs(dateRange.start - expected) < 60 * 60 * 1000
  })

  const setPreset = (days) => {
    setDateRange({ start: subDays(new Date(), days), end: new Date() })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
        {format(dateRange.start, 'MMM d')} – {format(dateRange.end, 'MMM d')}
      </span>
      <div style={{ display: 'flex', gap: '2px', background: 'var(--bg)', borderRadius: '4px', padding: '2px' }}>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setPreset(p.days)}
            style={{
              padding: '3px 10px',
              borderRadius: '3px',
              border: 'none',
              background: activePreset?.days === p.days ? 'var(--surface2)' : 'transparent',
              color: activePreset?.days === p.days ? '#fff' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: activePreset?.days === p.days ? 600 : 400,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
