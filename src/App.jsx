import React, { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import MapView from './components/Map/MapView.jsx'
import CrimeDetail from './components/CrimeDetail/CrimeDetail.jsx'
import StatsBar from './components/UI/StatsBar.jsx'
import useCrimeStore from './store/crimeStore.js'

export default function App() {
  const selectedIncident = useCrimeStore(s => s.selectedIncident)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapView />
          {selectedIncident && <CrimeDetail />}
        </div>
      </div>
      <StatsBar />
      <Analytics />
    </div>
  )
}
