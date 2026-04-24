// ---- Helpers ----
export const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export const fmt = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-AR')

export const METHODS = ['tarjeta','debito','cuenta','efectivo']
export const METHOD_LABELS = { tarjeta: 'Tarjeta', debito: 'Débito', cuenta: 'Cuenta', efectivo: 'Efectivo' }
export const FIXED_CATS = ['credito','servicios','suscripcion','seguro','otro']
export const VAR_CATS = ['mercado','nafta','salidas','ropa','salud','otro']

// ---- Badge ----
const BADGE_STYLES = {
  tarjeta:    { background: 'var(--purple-dim)', color: 'var(--purple)' },
  efectivo:   { background: 'var(--accent-dim)', color: 'var(--accent)' },
  cuenta:     { background: 'var(--blue-dim)',   color: 'var(--blue)' },
  debito:     { background: 'var(--amber-dim)',  color: 'var(--amber)' },
  credito:    { background: 'var(--red-dim)',    color: 'var(--red)' },
  servicios:  { background: 'var(--blue-dim)',   color: 'var(--blue)' },
  suscripcion:{ background: 'var(--purple-dim)', color: 'var(--purple)' },
  seguro:     { background: 'var(--amber-dim)',  color: 'var(--amber)' },
  default:    { background: 'rgba(255,255,255,0.06)', color: 'var(--muted2)' },
}

export function Badge({ value }) {
  const st = BADGE_STYLES[value] || BADGE_STYLES.default
  return (
    <span style={{ ...st, display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
      {METHOD_LABELS[value] || value}
    </span>
  )
}

// ---- Metric Card ----
const ACCENT_MAP = { green: 'var(--accent)', red: 'var(--red)', amber: 'var(--amber)', blue: 'var(--blue)', purple: 'var(--purple)' }

export function MetricCard({ label, value, color = 'green', sub }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: ACCENT_MAP[color] }} />
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', fontWeight: 600, marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 500, color: ACCENT_MAP[color] }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

// ---- Progress Bar ----
export function SavingsProgress({ current, goal, label = 'Progreso de ahorro mensual' }) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent)' }}>{pct}%</span>
      </div>
      <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: pct >= 100 ? 'var(--accent)' : pct > 50 ? 'var(--amber)' : 'var(--red)', borderRadius: '3px', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        <span>Objetivo: {fmt(current)}</span>
        <span>Meta: {fmt(goal)}</span>
      </div>
    </div>
  )
}

// ---- Section Wrapper ----
export function Section({ title, total, totalColor = 'var(--red)', children, defaultOpen = true }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{title}</span>
          {total !== undefined && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: totalColor }}>{fmt(total)}</span>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

// ---- Expense Table Row ----
export function ExpenseRow({ item, onDelete, isFixed }) {
  return (
    <div className="expense-row-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 110px 100px 36px', alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid var(--border)', fontSize: '13px', gap: '10px' }}>
      <span style={{ fontWeight: 500, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: isFixed ? 'var(--amber)' : 'var(--red)' }}>{fmt(item.amount)}</span>
      <span className="col-method"><Badge value={item.method} /></span>
      {onDelete
        ? <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: '1px solid transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px', padding: '4px 6px', borderRadius: 'var(--radius-sm)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.target.style.background = 'var(--red-dim)'; e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'var(--red)' }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'transparent' }}>✕</button>
        : <span style={{ color: 'var(--muted)', fontSize: '12px' }}>{item.category}</span>}
    </div>
  )
}

// ---- Add Form ----
export function AddForm({ fields, onSave, onCancel, buttonLabel = 'Guardar' }) {
  return (
    <div style={{ padding: '16px 20px', background: 'var(--surface2)', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      {fields}
      <button onClick={onSave} style={{ padding: '9px 18px', background: 'var(--accent)', color: '#0f0f0f', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-end', marginBottom: '0' }}>{buttonLabel}</button>
      <button onClick={onCancel} style={{ padding: '9px 14px', background: 'transparent', color: 'var(--muted2)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-end' }}>Cancelar</button>
    </div>
  )
}

export function FormGroup({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', ...style }}>
      <label style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = { background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', outline: 'none', width: '100%' }

export function Input(props) { return <input style={inputStyle} {...props} /> }
export function Select({ options, ...props }) {
  return (
    <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} {...props}>
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  )
}

// ---- Toast ----
export function Toast({ message, visible }) {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--surface2)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '10px 18px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600, zIndex: 1000, transform: visible ? 'translateY(0)' : 'translateY(60px)', opacity: visible ? 1 : 0, transition: 'all 0.25s', pointerEvents: 'none' }}>
      {message}
    </div>
  )
}

// ---- Page Header ----
export function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', letterSpacing: '-0.3px' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: '13px', color: 'var(--muted2)', marginTop: '4px' }}>{subtitle}</p>}
    </div>
  )
}

// ---- Add Row Button ----
export function AddRowBtn({ onClick, label }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.15s', borderTop: '1px solid var(--border)' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' }}>
      + {label}
    </div>
  )
}
