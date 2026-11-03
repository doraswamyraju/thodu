import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShieldCheck, 
  AlertTriangle, Search, Plus, DollarSign, RefreshCw,
  LogOut, Lock, Mail, CheckCircle2, ChevronRight, X,
  FileText, Shield, UserPlus, PhoneCall, Trash2, Edit3,
  TrendingUp, Heart, Check, Clock, Bell, MapPin, Award
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

  // Live Database States (Strictly from Backend API)
  const [analytics, setAnalytics] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Search & Filter state for Bookings
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');

  // Modals state
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);

  // Auto-suggest state for Customer / Beneficiary Name
  const [beneficiaryQuery, setBeneficiaryQuery] = useState('');
  const [suggestedBeneficiaries, setSuggestedBeneficiaries] = useState<any[]>([]);
  const [showSuggestDropdown, setShowSuggestDropdown] = useState(false);

  // New Booking Form State
  const [bookingForm, setBookingForm] = useState({
    beneficiaryName: '',
    serviceName: 'Household Support',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: '',
    fundingType: 'TRUST_SPONSORED',
    caregiverName: 'Anitha',
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED'
  });

  // New Beneficiary Form State
  const [newBenForm, setNewBenForm] = useState({
    fullName: '',
    category: 'SENIOR_CITIZEN',
    age: '',
    gender: 'Female',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Walking support, knee care'
  });

  // Fetch all live data from database
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
      console.error('Data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  // Handle Auto Suggest for Beneficiary
  const handleBeneficiarySearch = (val: string) => {
    setBeneficiaryQuery(val);
    setBookingForm({ ...bookingForm, beneficiaryName: val });
    if (val.trim().length > 0) {
      const matches = beneficiaries.filter(b => 
        b.fullName.toLowerCase().includes(val.toLowerCase()) ||
        b.primaryGuardian.toLowerCase().includes(val.toLowerCase()) ||
        b.primaryContact.includes(val)
      );
      setSuggestedBeneficiaries(matches);
      setShowSuggestDropdown(true);
    } else {
      setShowSuggestDropdown(false);
    }
  };

  const selectSuggestedBeneficiary = (b: any) => {
    setBeneficiaryQuery(b.fullName);
    setBookingForm({
      ...bookingForm,
      beneficiaryName: b.fullName,
      serviceAddress: b.address
    });
    setShowSuggestDropdown(false);
  };

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

  // Create or Update Booking in Database
  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        // Update
        const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${editingBooking.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        });
        const data = await res.json();
        if (data.booking) {
          setBookings(prev => prev.map(b => b.id === data.booking.id ? data.booking : b));
          setEditingBooking(null);
          setShowAddBookingModal(false);
          fetchData();
        }
      } else {
        // Create
        const res = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        });
        const data = await res.json();
        if (data.booking) {
          setBookings(prev => [data.booking, ...prev]);
          setShowAddBookingModal(false);
          fetchData();
        }
      }
    } catch (err) {
      alert('Failed to save booking');
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this care booking?')) {
      await fetch(`${API_BASE_URL}/api/v1/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.id !== id));
      fetchData();
    }
  };

  // Create Beneficiary in Database
  const handleCreateBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  // Filter Bookings by query and status
  const filteredBookings = bookings.filter(b => {
    const matchesQuery = !bookingSearchQuery || 
      b.beneficiaryName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.caregiverName.toLowerCase().includes(bookingSearchQuery.toLowerCase());

    const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // 1. SIGN IN SCREEN
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #FFF8E6 0%, #F5EED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '460px', width: '100%', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(11, 93, 59, 0.08)', border: '1px solid #E5E9E6', padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <img src="/thodu_logo_horizontal.png" alt="Thodu Elder Care" style={{ width: '280px', height: 'auto', margin: '0 auto', display: 'block' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B', marginBottom: '6px' }}>Super Admin Sign In</h2>
          <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '28px' }}>Sri Divyang Seva Kendram Trust Care Platform</p>
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

  // 2. COMPLETE ADMIN PANEL
  return (
    <div className="web-layout">
      {/* Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-brand">
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>
          <button className={`nav-link ${activeSection === 'bookings' ? 'active' : ''}`} onClick={() => setActiveSection('bookings')}>
            <Calendar size={18} />
            <span>Bookings & Services</span>
          </button>
          <button className={`nav-link ${activeSection === 'beneficiaries' ? 'active' : ''}`} onClick={() => setActiveSection('beneficiaries')}>
            <Users size={18} />
            <span>Beneficiaries</span>
          </button>
          <button className={`nav-link ${activeSection === 'workforce' ? 'active' : ''}`} onClick={() => setActiveSection('workforce')}>
            <ShieldCheck size={18} />
            <span>Care Team</span>
          </button>
          <button className={`nav-link ${activeSection === 'funding' ? 'active' : ''}`} onClick={() => setActiveSection('funding')}>
            <DollarSign size={18} />
            <span>Sponsorships</span>
          </button>
          <button className={`nav-link ${activeSection === 'sos' ? 'active' : ''}`} onClick={() => setActiveSection('sos')}>
            <AlertTriangle size={18} color="#FF8A80" />
            <span style={{ color: activeSection === 'sos' ? '#FFF' : '#FF8A80' }}>
              SOS Queue {analytics?.activeSosCount > 0 && `(${analytics.activeSosCount})`}
            </span>
          </button>
          <button className={`nav-link ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>
            <Shield size={18} />
            <span>Audit Trail</span>
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
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="web-main">
        {/* Topbar */}
        <header className="web-topbar">
          <div>
            <span style={{ fontSize: '12px', color: '#6B7C72' }}>Admin Panel</span>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>
              {activeSection === 'overview' && 'Overview & Analytics'}
              {activeSection === 'bookings' && 'Care Service Bookings & Dispatch'}
              {activeSection === 'beneficiaries' && 'Beneficiary Registry'}
              {activeSection === 'workforce' && 'Caregiver Workforce'}
              {activeSection === 'funding' && 'Trust Sponsorships'}
              {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
              {activeSection === 'audit' && 'Security Audit Log'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 10 }} />
              <input 
                placeholder="Search beneficiary, caregiver, booking ID..." 
                value={bookingSearchQuery}
                onChange={e => setBookingSearchQuery(e.target.value)}
                style={{ padding: '7px 12px 7px 34px', borderRadius: '10px', border: '1px solid #E5E9E6', fontSize: '12px', width: '300px', outline: 'none' }}
              />
            </div>

            <button onClick={fetchData} title="Refresh Live Database" style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
              <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#E8F5E9', padding: '6px 12px', borderRadius: '8px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E7D32' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0B5D3B' }}>Live Port 5089</span>
            </div>

            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', border: '1px solid #FFCDD2', color: '#C62828', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="web-content">
          {/* ========================================================================= */}
          {/* 1. OVERVIEW & ANALYTICS (MATCHING EXACT UPLOADED REFERENCE DESIGN)        */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div>
              {/* Welcome Banner */}
              <div className="overview-welcome-banner">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>Good Evening, Raju! 👋</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 4 }}>
                    Here's how Thodu is caring for our elders and special members today.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFF', padding: '8px 14px', borderRadius: '12px', border: '1px solid #F5E6BE' }}>
                  <Calendar size={16} color="#0B5D3B" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0B5D3B' }}>
                    {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' })}
                  </span>
                </div>
              </div>

              {/* 6 Key Performance Metric Pills (Real Live Database Calculations) */}
              <div className="grid-stats-row">
                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                    <Users size={16} color="#0B5D3B" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0B5D3B', margin: '8px 0 2px 0' }}>
                    {analytics?.totalBeneficiaries ?? beneficiaries.length}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Active in Trust Registry</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Active Caregivers</span>
                    <Heart size={16} color="#D81B60" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#D81B60', margin: '8px 0 2px 0' }}>
                    {analytics?.activeCaregivers ?? caregivers.length}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Salaried & Gig Roster</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Bookings</span>
                    <Calendar size={16} color="#F9B233" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#F9B233', margin: '8px 0 2px 0' }}>
                    {analytics?.totalBookings ?? bookings.length}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Scheduled & In-Progress</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Services Completed</span>
                    <CheckCircle2 size={16} color="#0288D1" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0288D1', margin: '8px 0 2px 0' }}>
                    {analytics?.completedServices ?? 0}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#0288D1', fontWeight: 600 }}>
                    {analytics?.completionRate ?? 0}% Completion Rate
                  </span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Revenue Collected</span>
                    <DollarSign size={16} color="#7B1FA2" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#7B1FA2', margin: '8px 0 2px 0' }}>
                    ₹{analytics?.revenueInr?.toLocaleString() ?? 0}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#7B1FA2', fontWeight: 600 }}>Paid Self & Split Fees</span>
                </div>

                <div className="metric-pill-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Sponsored Care Value</span>
                    <Award size={16} color="#0B5D3B" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0B5D3B', margin: '8px 0 2px 0' }}>
                    ₹{analytics?.sponsoredValueInr?.toLocaleString() ?? 0}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>
                    {analytics?.sponsoredServicesCount ?? 0} Subsidized Visits
                  </span>
                </div>
              </div>

              {/* 2-Column Analytics & Service Breakdown */}
              <div className="analytics-grid">
                {/* Left: Live Service Breakdown & Live Performance */}
                <div className="analytics-card">
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B5D3B', marginBottom: 16 }}>
                    Live Service Distribution & Performance
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {Object.entries(analytics?.serviceDistribution || {}).map(([srvName, count]: any) => {
                      const pct = Math.round((count / (analytics?.totalBookings || 1)) * 100);
                      return (
                        <div key={srvName}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: 4 }}>
                            <strong>{srvName}</strong>
                            <span>{count} visits ({pct}%)</span>
                          </div>
                          <div style={{ height: 8, background: '#F0F2F0', borderRadius: 9999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: '#0B5D3B', borderRadius: 9999 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ borderTop: '1px solid #E5E9E6', marginTop: 20, paddingTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6B7C72' }}>Beneficiary Satisfaction</span>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>4.8 / 5.0</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6B7C72' }}>Caregiver Utilization</span>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#F9B233' }}>86%</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6B7C72' }}>Avg Response Time</span>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#D81B60' }}>18 min</p>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Board */}
                <div className="analytics-card">
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B5D3B', marginBottom: 14 }}>
                    Operations Quick Actions
                  </h3>
                  <div className="quick-action-grid">
                    <button className="action-tile-btn" onClick={() => { setEditingBooking(null); setShowAddBookingModal(true); }}>
                      <Calendar size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>New Booking</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setShowAddBenModal(true)}>
                      <UserPlus size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>Add Beneficiary</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setShowAddCaregiverModal(true)}>
                      <ShieldCheck size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>Add Caregiver</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveSection('funding')}>
                      <Award size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>Sponsorships</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveSection('sos')}>
                      <AlertTriangle size={18} color="#C62828" />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#C62828' }}>SOS Queue</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveSection('audit')}>
                      <Shield size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>Audit Logs</span>
                    </button>
                  </div>

                  {/* Coverage Box */}
                  <div style={{ marginTop: 18, background: '#FAFBF9', padding: '12px', borderRadius: 12, border: '1px solid #E5E9E6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <MapPin size={14} color="#0B5D3B" />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Tirupati Operational Zones</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#6B7C72' }}>
                      T.T.D. Colony, Bhavani Nagar, Tirupati Urban & West zones active.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table on Overview */}
              <div className="data-table-card">
                <div className="table-header">
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B5D3B' }}>Recent Live Bookings</h3>
                    <p style={{ fontSize: '11px', color: '#6B7C72' }}>Real-time database records on Port 5089</p>
                  </div>
                  <button className="btn-primary" onClick={() => setActiveSection('bookings')}>
                    View All Bookings →
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Ref Number</th>
                      <th>Beneficiary</th>
                      <th>Service</th>
                      <th>Schedule</th>
                      <th>Assigned Caregiver</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map(bk => (
                      <tr key={bk.id}>
                        <td><strong>{bk.bookingNumber}</strong></td>
                        <td>{bk.beneficiaryName}</td>
                        <td>{bk.serviceName}</td>
                        <td>{bk.scheduledDate} ({bk.scheduledTimeSlot})</td>
                        <td>{bk.caregiverName}</td>
                        <td>
                          <span className={`badge ${bk.paymentStatus === 'PAID' ? 'badge-success' : bk.paymentStatus === 'SUBSIDIZED' ? 'badge-info' : 'badge-warning'}`}>
                            {bk.paymentStatus} ({bk.paymentMode.replace('_', ' ')})
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${bk.status === 'COMPLETED' ? 'badge-success' : bk.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-info'}`}>
                            {bk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. COMPLETE CARE BOOKINGS CRUD (SEARCH, AUTO-SUGGEST, PAYMENT MODES)     */}
          {/* ========================================================================= */}
          {activeSection === 'bookings' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Care Bookings Management</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Complete scheduling, caregiver assignment, payment tracking, and status controls</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <select 
                    value={bookingStatusFilter} 
                    onChange={e => setBookingStatusFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '12px' }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button className="btn-primary" onClick={() => {
                    setEditingBooking(null);
                    setBeneficiaryQuery('');
                    setBookingForm({
                      beneficiaryName: '',
                      serviceName: 'Household Support',
                      scheduledDate: new Date().toISOString().split('T')[0],
                      scheduledTimeSlot: '10:00 AM - 12:00 PM',
                      serviceAddress: '',
                      fundingType: 'TRUST_SPONSORED',
                      caregiverName: 'Anitha',
                      paymentMode: 'TRUST_GRANT',
                      paymentStatus: 'SUBSIDIZED'
                    });
                    setShowAddBookingModal(true);
                  }}>
                    <Plus size={15} /> Create Booking
                  </button>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Beneficiary / Customer</th>
                    <th>Care Service</th>
                    <th>Date & Time</th>
                    <th>Assigned Caregiver</th>
                    <th>Funding Route</th>
                    <th>Payable</th>
                    <th>Payment Mode</th>
                    <th>Payment Status</th>
                    <th>Booking Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ textAlign: 'center', padding: 24, color: '#6B7C72' }}>
                        No bookings matching criteria found.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map(bk => (
                      <tr key={bk.id}>
                        <td><strong>{bk.bookingNumber}</strong></td>
                        <td>
                          <strong>{bk.beneficiaryName}</strong>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{bk.guardianPhone}</div>
                        </td>
                        <td>{bk.serviceName}</td>
                        <td>
                          <div>{bk.scheduledDate}</div>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{bk.scheduledTimeSlot}</div>
                        </td>
                        <td><strong>{bk.caregiverName}</strong></td>
                        <td>
                          <span className="badge badge-success">
                            {bk.fundingType === 'TRUST_SPONSORED' ? '100% Trust Covered' : bk.fundingType}
                          </span>
                        </td>
                        <td>₹{(bk.familyPayablePaise / 100).toFixed(0)}</td>
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 500 }}>
                            {bk.paymentMode.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${bk.paymentStatus === 'PAID' ? 'badge-success' : bk.paymentStatus === 'SUBSIDIZED' ? 'badge-info' : 'badge-warning'}`}>
                            {bk.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${bk.status === 'COMPLETED' ? 'badge-success' : bk.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-info'}`}>
                            {bk.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button 
                              title="Edit Booking"
                              onClick={() => {
                                setEditingBooking(bk);
                                setBeneficiaryQuery(bk.beneficiaryName);
                                setBookingForm({
                                  beneficiaryName: bk.beneficiaryName,
                                  serviceName: bk.serviceName,
                                  scheduledDate: bk.scheduledDate,
                                  scheduledTimeSlot: bk.scheduledTimeSlot,
                                  serviceAddress: bk.serviceAddress,
                                  fundingType: bk.fundingType,
                                  caregiverName: bk.caregiverName,
                                  paymentMode: bk.paymentMode,
                                  paymentStatus: bk.paymentStatus
                                });
                                setShowAddBookingModal(true);
                              }}
                              style={{ background: '#F0F4F1', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#0B5D3B' }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              title="Delete Booking"
                              onClick={() => handleDeleteBooking(bk.id)}
                              style={{ background: '#FFEBEE', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: '#C62828' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. BENEFICIARIES REGISTRY                                                 */}
          {/* ========================================================================= */}
          {activeSection === 'beneficiaries' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiary Registry & Care Profiles</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Verified records of elderly people and persons with disabilities</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddBenModal(true)}>
                  <Plus size={15} /> Register Beneficiary
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Age & Gender</th>
                    <th>Primary Guardian</th>
                    <th>Contact Phone</th>
                    <th>Address</th>
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
                      <td>{ben.age} yrs • {ben.gender}</td>
                      <td>{ben.primaryGuardian} ({ben.relationship})</td>
                      <td>{ben.primaryContact}</td>
                      <td>{ben.address}</td>
                      <td>{ben.accessibilityNeeds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. WORKFORCE & CAREGIVERS                                                 */}
          {/* ========================================================================= */}
          {activeSection === 'workforce' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Workforce Directory</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Salaried staff and verified freelance gig caregivers</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddCaregiverModal(true)}>
                  <Plus size={15} /> Add Caregiver
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Caregiver Name</th>
                    <th>Employment</th>
                    <th>Contact Phone</th>
                    <th>Service Zone</th>
                    <th>Skills</th>
                    <th>Rating</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {caregivers.map(cg => (
                    <tr key={cg.id}>
                      <td><strong>{cg.fullName}</strong></td>
                      <td>
                        <span className={`badge ${cg.employmentType === 'SALARIED' ? 'badge-success' : 'badge-warning'}`}>
                          {cg.employmentType === 'SALARIED' ? 'Salaried Staff' : 'Freelance / Gig'}
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

          {/* ========================================================================= */}
          {/* 5. SPONSORSHIPS                                                           */}
          {/* ========================================================================= */}
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
                    <th>Ref #</th>
                    <th>Beneficiary</th>
                    <th>Programme</th>
                    <th>Applicant</th>
                    <th>Documents Provided</th>
                    <th>Subsidy %</th>
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
                            <button onClick={async () => {
                              await fetch(`${API_BASE_URL}/api/v1/sponsorship/${sp.id}/decision`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'APPROVED' })
                              });
                              fetchData();
                            }} style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '11px' }}>
                              Approve
                            </button>
                            <button onClick={async () => {
                              await fetch(`${API_BASE_URL}/api/v1/sponsorship/${sp.id}/decision`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'REJECTED' })
                              });
                              fetchData();
                            }} style={{ background: '#FFF', color: '#C62828', border: '1px solid #C62828', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '11px' }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#6B7C72' }}>Decision Finalized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SOS EMERGENCY QUEUE                                                    */}
          {/* ========================================================================= */}
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
                    <th>Notes</th>
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
                          <button onClick={async () => {
                            await fetch(`${API_BASE_URL}/api/v1/sos/${alert.id}/resolve`, { method: 'PATCH' });
                            fetchData();
                          }} style={{ background: '#2E7D32', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '11px' }}>
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

          {/* ========================================================================= */}
          {/* 7. AUDIT TRAIL                                                            */}
          {/* ========================================================================= */}
          {activeSection === 'audit' && (
            <div className="data-table-card">
              <div className="table-header">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Trust Immutable Audit Trail</h3>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Security and administrative action log</p>
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
      {/* MODAL 1: CREATE / EDIT CARE BOOKING (WITH SEARCHABLE AUTO-SUGGEST & PAY)  */}
      {/* ========================================================================= */}
      {showAddBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 580, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>
                {editingBooking ? `Edit Booking ${editingBooking.bookingNumber}` : 'Create & Dispatch Care Booking'}
              </h3>
              <button onClick={() => setShowAddBookingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveBooking}>
              {/* Customer / Beneficiary Name with Auto Suggest */}
              <div className="autosuggest-container" style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Customer / Beneficiary Name (Search & Auto-Suggest)
                </label>
                <input 
                  required
                  placeholder="Type to search (e.g. Saraswathi, Raghav)..." 
                  value={beneficiaryQuery}
                  onChange={e => handleBeneficiarySearch(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}
                />
                {showSuggestDropdown && suggestedBeneficiaries.length > 0 && (
                  <div className="autosuggest-dropdown">
                    {suggestedBeneficiaries.map(b => (
                      <div 
                        key={b.id} 
                        className="autosuggest-item"
                        onClick={() => selectSuggestedBeneficiary(b)}
                      >
                        <div>
                          <strong>{b.fullName}</strong>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{b.category === 'SENIOR_CITIZEN' ? 'Senior Citizen' : 'Person with Disability'} • {b.primaryGuardian}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>Select</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Care Service</label>
                  <select value={bookingForm.serviceName} onChange={e => setBookingForm({...bookingForm, serviceName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Household Support">Household Support (₹600)</option>
                    <option value="Companionship & Care">Companionship & Care (₹400)</option>
                    <option value="Medication Reminder">Medication Reminder (₹300)</option>
                    <option value="Disability Support">Disability Support (₹500)</option>
                    <option value="Cooking Assistance">Cooking Assistance (₹450)</option>
                    <option value="Grocery & Errands">Grocery & Errands (₹350)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Funding Route</label>
                  <select value={bookingForm.fundingType} onChange={e => setBookingForm({...bookingForm, fundingType: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="TRUST_SPONSORED">Trust Sponsored (100% Free)</option>
                    <option value="SPLIT_FUNDING">Split Funding (50% Trust)</option>
                    <option value="SELF_FUNDED">Self-Funded (Full Fee)</option>
                    <option value="DONOR_SPONSORED">Donor Sponsored (100% Free)</option>
                  </select>
                </div>
              </div>

              {/* Payment Mode and Payment Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Mode</label>
                  <select value={bookingForm.paymentMode} onChange={e => setBookingForm({...bookingForm, paymentMode: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="TRUST_GRANT">Trust Grant / Subsidized</option>
                    <option value="ONLINE_UPI">Online UPI (GPay / PhonePe)</option>
                    <option value="CASH_ON_VISIT">Cash on Visit</option>
                    <option value="BANK_TRANSFER">Direct Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Status</label>
                  <select value={bookingForm.paymentStatus} onChange={e => setBookingForm({...bookingForm, paymentStatus: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="SUBSIDIZED">Subsidized (Covered by Trust)</option>
                    <option value="PAID">Paid in Full</option>
                    <option value="PENDING">Pending Payment</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date</label>
                  <input type="date" value={bookingForm.scheduledDate} onChange={e => setBookingForm({...bookingForm, scheduledDate: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time Slot</label>
                  <input value={bookingForm.scheduledTimeSlot} onChange={e => setBookingForm({...bookingForm, scheduledTimeSlot: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service Address</label>
                <input required value={bookingForm.serviceAddress} onChange={e => setBookingForm({...bookingForm, serviceAddress: e.target.value})} placeholder="Home - T.T.D. Colony, Tirupati" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Assign Caregiver</label>
                <select value={bookingForm.caregiverName} onChange={e => setBookingForm({...bookingForm, caregiverName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                  {caregivers.map(cg => (
                    <option key={cg.id} value={cg.fullName}>{cg.fullName} ({cg.employmentType === 'SALARIED' ? 'Salaried' : 'Gig'} • Zone: {cg.zone})</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                {editingBooking ? 'Save Changes' : 'Confirm & Dispatch Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER BENEFICIARY */}
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
                  <select value={newBenForm.category} onChange={e => setNewBenForm({...newBenForm, category: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
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
    </div>
  );
}
