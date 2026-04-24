import { useState, useCallback } from 'react'
import { useAuth } from './hooks/useAuth.js'
import { useFinances } from './hooks/useFinances.js'
import LoginPage from './pages/LoginPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FixedExpensesPage from './pages/FixedExpensesPage.jsx'
import VariableExpensesPage from './pages/VariableExpensesPage.jsx'
import SavingsPage from './pages/SavingsPage.jsx'
import TimelinePage from './pages/TimelinePage.jsx'
import { Toast, MONTHS } from './components/UI.jsx'

const YEAR = 2025

const NAV = [
  { id: 'dashboard',  icon: '◈', iconActive: '◈', label: 'Resumen',   section: 'General' },
  { id: 'fixed',      icon: '◎', iconActive: '◉', label: 'Fijos',     section: 'Gastos' },
  { id: 'variable',   icon: '⊕', iconActive: '⊕', label: 'Gastos',    section: null },
  { id: 'savings',    icon: '◇', iconActive: '◆', label: 'Ahorro',    section: 'Planificación' },
  { id: 'timeline',   icon: '○', iconActive: '●', label: 'Timeline',  section: null },
]

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [month, setMonth] = useState(new Date().getMonth())
  const [toast, setToast] = useState({ visible: false, message: '' })

  const finances = useFinances(user, YEAR, month)

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }, [])

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: '12px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--accent)', letterSpacing: '-0.5px' }}>Fintrack</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>control personal</div>
        <div style={{ marginTop: '32px', width: '32px', height: '2px', background: 'var(--border2)', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-100%', width: '100%', height: '100%', background: 'var(--accent)', borderRadius: '1px', animation: 'slide 1.2s ease-in-out infinite' }} />
        </div>
        <style>{`@keyframes slide { 0% { left: -100% } 100% { left: 100% } }`}</style>
      </div>
    )
  }

  if (!user) return <LoginPage signIn={signIn} signUp={signUp} />

  let prevSection = null

  return (
    <>
      <style>{`
        .app-layout { display: flex; min-height: 100vh; }

        /* ── Desktop sidebar ── */
        .sidebar {
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          width: 240px;
          flex-shrink: 0;
        }

        .main-content {
          flex: 1;
          padding: 36px 40px;
          overflow-y: auto;
          min-width: 0;
        }

        /* ── Mobile tab bar ── */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 52px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          z-index: 100;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .tab-bar {
          display: none;
          position: fixed;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 60px;
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: 20px;
          z-index: 100;
          align-items: stretch;
          overflow: hidden;
        }

        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          transition: all 0.15s;
          position: relative;
        }

        .tab-item .tab-icon {
          font-size: 18px;
          line-height: 1;
          transition: all 0.15s;
        }

        .tab-item .tab-label {
          font-size: 10px;
          font-family: var(--font-sans);
          font-weight: 600;
          letter-spacing: 0.03em;
          transition: all 0.15s;
          color: var(--muted);
        }

        .tab-item.active .tab-icon { color: var(--accent); }
        .tab-item.active .tab-label { color: var(--accent); }
        .tab-item:not(.active) .tab-icon { color: var(--muted); }

        .tab-item.active::before {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--accent);
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-header { display: flex; }
          .tab-bar { display: flex; }
          .main-content { padding: 72px 16px 96px; }
          .metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .goal-form-grid { grid-template-columns: 1fr !important; }
          .expense-row-grid { grid-template-columns: 1fr 100px 36px !important; }
          .expense-row-grid .col-method { display: none; }
        }

        @media (max-width: 380px) {
          .metrics-grid { grid-template-columns: 1fr !important; }
          .tab-item .tab-label { font-size: 9px; }
        }
      `}</style>

      <div className="app-layout">

        {/* ── Desktop sidebar ── */}
        <aside className="sidebar">
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--accent)', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
            Fintrack
            <span style={{ color: 'var(--text)', opacity: 0.4, fontSize: '12px', display: 'block', fontFamily: 'var(--font-sans)', marginTop: '2px' }}>control personal</span>
          </div>

          {NAV.map(item => {
            const showSection = item.section && item.section !== prevSection
            if (item.section) prevSection = item.section
            return (
              <div key={item.id}>
                {showSection && (
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', margin: '14px 0 4px 12px', fontWeight: 600 }}>
                    {item.section}
                  </div>
                )}
                <div onClick={() => setPage(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 12px', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 500, transition: 'all 0.15s',
                  background: page === item.id ? 'var(--accent-dim)' : 'transparent',
                  color: page === item.id ? 'var(--accent)' : 'var(--muted2)',
                  border: page === item.id ? '1px solid var(--accent-dim2)' : '1px solid transparent',
                }}>
                  <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>
                    {page === item.id ? item.iconActive : item.icon}
                  </span>
                  {item.label === 'Fijos' ? 'Gastos fijos' : item.label === 'Gastos' ? 'Gastos del mes' : item.label === 'Ahorro' ? 'Objetivo de ahorro' : item.label}
                </div>
              </div>
            )
          })}

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <label style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Mes activo</label>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
              style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '8px 10px', borderRadius: '8px', fontFamily: 'var(--font-sans)', fontSize: '13px', cursor: 'pointer', outline: 'none', appearance: 'none', marginBottom: '12px' }}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m} {YEAR}</option>)}
            </select>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            <button onClick={signOut}
              style={{ width: '100%', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--muted2)', padding: '8px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              onMouseEnter={e => { e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'var(--red)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--muted2)'; e.target.style.borderColor = 'var(--border2)' }}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ── Mobile header ── */}
        <div className="mobile-header">
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--accent)' }}>Fintrack</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
              style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '5px 10px', borderRadius: '8px', fontFamily: 'var(--font-sans)', fontSize: '12px', outline: 'none', appearance: 'none' }}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m} {YEAR}</option>)}
            </select>
            <button onClick={signOut} style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--muted2)', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
              Salir
            </button>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="main-content">
          {page === 'dashboard' && <Dashboard finances={finances} month={month} year={YEAR} />}
          {page === 'fixed'     && <FixedExpensesPage finances={finances} showToast={showToast} />}
          {page === 'variable'  && <VariableExpensesPage finances={finances} month={month} year={YEAR} showToast={showToast} />}
          {page === 'savings'   && <SavingsPage finances={finances} showToast={showToast} />}
          {page === 'timeline'  && <TimelinePage finances={finances} currentMonth={month} year={YEAR} />}
        </main>

        {/* ── Mobile tab bar ── */}
        <nav className="tab-bar">
          {NAV.map(item => (
            <button key={item.id} className={`tab-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
              <span className="tab-icon">{page === item.id ? item.iconActive : item.icon}</span>
              <span className="tab-label">{item.label}</span>
            </button>
          ))}
        </nav>

      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}
