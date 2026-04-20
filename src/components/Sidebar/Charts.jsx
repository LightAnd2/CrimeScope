import React, { useMemo } from 'react'
import { getCrimeColor } from '../../constants/crimeTypes.js'
import useCrimeStore from '../../store/crimeStore.js'

export default function Charts() {
  const incidents = useCrimeStore(s => s.incidents)

  const data = useMemo(() => {
    const counts = {}
    for (const i of incidents) {
      counts[i.type] = (counts[i.type] || 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count, color: getCrimeColor(type) }))
  }, [incidents])

  if (!data.length) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No data</div>
  }

  const max = data[0].count

  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
        Incidents by Type
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {data.map(({ type, count, color }) => (
          <div key={type}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {type}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '6px' }}>
                {count.toLocaleString()}
              </span>
            </div>
            <div style={{ height: '5px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(count / max) * 100}%`,
                background: color,
                borderRadius: '2px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
