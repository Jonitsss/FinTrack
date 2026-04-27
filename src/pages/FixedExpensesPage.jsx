import { useState } from 'react'
import { Section, ExpenseRow, AddRowBtn, AddForm, FormGroup, Input, Select, PageHeader, fmt } from '../components/UI.jsx'
import MoneyInput, { parseMoneyInput } from '../components/MoneyInput.jsx'

const METHOD_OPTS = [['tarjeta','Tarjeta'],['debito','Débito'],['cuenta','Cuenta'],['efectivo','Efectivo']]
const CAT_OPTS = [['credito','Crédito'],['servicios','Servicios'],['suscripcion','Suscripción'],['seguro','Seguro'],['otro','Otro']]

export default function FixedExpensesPage({ finances, showToast }) {
  const { fixedExpenses, addFixed, deleteFixed, loading } = finances
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', method: 'tarjeta', category: 'servicios' })

  const total = fixedExpenses.reduce((a, x) => a + Number(x.amount), 0)

  const handleAdd = async () => {
    if (!form.name || !form.amount) return
    const err = await addFixed({ ...form, amount: parseMoneyInput(form.amount) })
    if (!err) {
      setForm({ name: '', amount: '', method: 'tarjeta', category: 'servicios' })
      setOpen(false)
      showToast('Gasto fijo guardado ✓')
    }
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Gastos fijos" subtitle="Se repiten todos los meses — internet, suscripciones, créditos" />

      <Section title="Mis gastos fijos" total={total} totalColor="var(--amber)">
        {fixedExpenses.length === 0
          ? <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Todavía no agregaste gastos fijos</div>
          : <>
              <div style={{ padding: '4px 20px 2px', fontSize: '11px', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '1fr 110px 100px 36px', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                <span>Descripción</span><span>Monto</span><span>Medio</span><span></span>
              </div>
              {fixedExpenses.map(item => <ExpenseRow key={item.id} item={item} onDelete={deleteFixed} isFixed />)}
            </>
        }

        <AddRowBtn onClick={() => setOpen(!open)} label="Agregar gasto fijo" />

        {open && (
          <AddForm
            onSave={handleAdd}
            onCancel={() => setOpen(false)}
            fields={<>
              <FormGroup label="Descripción" style={{ flex: 2, minWidth: '140px' }}>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="ej: Internet, Netflix..." />
              </FormGroup>
              <FormGroup label="Monto" style={{ flex: 1, minWidth: '110px' }}>
                <MoneyInput value={form.amount} onChange={v => setForm({...form, amount: v})} placeholder="0" />
              </FormGroup>
              <FormGroup label="Medio de pago" style={{ flex: 1, minWidth: '120px' }}>
                <Select options={METHOD_OPTS} value={form.method} onChange={e => setForm({...form, method: e.target.value})} />
              </FormGroup>
              <FormGroup label="Categoría" style={{ flex: 1, minWidth: '120px' }}>
                <Select options={CAT_OPTS} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </FormGroup>
            </>}
          />
        )}
      </Section>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Resumen por categoría</div>
        {['credito','servicios','suscripcion','seguro','otro'].map(cat => {
          const items = fixedExpenses.filter(x => x.category === cat)
          if (!items.length) return null
          const catTotal = items.reduce((a,x) => a + Number(x.amount), 0)
          return (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--muted2)', textTransform: 'capitalize' }}>{cat}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{fmt(catTotal)}</span>
            </div>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '14px', fontWeight: 600 }}>
          <span>Total</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>{fmt(total)}</span>
        </div>
      </div>
    </div>
  )
}
