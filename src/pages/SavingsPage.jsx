import { useState, useEffect } from 'react'
import { MetricCard, SavingsProgress, PageHeader, FormGroup, fmt } from '../components/UI.jsx'
import MoneyInput, { parseMoneyInput } from '../components/MoneyInput.jsx'

export default function SavingsPage({ finances, showToast }) {
  const { goals, fixedExpenses, variableExpenses, saveGoals, loading } = finances

  const [income, setIncome] = useState('')
  const [savingsGoalInput, setSavingsGoalInput] = useState('')
  const [reserveInput, setReserveInput] = useState('')
  const [initialized, setInitialized] = useState(false)

  // Cargar datos de Supabase cuando llegan
  useEffect(() => {
    if (!loading && goals && !initialized) {
      const totalInc = Number(goals.income1 || 0) + Number(goals.income2 || 0)
      if (totalInc > 0) setIncome(String(totalInc))
      if (goals.savings_goal) setSavingsGoalInput(String(goals.savings_goal))
      if (goals.reserve) setReserveInput(String(goals.reserve))
      setInitialized(true)
    }
  }, [goals, loading, initialized])

  const totalIncome = parseMoneyInput(income)
  const totalFixed = fixedExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalVar = variableExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalExpenses = totalFixed + totalVar
  const reserve = parseMoneyInput(reserveInput)
  const savingsGoal = parseMoneyInput(savingsGoalInput)
  const committed = totalExpenses + reserve + savingsGoal
  const available = totalIncome - committed
  const feasible = available >= 0

  const handleSave = async () => {
    const data = {
      income1: totalIncome, // guardamos todo en income1
      income2: 0,
      savings_goal: savingsGoal,
      reserve: reserve,
    }
    await saveGoals(data)
    showToast('Objetivos guardados ✓')
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Objetivo de ahorro" subtitle="Configurá tus ingresos y metas" />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginBottom: '20px' }}>
        <div className="goal-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '16px' }}>
          <FormGroup label="Ingreso mensual ($)">
            <MoneyInput value={income} onChange={setIncome} placeholder="1.400.000" />
          </FormGroup>
          <FormGroup label="Objetivo de ahorro ($)">
            <MoneyInput value={savingsGoalInput} onChange={setSavingsGoalInput} placeholder="600.000" />
          </FormGroup>
          <FormGroup label="Reserva ($)">
            <MoneyInput value={reserveInput} onChange={setReserveInput} placeholder="100.000" />
          </FormGroup>
        </div>
        <button onClick={handleSave} style={{ background: 'var(--accent)', color: '#0f0f0f', border: 'none', padding: '12px 28px', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', width: '100%' }}>
          Guardar
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

      <SavingsProgress current={savingsGoal} goal={savingsGoal} label="Meta de ahorro mensual" />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Desglose del plan</div>
        {[
          ['Ingresos', fmt(totalIncome), 'var(--accent)'],
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
