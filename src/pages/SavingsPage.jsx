import { useState, useEffect } from 'react'
import { MetricCard, SavingsProgress, PageHeader, FormGroup, fmt } from '../components/UI.jsx'

// Formatea número con puntos de miles mientras escribís
const fmtInput = (val) => {
  const clean = String(val).replace(/\D/g, '')
  if (!clean) return ''
  return Number(clean).toLocaleString('es-AR')
}

// Extrae el número limpio de un string con puntos
const parseInput = (val) => {
  const clean = String(val).replace(/\./g, '').replace(/,/g, '')
  return parseFloat(clean) || 0
}

function MoneyInput({ label, value, onChange, placeholder }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (value) setDisplay(fmtInput(value))
  }, [value])

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\./g, '').replace(/,/g, '').replace(/\D/g, '')
    setDisplay(fmtInput(raw))
    onChange(raw)
  }

  return (
    <FormGroup label={label}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '13px', pointerEvents: 'none' }}>$</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '10px 12px 10px 24px', borderRadius: 'var(--radius-sm)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        />
      </div>
    </FormGroup>
  )
}

export default function SavingsPage({ finances, showToast }) {
  const { goals, fixedExpenses, variableExpenses, saveGoals, loading } = finances
  const [form, setForm] = useState({ income1: '', income2: '', savings_goal: '', reserve: '' })

  useEffect(() => {
    if (goals && (goals.income1 || goals.savings_goal)) {
      setForm({
        income1: goals.income1 || '',
        income2: goals.income2 || '',
        savings_goal: goals.savings_goal || '',
        reserve: goals.reserve || '',
      })
    }
  }, [goals])

  const totalIncome = parseInput(form.income1) + parseInput(form.income2)
  const totalFixed = fixedExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalVar = variableExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalExpenses = totalFixed + totalVar
  const reserve = parseInput(form.reserve)
  const savingsGoal = parseInput(form.savings_goal)
  const committed = totalExpenses + reserve + savingsGoal
  const available = totalIncome - committed
  const feasible = available >= 0

  const handleSave = async () => {
    const data = {
      income1: parseInput(form.income1),
      income2: parseInput(form.income2),
      savings_goal: parseInput(form.savings_goal),
      reserve: parseInput(form.reserve),
    }
    await saveGoals(data)
    showToast('Objetivos guardados ✓')
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Objetivo de ahorro" subtitle="Configurá tus ingresos, meta de ahorro y reserva" />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginBottom: '20px' }}>
        <div className="goal-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '16px' }}>
          <MoneyInput label="Ingreso 1ra quincena ($)" value={form.income1} onChange={v => setForm({...form, income1: v})} placeholder="1.000.000" />
          <MoneyInput label="Ingreso 2da quincena ($)" value={form.income2} onChange={v => setForm({...form, income2: v})} placeholder="400.000" />
          <MoneyInput label="Objetivo de ahorro mensual ($)" value={form.savings_goal} onChange={v => setForm({...form, savings_goal: v})} placeholder="600.000" />
          <MoneyInput label="Reserva mensual ($)" value={form.reserve} onChange={v => setForm({...form, reserve: v})} placeholder="100.000" />
        </div>
        <button onClick={handleSave} style={{ background: 'var(--accent)', color: '#0f0f0f', border: 'none', padding: '12px 28px', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', width: '100%' }}>
          Guardar objetivos
        </button>
      </div>

      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        <MetricCard label="Ingreso total" value={fmt(totalIncome)} color="green" />
        <MetricCard label="Comprometido" value={fmt(committed)} color="red" sub="gastos + reserva + ahorro" />
        <MetricCard label="Para gastos diarios" value={fmt(available)} color={feasible ? 'amber' : 'red'} />
        <MetricCard
          label="¿Alcanza?"
          value={feasible ? '✓ Sí' : '✗ Ajustá'}
          color={feasible ? 'green' : 'red'}
          sub={feasible ? `Sobran ${fmt(available)}` : `Faltan ${fmt(Math.abs(available))}`}
        />
      </div>

      <SavingsProgress current={savingsGoal} goal={savingsGoal} label="Progreso de ahorro (meta mensual)" />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Desglose del plan</div>
        {[
          ['Ingresos totales', fmt(totalIncome), 'var(--accent)'],
          ['Gastos fijos', fmt(totalFixed), 'var(--amber)'],
          ['Gastos variables', fmt(totalVar), 'var(--red)'],
          ['Reserva', fmt(reserve), 'var(--blue)'],
          ['Ahorro objetivo', fmt(savingsGoal), 'var(--purple)'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
            <span style={{ color: 'var(--muted2)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color }}>{value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '14px', fontWeight: 600 }}>
          <span>Disponible gastos diarios</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: feasible ? 'var(--accent)' : 'var(--red)' }}>{fmt(available)}</span>
        </div>
      </div>
    </div>
  )
}
