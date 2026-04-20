import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import MapView from './components/Map/MapView.jsx'
import CrimeDetail from './components/CrimeDetail/CrimeDetail.jsx'
import StatsBar from './components/UI/StatsBar.jsx'
import useCrimeStore from './store/crimeStore.js'

export default function App() {
  const selectedIncident = useCrimeStore(s => s.selectedIncident)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative' }}>
          <MapView />
          {selectedIncident && <CrimeDetail />}
        </div>
      </div>
      <StatsBar />
    </div>
  )
}
