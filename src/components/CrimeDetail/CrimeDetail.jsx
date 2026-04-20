import React from 'react'
import { getCrimeColor } from '../../constants/crimeTypes.js'
import { formatDateTime } from '../../utils/formatDate.js'
import { CITIES } from '../../constants/cities.js'
import useCrimeStore from '../../store/crimeStore.js'

export default function CrimeDetail() {
  const incident = useCrimeStore(s => s.selectedIncident)
  const clearSelectedIncident = useCrimeStore(s => s.clearSelectedIncident)

  if (!incident) return null

  const color = getCrimeColor(incident.type)

  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      right: '12px',
      width: '260px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      zIndex: 1000,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '3px',
        background: color,
      }} />
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '2px',
            }}>
              {incident.type}
            </div>
            {incident.description && incident.description !== incident.type && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {incident.description}
              </div>
            )}
          </div>
          <button
            onClick={clearSelectedIncident}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '16px',
              lineHeight: 1,
              padding: '0 2px',
              marginLeft: '8px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Field label="Date & Time" value={formatDateTime(incident.date)} />
          {incident.address && <Field label="Address" value={incident.address} />}
          {incident.neighborhood && <Field label="Neighborhood" value={incident.neighborhood} />}
          {incident.district && <Field label="District" value={incident.district} />}
          {incident.caseNumber && <Field label="Case #" value={incident.caseNumber} />}
          {(() => {
            const c = CITIES[incident.city]
            return <Field label="City" value={c ? `${c.name}, ${c.state}` : incident.city} />
          })()}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '1px' }}>
        {label}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text)' }}>
        {value}
      </div>
    </div>
  )
}
