// Componente de input monetario reutilizable
// Muestra puntos de miles mientras escribís, guarda número limpio

const fmtDisplay = (val) => {
  const clean = String(val).replace(/\D/g, '')
  if (!clean) return ''
  return Number(clean).toLocaleString('es-AR')
}

export const parseMoneyInput = (val) => {
  return parseFloat(String(val).replace(/\./g, '').replace(/,/g, '').replace(/\D/g, '')) || 0
}

export default function MoneyInput({ value, onChange, placeholder = '0', style }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/\./g, '').replace(/,/g, '').replace(/\D/g, '')
    onChange(raw)
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '13px', pointerEvents: 'none' }}>$</span>
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        value={fmtDisplay(value)}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '8px 12px 8px 24px', borderRadius: 'var(--radius-sm)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
      />
    </div>
  )
}
