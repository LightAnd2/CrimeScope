import React, { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import MapView from './components/Map/MapView.jsx'
import CrimeDetail from './components/CrimeDetail/CrimeDetail.jsx'
import useCrimeStore from './store/crimeStore.js'
import { useUrlInit, useUrlSync } from './hooks/useUrlSync.js'

export default function App() {
  useUrlInit()
  useUrlSync()

  const selectedIncident = useCrimeStore(s => s.selectedIncident)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768)

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', minHeight: 0 }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
      <div className="app-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div style={{ flex: 1, position: 'relative', isolation: 'isolate' }}>
          <MapView />
          {selectedIncident && <CrimeDetail />}
        </div>
      </div>
      <footer style={{
        flexShrink: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '6px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Data sourced from public city open-data portals. For informational use only — not intended for legal, law enforcement, or investigative purposes. Accuracy not guaranteed.
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
          © {new Date().getFullYear()} CrimeScope
        </span>
      </footer>
      <Analytics />
    </div>
  )
}
