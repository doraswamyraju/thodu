import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, ShieldCheck, 
  AlertTriangle, Search, Plus, DollarSign, RefreshCw,
  LogOut, Lock, Mail, CheckCircle2, ChevronRight, X,
  FileText, Shield, UserPlus, PhoneCall, Trash2, Edit3,
  TrendingUp, Heart, Check, Clock, Bell, MapPin, Award,
  MoreVertical, ChevronDown, Filter, ChevronLeft
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
  const [activeSection, setActiveSection] = useState<NavSection>('bookings'); // Default to Bookings as requested
  const [loading, setLoading] = useState(false);

  // Live Database States
  const [analytics, setAnalytics] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filter Bar States for Bookings Board (Matching Reference)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [fundingFilter, setFundingFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('Mar 01, 2026 - Mar 31, 2026');

  // Modals & Menu State
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Auto-Suggest for Customer / Beneficiary Name
  const [beneficiaryQuery, setBeneficiaryQuery] = useState('');
  const [suggestedBeneficiaries, setSuggestedBeneficiaries] = useState<any[]>([]);
  const [showSuggestDropdown, setShowSuggestDropdown] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    beneficiaryName: '',
    serviceName: 'Household Support',
    scheduledDate: 'Mar 15, 2026',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    fundingType: 'Trust Sponsored',
    caregiverName: 'Anitha',
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'In Progress'
  });

  // Fetch Live Records
  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('q', searchQuery);
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (serviceFilter !== 'ALL') queryParams.append('service', serviceFilter);
      if (fundingFilter !== 'ALL') queryParams.append('funding', fundingFilter);

      const [analyticsRes, benRes, bkRes, cgRes, spRes, sosRes, audRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/analytics`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/beneficiaries`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/bookings?${queryParams.toString()}`).then(r => r.json()).catch(() => null),
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
  }, [session, searchQuery, statusFilter, serviceFilter, fundingFilter]);

  // Handle Auto Suggest
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

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setServiceFilter('ALL');
    setFundingFilter('ALL');
  };

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
    if (window.confirm('Log out from Thodu Admin Panel?')) {
      localStorage.removeItem('thodu_session');
      setSession(null);
    }
  };

  // Save Booking (Create or Update in Live DB)
  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${editingBooking.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        });
        const data = await res.json();
        if (data.booking) {
          setShowAddBookingModal(false);
          setEditingBooking(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        });
        const data = await res.json();
        if (data.booking) {
          setShowAddBookingModal(false);
          fetchData();
        }
      }
    } catch (err) {
      alert('Failed to save booking');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await fetch(`${API_BASE_URL}/api/v1/bookings/${id}`, { method: 'DELETE' });
      setOpenActionMenuId(null);
      fetchData();
    }
  };

  // Helper for Status Badge Styling matching reference image
  const renderStatusBadge = (status: string) => {
    if (status === 'In Progress') {
      return <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>In Progress</span>;
    } else if (status === 'Confirmed') {
      return <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Confirmed</span>;
    } else if (status === 'Awaiting Assignment') {
      return <span style={{ background: '#FFF3E0', color: '#E65100', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Awaiting Assignment</span>;
    } else if (status === 'Scheduled') {
      return <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Scheduled</span>;
    }
    return <span style={{ background: '#F5F5F5', color: '#616161', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>{status}</span>;
  };

  // Helper for Funding Badge Styling matching reference image
  const renderFundingBadge = (funding: string) => {
    if (funding === 'Trust Sponsored') {
      return <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Trust Sponsored</span>;
    } else if (funding === 'Family Paid') {
      return <span style={{ background: '#E1F5FE', color: '#0288D1', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Family Paid</span>;
    } else if (funding === 'Partially Sponsored' || funding === 'Split Funding') {
      return <span style={{ background: '#FFF8E1', color: '#F57F17', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Partially Sponsored</span>;
    }
    return <span style={{ background: '#F5F5F5', color: '#616161', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>{funding}</span>;
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
      {/* Left Sidebar matching exact reference styling */}
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
                TA
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Trust Operations</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Admin</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Log Out" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FF8A80' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="web-main">
        {/* Topbar Header */}
        <header className="web-topbar">
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>
            Care Service Bookings & Dispatch Board
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
          {/* CARE BOOKINGS BOARD (EXACT LAYOUT OF USER'S ATTACHED SCREENSHOT)          */}
          {/* ========================================================================= */}
          {activeSection === 'bookings' && (
            <div>
              {/* Header Card with Create Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>All Care Bookings & Dispatch</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Manage salaried roster assignment and caregiver dispatch
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setEditingBooking(null);
                    setBeneficiaryQuery('');
                    setBookingForm({
                      beneficiaryName: '',
                      serviceName: 'Household Support',
                      scheduledDate: 'Mar 15, 2026',
                      scheduledTimeSlot: '10:00 AM - 12:00 PM',
                      serviceAddress: 'T.T.D. Colony, Tirupati',
                      fundingType: 'Trust Sponsored',
                      caregiverName: 'Anitha',
                      paymentMode: 'TRUST_GRANT',
                      paymentStatus: 'SUBSIDIZED',
                      status: 'In Progress'
                    });
                    setShowAddBookingModal(true);
                  }}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Create Booking
                </button>
              </div>

              {/* 4 Dispatch KPI Cards (Derived from Live Database) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {/* 1. Total Bookings */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Bookings</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.totalBookings ?? bookings.length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>▲ +12.4% vs last month</span>
                  </div>
                </div>

                {/* 2. Awaiting Assignment */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Awaiting Assignment</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#F9B233', margin: '2px 0' }}>
                      {analytics?.awaitingAssignment ?? bookings.filter(b => b.caregiverName === 'Unassigned').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#E65100', fontWeight: 600 }}>Unassigned Roster</span>
                  </div>
                </div>

                {/* 3. Confirmed */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} color="#2E7D32" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Confirmed</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#2E7D32', margin: '2px 0' }}>
                      {analytics?.confirmed ?? bookings.filter(b => b.status === 'Confirmed').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>▲ +18.8% vs last month</span>
                  </div>
                </div>

                {/* 4. In Progress */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>In Progress</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0288D1', margin: '2px 0' }}>
                      {analytics?.inProgress ?? bookings.filter(b => b.status === 'In Progress').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#0288D1', fontWeight: 600 }}>▲ +5.9% vs last month</span>
                  </div>
                </div>
              </div>

              {/* Filter Row matching exact reference */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search booking ID or beneficiary..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={statusFilter} 
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Status: All Statuses</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Confirmed">Status: Confirmed</option>
                  <option value="Awaiting Assignment">Status: Awaiting Assignment</option>
                  <option value="Scheduled">Status: Scheduled</option>
                  <option value="Completed">Status: Completed</option>
                </select>

                <select 
                  value={serviceFilter} 
                  onChange={e => setServiceFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Service: All Services</option>
                  <option value="Household Support">Service: Household Support</option>
                  <option value="Cooking Assistance">Service: Cooking Assistance</option>
                  <option value="Companion Care">Service: Companion Care</option>
                  <option value="Disability Support">Service: Disability Support</option>
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid #E5E9E6', borderRadius: 8, fontSize: '13px', color: '#1E2D24', background: '#FFF' }}>
                  <Calendar size={14} color="#6B7C72" />
                  <span>{dateRangeFilter}</span>
                  <ChevronDown size={14} color="#6B7C72" />
                </div>

                <select 
                  value={fundingFilter} 
                  onChange={e => setFundingFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Funding: All Types</option>
                  <option value="Trust Sponsored">Funding: Trust Sponsored</option>
                  <option value="Family Paid">Funding: Family Paid</option>
                  <option value="Partially Sponsored">Funding: Partially Sponsored</option>
                </select>

                <button 
                  onClick={clearFilters}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              </div>

              {/* Data Table matching exact design layout */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th>REF ⬍</th>
                      <th>BENEFICIARY</th>
                      <th>SERVICE</th>
                      <th>ADDRESS</th>
                      <th>DATE & TIME ⬍</th>
                      <th>FUNDING</th>
                      <th>ASSIGNED CAREGIVER</th>
                      <th>PAYABLE ⬍</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#6B7C72' }}>
                          No matching bookings found in live database.
                        </td>
                      </tr>
                    ) : (
                      bookings.map(bk => (
                        <tr key={bk.id}>
                          <td><strong>{bk.bookingNumber}</strong></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={14} color="#0B5D3B" />
                              </div>
                              <div>
                                <strong style={{ fontSize: '13px' }}>{bk.beneficiaryName}</strong>
                                <div style={{ fontSize: '11px', color: '#6B7C72' }}>Age: {bk.beneficiaryAge} yrs</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Heart size={14} color="#0B5D3B" />
                              <span>{bk.serviceName}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7C72', fontSize: '12px' }}>
                              <MapPin size={12} />
                              <span>{bk.serviceAddress}</span>
                            </div>
                          </td>
                          <td>
                            <div>{bk.scheduledDate}</div>
                            <div style={{ fontSize: '11px', color: '#6B7C72' }}>{bk.scheduledTimeSlot}</div>
                          </td>
                          <td>
                            {renderFundingBadge(bk.fundingType)}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <ShieldCheck size={14} color={bk.caregiverName === 'Unassigned' ? '#F9B233' : '#0B5D3B'} />
                              <span style={{ fontWeight: bk.caregiverName === 'Unassigned' ? 400 : 600, color: bk.caregiverName === 'Unassigned' ? '#6B7C72' : '#1E2D24' }}>
                                {bk.caregiverName}
                              </span>
                            </div>
                          </td>
                          <td>
                            <strong>₹{(bk.familyPayablePaise / 100).toFixed(0)}</strong>
                          </td>
                          <td>
                            {renderStatusBadge(bk.status)}
                          </td>
                          <td style={{ position: 'relative' }}>
                            <button 
                              onClick={() => setOpenActionMenuId(openActionMenuId === bk.id ? null : bk.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                            >
                              <MoreVertical size={16} color="#6B7C72" />
                            </button>

                            {/* Dropdown Action Menu */}
                            {openActionMenuId === bk.id && (
                              <div style={{ position: 'absolute', right: 20, top: 40, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                                <button 
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
                                      paymentStatus: bk.paymentStatus,
                                      status: bk.status
                                    });
                                    setOpenActionMenuId(null);
                                    setShowAddBookingModal(true);
                                  }}
                                  style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                  <Edit3 size={13} /> Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteBooking(bk.id)}
                                  style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#C62828', display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Table Footer with Pagination matching screenshot */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E9E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7C72' }}>
                  <span>Showing 1 – {bookings.length} of {analytics?.totalBookings ?? bookings.length} bookings</span>
                  
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
          {/* OVERVIEW & ANALYTICS                                                      */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div>
              <div className="overview-welcome-banner">
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>Executive Operations Dashboard</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 4 }}>
                    Live analytics powered by central database on Port 5089
                  </p>
                </div>
              </div>

              <div className="grid-stats-row">
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0B5D3B', margin: '6px 0' }}>{beneficiaries.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Active in Trust</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Active Caregivers</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#D81B60', margin: '6px 0' }}>{caregivers.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Verified Roster</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Bookings</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#F9B233', margin: '6px 0' }}>{bookings.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Live Dispatch</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Revenue Collected</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#7B1FA2', margin: '6px 0' }}>₹{analytics?.revenueInr ?? 0}</h3>
                  <span style={{ fontSize: '11px', color: '#7B1FA2', fontWeight: 600 }}>Client Contributions</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Trust Subsidies</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0B5D3B', margin: '6px 0' }}>₹{analytics?.sponsoredValueInr ?? 0}</h3>
                  <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>Sponsored Care</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Active SOS Alerts</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#C62828', margin: '6px 0' }}>{analytics?.activeSosCount ?? 0}</h3>
                  <span style={{ fontSize: '11px', color: '#C62828', fontWeight: 600 }}>Emergency Queue</span>
                </div>
              </div>
            </div>
          )}

          {/* OTHER SECTIONS */}
          {activeSection === 'beneficiaries' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiary Registry</h3>
                <button className="btn-primary" onClick={() => setShowAddBenModal(true)}><Plus size={15} /> Add Beneficiary</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Age</th>
                    <th>Primary Guardian</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map(ben => (
                    <tr key={ben.id}>
                      <td><strong>{ben.fullName}</strong></td>
                      <td><span className="badge badge-success">{ben.category === 'SENIOR_CITIZEN' ? 'Senior Citizen' : 'Person with Disability'}</span></td>
                      <td>{ben.age} yrs</td>
                      <td>{ben.primaryGuardian} ({ben.relationship})</td>
                      <td>{ben.primaryContact}</td>
                      <td>{ben.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'workforce' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Workforce</h3>
                <button className="btn-primary" onClick={() => setShowAddCaregiverModal(true)}><Plus size={15} /> Add Caregiver</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Employment</th>
                    <th>Phone</th>
                    <th>Zone</th>
                    <th>Rating</th>
                    <th>Verification</th>
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
                      <td><span className="badge badge-success">{cg.verificationStatus}</span></td>
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
      {/* MODAL: CREATE / EDIT CARE BOOKING (WITH SEARCHABLE AUTO-SUGGEST)          */}
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
                  placeholder="Type to search (e.g. Saraswathi, Raghav, Anil)..." 
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
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{b.category === 'SENIOR_CITIZEN' ? 'Senior Citizen' : 'Person with Disability'} • Age: {b.age} • {b.address}</div>
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
                    <option value="Cooking Assistance">Cooking Assistance (₹450)</option>
                    <option value="Companion Care">Companion Care (₹400)</option>
                    <option value="Disability Support">Disability Support (₹500)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Funding Route</label>
                  <select value={bookingForm.fundingType} onChange={e => setBookingForm({...bookingForm, fundingType: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Trust Sponsored">Trust Sponsored (100% Free)</option>
                    <option value="Family Paid">Family Paid (Full Fee)</option>
                    <option value="Partially Sponsored">Partially Sponsored (75% Trust)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Mode</label>
                  <select value={bookingForm.paymentMode} onChange={e => setBookingForm({...bookingForm, paymentMode: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="TRUST_GRANT">Trust Grant / Subsidized</option>
                    <option value="ONLINE_UPI">Online UPI (GPay / PhonePe)</option>
                    <option value="CASH_ON_VISIT">Cash on Visit</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Status</label>
                  <select value={bookingForm.paymentStatus} onChange={e => setBookingForm({...bookingForm, paymentStatus: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="SUBSIDIZED">Subsidized (Covered by Trust)</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date</label>
                  <input value={bookingForm.scheduledDate} onChange={e => setBookingForm({...bookingForm, scheduledDate: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time Slot</label>
                  <input value={bookingForm.scheduledTimeSlot} onChange={e => setBookingForm({...bookingForm, scheduledTimeSlot: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Assigned Caregiver</label>
                  <select value={bookingForm.caregiverName} onChange={e => setBookingForm({...bookingForm, caregiverName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Unassigned">Unassigned (Awaiting Assignment)</option>
                    {caregivers.map(cg => (
                      <option key={cg.id} value={cg.fullName}>{cg.fullName} ({cg.employmentType})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Booking Status</label>
                  <select value={bookingForm.status} onChange={e => setBookingForm({...bookingForm, status: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="In Progress">In Progress</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Awaiting Assignment">Awaiting Assignment</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service Address</label>
                <input required value={bookingForm.serviceAddress} onChange={e => setBookingForm({...bookingForm, serviceAddress: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                {editingBooking ? 'Save Changes' : 'Confirm & Dispatch Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER BENEFICIARY */}
      {showAddBenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 540, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Register Beneficiary</h3>
              <button onClick={() => setShowAddBenModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await fetch(`${API_BASE_URL}/api/v1/beneficiaries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: beneficiaryQuery || 'New Beneficiary', age: 65, category: 'SENIOR_CITIZEN', address: 'T.T.D. Colony, Tirupati' })
              });
              setShowAddBenModal(false);
              fetchData();
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                <input required value={beneficiaryQuery} onChange={e => setBeneficiaryQuery(e.target.value)} placeholder="e.g. Narasimha Rao" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Register Beneficiary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
