import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage({ signIn, signUp }) {
  const [mode, setMode] = useState('login') // login | register | forgot
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = () => { setError(''); setSuccess('') }

  const handle = async () => {
    reset(); setLoading(true)
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      setLoading(false)
      if (error) setError(error.message)
      else setSuccess('Te mandamos un email para restablecer tu contraseña.')
      return
    }
    const fn = mode === 'login' ? signIn : signUp
    const err = await fn(email, password)
    setLoading(false)
    if (err) setError(err.message)
    else if (mode === 'register') setSuccess('¡Cuenta creada! Revisá tu email para confirmar.')
  }

  return (
    <>
      <style>{`
        .login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg);
        }
        .login-card {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 40px 36px;
          width: 100%;
          max-width: 400px;
        }
        .login-input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 11px 14px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          outline: none;
          margin-bottom: 12px;
          font-family: var(--font-sans);
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .login-input:focus { border-color: var(--accent); }
        .login-btn-primary {
          width: 100%;
          background: var(--accent);
          color: #0f0f0f;
          border: none;
          padding: 13px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-sans);
          margin-top: 4px;
          transition: opacity 0.15s;
        }
        .login-btn-primary:hover { opacity: 0.9; }
        .login-tab {
          flex: 1;
          padding: 9px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font-sans);
          transition: all 0.15s;
        }
        .login-link {
          background: none;
          border: none;
          color: var(--muted2);
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
          font-family: var(--font-sans);
        }
        .login-label {
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }
        @media (max-width: 480px) {
          .login-wrap { align-items: flex-start; padding-top: 48px; }
          .login-card { padding: 28px 20px; }
        }
      `}</style>

      <div className="login-wrap">
        <div className="login-card">

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', color: 'var(--accent)', marginBottom: '4px' }}>Fintrack</div>
          <div style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '28px' }}>control personal</div>

          {mode !== 'forgot' && (
            <div style={{ display: 'flex', marginBottom: '20px', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
              {[['login','Iniciar sesión'],['register','Registrarse']].map(([m, label]) => (
                <button key={m} className="login-tab"
                  onClick={() => { setMode(m); reset() }}
                  style={{ background: mode === m ? 'var(--surface)' : 'transparent', color: mode === m ? 'var(--text)' : 'var(--muted2)' }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {mode === 'forgot' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Restablecer contraseña</div>
              <div style={{ fontSize: '13px', color: 'var(--muted2)' }}>Te enviamos un link a tu email para crear una nueva contraseña.</div>
            </div>
          )}

          {error && <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', color: 'var(--red)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
          {success && <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px' }}>{success}</div>}

          <label className="login-label">Email</label>
          <input className="login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" onKeyDown={e => e.key === 'Enter' && handle()} />

          {mode !== 'forgot' && (
            <>
              <label className="login-label">Contraseña</label>
              <input className="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handle()} />
            </>
          )}

          <button className="login-btn-primary" onClick={handle} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Crear cuenta' : 'Enviar email'}
          </button>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            {mode === 'login' && (
              <button className="login-link" onClick={() => { setMode('forgot'); reset() }}>
                Olvidé mi contraseña
              </button>
            )}
            {mode === 'forgot' && (
              <button className="login-link" onClick={() => { setMode('login'); reset() }}>
                ← Volver al login
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
