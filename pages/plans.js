import Layout from './components/Layout'
import { useEffect, useState } from 'react'
import { getData, saveData } from '../utils/storage'
import { FiCheck, FiArrowRight } from 'react-icons/fi'
import { useRouter } from 'next/router'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const router = useRouter()

  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'))
    if (savedUser) setUser(savedUser)

    const defaultPlans = [
      { id: 1, name: "Starter (1 Month)", price: "1000", days: 30, features: ["Gym Access", "Locker Room", "Basic Support"] },
      { id: 2, name: "Pro (3 Months)", price: "2500", days: 90, features: ["Gym Access", "Locker Room", "Personal Trainer (2 sessions)", "Diet Plan"], popular: true },
      { id: 3, name: "Elite (6 Months)", price: "4500", days: 180, features: ["Full Gym Access", "Private Locker", "Personal Trainer (5 sessions)", "Advanced Diet Plan", "Guest Passes"] },
      { id: 4, name: "Student Special (1 Month)", price: "800", days: 30, features: ["Gym Access", "Valid ID Required"] },
      { id: 5, name: "Annual Core", price: "8000", days: 365, features: ["Full Gym Access", "All-time Access", "Free Wi-Fi"] },
      { id: 6, name: "Annual Ultimate", price: "12000", days: 365, features: ["Full Gym Access", "All-time Access", "Unlimited PT", "Spa Access", "Free Supplements"] }
    ]
    
    const stored = getData('plans')
    if (stored.length < 6) {
      saveData('plans', defaultPlans)
      setPlans(defaultPlans)
    } else {
      setPlans(stored)
    }
  }, [])

  const handleBuy = (id) => {
    router.push(`/payments?planId=${id}`)
  }

  return (
    <Layout>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
          Welcome, {user?.name || 'Athlete'}! 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Choose your path to fitness and activate your membership.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              border: plan.popular ? '2px solid var(--primary)' : '1px solid #e2e8f0',
              padding: '32px',
              borderRadius: '24px',
              transition: 'transform 0.2s',
              background: 'white'
            }}
          >
            {plan.popular && (
              <span style={{ 
                alignSelf: 'flex-start',
                background: 'var(--primary)', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '999px', 
                fontSize: '11px', 
                fontWeight: '800',
                marginBottom: '16px'
              }}>
                MOST POPULAR
              </span>
            )}
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800' }}>₹{plan.price}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>/ {plan.days} days</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1 }}>
              {plan.features?.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '14px', color: '#475569' }}>
                  <FiCheck style={{ color: '#10b981', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            <button 
              className={plan.popular ? "btn-primary" : "btn-secondary"} 
              onClick={() => handleBuy(plan.id)}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Get Started <FiArrowRight />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .btn-secondary { background: #f1f5f9; color: #1e293b; border: none; transition: 0.2s; cursor: pointer; }
        .btn-secondary:hover { background: #e2e8f0; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
      `}</style>
    </Layout>
  )
}