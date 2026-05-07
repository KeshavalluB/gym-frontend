import Layout from './components/Layout'
import { FiPieChart, FiBarChart2, FiTrendingUp, FiDownload } from 'react-icons/fi'

export default function Reports() {
  const reports = [
    { title: "Monthly Revenue", icon: <FiTrendingUp />, color: "var(--primary)" },
    { title: "Member Growth", icon: <FiBarChart2 />, color: "var(--success)" },
    { title: "Expired Members", icon: <FiPieChart />, color: "var(--error)" }
  ]

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Reports</h2>
        <button className="secondary">
          <FiDownload /> Export All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {reports.map(report => (
          <div key={report.title} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '12px', 
              background: report.color + '15', 
              color: report.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {report.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{report.title}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>View detailed analytics and history</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}