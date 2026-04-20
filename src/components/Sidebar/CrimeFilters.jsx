import React from 'react'
import { CRIME_CATEGORIES } from '../../constants/crimeTypes.js'
import useCrimeStore from '../../store/crimeStore.js'

export default function CrimeFilters() {
  const filters = useCrimeStore(s => s.filters)
  const setFilter = useCrimeStore(s => s.setFilter)

  const toggleType = (key) => {
    const current = filters.types
    if (current.includes(key)) {
      setFilter('types', current.filter(t => t !== key))
    } else {
      setFilter('types', [...current, key])
    }
  }

  const clearAll = () => setFilter('types', [])

  const allSelected = filters.types.length === 0

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Crime Type
        </span>
        <button
          onClick={clearAll}
          style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {allSelected ? 'All' : 'Show all'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {CRIME_CATEGORIES.map(cat => {
          const active = filters.types.length === 0 || filters.types.includes(cat.key)
          const checked = filters.types.includes(cat.key) || filters.types.length === 0

          return (
            <label
              key={cat.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '3px 0',
                opacity: active ? 1 : 0.4,
              }}
            >
              <input
                type="checkbox"
                checked={filters.types.length === 0 ? true : filters.types.includes(cat.key)}
                onChange={() => toggleType(cat.key)}
                style={{ display: 'none' }}
              />
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: cat.color,
                flexShrink: 0,
                border: (filters.types.length === 0 || filters.types.includes(cat.key))
                  ? `2px solid ${cat.color}`
                  : '2px solid var(--border)',
                outline: (filters.types.length === 0 || filters.types.includes(cat.key))
                  ? `1px solid ${cat.color}44`
                  : 'none',
              }} />
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>{cat.label}</span>
            </label>
          )
        })}
      </div>

      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
          Hour of Day
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="range"
            min={0}
            max={23}
            value={filters.timeRange[0]}
            onChange={e => {
              const val = +e.target.value
              setFilter('timeRange', [Math.min(val, filters.timeRange[1]), filters.timeRange[1]])
            }}
            style={{ flex: 1, accentColor: '#fff' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {String(filters.timeRange[0]).padStart(2,'0')}:00 – {String(filters.timeRange[1]).padStart(2,'0')}:00
          </span>
          <input
            type="range"
            min={0}
            max={23}
            value={filters.timeRange[1]}
            onChange={e => {
              const val = +e.target.value
              setFilter('timeRange', [filters.timeRange[0], Math.max(val, filters.timeRange[0])])
            }}
            style={{ flex: 1, accentColor: '#fff' }}
          />
        </div>
      </div>
    </div>
  )
}
