import Layout from './components/Layout'
import { useState, useEffect } from 'react'
import { GymDB } from '../utils/db'
import { FiPlus, FiUser, FiAward } from 'react-icons/fi'

export default function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await GymDB.trainers.getAll()
      setTrainers(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const addTrainer = async () => {
    if (!name || !email || !password) return alert("Please fill all fields")

    setLoading(true)
    try {
      await GymDB.trainers.add({ name, email, password, specialty: 'General Fitness' })
      const updated = await GymDB.trainers.getAll()
      setTrainers(updated)
      setName(''); setEmail(''); setPassword('');
      alert("✅ Trainer added successfully!")
    } catch (err) {
      alert("❌ Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Trainers</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Expert Staff: {trainers.length}</span>
      </div>

      <div className="card">
        <h3>Add New Trainer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>NAME</label>
            <input
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>EMAIL</label>
            <input
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>PASSWORD</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <button onClick={addTrainer} disabled={loading} style={{ height: '42px' }}>
            <FiPlus /> Add
          </button>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {trainers.map(t => (
          <div className="card" key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 0 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <FiAward size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.specialty || 'Professional Trainer'}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}