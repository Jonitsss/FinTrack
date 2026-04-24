import { useState, useEffect } from 'react'
import { MONTHS, fmt } from '../components/UI.jsx'
import { PageHeader } from '../components/UI.jsx'

export default function TimelinePage({ finances, currentMonth, year }) {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    finances.fetchYearSummary().then(data => {
      setSummary(data)
      setLoading(false)
    })
  }, [finances, currentMonth])

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Línea de tiempo" subtitle={`Evolución mes a mes · ${year}`} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {summary.map(({ month, goals, totalFixed, totalVariable }) => {
          const isCurrent = month === currentMonth
          const isPast = month < currentMonth
          const hasData = goals || totalFixed > 0 || totalVariable > 0
          const totalIncome = goals ? Number(goals.income1 || 0) + Number(goals.income2 || 0) : 0
          const totalExp = totalFixed + totalVariable
          const reserve = goals ? Number(goals.reserve || 0) : 0
          const savingsGoal = goals ? Number(goals.savings_goal || 0) : 0
          const available = totalIncome - totalExp - reserve - savingsGoal

          return (
            <div key={month} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0' }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0, marginTop: '6px', zIndex: 1,
                  background: isCurrent ? 'var(--accent)' : hasData ? 'var(--muted2)' : 'var(--border2)',
                  border: '2px solid var(--bg)',
                  boxShadow: isCurrent ? '0 0 0 4px var(--accent-dim2)' : 'none',
                }} />
                <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '4px' }} />
              </div>

              {/* Right */}
              <div style={{ paddingBottom: '28px', paddingLeft: '20px' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '10px', color: isCurrent ? 'var(--accent)' : isPast ? 'var(--text)' : 'var(--muted)' }}>
                  {MONTHS[month]} {year}
                  {isCurrent && <span style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--accent)', marginLeft: '10px', fontWeight: 600, letterSpacing: '0.05em' }}>MES ACTUAL</span>}
                </div>

                {hasData ? (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
                    {[
                      ['Ingresos', fmt(totalIncome), 'var(--accent)'],
                      ['Egresos', fmt(totalExp), 'var(--red)'],
                      ['Reserva', fmt(reserve), 'var(--blue)'],
                      ['Ahorro objetivo', fmt(savingsGoal), 'var(--purple)'],
                      ['Disponible', fmt(available), available >= 0 ? 'var(--accent)' : 'var(--red)'],
                    ].map(([label, value, color]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--muted2)' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Sin datos registrados</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
