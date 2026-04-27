import { MetricCard, SavingsProgress, Section, PageHeader, fmt, MONTHS, Badge } from '../components/UI.jsx'

const CAT_LABELS = {
  credito: 'Crédito', servicios: 'Servicios', suscripcion: 'Suscripción',
  seguro: 'Seguro', otro: 'Otro',
  mercado: 'Mercado', nafta: 'Nafta', salidas: 'Salidas',
  ropa: 'Ropa', salud: 'Salud', comida: 'Comida',
  transporte: 'Transporte', educacion: 'Educación', hogar: 'Hogar',
  entretenimiento: 'Entretenimiento',
}

const CAT_COLORS = {
  credito: 'var(--red)', servicios: 'var(--blue)', suscripcion: 'var(--purple)',
  seguro: 'var(--amber)', mercado: 'var(--accent)', nafta: 'var(--amber)',
  salidas: 'var(--purple)', comida: 'var(--accent)', transporte: 'var(--blue)',
  salud: 'var(--red)', ropa: 'var(--purple)', educacion: 'var(--blue)',
  hogar: 'var(--amber)', entretenimiento: 'var(--purple)', otro: 'var(--muted2)',
}

function FullExpenseRow({ item, isFixed }) {
  const catLabel = CAT_LABELS[item.category] || item.category
  const catColor = CAT_COLORS[item.category] || 'var(--muted2)'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px 90px', alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid var(--border)', fontSize: '13px', gap: '10px' }}>
      <span style={{ fontWeight: 500, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: isFixed ? 'var(--amber)' : 'var(--red)' }}>{fmt(item.amount)}</span>
      <Badge value={item.method} />
      <span style={{ fontSize: '11px', fontWeight: 600, color: catColor, background: catColor + '18', padding: '3px 8px', borderRadius: '20px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{catLabel}</span>
    </div>
  )
}

// Agrupador por categoría con totales
function CategoryBreakdown({ items, title, totalColor }) {
  const byCategory = {}
  items.forEach(item => {
    const cat = item.category || 'otro'
    if (!byCategory[cat]) byCategory[cat] = { total: 0, count: 0 }
    byCategory[cat].total += Number(item.amount)
    byCategory[cat].count++
  })
  const entries = Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total)
  if (!entries.length) return null

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
      {entries.map(([cat, data]) => (
        <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 10px', fontSize: '12px' }}>
          <span style={{ color: CAT_COLORS[cat] || 'var(--muted2)', fontWeight: 600 }}>{CAT_LABELS[cat] || cat}</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted2)', fontSize: '11px' }}>{fmt(data.total)}</span>
        </div>
      ))}
    </div>
  )
}

// Agrupador por método de pago
function MethodBreakdown({ items }) {
  const byMethod = {}
  items.forEach(item => {
    const m = item.method || 'otro'
    byMethod[m] = (byMethod[m] || 0) + Number(item.amount)
  })
  const entries = Object.entries(byMethod).sort((a, b) => b[1] - a[1])
  if (!entries.length) return null

  const METHOD_LABELS = { tarjeta: 'Tarjeta', efectivo: 'Efectivo', cuenta: 'Cuenta', debito: 'Débito' }
  const METHOD_COLORS = { tarjeta: 'var(--purple)', efectivo: 'var(--accent)', cuenta: 'var(--blue)', debito: 'var(--amber)' }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '10px 20px', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, alignSelf: 'center' }}>Por medio:</span>
      {entries.map(([method, total]) => (
        <div key={method} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
          <span style={{ color: METHOD_COLORS[method] || 'var(--muted2)', fontWeight: 600 }}>{METHOD_LABELS[method] || method}</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted2)', fontSize: '11px' }}>{fmt(total)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ finances, month, year }) {
  const { goals, fixedExpenses, variableExpenses, loading } = finances
  const totalIncome = Number(goals?.income1 || 0) + Number(goals?.income2 || 0)
  const totalFixed = fixedExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalVar = variableExpenses.reduce((a, x) => a + Number(x.amount), 0)
  const totalExpenses = totalFixed + totalVar
  const savingsGoal = Number(goals?.savings_goal || 0)
  const available = totalIncome - totalExpenses - savingsGoal

  const credits = fixedExpenses.filter(x => x.category === 'credito')
  const otherFixed = fixedExpenses.filter(x => x.category !== 'credito')
  const allItems = [...fixedExpenses, ...variableExpenses]

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Resumen del mes" subtitle={`${MONTHS[month]} ${year}`} />

      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
        <MetricCard label="Ingresos" value={fmt(totalIncome)} color="green" sub="Este mes" />
        <MetricCard label="Egresos totales" value={fmt(totalExpenses)} color="red" sub="Fijos + variables" />
        <MetricCard label="Meta de ahorro" value={fmt(savingsGoal)} color="purple" sub="Objetivo mensual" />
        <MetricCard label="Disponible" value={fmt(available)} color={available >= 0 ? 'blue' : 'red'} sub="Para gastos diarios" />
      </div>

      <SavingsProgress current={savingsGoal} goal={savingsGoal} label="Progreso de ahorro mensual" />

      {/* Resumen global por método y categoría */}
      {allItems.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: '14px', fontWeight: 600 }}>Desglose del mes</div>
          <MethodBreakdown items={allItems} />
          <CategoryBreakdown items={allItems} />
        </div>
      )}

      {credits.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Créditos / Tarjetas</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--red)' }}>{fmt(credits.reduce((a,x)=>a+Number(x.amount),0))}</span>
          </div>
          <div style={{ padding: '4px 20px 2px', fontSize: '11px', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '1fr 110px 90px 90px', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
            <span>Descripción</span><span>Monto</span><span>Medio</span><span>Categoría</span>
          </div>
          {credits.map(item => <FullExpenseRow key={item.id} item={item} isFixed />)}
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Gastos fijos</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--amber)' }}>{fmt(otherFixed.reduce((a,x)=>a+Number(x.amount),0))}</span>
        </div>
        {otherFixed.length === 0
          ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Sin gastos fijos registrados</div>
          : <>
              <div style={{ padding: '4px 20px 2px', fontSize: '11px', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '1fr 110px 90px 90px', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                <span>Descripción</span><span>Monto</span><span>Medio</span><span>Categoría</span>
              </div>
              {otherFixed.map(item => <FullExpenseRow key={item.id} item={item} isFixed />)}
            </>
        }
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Gastos variables</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--red)' }}>{fmt(totalVar)}</span>
        </div>
        {variableExpenses.length === 0
          ? <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Sin gastos variables registrados</div>
          : <>
              <div style={{ padding: '4px 20px 2px', fontSize: '11px', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '1fr 110px 90px 90px', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                <span>Descripción</span><span>Monto</span><span>Medio</span><span>Categoría</span>
              </div>
              {variableExpenses.map(item => <FullExpenseRow key={item.id} item={item} />)}
            </>
        }
      </div>
    </div>
  )
}
