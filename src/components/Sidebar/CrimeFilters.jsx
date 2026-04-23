import React, { useState, useMemo } from 'react'
import { subDays } from 'date-fns'
import { CRIME_CATEGORIES, getSeverity } from '../../constants/crimeTypes.js'
import CitySearch from '../Navbar/CitySearch.jsx'
import useCrimeStore from '../../store/crimeStore.js'

const PRESETS = [
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '60 days', days: 60 },
]

const TIME_PRESETS = [
  { label: 'All',  range: [0, 23] },
  { label: 'AM',   range: [5, 11] },
  { label: 'PM',   range: [12, 17] },
  { label: 'Night', range: [18, 23] },
]

const fmtHour = (h) =>
  h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`

export default function CrimeFilters() {
  const filters = useCrimeStore(s => s.filters)
  const setFilter = useCrimeStore(s => s.setFilter)
  const allIncidents = useCrimeStore(s => s.incidents)
  const dateRange = useCrimeStore(s => s.dateRange)
  const setDateRange = useCrimeStore(s => s.setDateRange)
  const dataAsOf = useCrimeStore(s => s.dataAsOf)
  const [expanded, setExpanded] = useState(null)

  const refDate = dataAsOf ?? new Date()
  const activePreset = PRESETS.find(p =>
    Math.abs(dateRange.start - subDays(refDate, p.days)) < 60 * 60 * 1000
  )

  // Build a map of severity → sorted specific types from current data
  const typesBySeverity = useMemo(() => {
    const map = {}
    for (const inc of allIncidents) {
      const sev = inc.severity
      if (!map[sev]) map[sev] = {}
      map[sev][inc.type] = (map[sev][inc.type] || 0) + 1
    }
    const result = {}
    for (const [sev, types] of Object.entries(map)) {
      result[sev] = Object.entries(types)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({ type, count }))
    }
    return result
  }, [allIncidents])

  const toggleSeverity = (key) => {
    // Clear specific types when toggling severity
    setFilter('specificTypes', [])
    const current = filters.types
    if (current.includes(key)) {
      setFilter('types', current.filter(t => t !== key))
    } else {
      setFilter('types', [...current, key])
    }
  }

  const toggleSpecificType = (type) => {
    const current = filters.specificTypes || []
    if (current.includes(type)) {
      setFilter('specificTypes', current.filter(t => t !== type))
    } else {
      setFilter('specificTypes', [...current, type])
    }
  }

  const clearAll = () => {
    setFilter('types', [])
    setFilter('specificTypes', [])
    setExpanded(null)
  }

  const toggleExpand = (key) => {
    setExpanded(prev => prev === key ? null : key)
  }

  const allSelected = filters.types.length === 0 && (filters.specificTypes || []).length === 0

  return (
    <div>
      {/* City — mobile only */}
      <div className="filter-mobile-only" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
          City
        </span>
        <CitySearch fullWidth />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Crime Type
        </span>
        {!allSelected && (
          <button
            onClick={clearAll}
            style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {CRIME_CATEGORIES.map(cat => {
          const isActive = allSelected || filters.types.includes(cat.key)
          const isExpanded = expanded === cat.key
          const subtypes = typesBySeverity[cat.key] || []
          const hasSubtypes = subtypes.length > 0
          const activeSpecific = (filters.specificTypes || [])

          return (
            <div key={cat.key}>
              {/* Severity row */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  onClick={() => toggleSeverity(cat.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer', padding: '7px 0' }}
                >
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                    background: isActive ? cat.color : 'transparent',
                    border: `2px solid ${isActive ? cat.color : 'var(--border)'}`,
                  }} />
                  <span style={{ fontSize: '14px', color: isActive ? 'var(--text)' : 'var(--text-muted)', userSelect: 'none' }}>
                    {cat.label}
                  </span>
                </div>
                {hasSubtypes && (
                  <button
                    onClick={e => { e.stopPropagation(); toggleExpand(cat.key) }}
                    style={{
                      background: 'none', border: 'none',
                      padding: '8px 12px',
                      color: isExpanded ? 'var(--text)' : 'var(--text-muted)',
                      cursor: 'pointer', fontSize: '15px',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    ▾
                  </button>
                )}
              </div>

              {/* Specific types dropdown */}
              {isExpanded && hasSubtypes && (
                <div style={{
                  marginLeft: '22px', marginTop: '4px', marginBottom: '4px',
                  borderLeft: `2px solid ${cat.color}33`,
                  paddingLeft: '10px',
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  maxHeight: '200px', overflowY: 'auto',
                }}>
                  {subtypes.map(({ type, count }) => {
                    const selected = activeSpecific.includes(type)
                    return (
                      <div
                        key={type}
                        onClick={() => toggleSpecificType(type)}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '4px 6px', borderRadius: '4px', cursor: 'pointer',
                          background: selected ? `${cat.color}22` : 'transparent',
                        }}
                      >
                        <span style={{
                          fontSize: '12px',
                          color: selected ? '#fff' : 'var(--text-muted)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: '180px',
                          fontWeight: selected ? 600 : 400,
                        }}>
                          {type}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px', flexShrink: 0 }}>
                          {count.toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Date range — mobile only */}
      <div className="filter-mobile-only" style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
          Date Range
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => setDateRange({ start: subDays(refDate, p.days), end: refDate })}
              style={{
                flex: 1,
                padding: '6px 0',
                border: '1px solid',
                borderColor: activePreset?.days === p.days ? '#fff' : 'var(--border)',
                borderRadius: '4px',
                background: activePreset?.days === p.days ? '#fff' : 'transparent',
                color: activePreset?.days === p.days ? '#111' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: activePreset?.days === p.days ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hour of Day */}
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
          Hour of Day
        </span>

        {/* Visual track bar */}
        <div style={{ position: 'relative', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '4px 0 6px' }}>
          <div style={{
            position: 'absolute',
            left: `${(filters.timeRange[0] / 23) * 100}%`,
            width: `${((filters.timeRange[1] - filters.timeRange[0]) / 23) * 100}%`,
            top: 0, bottom: 0,
            background: '#fff',
            borderRadius: '2px',
          }} />
        </div>

        {/* Tick labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span>
        </div>

        {/* From / To sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '28px', flexShrink: 0 }}>from</span>
            <input
              type="range" min={0} max={23}
              value={filters.timeRange[0]}
              onChange={e => {
                const val = +e.target.value
                setFilter('timeRange', [Math.min(val, filters.timeRange[1]), filters.timeRange[1]])
              }}
              style={{ flex: 1, accentColor: '#fff' }}
            />
            <span style={{ fontSize: '12px', color: '#fff', width: '42px', textAlign: 'right', flexShrink: 0 }}>
              {fmtHour(filters.timeRange[0])}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '28px', flexShrink: 0 }}>to</span>
            <input
              type="range" min={0} max={23}
              value={filters.timeRange[1]}
              onChange={e => {
                const val = +e.target.value
                setFilter('timeRange', [filters.timeRange[0], Math.max(val, filters.timeRange[0])])
              }}
              style={{ flex: 1, accentColor: '#fff' }}
            />
            <span style={{ fontSize: '12px', color: '#fff', width: '42px', textAlign: 'right', flexShrink: 0 }}>
              {fmtHour(filters.timeRange[1])}
            </span>
          </div>
        </div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {TIME_PRESETS.map(p => {
            const active = filters.timeRange[0] === p.range[0] && filters.timeRange[1] === p.range[1]
            return (
              <button
                key={p.label}
                onClick={() => setFilter('timeRange', p.range)}
                style={{
                  flex: 1,
                  padding: '4px 0',
                  border: '1px solid',
                  borderColor: active ? '#fff' : 'var(--border)',
                  borderRadius: '20px',
                  background: active ? '#fff' : 'transparent',
                  color: active ? '#111' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
