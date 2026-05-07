import Layout from './components/Layout'
import { useEffect, useState } from 'react'
import { GymDB } from '../utils/db'
import { Bar } from 'react-chartjs-2'
import { FiUsers, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiClock, FiPlusCircle, FiUser, FiActivity, FiStar, FiCalendar } from 'react-icons/fi'
import { useRouter } from 'next/router'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Home() {
  const [role, setRole] = useState(null)
  const [user, setUser] = useState(null)
  const [members, setMembers] = useState([])
  const [payments, setPayments] = useState([])
  const [plans, setPlans] = useState([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      const savedRole = localStorage.getItem('role') || 'admin'
      const savedUser = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: 'admin@gympro.com' }
      
      setRole(savedRole)
      setUser(savedUser)
      
      try {
        const [m, p] = await Promise.all([
          GymDB.members.getAll(),
          GymDB.payments.getAll()
        ])
        setMembers(m)
        setPayments(p)
      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setMounted(true)
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])


  const today = new Date()
  const active = payments.filter(p => new Date(p.end_date) > today)
  const userMembership = payments.find(p => p.member_id == user?.id)

  if (!mounted) return null

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  }

  return (
    <Layout>
      <div className="fade-in">
        
        {/* WELCOME HERO */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', 
          borderRadius: '24px', 
          padding: '40px', 
          color: 'white', 
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.2)'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Hello, {user?.name}! 👋</h1>
            <p style={{ fontSize: '18px', opacity: 0.9 }}>SYSTEM UPDATED: VERSION 7.0 IS LIVE - ALL MODULES SYNCED</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%' }}>
            <FiStar size={32} />
          </div>
        </div>

        {role === 'user' ? (
          <div className="user-experience">
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              
              {/* MEMBERSHIP STATUS CARD */}
              <div className="card" style={{ border: 'none', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', color: '#f1f5f9', fontSize: '120px' }}>
                  <FiCheckCircle />
                </div>
                <h3>Membership Plan</h3>
                {userMembership ? (
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="badge badge-success" style={{ marginBottom: '16px' }}>ACTIVE MEMBER</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--secondary)' }}>{plans.find(p => p.id == userMembership.plan_id)?.name || 'Premium Plan'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: 'var(--text-muted)' }}>
                      <FiCalendar /> Renew on: <span style={{ color: '#2563eb', fontWeight: '700' }}>{new Date(userMembership.end_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You don't have an active membership plan yet.</p>
                    <button className="btn-primary" onClick={() => router.push('/plans')} style={{ padding: '12px 32px' }}>
                      <FiPlusCircle /> Get Membership
                    </button>
                  </div>
                )}
              </div>

              {/* QUICK STATS */}
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px' }}>
                <div className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: '#ecfdf5', color: '#10b981', padding: '12px', borderRadius: '12px' }}><FiActivity size={24} /></div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>WORKOUT STREAK</div>
                    <div style={{ fontSize: '20px', fontWeight: '800' }}>12 Days</div>
                  </div>
                </div>
                <div className="card" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '12px', borderRadius: '12px' }}><FiUsers size={24} /></div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>GYM POPULARITY</div>
                    <div style={{ fontSize: '20px', fontWeight: '800' }}>Moderate</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: '32px' }}>Personal Training Schedule</h3>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiUser /></div>
                  <div>
                    <div style={{ fontWeight: '700' }}>Arjun (Personal Trainer)</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Strength & Conditioning</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary)' }}>08:00 AM</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tomorrow</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="management-experience">
            <div className="dashboard-grid">
              <div className="stat-card">
                <FiUsers className="icon" />
                <h3>{role === 'trainer' ? 'My Trainees' : 'Total Members'}</h3>
                <p>{role === 'trainer' ? members.filter(m => String(m.trainer_id) === String(user?.id)).length : members.length}</p>
              </div>
              <div className="stat-card active">
                <FiCheckCircle className="icon" />
                <h3>Total Members</h3>
                <p>{members.length}</p>
              </div>
              <div className="stat-card revenue">
                <FiTrendingUp className="icon" />
                <h3>Gym Capacity</h3>
                <p>42%</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <h3>{role === 'trainer' ? 'My Active Clients' : 'Recent Member Activity'}</h3>
                </div>
                <div className="table-container" style={{ border: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Member Name</th>
                        <th>Training Time</th>
                        <th>Plan Expiry</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(role === 'trainer' ? members.filter(m => String(m.trainer_id) === String(user?.id)) : members.slice(-5)).map(m => {
                        const payment = payments.find(p => p.member_id == m.id)
                        const expiry = payment ? new Date(payment.end_date) : null
                        return (
                          <tr key={m.id}>
                            <td>
                              <div style={{ fontWeight: '600' }}>{m.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MEMBER ID: {m.member_id_alt || `ID-${m.id}`}</div>
                            </td>
                            <td><FiClock style={{ marginRight: '6px' }} /> {role === 'trainer' ? '08:00 AM' : 'Varies'}</td>
                            <td>
                              {expiry && !isNaN(expiry) ? (
                                <span style={{ color: expiry < today ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                                  {expiry.toLocaleDateString()}
                                </span>
                              ) : 'No Plan'}
                            </td>
                            <td><button className="secondary" style={{ padding: '4px 12px', fontSize: '12px' }}>Manage</button></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <h3>Gym Traffic Overview</h3>
                <div style={{ height: '240px' }}>
                  <Bar data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{ label: 'Traffic', data: [30, 45, 60, 40, 70, 90, 50], backgroundColor: '#4f46e5', borderRadius: 4 }]
                  }} options={{ plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .user-experience h3 { margin-bottom: 16px; font-weight: 700; color: #1e293b; }
        .stat-card .icon { position: absolute; right: 20px; top: 20px; color: #e2e8f0; fontSize: 40px; }
      `}</style>
    </Layout>
  )
}