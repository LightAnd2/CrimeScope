import React from 'react'
import useCrimeStore from '../../store/crimeStore.js'

export default function RecordCounter() {
  const count = useCrimeStore(s => s.incidents.length)

  return (
    <div style={{
      fontSize: '11px',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      borderLeft: '1px solid var(--border)',
      paddingLeft: '12px',
    }}>
      <span style={{ color: '#fff', fontWeight: 600 }}>{count.toLocaleString()}</span> incidents
    </div>
  )
}
