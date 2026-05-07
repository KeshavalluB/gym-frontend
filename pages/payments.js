import Layout from './components/Layout'
import { useState, useEffect } from 'react'
import { GymDB } from '../utils/db'
import { FiPlus, FiTrash2, FiCreditCard, FiCheckCircle, FiXCircle, FiSearch, FiInfo } from 'react-icons/fi'
import { useRouter } from 'next/router'

export default function Payments() {
  const [members, setMembers] = useState([])
  const [plans, setPlans] = useState([])
  const [payments, setPayments] = useState([])
  const [trainers, setTrainers] = useState([])
  const [memberId, setMemberId] = useState('')
  const [planId, setPlanId] = useState('')
  const [trainerId, setTrainerId] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [storedMembers, storedPayments, storedTrainers] = await Promise.all([
          GymDB.members.getAll(),
          GymDB.payments.getAll(),
          GymDB.trainers.getAll()
        ])
        
        setMembers(storedMembers)
        setPayments(storedPayments)
        setTrainers(storedTrainers)

        // Using standard plans (static for now, could be in Supabase too)
        const defaultPlans = [
          { id: 1, name: "Starter (1 Month)", price: "1000", days: 30 },
          { id: 2, name: "Pro (3 Months)", price: "2500", days: 90 },
          { id: 3, name: "Elite (6 Months)", price: "4500", days: 180 },
          { id: 4, name: "Student Special (1 Month)", price: "800", days: 30 },
          { id: 5, name: "Annual Core", price: "8000", days: 365 },
          { id: 6, name: "Annual Ultimate", price: "12000", days: 365 }
        ]
        setPlans(defaultPlans)

        if (router.isReady) {
          if (router.query.planId) setPlanId(router.query.planId)
          const role = localStorage.getItem('role')
          const user = JSON.parse(localStorage.getItem('user'))
          if (role === 'user' && user) {
            setMemberId(String(user.id))
            setTrainerId("1")
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [router.isReady, router.query])

  const makePayment = async () => {
    if (!memberId || !planId || !trainerId) {
      setMessage("⚠️ Please complete all fields")
      return
    }

    const plan = plans.find(p => p.id == planId)
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + Number(plan.days))

    setLoading(true)
    try {
      const newPayment = {
        member_id: parseInt(memberId),
        plan_id: parseInt(planId),
        amount: parseFloat(plan.price),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      }

      await GymDB.payments.add(newPayment)
      
      // Also update the member's trainer assignment in Supabase
      await GymDB.supabase
        .from('members')
        .update({ trainer_id: parseInt(trainerId) })
        .eq('id', parseInt(memberId))

      const updated = await GymDB.payments.getAll()
      setPayments(updated)
      
      setMessage("✅ Payment Successful! Dashboard updated.")
      setTimeout(() => router.push('/'), 2000)
    } catch (err) {
      setMessage("❌ Payment failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }


  const filteredPayments = payments.filter(p => {
    const m = members.find(mem => mem.id == p.memberId)?.name || ""
    return m.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <Layout>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Payment Center</h2>
        <p style={{ color: 'var(--text-muted)' }}>Finalize your membership to activate gym access.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        <div className="card" style={{ height: 'fit-content', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCreditCard style={{ color: 'var(--primary)' }} /> Process Membership
          </h3>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>MEMBER</label>
            <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <option value="">-- Choose Member --</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>SELECTED PLAN</label>
            <select value={planId} onChange={e => setPlanId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <option value="">-- Select Plan --</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>CHOOSE TRAINER</label>
            <select value={trainerId} onChange={e => setTrainerId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <option value="">-- Select Trainer --</option>
              {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <button className="btn-primary" onClick={makePayment} style={{ width: '100%', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <FiCheckCircle /> Confirm & Activate
          </button>

          {message && (
            <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: message.includes('✅') ? '#dcfce7' : '#fee2e2', color: message.includes('✅') ? '#166534' : '#991b1b', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
              {message}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                placeholder="Search history..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>
          </div>
          
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan & Amount</th>
                  <th>Validity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredPayments].reverse().map(p => {
                  const m = members.find(mem => mem.id == p.memberId)
                  const plan = plans.find(pl => pl.id == p.planId)
                  const isActive = new Date(p.end) > new Date()
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{m?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{p.id.toString().slice(-6)}</div>
                      </td>
                      <td>
                        <div>{plan?.name || 'Plan'}</div>
                        <div style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{p.amount || '0'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>{new Date(p.start).toLocaleDateString()} - {new Date(p.end).toLocaleDateString()}</div>
                      </td>
                      <td>
                        <span className={`badge ${isActive ? 'badge-success' : 'badge-error'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isActive ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                          {isActive ? 'ACTIVE' : 'EXPIRED'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}