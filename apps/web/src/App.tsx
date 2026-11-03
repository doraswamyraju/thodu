import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShieldCheck, 
  AlertTriangle, Search, Plus, DollarSign, RefreshCw,
  LogOut, Lock, Mail, CheckCircle2, ChevronRight, X,
  FileText, Shield, UserPlus, PhoneCall, Trash2, Edit3
} from 'lucide-react';
import './style.css';

type NavSection = 'overview' | 'bookings' | 'beneficiaries' | 'workforce' | 'funding' | 'sos' | 'audit';

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5089' 
  : '';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('thodu_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [emailInput, setEmailInput] = useState('admin@thodu.sriddha.com');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [loading, setLoading] = useState(false);

  // Live Admin Entities
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals state
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);

  // Form states
  const [newBenForm, setNewBenForm] = useState({
    fullName: '',
    category: 'SENIOR_CITIZEN',
    age: '',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'Tirupati',
    accessibilityNeeds: 'Mobility support'
  });

  const [newBookingForm, setNewBookingForm] = useState({
    beneficiaryName: '',
    serviceName: 'Household Support',
    scheduledDate: '2026-03-15',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'Home - T.T.D. Colony, Tirupati',
    fundingType: 'TRUST_SPONSORED',
    caregiverName: 'Anitha'
  });

  const [newCaregiverForm, setNewCaregiverForm] = useState({
    fullName: '',
    phone: '',
    employmentType: 'SALARIED',
    skills: 'Elder Companionship, Cooking',
    zone: 'Tirupati Urban'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [benRes, bkRes, cgRes, spRes, sosRes, audRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/beneficiaries`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/bookings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/caregivers`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sponsorship`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sos/queue`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/audit-logs`).then(r => r.json()).catch(() => null)
      ]);

      if (benRes?.beneficiaries) setBeneficiaries(benRes.beneficiaries);
      if (bkRes?.bookings) setBookings(bkRes.bookings);
      if (cgRes?.caregivers) setCaregivers(cgRes.caregivers);
      if (spRes?.applications) setSponsorships(spRes.applications);
      if (sosRes?.queue) setSosQueue(sosRes.queue);
      if (audRes?.auditLogs) setAuditLogs(audRes.auditLogs);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserSession = {
      id: 'usr-admin',
      name: 'Trust Operations Admin',
      email: emailInput,
      role: 'Trust Administrator',
      phone: '+91 94444 56789'
    };
    localStorage.setItem('thodu_session', JSON.stringify(user));
    setSession(user);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of Thodu Operations?')) {
      localStorage.removeItem('thodu_session');
      setSession(null);
    }
  };

  // Add Beneficiary Action
  const handleCreateBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/beneficiaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBenForm)
      });
      const data = await res.json();
      if (data.beneficiary) {
        setBeneficiaries(prev => [data.beneficiary, ...prev]);
        setShowAddBenModal(false);
        setNewBenForm({
          fullName: '',
          category: 'SENIOR_CITIZEN',
          age: '',
          relationship: 'Mother',
          primaryGuardian: 'Anita Sharma',
          primaryContact: '+91 98765 43210',
          address: 'Tirupati',
          accessibilityNeeds: 'Mobility support'
        });
      }
    } catch (err) {
      alert('Error creating beneficiary');
    }
  };

  // Add Booking Action
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBookingForm,
          beneficiaryName: newBookingForm.beneficiaryName || beneficiaries[0]?.fullName || 'Saraswathi Garu'
        })
      });
      const data = await res.json();
      if (data.booking) {
        setBookings(prev => [data.booking, ...prev]);
        setShowAddBookingModal(false);
      }
    } catch (err) {
      alert('Error creating booking');
    }
  };

  // Add Caregiver Action
  const handleCreateCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/caregivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCaregiverForm)
      });
      const data = await res.json();
      if (data.caregiver) {
        setCaregivers(prev => [data.caregiver, ...prev]);
        setShowAddCaregiverModal(false);
      }
    } catch (err) {
      alert('Error adding caregiver');
    }
  };

  // Sponsorship Decision Action
  const handleSponsorshipDecision = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/sponsorship/${id}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSponsorships(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      }
    } catch (err) {
      alert('Error updating decision');
    }
  };

  // Resolve SOS Action
  const handleResolveSos = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/sos/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setSosQueue(prev => prev.map(s => s.id === id ? { ...s, status: 'RESOLVED' } : s));
      }
    } catch (err) {
      alert('Error resolving SOS');
    }
  };

  // 1. LOGIN SCREEN
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #FFF8E6 0%, #F5EED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '460px', width: '100%', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(11, 93, 59, 0.08)', border: '1px solid #E5E9E6', padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <img src="/thodu_logo_horizontal.png" alt="Thodu Elder Care" style={{ width: '280px', height: 'auto', margin: '0 auto', display: 'block' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B', marginBottom: '6px' }}>Operations & Portal Sign In</h2>
          <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '28px' }}>Sri Divyang Seva Kendram Trust Care Management Platform</p>
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}>
              Sign In to Workspace →
            </button>
          </form>
          <div style={{ marginTop: '28px', borderTop: '1px solid #F0F2F0', paddingTop: '20px' }}>
            <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: '10px', fontWeight: 500 }}>Quick Demo Login:</p>
            <button onClick={() => { setEmailInput('admin@thodu.sriddha.com'); setPasswordInput('admin123'); }} style={{ fontSize: '12px', background: '#E8F5E9', border: '1px solid #C8E6C9', padding: '6px 14px', borderRadius: '8px', color: '#0B5D3B', cursor: 'pointer', fontWeight: 600 }}>
              Trust Administrator
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN PORTAL
  return (
    <div className="web-layout">
      {/* Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-brand" style={{ padding: '16px 14px', background: 'rgba(255,255,255,0.04)' }}>
          <img src="/thodu_logo_horizontal.png" alt="Thodu Elder Care" style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
            <LayoutDashboard size={18} />
            <span>Overview & Analytics</span>
          </button>
          <button className={`nav-link ${activeSection === 'bookings' ? 'active' : ''}`} onClick={() => setActiveSection('bookings')}>
            <Calendar size={18} />
            <span>Care Bookings</span>
          </button>
          <button className={`nav-link ${activeSection === 'beneficiaries' ? 'active' : ''}`} onClick={() => setActiveSection('beneficiaries')}>
            <Users size={18} />
            <span>Beneficiaries & Families</span>
          </button>
          <button className={`nav-link ${activeSection === 'workforce' ? 'active' : ''}`} onClick={() => setActiveSection('workforce')}>
            <ShieldCheck size={18} />
            <span>Caregiver Workforce</span>
          </button>
          <button className={`nav-link ${activeSection === 'funding' ? 'active' : ''}`} onClick={() => setActiveSection('funding')}>
            <DollarSign size={18} />
            <span>Sponsorship & Subsidies</span>
          </button>
          <button className={`nav-link ${activeSection === 'sos' ? 'active' : ''}`} onClick={() => setActiveSection('sos')}>
            <AlertTriangle size={18} color="#FF8A80" />
            <span style={{ color: activeSection === 'sos' ? '#FFF' : '#FF8A80' }}>
              SOS Queue {sosQueue.filter(s => s.status !== 'RESOLVED').length > 0 && `(${sosQueue.filter(s => s.status !== 'RESOLVED').length})`}
            </span>
          </button>
          <button className={`nav-link ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>
            <Shield size={18} />
            <span>Trust Audit Logs</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                TA
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{session.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{session.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Log Out" style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '8px', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FF8A80' }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="web-main">
        {/* Top Header */}
        <header className="web-topbar">
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>
            {activeSection === 'overview' && 'Executive Operations Dashboard'}
            {activeSection === 'bookings' && 'Care Service Bookings & Dispatch Board'}
            {activeSection === 'beneficiaries' && 'Beneficiary Registry & Care Profiles'}
            {activeSection === 'workforce' && 'Caregiver Workforce Management'}
            {activeSection === 'funding' && 'Trust Sponsorship & Subsidy Allocation'}
            {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
            {activeSection === 'audit' && 'Security & Trust Audit Trail'}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={fetchData} style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E8F5E9', padding: '6px 12px', borderRadius: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7D32' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0B5D3B' }}>Live Port 5089</span>
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', border: '1px solid #FFCDD2', color: '#C62828', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Views */}
        <div className="web-content">
          {/* 1. OVERVIEW */}
          {activeSection === 'overview' && (
            <div>
              <div className="grid-stats">
                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72' }}>Active Beneficiaries</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0B5D3B', marginTop: 4 }}>{beneficiaries.length}</h2>
                    <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 4 }}>Seniors & Persons with Disabilities</p>
                  </div>
                  <Users size={36} color="#0B5D3B" style={{ opacity: 0.8 }} />
                </div>
                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72' }}>Active Bookings</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#F9B233', marginTop: 4 }}>{bookings.length}</h2>
                    <p style={{ fontSize: '12px', color: '#6B7C72', marginTop: 4 }}>100% Assigned</p>
                  </div>
                  <Calendar size={36} color="#F9B233" style={{ opacity: 0.8 }} />
                </div>
                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72' }}>Active Caregivers</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#2E7D32', marginTop: 4 }}>{caregivers.length}</h2>
                    <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 4 }}>Verified Staff & Gig</p>
                  </div>
                  <ShieldCheck size={36} color="#2E7D32" style={{ opacity: 0.8 }} />
                </div>
                <div className="stat-card">
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7C72' }}>Active SOS Alerts</p>
                    <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#C62828', marginTop: 4 }}>
                      {sosQueue.filter(s => s.status !== 'RESOLVED').length}
                    </h2>
                    <p style={{ fontSize: '12px', color: '#C62828', marginTop: 4 }}>Emergency Responder Dispatched</p>
                  </div>
                  <AlertTriangle size={36} color="#C62828" style={{ opacity: 0.8 }} />
                </div>
              </div>

              {/* Fast Action Board */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button className="btn-primary" onClick={() => setShowAddBookingModal(true)}>
                  <Plus size={16} /> New Booking
                </button>
                <button className="btn-primary" onClick={() => setShowAddBenModal(true)}>
                  <UserPlus size={16} /> Register Beneficiary
                </button>
                <button className="btn-primary" onClick={() => setShowAddCaregiverModal(true)}>
                  <ShieldCheck size={16} /> Add Caregiver
                </button>
              </div>

              {/* Overview Recent Bookings */}
              <div className="data-table-card">
                <div className="table-header">
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Recent Care Assignments</h3>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Ref Number</th>
                      <th>Beneficiary</th>
                      <th>Service</th>
                      <th>Schedule</th>
                      <th>Assigned Caregiver</th>
                      <th>Funding</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(bk => (
                      <tr key={bk.id}>
                        <td><strong>{bk.bookingNumber}</strong></td>
                        <td>{bk.beneficiaryName}</td>
                        <td>{bk.serviceName}</td>
                        <td>{bk.scheduledDate} {bk.scheduledTimeSlot}</td>
                        <td>{bk.caregiverName || 'Unassigned'}</td>
                        <td>
                          <span className="badge badge-success">
                            {bk.fundingType === 'TRUST_SPONSORED' ? '100% Trust Covered' : bk.fundingType}
                          </span>
                        </td>
                        <td><span className="badge badge-success">{bk.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. BOOKINGS SECTION */}
          {activeSection === 'bookings' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>All Care Bookings & Dispatch</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Manage salaried roster assignment and caregiver dispatch</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddBookingModal(true)}>
                  <Plus size={16} /> Create Booking
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Beneficiary</th>
                    <th>Service</th>
                    <th>Address</th>
                    <th>Date & Time</th>
                    <th>Assigned Caregiver</th>
                    <th>Payable</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(bk => (
                    <tr key={bk.id}>
                      <td><strong>{bk.bookingNumber}</strong></td>
                      <td>{bk.beneficiaryName}</td>
                      <td>{bk.serviceName}</td>
                      <td>{bk.serviceAddress}</td>
                      <td>{bk.scheduledDate} {bk.scheduledTimeSlot}</td>
                      <td><strong>{bk.caregiverName || 'Unassigned'}</strong></td>
                      <td>₹{((bk.familyPayablePaise || 0) / 100).toFixed(0)}</td>
                      <td><span className="badge badge-success">{bk.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. BENEFICIARIES SECTION */}
          {activeSection === 'beneficiaries' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiary Registry & Care Profiles</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Verified records of elderly people and persons with disabilities</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddBenModal(true)}>
                  <Plus size={16} /> Register Beneficiary
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Category</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Primary Guardian</th>
                    <th>Phone</th>
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
                      <td>{ben.age} yrs</td>
                      <td>{ben.gender}</td>
                      <td>{ben.primaryGuardian} ({ben.relationship})</td>
                      <td>{ben.primaryContact}</td>
                      <td>{ben.accessibilityNeeds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. WORKFORCE SECTION */}
          {activeSection === 'workforce' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Workforce Directory</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Manage salaried staff and independent gig caregivers</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddCaregiverModal(true)}>
                  <Plus size={16} /> Add Caregiver
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Caregiver Name</th>
                    <th>Employment</th>
                    <th>Phone</th>
                    <th>Service Zone</th>
                    <th>Primary Skills</th>
                    <th>Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {caregivers.map(cg => (
                    <tr key={cg.id}>
                      <td><strong>{cg.fullName}</strong></td>
                      <td>
                        <span className={`badge ${cg.employmentType === 'SALARIED' ? 'badge-success' : 'badge-warning'}`}>
                          {cg.employmentType === 'SALARIED' ? 'Salaried Staff' : 'Freelancer / Gig'}
                        </span>
                      </td>
                      <td>{cg.phone}</td>
                      <td>{cg.zone}</td>
                      <td>{Array.isArray(cg.skills) ? cg.skills.join(', ') : cg.skills}</td>
                      <td>★ {cg.rating} / 5.0</td>
                      <td><span className="badge badge-success">{cg.verificationStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. SPONSORSHIP SECTION */}
          {activeSection === 'funding' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Sponsorship Applications & Approvals</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Review and approve 100% or 50% Trust-sponsored care subsidies</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Beneficiary</th>
                    <th>Programme</th>
                    <th>Applicant</th>
                    <th>Documents</th>
                    <th>Subsidy</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorships.map(sp => (
                    <tr key={sp.id}>
                      <td><strong>{sp.applicationRef}</strong></td>
                      <td><strong>{sp.beneficiaryName}</strong></td>
                      <td>{sp.programme}</td>
                      <td>{sp.applicantName}</td>
                      <td><span style={{ fontSize: '12px', color: '#6B7C72' }}>{sp.documentsProvided}</span></td>
                      <td>{sp.requestedSubsidyPercent}% Covered</td>
                      <td>
                        <span className={`badge ${sp.status === 'APPROVED' ? 'badge-success' : sp.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                          {sp.status}
                        </span>
                      </td>
                      <td>
                        {sp.status === 'UNDER_REVIEW' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleSponsorshipDecision(sp.id, 'APPROVED')} style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                              Approve
                            </button>
                            <button onClick={() => handleSponsorshipDecision(sp.id, 'REJECTED')} style={{ background: '#FFF', color: '#C62828', border: '1px solid #C62828', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#6B7C72' }}>Decision Finalized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. SOS EMERGENCY QUEUE */}
          {activeSection === 'sos' && (
            <div className="data-table-card" style={{ borderLeft: '4px solid #C62828' }}>
              <div className="table-header" style={{ background: '#FFF5F5' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C62828' }}>Emergency Rapid Response Queue</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Real-time SOS emergencies requiring Trust dispatch and resolution</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Beneficiary</th>
                    <th>Triggered By</th>
                    <th>Notes / Location</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sosQueue.map(alert => (
                    <tr key={alert.id}>
                      <td><strong>{alert.id}</strong></td>
                      <td><strong>{alert.beneficiaryName}</strong></td>
                      <td>{alert.triggeredBy}</td>
                      <td>{alert.notes}</td>
                      <td>{new Date(alert.timestamp).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge ${alert.status === 'RESOLVED' ? 'badge-success' : 'badge-danger'}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td>
                        {alert.status !== 'RESOLVED' && (
                          <button onClick={() => handleResolveSos(alert.id)} style={{ background: '#2E7D32', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                            Mark Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. AUDIT LOGS */}
          {activeSection === 'audit' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Trust Immutable Audit Trail</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Auditable activity log of administrative decisions, subsidy grants, and dispatches</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Administrator</th>
                    <th>Module</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={log.id || i}>
                      <td><span style={{ fontSize: '12px', color: '#6B7C72' }}>{log.timestamp}</span></td>
                      <td><strong>{log.adminUser}</strong></td>
                      <td><span className="badge" style={{ background: '#F0F2F0' }}>{log.module}</span></td>
                      <td><strong>{log.action}</strong></td>
                      <td>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODALS FOR ADMIN CREATION                                                 */}
      {/* ========================================================================= */}

      {/* MODAL 1: REGISTER BENEFICIARY */}
      {showAddBenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 540, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Register New Beneficiary</h3>
              <button onClick={() => setShowAddBenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateBeneficiary}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                <input required value={newBenForm.fullName} onChange={e => setNewBenForm({...newBenForm, fullName: e.target.value})} placeholder="e.g. Saraswathi Garu" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
                  <select value={newBenForm.category} onChange={e => setNewBenForm({...newBenForm, category: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="SENIOR_CITIZEN">Senior Citizen</option>
                    <option value="PERSON_WITH_DISABILITY">Person with Disability</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Age</label>
                  <input required type="number" value={newBenForm.age} onChange={e => setNewBenForm({...newBenForm, age: e.target.value})} placeholder="68" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Primary Contact Phone</label>
                <input required value={newBenForm.primaryContact} onChange={e => setNewBenForm({...newBenForm, primaryContact: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service Address</label>
                <input required value={newBenForm.address} onChange={e => setNewBenForm({...newBenForm, address: e.target.value})} placeholder="T.T.D. Colony, Tirupati" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Accessibility Needs / Care Notes</label>
                <textarea value={newBenForm.accessibilityNeeds} onChange={e => setNewBenForm({...newBenForm, accessibilityNeeds: e.target.value})} rows={2} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE BOOKING */}
      {showAddBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 540, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Create & Dispatch Care Booking</h3>
              <button onClick={() => setShowAddBookingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateBooking}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Beneficiary</label>
                <select value={newBookingForm.beneficiaryName} onChange={e => setNewBookingForm({...newBookingForm, beneficiaryName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                  {beneficiaries.map(b => (
                    <option key={b.id} value={b.fullName}>{b.fullName} ({b.relationship})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Care Service</label>
                  <select value={newBookingForm.serviceName} onChange={e => setNewBookingForm({...newBookingForm, serviceName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Household Support">Household Support (₹600)</option>
                    <option value="Cooking Assistance">Cooking Assistance (₹450)</option>
                    <option value="Medication Reminders">Medication Reminders (₹300)</option>
                    <option value="Disability Mobility Support">Disability Mobility (₹500)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Funding Route</label>
                  <select value={newBookingForm.fundingType} onChange={e => setNewBookingForm({...newBookingForm, fundingType: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="TRUST_SPONSORED">Trust Sponsored (100% Free)</option>
                    <option value="SPLIT_FUNDING">Split Funding (50% Trust)</option>
                    <option value="SELF_FUNDED">Self-Funded (Full Pay)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date</label>
                  <input type="date" value={newBookingForm.scheduledDate} onChange={e => setNewBookingForm({...newBookingForm, scheduledDate: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time Slot</label>
                  <input value={newBookingForm.scheduledTimeSlot} onChange={e => setNewBookingForm({...newBookingForm, scheduledTimeSlot: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Assign Caregiver</label>
                <select value={newBookingForm.caregiverName} onChange={e => setNewBookingForm({...newBookingForm, caregiverName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                  {caregivers.map(cg => (
                    <option key={cg.id} value={cg.fullName}>{cg.fullName} ({cg.employmentType})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Confirm & Dispatch Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD CAREGIVER */}
      {showAddCaregiverModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 540, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Add Caregiver</h3>
              <button onClick={() => setShowAddCaregiverModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateCaregiver}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                <input required value={newCaregiverForm.fullName} onChange={e => setNewCaregiverForm({...newCaregiverForm, fullName: e.target.value})} placeholder="e.g. S. Radhika" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Employment Type</label>
                  <select value={newCaregiverForm.employmentType} onChange={e => setNewCaregiverForm({...newCaregiverForm, employmentType: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="SALARIED">Salaried Staff</option>
                    <option value="FREELANCE_GIG">Freelancer / Gig</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                  <input required value={newCaregiverForm.phone} onChange={e => setNewCaregiverForm({...newCaregiverForm, phone: e.target.value})} placeholder="+91 98765 00000" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service Zone</label>
                <input value={newCaregiverForm.zone} onChange={e => setNewCaregiverForm({...newCaregiverForm, zone: e.target.value})} placeholder="Tirupati Urban" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Primary Skills</label>
                <input value={newCaregiverForm.skills} onChange={e => setNewCaregiverForm({...newCaregiverForm, skills: e.target.value})} placeholder="Elder Care, Cooking, Mobility Support" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Save Caregiver Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
