import { useState, useEffect } from 'react'
import { MetricCard, SavingsProgress, PageHeader, FormGroup, Input, fmt } from '../components/UI.jsx'

export default function SavingsPage({ finances, showToast }) {
  const { goals, fixedExpenses, variableExpenses, saveGoals, loading } = finances
  const [form, setForm] = useState({ income1: '', income2: '', savings_goal: '', reserve: '' })

  useEffect(() => {
    if (goals) {
      setForm({
        income1: goals.income1 || '',
        income2: goals.income2 || '',
        savings_goal: goals.savings_goal || '',
        reserve: goals.reserve || '',
      })
    }
  }, [goals])

  const totalIncome = Number(form.income1 || 0) + Number(form.income2 || 0)
  const totalFixed = fixedExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalVar = variableExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalExpenses = totalFixed + totalVar
  const reserve = Number(form.reserve || 0)
  const savingsGoal = Number(form.savings_goal || 0)
  const committed = totalExpenses + reserve + savingsGoal
  const available = totalIncome - committed
  const feasible = available >= 0

  const handleSave = async () => {
    await saveGoals({
      income1: parseFloat(form.income1) || 0,
      income2: parseFloat(form.income2) || 0,
      savings_goal: parseFloat(form.savings_goal) || 0,
      reserve: parseFloat(form.reserve) || 0,
    })
    showToast('Objetivos guardados ✓')
  }

  const inputRow = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '16px' }

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Objetivo de ahorro" subtitle="Configurá tus ingresos, meta de ahorro y reserva" />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginBottom: '20px' }}>
        <div className="goal-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px', marginBottom: '16px' }}>
          <FormGroup label="Ingreso 1ra quincena ($)">
            <Input type="number" value={form.income1} onChange={e => setForm({...form, income1: e.target.value})} placeholder="ej: 1000000" />
          </FormGroup>
          <FormGroup label="Ingreso 2da quincena ($)">
            <Input type="number" value={form.income2} onChange={e => setForm({...form, income2: e.target.value})} placeholder="ej: 400000" />
          </FormGroup>
          <FormGroup label="Objetivo de ahorro mensual ($)">
            <Input type="number" value={form.savings_goal} onChange={e => setForm({...form, savings_goal: e.target.value})} placeholder="ej: 600000" />
          </FormGroup>
          <FormGroup label="Reserva mensual ($)">
            <Input type="number" value={form.reserve} onChange={e => setForm({...form, reserve: e.target.value})} placeholder="ej: 100000" />
          </FormGroup>
        </div>
        <button onClick={handleSave} style={{ background: 'var(--accent)', color: '#0f0f0f', border: 'none', padding: '10px 24px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
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
