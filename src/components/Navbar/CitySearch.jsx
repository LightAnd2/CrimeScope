import React, { useState, useRef, useEffect } from 'react'
import { CITY_LIST } from '../../constants/cities.js'
import useCrimeStore from '../../store/crimeStore.js'

export default function CitySearch({ fullWidth = false }) {
  const cityId = useCrimeStore(s => s.city)
  const setCity = useCrimeStore(s => s.setCity)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const current = CITY_LIST.find(c => c.id === cityId)

  const select = (city) => {
    setCity(city.id)
    setOpen(false)
  }

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cityList = CITY_LIST.map(c => (
    <button
      key={c.id}
      onClick={() => select(c)}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: c.id === cityId ? 'var(--surface2)' : 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        color: c.id === cityId ? '#fff' : 'var(--text)',
        fontSize: '13px',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontWeight: c.id === cityId ? 600 : 400 }}>{c.name}</span>
    </button>
  ))

  // Inline mode (sidebar on mobile) — no absolute positioning
  if (fullWidth) {
    return (
      <div ref={containerRef} style={{ width: '100%' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '0 12px',
            height: '36px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            width: '100%',
          }}
        >
          <span style={{ width: '16px', flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>{current ? `${current.name}, ${current.state}` : 'Select city'}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '16px', flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', textAlign: 'right' }}>▼</span>
        </button>
        {open && (
          <div style={{
            marginTop: '4px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}>
            {cityList}
          </div>
        )}
      </div>
    )
  }

  // Floating dropdown (navbar on desktop)
  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
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
          outline: 'none',
        }}
      >
        <span>{current ? `${current.name}, ${current.state}` : 'Select city'}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          width: '100%',
          minWidth: '160px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          zIndex: 9999,
        }}>
          {cityList}
        </div>
      )}
    </div>
  )
}
