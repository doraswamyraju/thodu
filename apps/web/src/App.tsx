import React, { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, Award, Bell, Calendar, Check, CheckCircle2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Clock, DollarSign, Download, Edit3, Eye, FileText, Filter, Heart, LayoutDashboard, Lock, LogOut, Mail, MapPin, MoreVertical, PhoneCall, Plus, Radio, RefreshCw, Search, Send, Shield, ShieldCheck, Trash2, TrendingUp, UserPlus, Users, X
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
  const [activeSection, setActiveSection] = useState<NavSection>('overview'); // Direct to requested screen
  const [loading, setLoading] = useState(false);

  // Live Database States
  const [analytics, setAnalytics] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // 1. Caregiver Workforce Filter States (Matching Image 1)
  const [cgTab, setCgTab] = useState<'ALL' | 'SALARIED' | 'FREELANCE' | 'ON_DUTY' | 'AVAILABLE'>('ALL');
  const [cgSearchQuery, setCgSearchQuery] = useState('');
  const [cgEmploymentFilter, setCgEmploymentFilter] = useState('ALL');
  const [cgZoneFilter, setCgZoneFilter] = useState('ALL');
  const [cgAvailabilityFilter, setCgAvailabilityFilter] = useState('ALL');
  const [cgVerificationFilter, setCgVerificationFilter] = useState('ALL');
  const [selectedCgIds, setSelectedCgIds] = useState<string[]>([]);
  const [openCgActionId, setOpenCgActionId] = useState<string | null>(null);

  // 2. Bookings Filter & Action States (Matching Image from previous request)
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [bookingServiceFilter, setBookingServiceFilter] = useState('ALL');
  const [bookingFundingFilter, setBookingFundingFilter] = useState('ALL');
  const [openBookingActionId, setOpenBookingActionId] = useState<string | null>(null);

  // Beneficiaries Section States (Exact Match to Reference Image 2)
  const [benTab, setBenTab] = useState<'ALL' | 'SENIOR' | 'DISABILITY'>('ALL');
  const [benSearchQuery, setBenSearchQuery] = useState('');
  const [benCategoryFilter, setBenCategoryFilter] = useState('ALL');
  const [benStatusFilter, setBenStatusFilter] = useState('ALL');
  const [selectedBenIds, setSelectedBenIds] = useState<string[]>([]);
  const [openBenActionId, setOpenBenActionId] = useState<string | null>(null);
  const [selectedBeneficiaryDetail, setSelectedBeneficiaryDetail] = useState<any | null>(null);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);

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

  const [assigningBooking, setAssigningBooking] = useState<any | null>(null);

  // Modals state
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [selectedCaregiverDetail, setSelectedCaregiverDetail] = useState<any | null>(null);

  // Auto-Suggest for Customer in Booking
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
    caregiverName: 'Unassigned',
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'Awaiting Assignment'
  });

  // Caregiver Form State
  const [newCgForm, setNewCgForm] = useState({
    fullName: '',
    phone: '+91 98765 00000',
    employmentType: 'Salaried',
    skills: 'Elder Companionship, Cooking',
    zone: 'Tirupati Urban'
  });

  // Fetch Live Database
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

  // Broadcast Booking to Gig Caregivers
  
  const handleBeneficiarySearch = (val: string) => {
    setBeneficiaryQuery(val);
    setBookingForm(prev => ({ ...prev, beneficiaryName: val }));
    if (val.trim().length > 0) {
      const matches = beneficiaries.filter(b => 
        b.fullName.toLowerCase().includes(val.toLowerCase()) ||
        b.primaryGuardian?.toLowerCase().includes(val.toLowerCase()) ||
        b.primaryContact?.includes(val)
      );
      setSuggestedBeneficiaries(matches);
      setShowSuggestDropdown(true);
    } else {
      setShowSuggestDropdown(false);
    }
  };

  const selectSuggestedBeneficiary = (b: any) => {
    setBeneficiaryQuery(b.fullName);
    setBookingForm(prev => ({
      ...prev,
      beneficiaryName: b.fullName,
      serviceAddress: b.address
    }));
    setShowSuggestDropdown(false);
  };

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

  const handleBroadcastBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/broadcast`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Booking broadcasted to all active gig caregivers in the area!');
        setOpenBookingActionId(null);
        fetchData();
      }
    } catch (e) {
      alert('Error broadcasting booking');
    }
  };

  // Assign Caregiver directly to booking
  const handleAssignCaregiver = async (bookingId: string, caregiverName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caregiverName })
      });
      const data = await res.json();
      if (data.success) {
        setAssigningBooking(null);
        setOpenBookingActionId(null);
        fetchData();
      }
    } catch (e) {
      alert('Error assigning caregiver');
    }
  };

  // Filtered Caregivers
  const filteredCaregivers = caregivers.filter(cg => {
    const matchesTab = cgTab === 'ALL' ||
      (cgTab === 'SALARIED' && cg.employmentType === 'Salaried') ||
      (cgTab === 'FREELANCE' && cg.employmentType.includes('Freelance')) ||
      (cgTab === 'ON_DUTY' && cg.availability === 'On Duty') ||
      (cgTab === 'AVAILABLE' && cg.availability === 'Available');

    const matchesEmployment = cgEmploymentFilter === 'ALL' || cg.employmentType === cgEmploymentFilter;
    const matchesZone = cgZoneFilter === 'ALL' || cg.zone === cgZoneFilter;
    const matchesAvailability = cgAvailabilityFilter === 'ALL' || cg.availability === cgAvailabilityFilter;
    const matchesVerification = cgVerificationFilter === 'ALL' || cg.verificationStatus === cgVerificationFilter;

    const matchesQuery = !cgSearchQuery ||
      cg.fullName.toLowerCase().includes(cgSearchQuery.toLowerCase()) ||
      cg.refNumber.toLowerCase().includes(cgSearchQuery.toLowerCase()) ||
      cg.phone.includes(cgSearchQuery) ||
      cg.zone.toLowerCase().includes(cgSearchQuery.toLowerCase());

    return matchesTab && matchesEmployment && matchesZone && matchesAvailability && matchesVerification && matchesQuery;
  });

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesQuery = !bookingSearchQuery || 
      b.beneficiaryName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.caregiverName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.serviceAddress.toLowerCase().includes(bookingSearchQuery.toLowerCase());

    const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
    const matchesService = bookingServiceFilter === 'ALL' || b.serviceName === bookingServiceFilter;
    const matchesFunding = bookingFundingFilter === 'ALL' || b.fundingType === bookingFundingFilter;

    return matchesQuery && matchesStatus && matchesService && matchesFunding;
  });

  // Checkbox helpers
  const toggleSelectCg = (id: string) => {
    setSelectedCgIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const selectAllCgs = () => {
    if (selectedCgIds.length === filteredCaregivers.length) {
      setSelectedCgIds([]);
    } else {
      setSelectedCgIds(filteredCaregivers.map(c => c.id));
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
          <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '28px' }}>Sri Divyang Seva Kendram Trust</p>
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
              Sign In to Super Admin Workspace →
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

      {/* Main Container */}
      <main className="web-main">
        {/* Top Header */}
        <header className="web-topbar">
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>
              {activeSection === 'workforce' && 'Caregiver Workforce'}
              {activeSection === 'bookings' && 'Care Service Bookings & Dispatch Board'}
              {activeSection === 'beneficiaries' && 'Beneficiaries & Families'}
              {activeSection === 'overview' && 'Overview & Analytics'}
              {activeSection === 'funding' && 'Trust Sponsorship & Subsidies'}
              {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
              {activeSection === 'audit' && 'Trust Security Audit Trail'}
            </h1>
            <p style={{ fontSize: '12px', color: '#6B7C72' }}>
              {activeSection === 'workforce' && 'Manage caregivers, their employment, availability and verification'}
              {activeSection === 'bookings' && 'Manage salaried roster assignment, gig broadcasts, and status'}
              {activeSection === 'beneficiaries' && 'Manage all registered beneficiaries and their family/guardian details'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 10 }} />
              <input 
                placeholder="Search by name, phone, or ID..."
                style={{ padding: '7px 12px 7px 34px', borderRadius: '10px', border: '1px solid #E5E9E6', fontSize: '12px', width: '260px', outline: 'none' }}
              />
            </div>

            <button onClick={fetchData} title="Refresh Database" style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
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
          {/* 1. CAREGIVER WORKFORCE (EXACT PIXEL-PERFECT CLONE OF IMAGE 1)              */}
          {/* ========================================================================= */}
          {activeSection === 'workforce' && (
            <div>
              {/* Header Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddCaregiverModal(true)}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Add Caregiver
                </button>
              </div>

              {/* 4 Summary Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {/* 1. Total Caregivers */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Caregivers</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.totalCaregivers ?? caregivers.length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.1% vs last month</span>
                  </div>
                </div>

                {/* 2. Salaried Staff */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} color="#D81B60" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Salaried Staff</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.salariedStaff ?? caregivers.filter(c => c.employmentType === 'Salaried').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.salariedStaffPct ?? 60}%)
                    </span>
                  </div>
                </div>

                {/* 3. Freelancers / Gig */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Freelancers / Gig</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.freelanceGig ?? caregivers.filter(c => c.employmentType.includes('Freelance')).length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.freelanceGigPct ?? 25}%)
                    </span>
                  </div>
                </div>

                {/* 4. Verified Caregivers */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Verified Caregivers</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.verifiedCaregivers ?? caregivers.filter(c => c.verificationStatus === 'Verified').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>
                      ({analytics?.verifiedCaregiversPct ?? 96}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Segment Tabs */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button 
                  onClick={() => setCgTab('ALL')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'ALL' ? '#0B5D3B' : '#FFF', color: cgTab === 'ALL' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  All Caregivers ({caregivers.length})
                </button>
                <button 
                  onClick={() => setCgTab('SALARIED')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'SALARIED' ? '#0B5D3B' : '#FFF', color: cgTab === 'SALARIED' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Salaried ({caregivers.filter(c => c.employmentType === 'Salaried').length})
                </button>
                <button 
                  onClick={() => setCgTab('FREELANCE')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'FREELANCE' ? '#0B5D3B' : '#FFF', color: cgTab === 'FREELANCE' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Freelancers ({caregivers.filter(c => c.employmentType.includes('Freelance')).length})
                </button>
                <button 
                  onClick={() => setCgTab('ON_DUTY')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'ON_DUTY' ? '#0B5D3B' : '#FFF', color: cgTab === 'ON_DUTY' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  On Duty ({caregivers.filter(c => c.availability === 'On Duty').length})
                </button>
                <button 
                  onClick={() => setCgTab('AVAILABLE')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'AVAILABLE' ? '#0B5D3B' : '#FFF', color: cgTab === 'AVAILABLE' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Available ({caregivers.filter(c => c.availability === 'Available').length})
                </button>
              </div>

              {/* Filter Toolbar */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search by name, phone, or caregiver ID..."
                    value={cgSearchQuery}
                    onChange={e => setCgSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={cgEmploymentFilter} 
                  onChange={e => setCgEmploymentFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Employment: All</option>
                  <option value="Salaried">Employment: Salaried</option>
                  <option value="Freelance / Gig">Employment: Freelance / Gig</option>
                </select>

                <select 
                  value={cgZoneFilter} 
                  onChange={e => setCgZoneFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Zone: All</option>
                  <option value="Tirupati Urban">Tirupati Urban</option>
                  <option value="T.T.D. Colony">T.T.D. Colony</option>
                  <option value="Tirupati West">Tirupati West</option>
                </select>

                <select 
                  value={cgAvailabilityFilter} 
                  onChange={e => setCgAvailabilityFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Availability: All</option>
                  <option value="Available">Available</option>
                  <option value="On Duty">On Duty</option>
                </select>

                <select 
                  value={cgVerificationFilter} 
                  onChange={e => setCgVerificationFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Verification: All</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>

                <button 
                  onClick={() => alert('Exporting Caregivers data.')}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={14} /> Export
                </button>
              </div>

              {/* Caregiver Table */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input 
                          type="checkbox" 
                          checked={selectedCgIds.length === filteredCaregivers.length && filteredCaregivers.length > 0}
                          onChange={selectAllCgs}
                        />
                      </th>
                      <th>CAREGIVER</th>
                      <th>EMPLOYMENT</th>
                      <th>PHONE</th>
                      <th>ZONE / AREA</th>
                      <th>RATING</th>
                      <th>VERIFICATION</th>
                      <th>AVAILABILITY</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCaregivers.map(cg => (
                      <tr key={cg.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedCgIds.includes(cg.id)}
                            onChange={() => toggleSelectCg(cg.id)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: cg.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#0B5D3B' }}>
                              {cg.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ fontSize: '13px' }}>{cg.fullName}</strong>
                              <div style={{ fontSize: '11px', color: '#6B7C72' }}>{cg.refNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: cg.employmentType === 'Salaried' ? '#E8F5E9' : '#E1F5FE', color: cg.employmentType === 'Salaried' ? '#2E7D32' : '#0288D1' }}>
                            {cg.employmentType}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1E2D24', fontSize: '12px' }}>
                            <PhoneCall size={12} color="#6B7C72" />
                            <span>{cg.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7C72', fontSize: '12px' }}>
                            <MapPin size={12} />
                            <span>{cg.zone}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px' }}>
                            <span style={{ color: '#F9B233' }}>★</span>
                            <strong>{cg.rating}</strong>
                            <span style={{ color: '#6B7C72', fontSize: '11px' }}>({cg.ratingReviewsCount})</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                            <CheckCircle2 size={12} /> {cg.verificationStatus}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: cg.availability === 'Available' ? '#E8F5E9' : '#FFF3E0', color: cg.availability === 'Available' ? '#2E7D32' : '#E65100', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                            ● {cg.availability}
                          </span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button 
                              title="View Caregiver"
                              onClick={() => setSelectedCaregiverDetail(cg)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Eye size={15} />
                            </button>
                            <button 
                              title="Edit Record"
                              onClick={() => alert(`Edit profile for ${cg.fullName}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => setOpenCgActionId(openCgActionId === cg.id ? null : cg.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <MoreVertical size={15} />
                            </button>
                          </div>

                          {openCgActionId === cg.id && (
                            <div style={{ position: 'absolute', right: 20, top: 38, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                              <button 
                                onClick={() => {
                                  setSelectedCaregiverDetail(cg);
                                  setOpenCgActionId(null);
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer' }}
                              >
                                View Profile
                              </button>
                              <button 
                                onClick={async () => {
                                  setCaregivers(prev => prev.map(c => c.id === cg.id ? { ...c, availability: c.availability === 'Available' ? 'On Duty' : 'Available' } : c));
                                  setOpenCgActionId(null);
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#0B5D3B' }}
                              >
                                Toggle Duty
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table Pagination */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E9E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7C72' }}>
                  <span>Showing 1 – {filteredCaregivers.length} of {caregivers.length} caregivers</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>Rows per page:</span>
                    <select style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E9E6', fontSize: '12px' }}>
                      <option>10</option>
                      <option>25</option>
                    </select>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF' }}>&lt;</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#0B5D3B', color: '#FFF', fontWeight: 600 }}>1</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. CARE SERVICE BOOKINGS & DISPATCH (WITH ASSIGN & BROADCAST FEATURES!)   */}
          {/* ========================================================================= */}
          {activeSection === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>All Care Bookings & Dispatch</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Manage salaried roster assignment and caregiver dispatch
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddBookingModal(true)}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Create Booking
                </button>
              </div>

              {/* 4 Dispatch KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Bookings</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>{bookings.length}</h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.4% vs last month</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Awaiting Assignment</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#F9B233', margin: '2px 0' }}>
                      {bookings.filter(b => b.caregiverName === 'Unassigned').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#E65100', fontWeight: 600 }}>Unassigned Roster</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} color="#2E7D32" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Confirmed</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#2E7D32', margin: '2px 0' }}>
                      {bookings.filter(b => b.status === 'Confirmed').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +18.8% vs last month</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>In Progress</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0288D1', margin: '2px 0' }}>
                      {bookings.filter(b => b.status === 'In Progress').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#0288D1', fontWeight: 600 }}>Active Care Visits</span>
                  </div>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search booking ID or beneficiary..."
                    value={bookingSearchQuery}
                    onChange={e => setBookingSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={bookingStatusFilter} 
                  onChange={e => setBookingStatusFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Status: All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Awaiting Assignment">Awaiting Assignment</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>

                <select 
                  value={bookingServiceFilter} 
                  onChange={e => setBookingServiceFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Service: All Services</option>
                  <option value="Household Support">Household Support</option>
                  <option value="Cooking Assistance">Cooking Assistance</option>
                  <option value="Companion Care">Companion Care</option>
                  <option value="Disability Support">Disability Support</option>
                </select>

                <button 
                  onClick={() => {
                    setBookingSearchQuery('');
                    setBookingStatusFilter('ALL');
                    setBookingServiceFilter('ALL');
                    setBookingFundingFilter('ALL');
                  }}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              </div>

              {/* Data Table */}
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
                      <th>ACTIONS / DISPATCH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(bk => (
                      <tr key={bk.id}>
                        <td><strong>{bk.bookingNumber}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: bk.fundingType === 'Trust Sponsored' ? '#E8F5E9' : bk.fundingType === 'Family Paid' ? '#E1F5FE' : '#FFF8E1', color: bk.fundingType === 'Trust Sponsored' ? '#2E7D32' : bk.fundingType === 'Family Paid' ? '#0288D1' : '#F57F17' }}>
                            {bk.fundingType}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={14} color={bk.caregiverName === 'Unassigned' ? '#F9B233' : '#0B5D3B'} />
                            <span style={{ fontWeight: bk.caregiverName === 'Unassigned' ? 400 : 600, color: bk.caregiverName === 'Unassigned' ? '#6B7C72' : '#1E2D24' }}>
                              {bk.caregiverName}
                            </span>
                          </div>
                        </td>
                        <td><strong>₹{(bk.familyPayablePaise / 100).toFixed(0)}</strong></td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: bk.status === 'Completed' ? '#E8F5E9' : bk.status === 'In Progress' ? '#E8F5E9' : bk.status === 'Awaiting Assignment' ? '#FFF3E0' : '#E3F2FD', color: bk.status === 'Completed' || bk.status === 'In Progress' ? '#2E7D32' : bk.status === 'Awaiting Assignment' ? '#E65100' : '#1565C0' }}>
                            {bk.status}
                          </span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {/* Broadcast Button */}
                            <button 
                              title="Broadcast Job to Freelancers"
                              onClick={() => handleBroadcastBooking(bk.id)}
                              style={{ background: '#FFF8E6', border: '1px solid #F9B233', color: '#B78103', borderRadius: 6, padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <Radio size={12} /> Broadcast
                            </button>

                            {/* Direct Assign Button */}
                            <button 
                              title="Assign Caregiver"
                              onClick={() => setAssigningBooking(bk)}
                              style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#0B5D3B', borderRadius: 6, padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <UserPlus size={12} /> Assign
                            </button>

                            <button 
                              onClick={() => setOpenBookingActionId(openBookingActionId === bk.id ? null : bk.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                            >
                              <MoreVertical size={16} color="#6B7C72" />
                            </button>
                          </div>

                          {openBookingActionId === bk.id && (
                            <div style={{ position: 'absolute', right: 20, top: 38, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                              <button 
                                onClick={async () => {
                                  if (window.confirm('Delete this booking?')) {
                                    await fetch(`${API_BASE_URL}/api/v1/bookings/${bk.id}`, { method: 'DELETE' });
                                    setOpenBookingActionId(null);
                                    fetchData();
                                  }
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#C62828' }}
                              >
                                Delete Booking
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. OVERVIEW & ANALYTICS (FIXED ALIGNMENT & CHART SIZING)                   */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div>
              {/* Banner */}
              <div className="overview-welcome-banner">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0B5D3B' }}>Good Evening, Raju! 👋</h2>
                  <p style={{ fontSize: '14px', color: '#6B7C72', marginTop: 4 }}>
                    Here's how Thodu is caring for our elders and special members today.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF', padding: '8px 16px', borderRadius: '12px', border: '1px solid #F5E6BE', fontSize: '13px', fontWeight: 600, color: '#0B5D3B' }}>
                  <Calendar size={16} />
                  <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' })}</span>
                </div>
              </div>

              {/* 6 Top Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{beneficiaries.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +8.4% vs last month</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Active Caregivers</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{caregivers.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.1%</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Bookings (This Month)</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{bookings.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +18.7%</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Services Completed</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{bookings.filter(b => b.status === 'Completed').length}</h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>96.8% completion</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Revenue (This Month)</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>₹{analytics?.revenueInr ?? 0}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +26.3%</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Sponsored Services</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{bookings.filter(b => b.fundingType !== 'Family Paid').length}</h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>(₹{analytics?.sponsoredValueInr ?? 0} value)</span>
                </div>
              </div>

              {/* Middle Row with properly bounded chart container */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1fr', gap: 18, marginBottom: 24 }}>
                {/* Bookings Trend Chart without overflow bars */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24' }}>Bookings Trend</h3>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Last 6 Months</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', borderBottom: '1px solid #E5E9E6', paddingBottom: 10 }}>
                    {[
                      { m: 'Jun', b: 40, c: 35 },
                      { m: 'Jul', b: 55, c: 50 },
                      { m: 'Aug', b: 70, c: 65 },
                      { m: 'Sep', b: 85, c: 80 },
                      { m: 'Oct', b: 100, c: 92 },
                      { m: 'Nov', b: 120, c: 110 }
                    ].map(item => (
                      <div key={item.m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: '100px' }}>
                          <div style={{ width: 12, height: `${item.b}px`, background: '#0B5D3B', borderRadius: '3px 3px 0 0' }} />
                          <div style={{ width: 12, height: `${item.c}px`, background: '#81C784', borderRadius: '3px 3px 0 0' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#6B7C72' }}>{item.m}</span>
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

                {/* Service Distribution Donut */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>
                    Service Distribution
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'conic-gradient(#4CAF50 0% 32%, #FF9800 32% 52%, #9C27B0 52% 68%, #00BCD4 68% 82%, #3F51B5 82% 92%, #E91E63 92% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800 }}>4</span>
                        <span style={{ fontSize: '9px', color: '#6B7C72' }}>Services</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, fontSize: '11px' }}>
                      <div><strong style={{ color: '#4CAF50' }}>●</strong> Household Support: 32%</div>
                      <div><strong style={{ color: '#FF9800' }}>●</strong> Companionship: 20%</div>
                      <div><strong style={{ color: '#9C27B0' }}>●</strong> Medication: 16%</div>
                      <div><strong style={{ color: '#00BCD4' }}>●</strong> Disability Aid: 14%</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>
                    Quick Actions
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div className="action-tile-btn" onClick={() => setActiveSection('bookings')}>
                      <Calendar size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>Bookings</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setActiveSection('beneficiaries')}>
                      <Users size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>Beneficiary</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setActiveSection('workforce')}>
                      <ShieldCheck size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>Caregiver</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER SECTIONS */}
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorships.map(sp => (
                    <tr key={sp.id}>
                      <td><strong>{sp.applicationRef}</strong></td>
                      <td>{sp.beneficiaryName}</td>
                      <td>{sp.programme}</td>
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
      {/* MODAL: DIRECT ASSIGN CAREGIVER MODAL                                      */}
      {/* ========================================================================= */}
      {assigningBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 440, width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>
                Assign Caregiver to {assigningBooking.bookingNumber}
              </h3>
              <button onClick={() => setAssigningBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 16 }}>
              Select an available caregiver for {assigningBooking.beneficiaryName} ({assigningBooking.serviceName})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {caregivers.map(cg => (
                <div 
                  key={cg.id} 
                  onClick={() => handleAssignCaregiver(assigningBooking.id, cg.fullName)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', cursor: 'pointer', background: '#FAFBF9' }}
                >
                  <div>
                    <strong>{cg.fullName}</strong>
                    <div style={{ fontSize: '11px', color: '#6B7C72' }}>{cg.employmentType} • ★ {cg.rating}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>Assign →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CAREGIVER */}
      {showAddCaregiverModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 480, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Add Caregiver to Roster</h3>
              <button onClick={() => setShowAddCaregiverModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await fetch(`${API_BASE_URL}/api/v1/caregivers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCgForm)
              });
              setShowAddCaregiverModal(false);
              fetchData();
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                <input required value={newCgForm.fullName} onChange={e => setNewCgForm({...newCgForm, fullName: e.target.value})} placeholder="e.g. Radhika S." style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Employment Type</label>
                  <select value={newCgForm.employmentType} onChange={e => setNewCgForm({...newCgForm, employmentType: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Salaried">Salaried Staff</option>
                    <option value="Freelance / Gig">Freelance / Gig</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                  <input required value={newCgForm.phone} onChange={e => setNewCgForm({...newCgForm, phone: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service Zone</label>
                <input value={newCgForm.zone} onChange={e => setNewCgForm({...newCgForm, zone: e.target.value})} placeholder="Tirupati Urban" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Confirm Add Caregiver
              </button>
            </form>
          </div>
        </div>
      )}
    
      {/* MODAL 1: CREATE / EDIT CARE BOOKING */}
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

      {/* MODAL 3: REGISTER NEW BENEFICIARY */}
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

      {/* MODAL 4: BENEFICIARY PROFILE DETAILS */}
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

            {/* MODAL: CAREGIVER DETAIL PROFILE */}
      {selectedCaregiverDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 500, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Profile</h3>
              <button onClick={() => setSelectedCaregiverDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#0B5D3B' }}>
                {selectedCaregiverDetail.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{selectedCaregiverDetail.fullName}</h4>
                <p style={{ fontSize: '12px', color: '#6B7C72' }}>{selectedCaregiverDetail.staffId} • {selectedCaregiverDetail.employmentType}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '13px', background: '#FAFBF9', padding: 16, borderRadius: 12, border: '1px solid #E5E9E6' }}>
              <div><strong>Rating:</strong> ★ {selectedCaregiverDetail.rating} ({selectedCaregiverDetail.reviewCount || 120} reviews)</div>
              <div><strong>Service Zone:</strong> {selectedCaregiverDetail.zone}</div>
              <div><strong>Phone Contact:</strong> {selectedCaregiverDetail.phone}</div>
              <div><strong>Availability Status:</strong> <span className="badge badge-success">{selectedCaregiverDetail.availability}</span></div>
              <div><strong>Verification:</strong> <span className="badge badge-success">✓ Background Verified</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}