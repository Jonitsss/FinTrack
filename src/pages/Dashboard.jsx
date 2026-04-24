import { MetricCard, SavingsProgress, Section, ExpenseRow, PageHeader, fmt } from '../components/UI.jsx'

export default function Dashboard({ finances, month, year }) {
  const { goals, fixedExpenses, variableExpenses, loading } = finances
  const totalIncome = Number(goals.income1 || 0) + Number(goals.income2 || 0)
  const totalFixed = fixedExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalVar = variableExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalExpenses = totalFixed + totalVar
  const reserve = Number(goals.reserve || 0)
  const savingsGoal = Number(goals.savings_goal || 0)
  const available = totalIncome - totalExpenses - reserve - savingsGoal

  const credits = fixedExpenses.filter(x => x.category === 'credito')
  const otherFixed = fixedExpenses.filter(x => x.category !== 'credito')

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Resumen del mes" subtitle={`${['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][month]} ${year}`} />

      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        <MetricCard label="Ingresos" value={fmt(totalIncome)} color="green" sub="Este mes" />
        <MetricCard label="Egresos totales" value={fmt(totalExpenses)} color="red" sub="Fijos + variables" />
        <MetricCard label="Reserva" value={fmt(reserve)} color="amber" sub="Apartada" />
        <MetricCard label="Disponible" value={fmt(available)} color={available >= 0 ? 'blue' : 'red'} sub="Para gastos diarios" />
      </div>

      <SavingsProgress current={savingsGoal} goal={savingsGoal} />

      {credits.length > 0 && (
        <Section title="Créditos / Tarjetas" total={credits.reduce((a,x)=>a+Number(x.amount),0)} totalColor="var(--red)">
          <div style={{ padding: '4px 20px 2px', fontSize: '11px', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px', gap: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
            <span>Descripción</span><span>Monto</span><span>Medio</span><span>Categoría</span>
          </div>
          {credits.map(item => <ExpenseRow key={item.id} item={item} isFixed />)}
        </Section>
      )}

      <Section title="Gastos fijos" total={otherFixed.reduce((a,x)=>a+Number(x.amount),0)} totalColor="var(--amber)">
        {otherFixed.length === 0
          ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Sin gastos fijos registrados</div>
          : otherFixed.map(item => <ExpenseRow key={item.id} item={item} isFixed />)}
      </Section>

      <Section title="Gastos variables" total={totalVar} totalColor="var(--red)">
        {variableExpenses.length === 0
          ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Sin gastos variables registrados</div>
          : variableExpenses.map(item => <ExpenseRow key={item.id} item={item} />)}
      </Section>
    </div>
  )
}
