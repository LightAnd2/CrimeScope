import React, { useState } from 'react'
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
  const viewMode = useCrimeStore(s => s.viewMode)
  const setViewMode = useCrimeStore(s => s.setViewMode)

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

        {/* Heatmap toggle — sits right below content */}
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
