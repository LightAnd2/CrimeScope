import React from 'react'
import CitySearch from './CitySearch.jsx'
import useCrimeStore from '../../store/crimeStore.js'
import { subDays, format, differenceInDays } from 'date-fns'

const PRESETS = [
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
]

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const dateRange = useCrimeStore(s => s.dateRange)
  const setDateRange = useCrimeStore(s => s.setDateRange)
  const loading = useCrimeStore(s => s.loading)
  const count = useCrimeStore(s => s.incidents.length)
  const dataAsOf = useCrimeStore(s => s.dataAsOf)

  const refDate = dataAsOf ?? new Date()
  const isStale = dataAsOf && differenceInDays(new Date(), dataAsOf) > 10

  const activePreset = PRESETS.find(p =>
    Math.abs(dateRange.start - subDays(refDate, p.days)) < 60 * 60 * 1000
  )

  return (
    <nav className="navbar" style={{
      height: 'var(--navbar-h)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '0',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          width: '32px',
          height: '32px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          background: 'transparent',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '6px',
          flexShrink: 0,
          marginRight: '12px',
        }}
        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        <span style={{ display: 'block', width: '14px', height: '1.5px', background: 'currentColor', borderRadius: '1px' }} />
        <span style={{ display: 'block', width: '14px', height: '1.5px', background: 'currentColor', borderRadius: '1px' }} />
        <span style={{ display: 'block', width: '14px', height: '1.5px', background: 'currentColor', borderRadius: '1px' }} />
      </button>

      <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px', color: '#fff', marginRight: '16px', whiteSpace: 'nowrap' }}>
        Crime<span style={{ color: '#ff3333' }}>Scope</span>
      </div>

      <Divider />

      <div style={{ margin: '0 12px' }}>
        <CitySearch />
      </div>

      <Divider />

      {PRESETS.map(p => (
        <button key={p.label}
          onClick={() => setDateRange({ start: subDays(refDate, p.days), end: refDate })}
          style={{
            padding: '0 10px',
            height: 'var(--navbar-h)',
            border: 'none',
            borderBottom: activePreset?.days === p.days ? '2px solid #fff' : '2px solid transparent',
            background: 'transparent',
            color: activePreset?.days === p.days ? '#fff' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: activePreset?.days === p.days ? 600 : 400,
            cursor: 'pointer',
            flexShrink: 0,
          }}>
          {p.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {isStale && (
        <span className="nav-stale" style={{ fontSize: '10px', color: '#f90', marginRight: '12px', whiteSpace: 'nowrap' }}>
          Data as of {format(dataAsOf, 'MMM d, yyyy')}
        </span>
      )}

      <span className="nav-date-range" style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '16px', whiteSpace: 'nowrap' }}>
        {format(dateRange.start, 'MMM d')} – {format(dateRange.end, 'MMM d')}
      </span>

      <Divider className="nav-divider-hide" />

      <span style={{ fontSize: '12px', color: loading ? 'var(--text-muted)' : '#fff', marginLeft: '12px', whiteSpace: 'nowrap' }}>
        {loading ? '...' : `${count.toLocaleString()}`}
      </span>
    </nav>
  )
}

function Divider({ className = '' }) {
  return <div className={className} style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 8px' }} />
}
