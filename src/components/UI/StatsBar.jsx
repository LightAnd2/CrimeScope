import React, { useMemo } from 'react'
import useCrimeStore from '../../store/crimeStore.js'

export default function StatsBar() {
  const incidents = useCrimeStore(s => s.incidents)

  const stats = useMemo(() => {
    if (!incidents.length) return null

    const typeCounts = {}
    const neighborhoodCounts = {}

    for (const i of incidents) {
      typeCounts[i.type] = (typeCounts[i.type] || 0) + 1
      if (i.neighborhood) {
        neighborhoodCounts[i.neighborhood] = (neighborhoodCounts[i.neighborhood] || 0) + 1
      }
    }

    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]
    const topNeighborhood = Object.entries(neighborhoodCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      total: incidents.length,
      topType: topType ? topType[0] : '—',
      topNeighborhood: topNeighborhood ? topNeighborhood[0] : '—',
    }
  }, [incidents])

  return (
    <div style={{
      height: 'var(--statsbar-h)',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '24px',
      flexShrink: 0,
      fontSize: '11px',
      color: 'var(--text-muted)',
    }}>
      <Stat label="Total incidents" value={stats?.total?.toLocaleString() ?? '—'} />
      <Stat label="Most common" value={stats?.topType ?? '—'} />
      <Stat label="Top neighborhood" value={stats?.topNeighborhood ?? '—'} />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span>{label}:</span>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
