// Componente de input monetario reutilizable
// Muestra puntos de miles mientras escribís, guarda número limpio

const fmtDisplay = (val) => {
  const str = String(val)
  // Si tiene coma decimal, preservar la parte decimal mientras escribe
  if (str.includes(',')) {
    const [intPart, decPart] = str.split(',')
    const cleanInt = intPart.replace(/\D/g, '')
    if (!cleanInt) return ',' + decPart
    return Number(cleanInt).toLocaleString('es-AR') + ',' + decPart
  }
  const clean = str.replace(/\D/g, '')
  if (!clean) return ''
  return Number(clean).toLocaleString('es-AR')
}

export const parseMoneyInput = (val) => {
  // Reemplaza puntos de miles y convierte coma decimal a punto
  const clean = String(val).replace(/\./g, '').replace(',', '.')
  return parseFloat(clean) || 0
}

export default function MoneyInput({ value, onChange, placeholder = '0', style }) {
  const handleChange = (e) => {
    let raw = e.target.value
    // Permitir solo números, puntos (miles) y una coma (decimal)
    raw = raw.replace(/[^0-9,.]/g, '')
    // Solo una coma permitida
    const commas = (raw.match(/,/g) || []).length
    if (commas > 1) return
    // Quitar puntos de miles para trabajar el valor limpio
    const withoutDots = raw.replace(/\./g, '')
    onChange(withoutDots)
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '13px', pointerEvents: 'none' }}>$</span>
      <input
        value={fmtDisplay(value)}
        onChange={handleChange}
        placeholder={placeholder}
        inputMode="decimal"
        style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '8px 12px 8px 24px', borderRadius: 'var(--radius-sm)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-mono)', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
      />
    </div>
  )
}
