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

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {tab === 'filters' && <CrimeFilters />}
          {tab === 'stats' && <Summary />}
          {tab === 'chart' && <Charts />}
        </div>

        {currentCity && (
          <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid var(--border)' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              marginBottom: dataAsOf ? '8px' : '0',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Source Status
              </span>
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}>
                {currentCity.statusLabel}
              </span>
            </div>
            {dataAsOf && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Data as of</span>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{format(dataAsOf, 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        )}

        {/* Heatmap toggle — sits right below source status */}
        <div style={{ paddingTop: '12px', marginTop: '12px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setViewMode(viewMode === 'pins' ? 'heatmap' : 'pins')}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              background: viewMode === 'heatmap' ? '#fff' : 'transparent',
              color: viewMode === 'heatmap' ? '#111' : 'var(--text)',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {viewMode === 'heatmap' ? 'Heatmap ON' : 'Heatmap OFF'}
          </button>
        </div>
      </div>
    </div>
  )
}
