import { useState } from 'react'
import { useRouter } from 'next/router'
import { FiMail, FiLock, FiUser, FiAward, FiShield, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import Head from 'next/head'
import Link from 'next/link'
import { GymDB } from '../../utils/db'

export default function Register() {
  const [role, setRole] = useState('user')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    try {
      if (role === 'user') {
        await GymDB.members.add({ name, email, password })
      } else if (role === 'trainer') {
        // We'll use the same insert logic for trainers
        const { data, error: err } = await GymDB.supabase
          .from('trainers')
          .insert([{ name, email, password, specialty }])
        if (err) throw err
      }

      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      <Head>
        <title>Create Account | GymPro</title>
      </Head>

      <div className="register-card">
        <h1 className="logo">Gym<span>Pro</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Join the professional fitness community
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <FiCheckCircle size={64} color="var(--success)" style={{ marginBottom: '24px' }} />
            <h2 style={{ marginBottom: '8px' }}>Account Created!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="role-selector">
              <button className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>
                <FiUser /> Member
              </button>
              <button className={role === 'trainer' ? 'active' : ''} onClick={() => setRole('trainer')}>
                <FiAward /> Trainer
              </button>
            </div>

            <form onSubmit={handleRegister}>
              {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiAlertCircle /> {error}
                </div>
              )}

              <div className="input-field">
                <FiUser />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <FiMail />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              {role === 'trainer' && (
                <div className="input-field">
                  <FiAward />
                  <input 
                    type="text" 
                    placeholder="Specialty (e.g. Yoga, Strength)" 
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="input-field">
                <FiLock />
                <input 
                  type="password" 
                  placeholder="Create Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <FiShield />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="register-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Get Started'}
                <FiArrowRight />
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '24px', color: 'var(--text-muted)' }}>
                Already have an account? <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
              </p>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        .register-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 20px; }
        .register-card { background: white; padding: 48px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); width: 100%; max-width: 480px; }
        .logo { font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 8px; }
        .logo span { color: var(--primary); }
        .role-selector { display: flex; gap: 8px; margin-bottom: 32px; background: #f1f5f9; padding: 6px; border-radius: 12px; }
        .role-selector button { flex: 1; padding: 12px; border-radius: 8px; border: none; background: transparent; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .role-selector button.active { background: white; color: var(--primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .input-field { position: relative; margin-bottom: 16px; }
        .input-field :global(svg) { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-field input { width: 100%; padding: 14px 14px 14px 48px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; transition: 0.2s; }
        .input-field input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
        .register-btn { width: 100%; padding: 14px; border-radius: 12px; background: var(--primary); color: white; font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.2s; border: none; display: flex; align-items: center; justify-content: center; gap: 12px; }
        .register-btn:hover { background: var(--primary-hover); transform: translateY(-1px); }
        .register-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
