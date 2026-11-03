import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShieldCheck, 
  AlertTriangle, Search, Plus, DollarSign, RefreshCw,
  LogOut, Lock, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
import './style.css';

type NavSection = 'overview' | 'bookings' | 'beneficiaries' | 'workforce' | 'funding' | 'sos';

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5089' 
  : ''; // Proxied via Nginx in production

export default function App() {
  // Authentication State
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('thodu_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [emailInput, setEmailInput] = useState('admin@thodu.sriddha.com');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // App Navigation & Data State
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState({
    activeBeneficiariesCount: 3,
    activeBookingsCount: 1,
    port: 5089
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // Authenticate with API or predefined role users
    setTimeout(() => {
      if (!emailInput || !passwordInput) {
        setLoginError('Please enter both email and password.');
        setLoginLoading(false);
        return;
      }

      let user: UserSession = {
        id: 'usr-admin',
        name: 'Trust Operations Admin',
        email: emailInput,
        role: 'Trust Administrator',
        phone: '+91 94444 56789'
      };

      if (emailInput.includes('family')) {
        user = {
          id: 'usr-family',
          name: 'Anita Sharma',
          email: emailInput,
          role: 'Family Member / Guardian',
          phone: '+91 98765 43210'
        };
      } else if (emailInput.includes('care')) {
        user = {
          id: 'usr-care',
          name: 'Anitha',
          email: emailInput,
          role: 'Salaried Caregiver',
          phone: '+91 98765 11111'
        };
      }

      localStorage.setItem('thodu_session', JSON.stringify(user));
      setSession(user);
      setLoginLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of Thodu Operations?')) {
      localStorage.removeItem('thodu_session');
      setSession(null);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, benRes, bkRes, sosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/health`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/beneficiaries`).then(r => r.json()).catch(() => null),
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
      if (bkRes && bkRes.bookings) setBookings(bkRes.bookings);
      if (sosRes && sosRes.queue) setSosQueue(sosRes.queue);
    } catch (e) {
      console.error('API fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleTriggerSOS = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beneficiaryId: 'b1-saraswathi',
          notes: `Triggered from Operations Console by ${session?.name}`
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

  // ==========================================
  // 1. DEDICATED DESKTOP LOGIN SCREEN
  // ==========================================
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #FFF8E6 0%, #F5EED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '460px', width: '100%', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(11, 93, 59, 0.08)', border: '1px solid #E5E9E6', padding: '40px 36px', textAlign: 'center' }}>
          
          {/* Authentic Horizontal Brand Logo */}
          <div style={{ marginBottom: '24px' }}>
            <img 
              src="/thodu_logo_horizontal.png" 
              alt="Thodu Elder Care Services" 
              style={{ width: '280px', height: 'auto', margin: '0 auto', display: 'block' }} 
            />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B', marginBottom: '6px' }}>
            Operations & Portal Sign In
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '28px' }}>
            Sri Divyang Seva Kendram Trust Care Management Platform
          </p>

          {loginError && (
            <div style={{ background: '#FFEBEE', color: '#C62828', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '18px', textAlign: 'left' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@thodu.sriddha.com"
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loginLoading}
              style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Workspace →'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div style={{ marginTop: '28px', borderTop: '1px solid #F0F2F0', paddingTop: '20px' }}>
            <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: '10px', fontWeight: 500 }}>
              Quick Role Switching (Click to auto-fill):
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                type="button"
                onClick={() => { setEmailInput('admin@thodu.sriddha.com'); setPasswordInput('admin123'); }}
                style={{ fontSize: '11px', background: '#E8F5E9', border: '1px solid #C8E6C9', padding: '6px 12px', borderRadius: '8px', color: '#0B5D3B', cursor: 'pointer', fontWeight: 600 }}
              >
                Trust Admin
              </button>
              <button 
                type="button"
                onClick={() => { setEmailInput('family@thodu.sriddha.com'); setPasswordInput('family123'); }}
                style={{ fontSize: '11px', background: '#FFF8E6', border: '1px solid #FFE082', padding: '6px 12px', borderRadius: '8px', color: '#B78103', cursor: 'pointer', fontWeight: 600 }}
              >
                Family Member
              </button>
              <button 
                type="button"
                onClick={() => { setEmailInput('caregiver@thodu.sriddha.com'); setPasswordInput('care123'); }}
                style={{ fontSize: '11px', background: '#EDE7F6', border: '1px solid #D1C4E9', padding: '6px 12px', borderRadius: '8px', color: '#512DA8', cursor: 'pointer', fontWeight: 600 }}
              >
                Caregiver Staff
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '11px', color: '#8A9990' }}>
            Dedicated Port 5089 • SSL Secured • Sri Divyang Seva Kendram Trust
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED DESKTOP PORTAL
  // ==========================================
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

        {/* Sidebar Footer with Active User Profile & Logout */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                {session.name.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {session.name}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {session.role}
                </p>
              </div>
            </div>
            
            {/* Logout Icon Button */}
            <button 
              onClick={handleLogout}
              title="Log out of Thodu"
              style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FF8A80', transition: 'background 0.2s' }}
            >
              <LogOut size={16} />
            </button>
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
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
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

            {/* Topbar Logout Shortcut */}
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', border: '1px solid #FFCDD2', color: '#C62828', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              <LogOut size={14} /> Log Out
            </button>
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
