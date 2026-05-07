import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FiMail, FiLock, FiUser, FiAward, FiShield, FiX, FiAlertCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import Head from 'next/head'
import Link from 'next/link'
import { GymDB } from '../../utils/db'

export default function Login() {
  const [role, setRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [accounts, setAccounts] = useState({ admins: [], trainers: [], members: [] })
  const router = useRouter()

  useEffect(() => {
    const loadAccounts = async () => {
      // Load all accounts from Supabase
      const [admins, trainers, members] = await Promise.all([
        GymDB.admins.getAll(),
        GymDB.trainers.getAll(),
        GymDB.members.getAll()
      ])
      setAccounts({ admins, trainers, members })
    }
    loadAccounts()
  }, [])

  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError('')
    setIsAuthenticating(true)

    try {
      let user = null
      if (role === 'admin') user = await GymDB.admins.validate(email, password)
      if (role === 'trainer') user = await GymDB.trainers.validate(email, password)
      if (role === 'user') user = await GymDB.members.validate(email, password)

      if (user) {
        localStorage.setItem('role', role)
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/')
      } else {
        setError(`❌ Access Denied: Invalid credentials.`)
      }
    } catch (err) {
      setError(`⚠️ Connection Error: Failed to reach Supabase.`)
    } finally {
      setIsAuthenticating(false)
    }
  }


  const handleGoogleSelect = (account) => {
    localStorage.setItem('role', role === 'user' ? 'user' : role)
    localStorage.setItem('user', JSON.stringify(account))
    router.push('/')
  }

  const getVisibleAccounts = () => {
    if (role === 'admin') return accounts.admins
    if (role === 'trainer') return accounts.trainers
    return accounts.members
  }

  const visibleAccounts = getVisibleAccounts()

  return (
    <div className="login-page">
      <Head>
        <title>Login | GymPro</title>
      </Head>

      <div className="login-card">
        <h1 className="logo">Gym<span>Pro</span></h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Professional Management Portal</p>

        <div className="role-selector">
          <button className={role === 'user' ? 'active' : ''} onClick={() => { setRole('user'); setError(''); }}>
            <FiUser /> Member
          </button>
          <button className={role === 'trainer' ? 'active' : ''} onClick={() => { setRole('trainer'); setError(''); }}>
            <FiAward /> Trainer
          </button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => { setRole('admin'); setError(''); }}>
            <FiShield /> Admin
          </button>
        </div>

        <form className="form-container" onSubmit={handleLogin}>
          <button type="button" className="google-btn" onClick={() => setShowGoogleModal(true)}>
            <FcGoogle size={20} /> Continue with Google
          </button>
          
          <div className="divider">SECURE SIGN-IN</div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiAlertCircle /> {error}
            </div>
          )}

          <div className="input-field">
            <FiMail />
            <input 
              type="email" 
              placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)} Email`} 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <FiLock />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isAuthenticating}>
            {isAuthenticating ? 'Verifying...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '24px' }}>
            Powered by <strong>GymPro Local Engine</strong>
          </p>

          <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Register Now</Link>
          </p>

        </form>
      </div>

      {/* GOOGLE ACCOUNT PICKER MODAL */}
      {showGoogleModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '400px', padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '32px 24px 24px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
              <FcGoogle size={48} style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>Choose an account</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>to continue as <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{role.toUpperCase()}</span></p>
            </div>
            
            <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px 0' }}>
              {visibleAccounts.length > 0 ? (
                visibleAccounts.map(acc => (
                  <div key={acc.id} className="google-account" onClick={() => handleGoogleSelect(acc)}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: role === 'admin' ? '#ef4444' : role === 'trainer' ? '#10b981' : 'var(--primary)', 
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' 
                    }}>
                      {acc.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{acc.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{acc.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FiUser size={32} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <div style={{ fontSize: '14px' }}>No {role} accounts found in database.</div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="secondary" onClick={() => setShowGoogleModal(false)} style={{ borderRadius: '10px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 20px; }
        .login-card { background: white; padding: 48px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); width: 100%; max-width: 480px; }
        .logo { font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 8px; }
        .logo span { color: var(--primary); }
        .role-selector { display: flex; gap: 8px; margin-bottom: 32px; background: #f1f5f9; padding: 6px; border-radius: 12px; }
        .role-selector button { flex: 1; padding: 12px; border-radius: 8px; border: none; background: transparent; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .role-selector button.active { background: white; color: var(--primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .google-btn { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; color: #1e293b; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; margin-bottom: 24px; }
        .divider { display: flex; align-items: center; gap: 16px; color: #94a3b8; font-size: 11px; font-weight: 700; margin-bottom: 24px; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: #f1f5f9; }
        .input-field { position: relative; margin-bottom: 16px; }
        .input-field :global(svg) { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-field input { width: 100%; padding: 14px 14px 14px 48px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; transition: 0.2s; }
        .input-field input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .login-btn { width: 100%; padding: 14px; border-radius: 12px; background: var(--primary) !important; color: white; font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.2s; border: none; }
        .login-btn:hover { background: var(--primary-hover) !important; transform: translateY(-1px); }
        .google-account { display: flex; alignItems: center; gap: 12px; padding: 12px 24px; cursor: pointer; transition: 0.2s; }
        .google-account:hover { background: #f1f5f9; }
      `}</style>

    </div>
  )
}
