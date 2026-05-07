import Layout from './components/Layout'
import { useState, useEffect } from 'react'
import { GymDB } from '../utils/db'
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiSearch, FiAlertTriangle, FiLock } from 'react-icons/fi'

export default function Members() {
  const [members, setMembers] = useState([])
  const [trainers, setTrainers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [trainerId, setTrainerId] = useState('')
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [m, t] = await Promise.all([
        GymDB.members.getAll(),
        GymDB.trainers.getAll()
      ])
      setMembers(m)
      setTrainers(t)
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSubmit = async () => {
    if (!name || !email || !password) return alert("Please fill all fields including password")

    setLoading(true)
    try {
      if (editId) {
        // Edit logic (if Supabase update is implemented)
        alert("Edit functionality coming soon to cloud version")
      } else {
        const newMember = { 
          name, 
          email, 
          password,
          trainer_id: trainerId ? parseInt(trainerId) : null
        }
        await GymDB.members.add(newMember)
        const updated = await GymDB.members.getAll()
        setMembers(updated)
      }
      setName(''); setEmail(''); setPassword(''); setTrainerId('');
    } catch (err) {
      alert("Error saving member: " + err.message)
    } finally {
      setLoading(false)
    }
  }


  const clearAllMembers = async () => {
    if (confirm("⚠️ WARNING: This will delete ALL members and their payment history. Proceed?")) {
      setLoading(true)
      try {
        await GymDB.supabase.from('payments').delete().neq('id', 0)
        await GymDB.supabase.from('members').delete().neq('id', 0)
        setMembers([])
        alert("System Cleared: All members and payments removed.")
      } catch (err) {
        alert("Error clearing system: " + err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEdit = (m) => {
    setName(m.name)
    setEmail(m.email || '')
    setPassword(m.password || '')
    setTrainerId(m.trainer_id)
    setEditId(m.id)
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await GymDB.supabase.from('members').delete().eq('id', id)
        setMembers(members.filter(m => m.id !== id))
      } catch (err) {
        alert("Delete failed: " + err.message)
      }
    }
  }

  const getTrainer = (id) =>
    trainers.find(t => t.id == id)?.name || "Not Assigned"

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Member Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Validate and register members to the database.</p>
        </div>
        <button className="danger" onClick={clearAllMembers} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
          <FiAlertTriangle /> Clear All Members
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* ADD / EDIT FORM */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '24px' }}>{editId ? 'Edit Account' : 'Create Member Account'}</h3>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>FULL NAME</label>
            <input
              placeholder="e.g. John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>EMAIL ADDRESS</label>
            <input
              placeholder="john@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>SECURE PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>ASSIGN TRAINER</label>
            <select 
              value={trainerId} 
              onChange={e => setTrainerId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}
            >
              <option value="">No Trainer Assigned</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', padding: '14px', borderRadius: '12px' }}>
            {editId ? <FiEdit2 /> : <FiPlus />}
            <span style={{ marginLeft: '8px' }}>{editId ? "Update Member" : "Save to Database"}</span>
          </button>
          
          {editId && (
            <button className="secondary" onClick={() => { setEditId(null); setName(''); setEmail(''); setPassword(''); setTrainerId(''); }} style={{ width: '100%', marginTop: '12px' }}>
              Cancel
            </button>
          )}
        </div>

        {/* MEMBER LIST */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Validated Member Database</h3>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                placeholder="Search..." 
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
                  <th>User Information</th>
                  <th>Trainer</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No members found in database.</td></tr>
                ) : (
                  filteredMembers.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700' }}>
                            {m.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{m.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.member_id_alt || `ID-${m.id}`} • {m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: m.trainer_id ? '#e0e7ff' : '#f1f5f9', color: m.trainer_id ? '#4338ca' : '#64748b' }}>
                          {getTrainer(m.trainer_id)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="secondary" style={{ padding: '8px 12px', marginRight: '8px' }} onClick={() => handleEdit(m)}>
                          <FiEdit2 size={14} />
                        </button>
                        <button className="danger" style={{ padding: '8px 12px' }} onClick={() => handleDelete(m.id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}