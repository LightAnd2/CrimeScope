import React, { useState, useRef, useEffect } from 'react'
import { CITY_LIST } from '../../constants/cities.js'
import useCrimeStore from '../../store/crimeStore.js'

export default function CitySearch() {
  const cityId = useCrimeStore(s => s.city)
  const setCity = useCrimeStore(s => s.setCity)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const current = CITY_LIST.find(c => c.id === cityId)

  const filtered = CITY_LIST.filter(c =>
    `${c.name} ${c.state}`.toLowerCase().includes(query.toLowerCase())
  )

  const select = (city) => {
    setCity(city.id)
    setOpen(false)
    setQuery('')
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0 12px',
          height: '28px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
        {current ? `${current.name}, ${current.state}` : 'Select city'}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: '220px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          zIndex: 9999,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search city..."
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '3px',
                padding: '5px 8px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                No cities found
              </div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => select(c)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: c.id === cityId ? 'var(--surface2)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    color: c.id === cityId ? '#fff' : 'var(--text)',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: c.id === cityId ? 600 : 400 }}>{c.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{c.state}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
