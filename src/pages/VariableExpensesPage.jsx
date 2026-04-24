import { useState } from 'react'
import { Section, ExpenseRow, AddRowBtn, AddForm, FormGroup, Input, Select, PageHeader, fmt, MONTHS } from '../components/UI.jsx'

const METHOD_OPTS = [['efectivo','Efectivo'],['tarjeta','Tarjeta'],['debito','Débito'],['cuenta','Cuenta']]
const CAT_OPTS = [['mercado','Mercado'],['nafta','Nafta / transporte'],['salidas','Salidas'],['ropa','Ropa'],['salud','Salud'],['otro','Otro']]

export default function VariableExpensesPage({ finances, month, year, showToast }) {
  const { variableExpenses, addVariable, deleteVariable, loading } = finances
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', method: 'efectivo', category: 'mercado' })

  const total = variableExpenses.reduce((a, x) => a + Number(x.amount), 0)

  const byCategory = CAT_OPTS.map(([val, label]) => ({
    val, label,
    items: variableExpenses.filter(x => x.category === val),
    total: variableExpenses.filter(x => x.category === val).reduce((a,x) => a+Number(x.amount), 0)
  })).filter(g => g.items.length > 0)

  const handleAdd = async () => {
    if (!form.name || !form.amount) return
    const err = await addVariable({ ...form, amount: parseFloat(form.amount) })
    if (!err) {
      setForm({ name: '', amount: '', method: 'efectivo', category: 'mercado' })
      setOpen(false)
      showToast('Gasto registrado ✓')
    }
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div>
      <PageHeader title="Gastos del mes" subtitle={`${MONTHS[month]} ${year} · ${variableExpenses.length} gastos · Total: ${fmt(total)}`} />

      {byCategory.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {byCategory.map(g => (
            <div key={g.val} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '13px' }}>
              <div style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '4px', textTransform: 'capitalize' }}>{g.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{fmt(g.total)}</div>
            </div>
          ))}
        </div>
      )}

      <Section title="Todos los gastos" total={total}>
        {variableExpenses.length === 0
          ? <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>Todavía no registraste gastos este mes</div>
          : <>
              <div style={{ padding: '4px 20px 2px', fontSize: '11px', color: 'var(--muted)', display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px', gap: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
                <span>Descripción</span><span>Monto</span><span>Medio</span><span>—</span>
              </div>
              {variableExpenses.map(item => <ExpenseRow key={item.id} item={item} onDelete={deleteVariable} />)}
            </>
        }

        <AddRowBtn onClick={() => setOpen(!open)} label="Registrar gasto" />

        {open && (
          <AddForm
            onSave={handleAdd}
            onCancel={() => setOpen(false)}
            fields={<>
              <FormGroup label="Descripción" style={{ flex: 2, minWidth: '160px' }}>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="ej: Super, nafta, salida..." />
              </FormGroup>
              <FormGroup label="Monto ($)" style={{ flex: 1, minWidth: '120px' }}>
                <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" />
              </FormGroup>
              <FormGroup label="Medio de pago" style={{ flex: 1, minWidth: '130px' }}>
                <Select options={METHOD_OPTS} value={form.method} onChange={e => setForm({...form, method: e.target.value})} />
              </FormGroup>
              <FormGroup label="Categoría" style={{ flex: 1, minWidth: '130px' }}>
                <Select options={CAT_OPTS} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </FormGroup>
            </>}
          />
        )}
      </Section>
    </div>
  )
}
