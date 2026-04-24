import React, { useState } from 'react'
import { format } from 'date-fns'
import { CITIES } from '../../constants/cities.js'
import CrimeFilters from './CrimeFilters.jsx'
import Summary from './Summary.jsx'
import Charts from './Charts.jsx'
import useCrimeStore from '../../store/crimeStore.js'

const TABS = [
  { id: 'filters', label: 'Filters', icon: '⊟' },
  { id: 'stats', label: 'Stats', icon: '≡' },
  { id: 'chart', label: 'Chart', icon: '▦' },
]

export default function Sidebar({ isOpen, onClose }) {
  const [tab, setTab] = useState('filters')
  const cityId = useCrimeStore(s => s.city)
  const dataAsOf = useCrimeStore(s => s.dataAsOf)
  const viewMode = useCrimeStore(s => s.viewMode)
  const setViewMode = useCrimeStore(s => s.setViewMode)
  const currentCity = CITIES[cityId]

  return (
    <div className={`sidebar${isOpen ? '' : ' sidebar-closed'}`}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              background: tab === t.id ? 'var(--surface2)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--text-muted)',
              fontSize: '12px',
              borderBottom: tab === t.id ? '2px solid #fff' : '2px solid transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content — scrollable */}
      <div className="sidebar-content" style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '12px' }}>
        {tab === 'filters' && <CrimeFilters />}
        {tab === 'stats' && <Summary />}
        {tab === 'chart' && <Charts />}
      </div>

      {/* Bottom bar — always visible */}
      <div className="sidebar-footer" style={{ flexShrink: 0, borderTop: '1px solid var(--border)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {currentCity && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: dataAsOf ? '4px' : '0' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Source
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                {currentCity.statusLabel}
              </span>
            </div>
            {dataAsOf && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Data as of</span>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>{format(dataAsOf, 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        )}
        <button
          className="sidebar-heatmap-toggle"
          onClick={() => setViewMode(viewMode === 'pins' ? 'heatmap' : 'pins')}
          style={{
            width: '100%',
            padding: '7px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: viewMode === 'heatmap' ? '#fff' : 'transparent',
            color: viewMode === 'heatmap' ? '#111' : 'var(--text)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {viewMode === 'heatmap' ? 'Heatmap ON' : 'Heatmap OFF'}
        </button>
      </div>
    </div>
  )
}
