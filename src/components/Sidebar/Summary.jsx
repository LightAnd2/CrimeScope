import React, { useMemo } from 'react'
import { getCrimeColor } from '../../constants/crimeTypes.js'
import useCrimeStore from '../../store/crimeStore.js'

export default function Summary() {
  const incidents = useCrimeStore(s => s.incidents)

  const stats = useMemo(() => {
    const typeCounts = {}
    const neighborhoodCounts = {}

    for (const i of incidents) {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1
      if (i.neighborhood) {
        neighborhoodCounts[i.neighborhood] = (neighborhoodCounts[i.neighborhood] || 0) + 1
      }
    }

    const byType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    const byNeighborhood = Object.entries(neighborhoodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return { byType, byNeighborhood, total: incidents.length }
  }, [incidents])

  return (
    <div>
      <Row label="Total" value={stats.total.toLocaleString()} />

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>By Type</SectionLabel>
        {stats.byType.map(([type, count]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getCrimeColor(type), flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{type}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>Top Neighborhoods</SectionLabel>
        {stats.byNeighborhood.map(([n, count]) => (
          <div key={n} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{n}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
      {children}
    </div>
  )
}
