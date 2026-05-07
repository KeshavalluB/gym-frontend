import Layout from './components/Layout'
import { useEffect, useState } from 'react'
import { GymDB } from '../utils/db'
import { FiUser, FiMail, FiShield, FiCalendar, FiClock, FiEdit2, FiInfo } from 'react-icons/fi'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [membership, setMembership] = useState(null)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      const savedUser = JSON.parse(localStorage.getItem('user'))
      const savedRole = localStorage.getItem('role') || 'admin'
      
      if (savedUser) {
        setUser(savedUser)
        setRole(savedRole)

        if (savedRole === 'user') {
          try {
            const payments = await GymDB.payments.getAll()
            const userPayment = payments.find(p => p.member_id == savedUser.id)
            if (userPayment) {
              setMembership(userPayment)
              
              // Standard plans (static for now, same as in payments.js)
              const defaultPlans = [
                { id: 1, name: "Starter (1 Month)", price: "1000", days: 30 },
                { id: 2, name: "Pro (3 Months)", price: "2500", days: 90 },
                { id: 3, name: "Elite (6 Months)", price: "4500", days: 180 },
                { id: 4, name: "Student Special (1 Month)", price: "800", days: 30 },
                { id: 5, name: "Annual Core", price: "8000", days: 365 },
                { id: 6, name: "Annual Ultimate", price: "12000", days: 365 }
              ]
              setPlan(defaultPlans.find(pl => pl.id == userPayment.plan_id))
            }
          } catch (err) {
            console.error("Profile load error:", err)
          }
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])


  if (!user) return <Layout><div>Loading profile...</div></Layout>

  return (
    <Layout>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Account Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and membership details.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* PROFILE CARD */}
        <div className="card" style={{ height: 'fit-content', textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            fontWeight: '800',
            margin: '0 auto 20px auto',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
          }}>
            {user.name[0]}
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{user.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{user.email}</p>
          
          <div className="badge" style={{ 
            background: '#eff6ff', 
            color: '#2563eb', 
            padding: '6px 16px', 
            borderRadius: '99px', 
            fontWeight: '700', 
            fontSize: '11px',
            letterSpacing: '0.5px'
          }}>
            {role.toUpperCase()}
          </div>

          <button className="secondary" style={{ width: '100%', marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FiEdit2 size={14} /> Edit Profile
          </button>
        </div>

        {/* DETAILS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* DESCRIPTION CARD */}
          <div className="card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--secondary)' }}>
              <FiInfo className="icon-primary" /> About Me
            </h4>
            <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '15px' }}>
              {role === 'user' ? 
                "Fitness enthusiast currently focusing on strength training and weight loss goals. Dedicated to hitting the gym at least 4 times a week." :
                role === 'trainer' ?
                "Certified professional trainer with 5+ years of experience in bodybuilding and nutrition. Expert in helping clients achieve peak physical form." :
                "System administrator responsible for gym operations, member onboarding, and financial oversight."}
            </p>
          </div>

          {/* MEMBERSHIP STATUS CARD */}
          {role === 'user' && (
            <div className="card" style={{ background: membership ? '#f0fdf4' : '#fff7ed', border: membership ? '1px solid #bbf7d0' : '1px solid #ffedd5' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: membership ? '#166534' : '#9a3412' }}>
                <FiCalendar /> Membership Details
              </h4>
              
              {membership ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '16px', background: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>ACTIVE PLAN</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>{plan?.name || 'Standard Plan'}</div>
                  </div>
                  <div style={{ padding: '16px', background: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>EXPIRY DATE</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#ef4444' }}>{new Date(membership.end_date).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <p style={{ fontSize: '14px', marginBottom: '16px' }}>You don't have an active membership.</p>
                  <button className="btn-primary" onClick={() => window.location.href='/plans'}>View Plans</button>
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT INFO */}
          <div className="card">
            <h4 style={{ marginBottom: '20px' }}>Account Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Member Since</span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>May 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Preferred Gym Time</span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>08:00 AM - 10:00 AM</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}