import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShieldCheck, 
  AlertTriangle, Search, Plus, DollarSign, RefreshCw,
  LogOut, Lock, Mail, CheckCircle2, ChevronRight, X,
  FileText, Shield, UserPlus, PhoneCall, Trash2, Edit3,
  TrendingUp, Heart, Check, Clock, Bell, MapPin, Award,
  MoreVertical, ChevronDown, Filter, ChevronLeft, Eye, Download,
  Activity, ArrowUpRight
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

  const [emailInput, setEmailInput] = useState('raju@thodu.sriddha.com');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [loading, setLoading] = useState(false);

  // Live Database States
  const [analytics, setAnalytics] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Beneficiaries Section States (Matching Reference 2)
  const [benTab, setBenTab] = useState<'ALL' | 'SENIOR' | 'DISABILITY'>('ALL');
  const [benSearchQuery, setBenSearchQuery] = useState('');
  const [benCategoryFilter, setBenCategoryFilter] = useState('ALL');
  const [benStatusFilter, setBenStatusFilter] = useState('ALL');
  const [selectedBenIds, setSelectedBenIds] = useState<string[]>([]);
  const [openBenActionId, setOpenBenActionId] = useState<string | null>(null);

  // Modals state
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [selectedBeneficiaryDetail, setSelectedBeneficiaryDetail] = useState<any | null>(null);

  // Form State for Add Beneficiary
  const [newBenForm, setNewBenForm] = useState({
    fullName: '',
    category: 'Senior Citizen',
    age: '',
    gender: 'Female',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Walking assistance, routine health monitoring'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, benRes, bkRes, cgRes, spRes, sosRes, audRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/analytics`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/beneficiaries`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/bookings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/caregivers`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sponsorship`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sos/queue`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/audit-logs`).then(r => r.json()).catch(() => null)
      ]);

      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
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
      name: 'Raju Kumar',
      email: emailInput,
      role: 'Super Admin',
      phone: '+91 94444 56789'
    };
    localStorage.setItem('thodu_session', JSON.stringify(user));
    setSession(user);
  };

  const handleLogout = () => {
    if (window.confirm('Log out from Thodu Admin Panel?')) {
      localStorage.removeItem('thodu_session');
      setSession(null);
    }
  };

  // Add Beneficiary to Live DB
  const handleSaveBeneficiary = async (e: React.FormEvent) => {
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
        fetchData();
      }
    } catch (err) {
      alert('Error creating beneficiary');
    }
  };

  // Filtered Beneficiaries matching tabs and search
  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesTab = benTab === 'ALL' || 
      (benTab === 'SENIOR' && b.category === 'Senior Citizen') ||
      (benTab === 'DISABILITY' && b.category === 'Person with Disability');

    const matchesCategory = benCategoryFilter === 'ALL' || b.category === benCategoryFilter;
    const matchesStatus = benStatusFilter === 'ALL' || b.status === benStatusFilter;

    const matchesQuery = !benSearchQuery || 
      b.fullName.toLowerCase().includes(benSearchQuery.toLowerCase()) ||
      b.refNumber.toLowerCase().includes(benSearchQuery.toLowerCase()) ||
      b.primaryGuardian.toLowerCase().includes(benSearchQuery.toLowerCase()) ||
      b.primaryContact.includes(benSearchQuery);

    return matchesTab && matchesCategory && matchesStatus && matchesQuery;
  });

  // Checkbox toggle
  const toggleSelectBen = (id: string) => {
    setSelectedBenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllBens = () => {
    if (selectedBenIds.length === filteredBeneficiaries.length) {
      setSelectedBenIds([]);
    } else {
      setSelectedBenIds(filteredBeneficiaries.map(b => b.id));
    }
  };

  // 1. SIGN IN SCREEN
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #FFF8E6 0%, #F5EED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '460px', width: '100%', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(11, 93, 59, 0.08)', border: '1px solid #E5E9E6', padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <img src="/thodu_logo_horizontal.png" alt="Thodu Elder Care" style={{ width: '280px', height: 'auto', margin: '0 auto', display: 'block' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B', marginBottom: '6px' }}>Super Admin Sign In</h2>
          <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '28px' }}>Sri Divyang Seva Kendram Trust Care Management</p>
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}>
              Access Super Admin Workspace →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="web-layout">
      {/* Left Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-brand">
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
            <TrendingUp size={18} />
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
              SOS Queue {analytics?.activeSosCount > 0 && `(${analytics.activeSosCount})`}
            </span>
          </button>
          <button className={`nav-link ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>
            <FileText size={18} />
            <span>Trust Audit Logs</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                RK
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Raju Kumar</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Super Admin</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Log Out" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FF8A80' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="web-main">
        {/* Top Header without Port Number */}
        <header className="web-topbar">
          <div>
            <span style={{ fontSize: '12px', color: '#6B7C72' }}>Admin Panel</span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>
              {activeSection === 'overview' && 'Executive Overview & Analytics'}
              {activeSection === 'bookings' && 'Care Service Bookings & Dispatch'}
              {activeSection === 'beneficiaries' && 'Beneficiaries & Families Registry'}
              {activeSection === 'workforce' && 'Caregiver Workforce Management'}
              {activeSection === 'funding' && 'Trust Sponsorship & Subsidy Allocation'}
              {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
              {activeSection === 'audit' && 'Trust Security & Audit Trail'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 10 }} />
              <input 
                placeholder="Search beneficiary, caregiver, booking ID..."
                style={{ padding: '7px 12px 7px 34px', borderRadius: '10px', border: '1px solid #E5E9E6', fontSize: '12px', width: '280px', outline: 'none' }}
              />
            </div>

            <button onClick={fetchData} title="Refresh Live Database" style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
              <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh
            </button>

            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', border: '1px solid #FFCDD2', color: '#C62828', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="web-content">
          {/* ========================================================================= */}
          {/* 1. OVERVIEW & ANALYTICS (EXACT CLONE OF IMAGE 3 USER UPLOADED)             */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div>
              {/* Banner with Greeting & Trust Picture */}
              <div style={{ background: 'linear-gradient(135deg, #FFF9EB 0%, #FFF3D6 100%)', borderRadius: '18px', padding: '24px 28px', border: '1px solid #F5E6BE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0B5D3B' }}>Good Evening, Raju! 👋</h2>
                  <p style={{ fontSize: '14px', color: '#6B7C72', marginTop: 4 }}>
                    Here's how Thodu is caring for our elders and special members today.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF', padding: '8px 16px', borderRadius: '12px', border: '1px solid #F5E6BE', fontSize: '13px', fontWeight: 600, color: '#0B5D3B' }}>
                  <Calendar size={16} />
                  <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' })}</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* 6 Top Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                    <Users size={16} color="#0B5D3B" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '8px 0 2px 0' }}>
                    {analytics?.totalBeneficiaries ?? beneficiaries.length}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +8.4% vs last month</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Active Caregivers</span>
                    <Heart size={16} color="#D81B60" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '8px 0 2px 0' }}>
                    {analytics?.activeCaregivers ?? caregivers.length}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.1%</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Bookings (This Month)</span>
                    <Calendar size={16} color="#F9B233" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '8px 0 2px 0' }}>
                    {analytics?.totalBookings ?? bookings.length}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +18.7%</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Services Completed</span>
                    <CheckCircle2 size={16} color="#0288D1" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '8px 0 2px 0' }}>
                    {analytics?.completedServices ?? 0}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                    {analytics?.completionRate ?? 96.8}% completion
                  </span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Revenue (This Month)</span>
                    <DollarSign size={16} color="#7B1FA2" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '8px 0 2px 0' }}>
                    ₹{analytics?.revenueInr?.toLocaleString() ?? 0}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +26.3%</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Sponsored Services</span>
                    <Award size={16} color="#0B5D3B" />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '8px 0 2px 0' }}>
                    {analytics?.sponsoredServicesCount ?? 0}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                    (₹{analytics?.sponsoredValueInr?.toLocaleString() ?? 0} value)
                  </span>
                </div>
              </div>

              {/* Middle Row: Bookings Trend Chart, Service Distribution Donut, Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1fr', gap: 18, marginBottom: 24 }}>
                {/* Bookings Trend Bar Chart */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24' }}>Bookings Trend</h3>
                    <div style={{ fontSize: '12px', color: '#6B7C72', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>Last 6 Months</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', paddingTop: 20, borderBottom: '1px solid #E5E9E6', paddingBottom: 10 }}>
                    {(analytics?.bookingsTrend || [
                      { month: 'Jun', bookings: 60, completed: 50 },
                      { month: 'Jul', bookings: 75, completed: 70 },
                      { month: 'Aug', bookings: 90, completed: 85 },
                      { month: 'Sep', bookings: 110, completed: 100 },
                      { month: 'Oct', bookings: 130, completed: 120 },
                      { month: 'Nov', bookings: 150, completed: 140 }
                    ]).map((t: any) => (
                      <div key={t.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: '120px' }}>
                          <div style={{ width: 14, height: `${(t.bookings / 160) * 100}%`, background: '#0B5D3B', borderRadius: '4px 4px 0 0' }} />
                          <div style={{ width: 14, height: `${(t.completed / 160) * 100}%`, background: '#81C784', borderRadius: '4px 4px 0 0' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#6B7C72' }}>{t.month} '26</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12, fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, background: '#0B5D3B', borderRadius: 2 }} />
                      <span>Bookings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, background: '#81C784', borderRadius: 2 }} />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>

                {/* Service Distribution Pie/Donut Breakdown */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>
                    Service Distribution
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    {/* Donut representation */}
                    <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'conic-gradient(#4CAF50 0% 32%, #FF9800 32% 52%, #9C27B0 52% 68%, #00BCD4 68% 82%, #3F51B5 82% 92%, #E91E63 92% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E2D24' }}>{analytics?.completedServices ?? 4}</span>
                        <span style={{ fontSize: '9px', color: '#6B7C72' }}>Services</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                      {(analytics?.serviceDistribution || []).map((sd: any) => (
                        <div key={sd.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: sd.color }} />
                            <span>{sd.name}</span>
                          </div>
                          <strong>{sd.percentage}%</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions 6-grid matching reference */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>
                    Quick Actions
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div className="action-tile-btn" onClick={() => { setActiveSection('bookings'); setShowAddBookingModal(true); }}>
                      <Calendar size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>New Booking</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setShowAddBenModal(true)}>
                      <UserPlus size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>Add Beneficiary</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setActiveSection('workforce')}>
                      <ShieldCheck size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>Add Caregiver</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setActiveSection('funding')}>
                      <Heart size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>Create Sponsor</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => alert('Support ticket system active.')}>
                      <AlertTriangle size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>Raise Support</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => alert('Broadcast alert push sent.')}>
                      <Bell size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600, textAlign: 'center' }}>Send Notice</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Key Performance Metrics, Recent Bookings List, Geographic Coverage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: 18 }}>
                {/* Key Performance Progress Bars */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 18 }}>
                    Key Performance
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                        <span>Service Completion Rate</span>
                        <strong>{analytics?.completionRate ?? 96.8}%</strong>
                      </div>
                      <div style={{ height: 7, background: '#F0F2F0', borderRadius: 9999 }}>
                        <div style={{ height: '100%', width: `${analytics?.completionRate ?? 96.8}%`, background: '#2E7D32', borderRadius: 9999 }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                        <span>Beneficiary Satisfaction</span>
                        <strong>4.8 / 5.0</strong>
                      </div>
                      <div style={{ height: 7, background: '#F0F2F0', borderRadius: 9999 }}>
                        <div style={{ height: '100%', width: '96%', background: '#2E7D32', borderRadius: 9999 }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                        <span>Caregiver Utilization</span>
                        <strong>82%</strong>
                      </div>
                      <div style={{ height: 7, background: '#F0F2F0', borderRadius: 9999 }}>
                        <div style={{ height: '100%', width: '82%', background: '#2E7D32', borderRadius: 9999 }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 6 }}>
                        <span>On-time Service</span>
                        <strong>94.1%</strong>
                      </div>
                      <div style={{ height: 7, background: '#F0F2F0', borderRadius: 9999 }}>
                        <div style={{ height: '100%', width: '94.1%', background: '#2E7D32', borderRadius: 9999 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings List matching reference */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24' }}>Recent Bookings</h3>
                    <button onClick={() => setActiveSection('bookings')} style={{ background: 'none', border: 'none', color: '#0B5D3B', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      View All →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {bookings.slice(0, 4).map(bk => (
                      <div key={bk.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: '#FAFBF9', border: '1px solid #F0F2F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={16} color="#0B5D3B" />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E2D24' }}>{bk.serviceName}</h4>
                            <p style={{ fontSize: '11px', color: '#6B7C72' }}>{bk.bookingNumber} • {bk.beneficiaryName}</p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 9999, fontWeight: 600, background: bk.status === 'Completed' ? '#E8F5E9' : bk.status === 'In Progress' ? '#FFF3E0' : '#E3F2FD', color: bk.status === 'Completed' ? '#2E7D32' : bk.status === 'In Progress' ? '#E65100' : '#1565C0' }}>
                            {bk.status}
                          </span>
                          <div style={{ fontSize: '10px', color: '#6B7C72', marginTop: 4 }}>{bk.scheduledDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geographic Coverage */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24' }}>Geographic Coverage</h3>
                    <span style={{ fontSize: '12px', color: '#0B5D3B', fontWeight: 600 }}>Tirupati Zone</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={16} color="#0B5D3B" />
                        <span>Total Service Areas</span>
                      </div>
                      <strong>12</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} color="#2E7D32" />
                        <span>Active Areas</span>
                      </div>
                      <strong>10</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={16} color="#F9B233" />
                        <span>New Requests</span>
                      </div>
                      <strong>28</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={16} color="#D81B60" />
                        <span>Avg. Response Time</span>
                      </div>
                      <strong>18 min</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. BENEFICIARIES & FAMILIES (EXACT CLONE OF IMAGE 2 USER UPLOADED)        */}
          {/* ========================================================================= */}
          {activeSection === 'beneficiaries' && (
            <div>
              {/* Header Title with Add Beneficiary Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiaries & Families</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Manage all registered beneficiaries and their family/guardian details
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddBenModal(true)}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Add Beneficiary
                </button>
              </div>

              {/* 4 Summary Cards at Top */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {/* 1. Total Beneficiaries */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.totalBeneficiaries ?? beneficiaries.length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +8.4% vs last month</span>
                  </div>
                </div>

                {/* 2. Senior Citizens */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#C62828" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Senior Citizens</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.seniorCitizens ?? beneficiaries.filter(b => b.category === 'Senior Citizen').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.seniorCitizensPct ?? 60}%)
                    </span>
                  </div>
                </div>

                {/* 3. Persons with Disabilities */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Persons with Disabilities</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.personsWithDisabilities ?? beneficiaries.filter(b => b.category === 'Person with Disability').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.personsWithDisabilitiesPct ?? 40}%)
                    </span>
                  </div>
                </div>

                {/* 4. Family Members / Guardians */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Family Members / Guardians</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.activeGuardians ?? 3}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Active Contacts</span>
                  </div>
                </div>
              </div>

              {/* Category Segment Tabs matching reference */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button 
                  onClick={() => setBenTab('ALL')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: benTab === 'ALL' ? '#0B5D3B' : '#FFF', color: benTab === 'ALL' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  All Beneficiaries ({beneficiaries.length})
                </button>
                <button 
                  onClick={() => setBenTab('SENIOR')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: benTab === 'SENIOR' ? '#0B5D3B' : '#FFF', color: benTab === 'SENIOR' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Senior Citizens ({beneficiaries.filter(b => b.category === 'Senior Citizen').length})
                </button>
                <button 
                  onClick={() => setBenTab('DISABILITY')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: benTab === 'DISABILITY' ? '#0B5D3B' : '#FFF', color: benTab === 'DISABILITY' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Persons with Disabilities ({beneficiaries.filter(b => b.category === 'Person with Disability').length})
                </button>
              </div>

              {/* Filter and Search Bar matching reference */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search by name, phone, or ID..."
                    value={benSearchQuery}
                    onChange={e => setBenSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={benCategoryFilter} 
                  onChange={e => setBenCategoryFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Category: All</option>
                  <option value="Senior Citizen">Category: Senior Citizen</option>
                  <option value="Person with Disability">Category: Person with Disability</option>
                </select>

                <select style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}>
                  <option>Age: All</option>
                  <option>Below 40</option>
                  <option>60 - 75</option>
                  <option>75+</option>
                </select>

                <select style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}>
                  <option>Area: All</option>
                  <option>T.T.D. Colony</option>
                  <option>Lakshmi Nagar</option>
                  <option>Bhavani Nagar</option>
                </select>

                <select 
                  value={benStatusFilter} 
                  onChange={e => setBenStatusFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Status: All</option>
                  <option value="Active">Status: Active</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>

                <button 
                  onClick={() => alert('Exporting beneficiary roster as CSV.')}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={14} /> Export
                </button>
              </div>

              {/* Beneficiaries Table */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input 
                          type="checkbox" 
                          checked={selectedBenIds.length === filteredBeneficiaries.length && filteredBeneficiaries.length > 0}
                          onChange={selectAllBens}
                        />
                      </th>
                      <th>BENEFICIARY ⬍</th>
                      <th>CATEGORY</th>
                      <th>AGE</th>
                      <th>PRIMARY GUARDIAN</th>
                      <th>PHONE</th>
                      <th>ADDRESS</th>
                      <th>STATUS ⬍</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBeneficiaries.map(ben => (
                      <tr key={ben.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedBenIds.includes(ben.id)}
                            onChange={() => toggleSelectBen(ben.id)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: ben.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#0B5D3B' }}>
                              {ben.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ fontSize: '13px' }}>{ben.fullName}</strong>
                              <div style={{ fontSize: '11px', color: '#6B7C72' }}>{ben.refNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: ben.category === 'Senior Citizen' ? '#E8F5E9' : '#E1F5FE', color: ben.category === 'Senior Citizen' ? '#2E7D32' : '#0288D1', display: 'flex', alignItems: 'center', gap: 4 }}>
                              {ben.category === 'Senior Citizen' ? 'Senior Citizen' : 'Person with Disability'}
                            </span>
                          </div>
                        </td>
                        <td>{ben.age} yrs</td>
                        <td>{ben.primaryGuardian} ({ben.relationship})</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1E2D24', fontSize: '12px' }}>
                            <PhoneCall size={12} color="#6B7C72" />
                            <span>{ben.primaryContact}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7C72', fontSize: '12px' }}>
                            <MapPin size={12} />
                            <span>{ben.address}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: ben.status === 'Active' ? '#E8F5E9' : '#FFEBEE', color: ben.status === 'Active' ? '#2E7D32' : '#C62828' }}>
                            {ben.status}
                          </span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button 
                              title="View Details"
                              onClick={() => setSelectedBeneficiaryDetail(ben)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Eye size={15} />
                            </button>
                            <button 
                              title="Edit Record"
                              onClick={() => alert(`Editing profile for ${ben.fullName}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => setOpenBenActionId(openBenActionId === ben.id ? null : ben.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <MoreVertical size={15} />
                            </button>
                          </div>

                          {openBenActionId === ben.id && (
                            <div style={{ position: 'absolute', right: 20, top: 38, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                              <button 
                                onClick={() => {
                                  setSelectedBeneficiaryDetail(ben);
                                  setOpenBenActionId(null);
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer' }}
                              >
                                View Profile
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm(`Deactivate ${ben.fullName}?`)) {
                                    setBeneficiaries(prev => prev.map(b => b.id === ben.id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));
                                    setOpenBenActionId(null);
                                  }
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#C62828' }}
                              >
                                Toggle Status
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Footer */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E9E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7C72' }}>
                  <span>Showing 1 – {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>Rows per page:</span>
                    <select style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E9E6', fontSize: '12px' }}>
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>&lt;</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#0B5D3B', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}>1</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>2</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>3</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CARE BOOKINGS & DISPATCH (PREVIOUS COMPLETE SCREEN)                     */}
          {/* ========================================================================= */}
          {activeSection === 'bookings' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Care Service Bookings</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Live Care Bookings from central database</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddBookingModal(true)}>
                  <Plus size={15} /> Create Booking
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>REF</th>
                    <th>BENEFICIARY</th>
                    <th>SERVICE</th>
                    <th>ADDRESS</th>
                    <th>DATE & TIME</th>
                    <th>CAREGIVER</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(bk => (
                    <tr key={bk.id}>
                      <td><strong>{bk.bookingNumber}</strong></td>
                      <td>{bk.beneficiaryName}</td>
                      <td>{bk.serviceName}</td>
                      <td>{bk.serviceAddress}</td>
                      <td>{bk.scheduledDate}</td>
                      <td><strong>{bk.caregiverName}</strong></td>
                      <td><span className="badge badge-success">{bk.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* OTHER SECTIONS */}
          {activeSection === 'workforce' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Workforce</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employment</th>
                    <th>Phone</th>
                    <th>Zone</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {caregivers.map(cg => (
                    <tr key={cg.id}>
                      <td><strong>{cg.fullName}</strong></td>
                      <td><span className="badge badge-success">{cg.employmentType}</span></td>
                      <td>{cg.phone}</td>
                      <td>{cg.zone}</td>
                      <td>★ {cg.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'funding' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Sponsorship Applications</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Beneficiary</th>
                    <th>Programme</th>
                    <th>Applicant</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorships.map(sp => (
                    <tr key={sp.id}>
                      <td><strong>{sp.applicationRef}</strong></td>
                      <td>{sp.beneficiaryName}</td>
                      <td>{sp.programme}</td>
                      <td>{sp.applicantName}</td>
                      <td><span className="badge badge-success">{sp.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'sos' && (
            <div className="data-table-card" style={{ borderLeft: '4px solid #C62828' }}>
              <div className="table-header" style={{ background: '#FFF5F5' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C62828' }}>Emergency SOS Queue</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Beneficiary</th>
                    <th>Triggered By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sosQueue.map(alert => (
                    <tr key={alert.id}>
                      <td><strong>{alert.id}</strong></td>
                      <td>{alert.beneficiaryName}</td>
                      <td>{alert.triggeredBy}</td>
                      <td><span className="badge badge-danger">{alert.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'audit' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Trust Immutable Audit Trail</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Administrator</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={log.id || i}>
                      <td>{log.timestamp}</td>
                      <td><strong>{log.adminUser}</strong></td>
                      <td>{log.action}</td>
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
      {/* MODAL: ADD BENEFICIARY                                                    */}
      {/* ========================================================================= */}
      {showAddBenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 540, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Register New Beneficiary</h3>
              <button onClick={() => setShowAddBenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveBeneficiary}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                <input required value={newBenForm.fullName} onChange={e => setNewBenForm({...newBenForm, fullName: e.target.value})} placeholder="e.g. Saraswathi Garu" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
                  <select value={newBenForm.category} onChange={e => setNewBenForm({...newBenForm, category: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Senior Citizen">Senior Citizen</option>
                    <option value="Person with Disability">Person with Disability</option>
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
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Address</label>
                <input required value={newBenForm.address} onChange={e => setNewBenForm({...newBenForm, address: e.target.value})} placeholder="T.T.D. Colony, Tirupati" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL: VIEW BENEFICIARY PROFILE */}
      {selectedBeneficiaryDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 500, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiary Profile Details</h3>
              <button onClick={() => setSelectedBeneficiaryDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: selectedBeneficiaryDetail.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#0B5D3B' }}>
                {selectedBeneficiaryDetail.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{selectedBeneficiaryDetail.fullName}</h4>
                <p style={{ fontSize: '12px', color: '#6B7C72' }}>{selectedBeneficiaryDetail.refNumber} • {selectedBeneficiaryDetail.category}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '13px', background: '#FAFBF9', padding: 16, borderRadius: 12, border: '1px solid #E5E9E6' }}>
              <div><strong>Age / Gender:</strong> {selectedBeneficiaryDetail.age} yrs • {selectedBeneficiaryDetail.gender}</div>
              <div><strong>Primary Guardian:</strong> {selectedBeneficiaryDetail.primaryGuardian} ({selectedBeneficiaryDetail.relationship})</div>
              <div><strong>Phone Contact:</strong> {selectedBeneficiaryDetail.primaryContact}</div>
              <div><strong>Address:</strong> {selectedBeneficiaryDetail.address}</div>
              <div><strong>Care & Accessibility Needs:</strong> {selectedBeneficiaryDetail.accessibilityNeeds}</div>
              <div><strong>Status:</strong> <span className={`badge ${selectedBeneficiaryDetail.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{selectedBeneficiaryDetail.status}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
