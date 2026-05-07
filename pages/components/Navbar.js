import { useEffect, useState } from 'react'
import { FiSearch, FiBell, FiUser, FiSettings } from 'react-icons/fi'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'))
    if (savedUser) setUser(savedUser)
    
    const savedRole = localStorage.getItem('role')
    if (savedRole) setRole(savedRole)
  }, [])

  return (
    <div className="navbar" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 32px',
      background: 'white',
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            placeholder="Quick search..." 
            style={{ 
              padding: '10px 16px 10px 40px', 
              borderRadius: '10px', 
              border: '1px solid #f1f5f9',
              background: '#f8fafc',
              fontSize: '14px',
              width: '300px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', position: 'relative' }}>
          <FiBell size={20} />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px', borderLeft: '1px solid #f1f5f9' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{user?.name || 'Guest'}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{role ? role.toUpperCase() : 'VISITOR'}</div>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}>
            {user?.name ? user.name[0] : <FiUser />}
          </div>
        </div>
      </div>
    </div>
  )
}