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
      <Analytics />
    </div>
  )
}
