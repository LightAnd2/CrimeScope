import React, { useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { getCrimeColor, SEVERITY_COLORS } from '../../constants/crimeTypes.js'
import useCrimeStore from '../../store/crimeStore.js'

// ── Trend chart ─────────────────────────────────────────────────────────────

function TrendChart({ incidents }) {
  const data = useMemo(() => {
    const byDay = {}
    for (const inc of incidents) {
      const day = format(inc.date, 'yyyy-MM-dd')
      if (!byDay[day]) byDay[day] = { violent: 0, property: 0, narcotics: 0, qol: 0, other: 0, total: 0 }
      const b = byDay[day]
      b.total++
      if (inc.severity === 'VIOLENT')          b.violent++
      else if (inc.severity === 'PROPERTY')    b.property++
      else if (inc.severity === 'NARCOTICS')   b.narcotics++
      else if (inc.severity === 'QUALITY OF LIFE') b.qol++
      else                                     b.other++
    }
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({
        ...counts,
        label: format(parseISO(date), 'MMM d'),
      }))
  }, [incidents])

  if (!data.length) return <Empty />

  // Show at most ~5 x-axis labels regardless of range (keeps labels readable in narrow sidebar)
  const tickInterval = Math.max(1, Math.floor(data.length / 5))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const total = payload.reduce((s, p) => s + (p.value || 0), 0)
    return (
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '6px', padding: '8px 12px', fontSize: '12px',
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
        {[...payload].sort((a, b) => b.value - a.value).map(p => p.value > 0 && (
          <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: p.fill }}>{p.name}</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Total</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>{total}</span>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          {[
            ['violent',  SEVERITY_COLORS.VIOLENT],
            ['property', SEVERITY_COLORS.PROPERTY],
            ['narcotics',SEVERITY_COLORS.NARCOTICS],
            ['qol',      SEVERITY_COLORS['QUALITY OF LIFE']],
            ['other',    SEVERITY_COLORS.OTHER],
          ].map(([key, color]) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={tickInterval}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {[
          ['violent',  'Violent',   SEVERITY_COLORS.VIOLENT],
          ['property', 'Property',  SEVERITY_COLORS.PROPERTY],
          ['narcotics','Narcotics', SEVERITY_COLORS.NARCOTICS],
          ['qol',      'QoL',       SEVERITY_COLORS['QUALITY OF LIFE']],
          ['other',    'Other',     SEVERITY_COLORS.OTHER],
        ].map(([key, name, color]) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stackId="1"
            stroke={color}
            strokeWidth={1}
            fill={`url(#grad-${key})`}
            dot={false}
            activeDot={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── By-type bar chart ────────────────────────────────────────────────────────

function TypeChart({ incidents }) {
  const data = useMemo(() => {
    const counts = {}
    for (const i of incidents) {
      counts[i.type] = (counts[i.type] || 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count, color: getCrimeColor(type) }))
  }, [incidents])

  if (!data.length) return <Empty />

  const max = data[0].count

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {data.map(({ type, count, color }) => (
        <div key={type}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {type}
              </span>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '8px' }}>
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
  )
}

// ── Shell ────────────────────────────────────────────────────────────────────

function Empty() {
  return <div style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No data</div>
}

const VIEWS = [
  { id: 'trend', label: 'Trend' },
  { id: 'type',  label: 'By Type' },
]

export default function Charts() {
  const incidents = useCrimeStore(s => s.incidents)
  const [view, setView] = useState('trend')

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              flex: 1,
              padding: '5px 0',
              border: '1px solid',
              borderColor: view === v.id ? '#fff' : 'var(--border)',
              borderRadius: '4px',
              background: view === v.id ? '#fff' : 'transparent',
              color: view === v.id ? '#111' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: view === v.id ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'trend' && <TrendChart incidents={incidents} />}
      {view === 'type'  && <TypeChart  incidents={incidents} />}
    </div>
  )
}
