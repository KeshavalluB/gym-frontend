import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiHome, FiUsers, FiLayers, FiCreditCard, FiUserCheck, FiLogOut, FiUser, FiBarChart2 } from 'react-icons/fi'

export default function Sidebar() {
  const router = useRouter()
  const [role, setRole] = useState(null)

  useEffect(() => {
    setRole(localStorage.getItem('role') || 'admin')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const menu = [
    { name: "Home Dashboard", path: "/", icon: <FiHome />, roles: ['admin', 'trainer', 'user'] },
    { name: "Member List", path: "/members", icon: <FiUsers />, roles: ['admin'] },
    { name: "Membership Plans", path: "/plans", icon: <FiLayers />, roles: ['admin', 'user'] },
    { name: "Payment Center", path: "/payments", icon: <FiCreditCard />, roles: ['admin'] },
    { name: "Gym Analytics", path: "/reports", icon: <FiBarChart2 />, roles: ['admin'] },
    { name: "Team Trainers", path: "/trainers", icon: <FiUserCheck />, roles: ['admin'] },
    { name: "My Profile", path: "/profile", icon: <FiUser />, roles: ['admin', 'trainer', 'user'] }
  ]

  return (
    <div className="sidebar" style={{ width: '280px', background: '#0f172a', padding: '40px 24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 className="logo" style={{ fontSize: '28px', color: 'white', fontWeight: '800', margin: 0 }}>Gym<span style={{ color: '#3b82f6' }}>Pro</span></h2>
        <div style={{ 
          marginTop: '12px', 
          background: 'rgba(59, 130, 246, 0.15)', 
          color: '#60a5fa', 
          padding: '4px 12px', 
          borderRadius: '99px', 
          fontSize: '11px', 
          fontWeight: '700',
          display: 'inline-block',
          letterSpacing: '0.5px'
        }}>
          {role?.toUpperCase()} PORTAL
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menu.filter(item => item.roles.includes(role)).map(item => (
          <Link
            key={item.path}
            href={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              color: router.pathname === item.path ? 'white' : '#94a3b8',
              textDecoration: 'none',
              borderRadius: '12px',
              background: router.pathname === item.path ? '#2563eb' : 'transparent',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              boxShadow: router.pathname === item.path ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : 'none'
            }}
          >
            <span style={{ fontSize: '18px', display: 'flex' }}>{item.icon}</span>
            {item.name}
          </Link>
        ))}
        
        <a 
          href="#" 
          onClick={handleLogout} 
          style={{ 
            marginTop: '40px', 
            color: '#f87171', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px 16px', 
            fontSize: '14px', 
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          <span style={{ fontSize: '18px', display: 'flex' }}><FiLogOut /></span>
          Sign Out
        </a>
      </nav>

      <style jsx>{`
        a:hover { color: white !important; background: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  )
}