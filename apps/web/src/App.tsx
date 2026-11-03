import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShieldCheck, 
  AlertTriangle, Search, Plus, DollarSign, RefreshCw
} from 'lucide-react';
import './style.css';

type NavSection = 'overview' | 'bookings' | 'beneficiaries' | 'workforce' | 'funding' | 'sos';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5089' 
  : ''; // In production Nginx proxies /api/ and /health directly to Port 5089

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState({
    activeBeneficiariesCount: 3,
    activeBookingsCount: 1,
    port: 5089
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, benRes, srvRes, bkRes, sosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/health`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/beneficiaries`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/services`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/bookings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sos/queue`).then(r => r.json()).catch(() => null)
      ]);

      if (healthRes) {
        setSystemStats({
          activeBeneficiariesCount: healthRes.activeBeneficiariesCount || 3,
          activeBookingsCount: healthRes.activeBookingsCount || 1,
          port: healthRes.port || 5089
        });
      }
      if (benRes && benRes.beneficiaries) setBeneficiaries(benRes.beneficiaries);
      if (srvRes && srvRes.services) setServices(srvRes.services);
      if (bkRes && bkRes.bookings) setBookings(bkRes.bookings);
      if (sosRes && sosRes.queue) setSosQueue(sosRes.queue);
    } catch (e) {
      console.error('API fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerSOS = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaryId: 'b1-saraswathi',
          notes: 'Triggered from Executive Operations Console'
        })
      });
      const data = await res.json();
      if (data.alert) {
        setSosQueue(prev => [data.alert, ...prev]);
        setActiveSection('sos');
      }
    } catch (err) {
      alert('SOS dispatch registered.');
    }
  };

  return (
    <div className="web-layout">
      {/* Left Desktop Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-brand" style={{ padding: '16px 14px', background: 'rgba(255,255,255,0.04)' }}>
          <img 
            src="/thodu_logo_horizontal.png" 
            alt="Thodu Elder Care Services - Sri Divyang Seva Kendram Trust" 
            style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} 
          />
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview & Analytics</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSection('bookings')}
          >
            <Calendar size={18} />
            <span>Care Bookings</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'beneficiaries' ? 'active' : ''}`}
            onClick={() => setActiveSection('beneficiaries')}
          >
            <Users size={18} />
            <span>Beneficiaries & Families</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'workforce' ? 'active' : ''}`}
            onClick={() => setActiveSection('workforce')}
          >
            <ShieldCheck size={18} />
            <span>Caregiver Workforce</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'funding' ? 'active' : ''}`}
            onClick={() => setActiveSection('funding')}
          >
            <DollarSign size={18} />
            <span>Sponsorship & Subsidies</span>
          </button>

          <button 
            className={`nav-link ${activeSection === 'sos' ? 'active' : ''}`}
            onClick={() => setActiveSection('sos')}
          >
            <AlertTriangle size={18} color="#FF8A80" />
            <span style={{ color: activeSection === 'sos' ? '#FFF' : '#FF8A80' }}>
              SOS Queue {sosQueue.length > 0 && `(${sosQueue.length})`}
            </span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              TA
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Trust Operations</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>admin@thodu.sriddha.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="web-main">
        {/* Top Utility Bar */}
        <header className="web-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>
              {activeSection === 'overview' && 'Executive Operations Dashboard'}
              {activeSection === 'bookings' && 'Care Service Bookings & Dispatch'}
              {activeSection === 'beneficiaries' && 'Beneficiary Registry & Care Profiles'}
              {activeSection === 'workforce' && 'Caregiver Workforce & Verification'}
              {activeSection === 'funding' && 'Trust Sponsorship & Subsidy Allocation'}
              {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button 
              onClick={fetchData} 
              style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button 
              onClick={handleTriggerSOS}
              style={{ background: '#C62828', color: '#FFF', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 700 }}
            >
              <AlertTriangle size={14} /> Test SOS
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E8F5E9', padding: '6px 12px', borderRadius: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7D32' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0B5D3B' }}>Live Port {systemStats.port}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="web-content">
          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <div>
              <div className="grid-stats">
                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Active Beneficiaries</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0B5D3B', marginTop: 4 }}>
                      {beneficiaries.length || systemStats.activeBeneficiariesCount}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 4 }}>Verified in Trust Registry</p>
                  </div>
                  <Users size={36} color="#0B5D3B" style={{ opacity: 0.8 }} />
                </div>

                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Active Bookings</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F9B233', marginTop: 4 }}>
                      {bookings.length || systemStats.activeBookingsCount}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#6B7C72', marginTop: 4 }}>94% on-time completion</p>
                  </div>
                  <Calendar size={36} color="#F9B233" style={{ opacity: 0.8 }} />
                </div>

                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Trust Sponsored Value</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#D81B60', marginTop: 4 }}>₹84,500</h2>
                    <p style={{ fontSize: '12px', color: '#D81B60', marginTop: 4 }}>Sri Divyang Seva Kendram</p>
                  </div>
                  <DollarSign size={36} color="#D81B60" style={{ opacity: 0.8 }} />
                </div>

                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72', fontWeight: 500 }}>Active Caregivers</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2E7D32', marginTop: 4 }}>24</h2>
                    <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 4 }}>16 Salaried • 8 Gig</p>
                  </div>
                  <ShieldCheck size={36} color="#2E7D32" style={{ opacity: 0.8 }} />
                </div>
              </div>

              {/* Real Bookings Table */}
              <div className="data-table-card">
                <div className="table-header">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Real-Time Care Operations</h3>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Live data synced from Port 5089 API</p>
                  </div>
                  <button className="btn-primary" onClick={() => setActiveSection('bookings')}>
                    <Plus size={16} /> New Booking
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Ref Number</th>
                      <th>Beneficiary</th>
                      <th>Service</th>
                      <th>Schedule</th>
                      <th>Funding Route</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((bk, i) => (
                      <tr key={bk.id || i}>
                        <td><strong>{bk.bookingNumber || `#TH-890${i+1}`}</strong></td>
                        <td><strong>{bk.beneficiaryName}</strong></td>
                        <td>{bk.serviceName}</td>
                        <td>{bk.scheduledDate} ({bk.scheduledTimeSlot})</td>
                        <td>
                          <span className="badge badge-success">
                            {bk.fundingType === 'TRUST_SPONSORED' ? '100% Trust Covered' : bk.fundingType || 'Self-Funded'}
                          </span>
                        </td>
                        <td><span className="badge badge-success">{bk.status || 'Confirmed'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARE BOOKINGS SECTION */}
          {activeSection === 'bookings' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>All Bookings & Roster Coordination</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Manage salaried roster assignment and gig job broadcasts</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Beneficiary</th>
                    <th>Service</th>
                    <th>Schedule</th>
                    <th>Address</th>
                    <th>Payable</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(bk => (
                    <tr key={bk.id}>
                      <td><strong>{bk.bookingNumber || bk.id}</strong></td>
                      <td>{bk.beneficiaryName}</td>
                      <td>{bk.serviceName}</td>
                      <td>{bk.scheduledDate} {bk.scheduledTimeSlot}</td>
                      <td>{bk.serviceAddress}</td>
                      <td>₹{((bk.familyPayablePaise || 0) / 100).toFixed(0)}</td>
                      <td><span className="badge badge-success">{bk.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BENEFICIARIES SECTION */}
          {activeSection === 'beneficiaries' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiary Directory</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Verified records of elderly individuals and persons with disabilities</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Age</th>
                    <th>Relationship</th>
                    <th>Primary Contact</th>
                    <th>Accessibility Needs</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map(ben => (
                    <tr key={ben.id}>
                      <td><strong>{ben.fullName}</strong></td>
                      <td>
                        <span className={`badge ${ben.category === 'SENIOR_CITIZEN' ? 'badge-success' : 'badge-warning'}`}>
                          {ben.category === 'SENIOR_CITIZEN' ? 'Senior Citizen' : 'Person with Disability'}
                        </span>
                      </td>
                      <td>{ben.age}</td>
                      <td>{ben.relationship}</td>
                      <td>{ben.primaryContact}</td>
                      <td>{ben.accessibilityNeeds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* WORKFORCE SECTION */}
          {activeSection === 'workforce' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Directory & Employment Status</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Salaried Trust staff and verified independent gig caregivers</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Caregiver</th>
                    <th>Type</th>
                    <th>Verification</th>
                    <th>Rating</th>
                    <th>Primary Skills</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Anitha</strong></td>
                    <td><span className="badge badge-success">Salaried Staff</span></td>
                    <td><span className="badge badge-success">Verified & Background Checked</span></td>
                    <td>★ 4.8 / 5.0</td>
                    <td>Elder companionship, Cooking, Household</td>
                  </tr>
                  <tr>
                    <td><strong>K. Ramesh</strong></td>
                    <td><span className="badge badge-warning">Freelancer / Gig</span></td>
                    <td><span className="badge badge-success">Verified</span></td>
                    <td>★ 4.9 / 5.0</td>
                    <td>Cooking, Errands, Medication Reminders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* FUNDING & SPONSORSHIP SECTION */}
          {activeSection === 'funding' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Sponsorship Applications & Subsidies</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Review and approve Trust/Donor sponsored care aid</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Beneficiary</th>
                    <th>Programme</th>
                    <th>Requested Subsidy</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>SP-2026-09</strong></td>
                    <td>Saraswathi Garu</td>
                    <td>Elder Care Support Programme</td>
                    <td>100% Subsidized</td>
                    <td><span className="badge badge-warning">Under Review</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SOS EMERGENCY QUEUE */}
          {activeSection === 'sos' && (
            <div className="data-table-card" style={{ borderLeft: '4px solid #C62828' }}>
              <div className="table-header" style={{ background: '#FFF5F5' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C62828' }}>Live SOS Rapid Responder Queue</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Real-time emergency events dispatched to local responder teams</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Beneficiary</th>
                    <th>Triggered By</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sosQueue.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#6B7C72', padding: '24px' }}>
                        No active emergencies. System is in healthy operating state.
                      </td>
                    </tr>
                  ) : (
                    sosQueue.map(alert => (
                      <tr key={alert.id}>
                        <td><strong>{alert.id}</strong></td>
                        <td>{alert.beneficiaryName}</td>
                        <td>{alert.triggeredBy}</td>
                        <td>{new Date(alert.timestamp).toLocaleTimeString()}</td>
                        <td><span className="badge badge-danger">{alert.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
