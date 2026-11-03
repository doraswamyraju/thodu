import React, { useState } from 'react';
import { 
  Heart, Home, Calendar, Users, HelpCircle, User, AlertCircle, 
  ChevronRight, Phone, MapPin, Clock, ShieldCheck, CheckCircle2,
  Plus, ArrowLeft, Bell, Search, Star, FileText
} from 'lucide-react';
import './style.css';

// Screen Types matching exact 22-screen flow
type Screen = 
  | 'splash' 
  | 'login' 
  | 'workspace_select' 
  | 'family_dashboard' 
  | 'beneficiaries' 
  | 'beneficiary_detail' 
  | 'services' 
  | 'service_detail' 
  | 'booking_step1' 
  | 'booking_step2' 
  | 'booking_step3_funding' 
  | 'booking_step4_confirm' 
  | 'my_bookings' 
  | 'booking_detail' 
  | 'care_team' 
  | 'payments' 
  | 'sponsorship_apply' 
  | 'sponsorship_status' 
  | 'notifications' 
  | 'sos_emergency' 
  | 'help_support' 
  | 'profile_settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFunding, setSelectedFunding] = useState<'self' | 'trust' | 'donor' | 'split'>('self');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Top Bar for Interior Screens
  const renderHeader = (title: string, backTo?: Screen) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {backTo && (
          <button 
            onClick={() => setCurrentScreen(backTo)} 
            style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ArrowLeft size={18} color="#0B5D3B" />
          </button>
        )}
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0B5D3B' }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setCurrentScreen('notifications')} 
          style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Bell size={18} color="#0B5D3B" />
        </button>
      </div>
    </div>
  );

  // Bottom Navigation
  const showBottomNav = [
    'family_dashboard', 'beneficiaries', 'my_bookings', 'care_team', 'help_support', 'profile_settings'
  ].includes(currentScreen);

  return (
    <div className="app-viewport">
      {/* iOS/Android Status Bar */}
      <div className="status-bar">
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', background: '#0B5D3B', color: '#FFF', padding: '2px 6px', borderRadius: '4px' }}>LIVE 5089</span>
          <span>●●●</span>
        </div>
      </div>

      <div className="screen-content">
        {/* 1. SPLASH SCREEN */}
        {currentScreen === 'splash' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', textAlign: 'center', padding: '20px 0' }}>
            <div style={{ marginTop: '40px' }}>
              <div style={{ width: 90, height: 90, margin: '0 auto', background: '#FFF', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(11,93,59,0.1)' }}>
                <Heart size={48} color="#0B5D3B" fill="#F9B233" />
              </div>
              <h1 style={{ color: '#0B5D3B', fontSize: '32px', fontWeight: 700, marginTop: '16px' }}>Thodu</h1>
              <p style={{ color: '#6B7C72', fontSize: '13px', fontWeight: 500, letterSpacing: '1px' }}>ELDER CARE SERVICES</p>
              <p style={{ color: '#D81B60', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>Always By Your Side</p>
            </div>

            <div style={{ background: '#FFF', borderRadius: '28px', padding: '28px 20px', border: '1px solid #E5E9E6' }}>
              <h2 style={{ fontSize: '20px', color: '#0B5D3B', fontWeight: 700 }}>Care Today,</h2>
              <h2 style={{ fontSize: '20px', color: '#F9B233', fontWeight: 700, marginBottom: '12px' }}>Comfort Always.</h2>
              <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '24px' }}>
                Compassionate elder care and assisted living support by Sri Divyang Seva Kendram Trust.
              </p>
              <button className="btn-primary" onClick={() => setCurrentScreen('login')}>
                Get Started →
              </button>
            </div>
          </div>
        )}

        {/* 2. LOGIN (Email/Password, No OTP) */}
        {currentScreen === 'login' && (
          <div>
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <h1 style={{ color: '#0B5D3B', fontSize: '26px', fontWeight: 700 }}>Thodu</h1>
              <p style={{ color: '#6B7C72', fontSize: '13px' }}>Elder Care Services</p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '18px', color: '#0B5D3B', fontWeight: 600, marginBottom: '6px' }}>Welcome Back</h3>
              <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '20px' }}>Sign in with email and password to access your role workspace.</p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  placeholder="anita@thodu.org" 
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E5E9E6', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  placeholder="••••••••" 
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E5E9E6', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button className="btn-primary" onClick={() => setCurrentScreen('workspace_select')}>
                Sign In
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#6B7C72' }}>Quick demo accounts:</span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                  <button onClick={() => { setEmail('anita@thodu.org'); setCurrentScreen('workspace_select'); }} style={{ fontSize: '11px', background: '#E8F5E9', border: 'none', padding: '4px 8px', borderRadius: '6px', color: '#0B5D3B', cursor: 'pointer' }}>Family User</button>
                  <button onClick={() => { setEmail('admin@thodu.org'); setCurrentScreen('workspace_select'); }} style={{ fontSize: '11px', background: '#FFF3E0', border: 'none', padding: '4px 8px', borderRadius: '6px', color: '#E65100', cursor: 'pointer' }}>Trust Admin</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. WORKSPACE SELECTION (Role Chooser) */}
        {currentScreen === 'workspace_select' && (
          <div>
            <div style={{ textAlign: 'center', margin: '20px 0 24px 0' }}>
              <h2 style={{ color: '#0B5D3B', fontSize: '20px', fontWeight: 700 }}>Select Your Workspace</h2>
              <p style={{ color: '#6B7C72', fontSize: '13px' }}>You have access to multiple roles. Choose one to continue.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div 
                onClick={() => setCurrentScreen('family_dashboard')} 
                className="card" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid #0B5D3B' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#0B5D3B', fontWeight: 600 }}>Family Member / Guardian</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Manage care for your loved ones</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>

              <div 
                onClick={() => setCurrentScreen('care_team')} 
                className="card" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid #F9B233' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} color="#F9B233" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#1E2D24', fontWeight: 600 }}>Caregiver</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>View assigned visits and tasks</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>

              <div 
                onClick={() => setCurrentScreen('my_bookings')} 
                className="card" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid #D81B60' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FCE4EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} color="#D81B60" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#1E2D24', fontWeight: 600 }}>Trust Staff</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Operational support & coordination</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>

              <div 
                onClick={() => setCurrentScreen('family_dashboard')} 
                className="card" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid #2E7D32' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={22} color="#2E7D32" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: '#1E2D24', fontWeight: 600 }}>Trust Administrator</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Full system access & settings</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>
            </div>
          </div>
        )}

        {/* 4. FAMILY DASHBOARD */}
        {currentScreen === 'family_dashboard' && (
          <div>
            {/* Header Greeting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#6B7C72' }}>Good Morning,</p>
                <h3 style={{ fontSize: '18px', color: '#0B5D3B', fontWeight: 700 }}>Anita Sharma</h3>
                <span className="badge badge-success">Family Member</span>
              </div>
              <button 
                onClick={() => setCurrentScreen('sos_emergency')} 
                style={{ background: '#C62828', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <AlertCircle size={16} /> SOS
              </button>
            </div>

            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg, #0B5D3B 0%, #19643E 100%)', borderRadius: '20px', padding: '18px', color: '#FFF', marginBottom: '18px' }}>
              <p style={{ fontSize: '15px', fontWeight: 600 }}>Better Care.</p>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#F9B233', marginBottom: '8px' }}>Brighter Tomorrows.</p>
              <p style={{ fontSize: '12px', opacity: 0.9 }}>Sri Divyang Seva Kendram Trust is always available for your care needs.</p>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <div onClick={() => setCurrentScreen('beneficiaries')} className="card" style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <h3 style={{ color: '#0B5D3B', fontSize: '18px', fontWeight: 700 }}>2</h3>
                <p style={{ fontSize: '11px', color: '#6B7C72' }}>Beneficiaries</p>
              </div>
              <div onClick={() => setCurrentScreen('my_bookings')} className="card" style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <h3 style={{ color: '#F9B233', fontSize: '18px', fontWeight: 700 }}>3</h3>
                <p style={{ fontSize: '11px', color: '#6B7C72' }}>Upcoming Visits</p>
              </div>
              <div onClick={() => setCurrentScreen('sponsorship_status')} className="card" style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <h3 style={{ color: '#D81B60', fontSize: '18px', fontWeight: 700 }}>1</h3>
                <p style={{ fontSize: '11px', color: '#6B7C72' }}>Active Request</p>
              </div>
            </div>

            {/* Quick Actions (6 Tiles) */}
            <h4 style={{ fontSize: '15px', color: '#0B5D3B', fontWeight: 600, marginBottom: '12px' }}>Quick Actions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div onClick={() => setCurrentScreen('services')} className="card" style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <Home size={22} color="#0B5D3B" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E2D24' }}>Book Service</span>
              </div>
              <div onClick={() => setCurrentScreen('my_bookings')} className="card" style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <Calendar size={22} color="#0B5D3B" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E2D24' }}>My Bookings</span>
              </div>
              <div onClick={() => setCurrentScreen('care_team')} className="card" style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <Users size={22} color="#0B5D3B" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E2D24' }}>Care Team</span>
              </div>
              <div onClick={() => setCurrentScreen('payments')} className="card" style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <FileText size={22} color="#0B5D3B" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E2D24' }}>Payments</span>
              </div>
              <div onClick={() => setCurrentScreen('help_support')} className="card" style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', margin: 0 }}>
                <HelpCircle size={22} color="#0B5D3B" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#1E2D24' }}>Support</span>
              </div>
              <div onClick={() => setCurrentScreen('sos_emergency')} className="card" style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', margin: 0, background: '#FFF5F5' }}>
                <AlertCircle size={22} color="#C62828" style={{ margin: '0 auto 6px auto' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#C62828' }}>SOS</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. BENEFICIARIES LIST */}
        {currentScreen === 'beneficiaries' && (
          <div>
            {renderHeader('My Beneficiaries', 'family_dashboard')}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div onClick={() => setCurrentScreen('beneficiary_detail')} className="card" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0B5D3B' }}>
                    SG
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Saraswathi Garu</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>68 years • Senior Citizen (Mother)</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>

              <div onClick={() => setCurrentScreen('beneficiary_detail')} className="card" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#E65100' }}>
                    LN
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Lakshmi Narasimha Rao</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>72 years • Senior Citizen (Father)</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>

              <div onClick={() => setCurrentScreen('beneficiary_detail')} className="card" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EDE7F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#512DA8' }}>
                    RG
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Raghav</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>28 years • Person with Disability</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#6B7C72" />
              </div>

              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <Plus size={16} /> Add Beneficiary
              </button>
            </div>
          </div>
        )}

        {/* 6. BENEFICIARY PROFILE */}
        {currentScreen === 'beneficiary_detail' && (
          <div>
            {renderHeader('Beneficiary Profile', 'beneficiaries')}

            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#E8F5E9', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#0B5D3B' }}>
                SG
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Saraswathi Garu</h3>
              <p style={{ fontSize: '13px', color: '#6B7C72' }}>68 years • Senior Citizen</p>
            </div>

            <div className="card">
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#6B7C72', textTransform: 'uppercase', fontWeight: 600 }}>Relationship</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24', marginTop: '2px' }}>Mother</p>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#6B7C72', textTransform: 'uppercase', fontWeight: 600 }}>Primary Contact</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24', marginTop: '2px' }}>Anita Sharma (+91 98765 43210)</p>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#6B7C72', textTransform: 'uppercase', fontWeight: 600 }}>Address</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24', marginTop: '2px' }}>Home - T.T.D. Colony, Tirupati</p>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7C72', textTransform: 'uppercase', fontWeight: 600 }}>Accessibility Needs</span>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24', marginTop: '2px' }}>Walking support, large print medicine labels, gentle assistance.</p>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setCurrentScreen('services')}>
              Book Care for Saraswathi Garu
            </button>
          </div>
        )}

        {/* 7. SERVICES CATALOG */}
        {currentScreen === 'services' && (
          <div>
            {renderHeader('Services', 'family_dashboard')}

            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={18} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
              <input 
                placeholder="Search care services..." 
                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '14px', border: '1px solid #E5E9E6', background: '#FFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div onClick={() => setCurrentScreen('service_detail')} className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#E8F5E9', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={22} color="#0B5D3B" />
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E2D24' }}>Household Support</h4>
                <p style={{ fontSize: '11px', color: '#6B7C72', marginTop: '4px' }}>From ₹300/visit</p>
              </div>

              <div onClick={() => setCurrentScreen('service_detail')} className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#FFF3E0', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={22} color="#E65100" />
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E2D24' }}>Cooking Assistance</h4>
                <p style={{ fontSize: '11px', color: '#6B7C72', marginTop: '4px' }}>From ₹450/visit</p>
              </div>

              <div onClick={() => setCurrentScreen('service_detail')} className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#F3E5F5', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color="#7B1FA2" />
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E2D24' }}>Medication Reminders</h4>
                <p style={{ fontSize: '11px', color: '#6B7C72', marginTop: '4px' }}>Daily or weekly</p>
              </div>

              <div onClick={() => setCurrentScreen('service_detail')} className="card" style={{ cursor: 'pointer', textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#EDE7F6', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} color="#512DA8" />
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E2D24' }}>Disability Support</h4>
                <p style={{ fontSize: '11px', color: '#6B7C72', marginTop: '4px' }}>Assisted living</p>
              </div>
            </div>
          </div>
        )}

        {/* 8. SERVICE DETAIL */}
        {currentScreen === 'service_detail' && (
          <div>
            {renderHeader('Service Details', 'services')}

            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Household Support</h3>
              <p style={{ fontSize: '13px', color: '#6B7C72', margin: '6px 0 16px 0' }}>
                Light housekeeping, laundry, home organization and daily household tasks tailored for seniors.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', borderBottom: '1px solid #E5E9E6', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>Duration</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>1 - 3 hours</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>Starting from</span>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0B5D3B' }}>₹300 / visit</p>
                </div>
              </div>

              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1E2D24', marginBottom: '8px' }}>What's Included</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1E2D24' }}>
                  <CheckCircle2 size={16} color="#0B5D3B" /> Light housekeeping & tidying
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1E2D24' }}>
                  <CheckCircle2 size={16} color="#0B5D3B" /> Laundry and folding
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1E2D24' }}>
                  <CheckCircle2 size={16} color="#0B5D3B" /> Home organization & mobility clearance
                </li>
              </ul>
            </div>

            <button className="btn-primary" onClick={() => setCurrentScreen('booking_step1')}>
              Book This Service
            </button>
          </div>
        )}

        {/* 9. MULTI-STEP BOOKING (Step 1: Beneficiary & Address) */}
        {currentScreen === 'booking_step1' && (
          <div>
            {renderHeader('Book Service (1/3)', 'service_detail')}

            <div className="card">
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Select Beneficiary</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E9E6', background: '#FFF', fontSize: '14px', marginBottom: '16px' }}>
                <option>Saraswathi Garu (Mother, 68 yrs)</option>
                <option>Lakshmi Narasimha Rao (Father, 72 yrs)</option>
                <option>Raghav (Son, 28 yrs)</option>
              </select>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Service Address</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E9E6', background: '#FFF', fontSize: '14px', marginBottom: '16px' }}>
                <option>Home - T.T.D. Colony, Tirupati</option>
              </select>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Date & Time</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input type="text" defaultValue="10 Mar 2026" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E9E6', fontSize: '14px' }} />
                <input type="text" defaultValue="10:00 AM - 12:00 PM" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E9E6', fontSize: '14px' }} />
              </div>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#1E2D24', display: 'block', marginBottom: '6px' }}>Special Instructions (Optional)</label>
              <textarea 
                defaultValue="Please be gentle. She has knee pain."
                rows={3} 
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E9E6', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <button className="btn-primary" onClick={() => setCurrentScreen('booking_step3_funding')}>
              Next → Choose Funding
            </button>
          </div>
        )}

        {/* 10. MULTI-STEP BOOKING (Step 2: Funding Selection) */}
        {currentScreen === 'booking_step3_funding' && (
          <div>
            {renderHeader('Funding Option (2/3)', 'booking_step1')}

            <div className="card" style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>Total Service Charge</span>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0B5D3B' }}>₹600</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div 
                onClick={() => setSelectedFunding('self')}
                className="card" 
                style={{ cursor: 'pointer', margin: 0, border: selectedFunding === 'self' ? '2px solid #0B5D3B' : '1px solid #E5E9E6' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Self-Funded</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>You pay the full amount (₹600).</p>
                  </div>
                  <input type="radio" checked={selectedFunding === 'self'} readOnly />
                </div>
              </div>

              <div 
                onClick={() => setSelectedFunding('trust')}
                className="card" 
                style={{ cursor: 'pointer', margin: 0, border: selectedFunding === 'trust' ? '2px solid #0B5D3B' : '1px solid #E5E9E6' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Trust Sponsored</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Subsidized by Sri Divyang Seva Kendram Trust.</p>
                  </div>
                  <input type="radio" checked={selectedFunding === 'trust'} readOnly />
                </div>
              </div>

              <div 
                onClick={() => setSelectedFunding('donor')}
                className="card" 
                style={{ cursor: 'pointer', margin: 0, border: selectedFunding === 'donor' ? '2px solid #0B5D3B' : '1px solid #E5E9E6' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Donor Sponsored</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Funded by approved donor contribution.</p>
                  </div>
                  <input type="radio" checked={selectedFunding === 'donor'} readOnly />
                </div>
              </div>

              <div 
                onClick={() => setSelectedFunding('split')}
                className="card" 
                style={{ cursor: 'pointer', margin: 0, border: selectedFunding === 'split' ? '2px solid #0B5D3B' : '1px solid #E5E9E6' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Split Funding</h4>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>You pay 50% (₹300), Trust pays 50% (₹300).</p>
                  </div>
                  <input type="radio" checked={selectedFunding === 'split'} readOnly />
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setCurrentScreen('booking_step4_confirm')}>
              Continue → Review Booking
            </button>
          </div>
        )}

        {/* 11. CONFIRM BOOKING */}
        {currentScreen === 'booking_step4_confirm' && (
          <div>
            {renderHeader('Confirm Booking (3/3)', 'booking_step3_funding')}

            <div className="card">
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B', marginBottom: '8px' }}>Household Support</h4>
              <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '14px' }}>10 Mar 2026 • 10:00 AM - 12:00 PM</p>
              <p style={{ fontSize: '13px', color: '#1E2D24', marginBottom: '14px' }}><strong>Beneficiary:</strong> Saraswathi Garu</p>
              <p style={{ fontSize: '13px', color: '#1E2D24', marginBottom: '14px' }}><strong>Address:</strong> Home - T.T.D. Colony, Tirupati</p>

              <div style={{ borderTop: '1px solid #E5E9E6', paddingTop: '14px', marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#6B7C72' }}>
                  <span>Service Charge</span>
                  <span>₹600</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#2E7D32' }}>
                  <span>Funding / Subsidy</span>
                  <span>{selectedFunding === 'trust' ? '-₹600 (100% Trust)' : selectedFunding === 'split' ? '-₹300 (50% Trust)' : '₹0'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#0B5D3B', borderTop: '1px solid #E5E9E6', paddingTop: '8px' }}>
                  <span>You Pay</span>
                  <span>{selectedFunding === 'trust' ? '₹0' : selectedFunding === 'split' ? '₹300' : '₹600'}</span>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => {
                setBookingSuccess(true);
                setCurrentScreen('my_bookings');
              }}
            >
              Confirm Booking
            </button>
          </div>
        )}

        {/* 12. MY BOOKINGS */}
        {currentScreen === 'my_bookings' && (
          <div>
            {renderHeader('My Bookings', 'family_dashboard')}

            {bookingSuccess && (
              <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '12px 14px', borderRadius: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#2E7D32" />
                <span style={{ fontSize: '13px', color: '#1E2D24', fontWeight: 600 }}>Booking confirmed successfully!</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span className="badge badge-success" style={{ cursor: 'pointer' }}>Upcoming (2)</span>
              <span className="badge" style={{ background: '#FFF', border: '1px solid #E5E9E6', cursor: 'pointer' }}>Completed</span>
              <span className="badge" style={{ background: '#FFF', border: '1px solid #E5E9E6', cursor: 'pointer' }}>Cancelled</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div onClick={() => setCurrentScreen('booking_detail')} className="card" style={{ cursor: 'pointer', margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0B5D3B' }}>Household Support</h4>
                  <span className="badge badge-success">Confirmed</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B7C72' }}>10 Mar 2026 • 10:00 AM - 12:00 PM</p>
                <p style={{ fontSize: '12px', color: '#1E2D24', marginTop: '4px' }}>Home - T.T.D. Colony, Tirupati</p>
              </div>

              <div onClick={() => setCurrentScreen('booking_detail')} className="card" style={{ cursor: 'pointer', margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0B5D3B' }}>Cooking Assistance</h4>
                  <span className="badge badge-warning">Pending</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6B7C72' }}>12 Mar 2026 • 11:00 AM - 1:00 PM</p>
                <p style={{ fontSize: '12px', color: '#1E2D24', marginTop: '4px' }}>Home - T.T.D. Colony, Tirupati</p>
              </div>
            </div>
          </div>
        )}

        {/* 13. BOOKING DETAIL */}
        {currentScreen === 'booking_detail' && (
          <div>
            {renderHeader('Booking Details', 'my_bookings')}

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Household Support</h4>
                <span className="badge badge-success">Confirmed</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7C72' }}>10 Mar 2026 • 10:00 AM - 12:00 PM</p>
              <p style={{ fontSize: '13px', color: '#1E2D24', marginTop: '6px' }}>Home - T.T.D. Colony, Tirupati</p>
            </div>

            <div className="card">
              <span style={{ fontSize: '11px', color: '#6B7C72', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Caregiver</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0B5D3B' }}>
                    AN
                  </div>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Anitha</h5>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Verified Caregiver • ★ 4.8</p>
                  </div>
                </div>
                <button style={{ background: '#0B5D3B', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Phone size={16} color="#FFF" />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" style={{ flex: 1 }}>Reschedule</button>
              <button className="btn-secondary" style={{ flex: 1, color: '#C62828', borderColor: '#C62828' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* 14. SOS EMERGENCY SCREEN */}
        {currentScreen === 'sos_emergency' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ color: '#C62828', fontSize: '22px', fontWeight: 800 }}>SOS Emergency</h2>
            <p style={{ color: '#6B7C72', fontSize: '13px', marginBottom: '24px' }}>Sri Divyang Seva Kendram Trust Rapid Responder System</p>

            <div 
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #D32F2F 0%, #B71C1C 100%)',
                color: '#FFF',
                margin: '0 auto 28px auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(198, 40, 40, 0.4)',
                cursor: 'pointer'
              }}
              onClick={() => alert('SOS Triggered! Sri Divyang Seva Kendram Trust responders and emergency contacts notified.')}
            >
              <AlertCircle size={48} color="#FFF" />
              <span style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>SOS</span>
              <span style={{ fontSize: '11px', opacity: 0.9 }}>TAP TO ALERT</span>
            </div>

            <div className="card" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24', marginBottom: '8px' }}>Emergency Contacts to be Notified</h4>
              <p style={{ fontSize: '13px', color: '#1E2D24', marginBottom: '4px' }}>• Anita Sharma: +91 98765 43210</p>
              <p style={{ fontSize: '13px', color: '#1E2D24' }}>• Trust Local Support Desk: +91 94444 56789</p>
            </div>

            <button className="btn-secondary" onClick={() => setCurrentScreen('family_dashboard')}>
              Cancel / Back to Safety
            </button>
          </div>
        )}

        {/* 15. CARE TEAM */}
        {currentScreen === 'care_team' && (
          <div>
            {renderHeader('Care Team', 'family_dashboard')}

            <div className="card">
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>Assigned Caregiver</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>
                  AN
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2D24' }}>Anitha</h4>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Verified Caregiver • ★ 4.8</p>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#6B7C72', margin: '14px 0' }}>
                Professional caregiver with 5 years experience in elder companionship, mobility assistance and diabetic diet monitoring.
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: '#F5F5F5' }}>Household</span>
                <span className="badge" style={{ background: '#F5F5F5' }}>Cooking</span>
                <span className="badge" style={{ background: '#F5F5F5' }}>Companionship</span>
              </div>
            </div>
          </div>
        )}

        {/* 16. SPONSORSHIP STATUS */}
        {currentScreen === 'sponsorship_status' && (
          <div>
            {renderHeader('Sponsorship Status', 'family_dashboard')}

            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF3E0', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={28} color="#E65100" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2D24' }}>Application Under Review</h3>
              <p style={{ fontSize: '12px', color: '#6B7C72', marginTop: '4px' }}>Submitted on 5 Mar 2026</p>
            </div>

            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <CheckCircle2 size={18} color="#2E7D32" />
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Application Submitted</h5>
                    <p style={{ fontSize: '11px', color: '#6B7C72' }}>Initial care request registered</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={18} color="#E65100" />
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Document Verification</h5>
                    <p style={{ fontSize: '11px', color: '#6B7C72' }}>Trust staff reviewing income proof</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', opacity: 0.5 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #6B7C72' }} />
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Approval Decision</h5>
                    <p style={{ fontSize: '11px', color: '#6B7C72' }}>Subsidy allocation & confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 17. PAYMENTS */}
        {currentScreen === 'payments' && (
          <div>
            {renderHeader('Payments & Receipts', 'family_dashboard')}

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1E2D24' }}>Household Support</h4>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>10 Mar 2026</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0B5D3B' }}>₹600</h4>
                  <span className="badge badge-success">Paid</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 18. HELP & SUPPORT */}
        {currentScreen === 'help_support' && (
          <div>
            {renderHeader('Help & Support', 'family_dashboard')}

            <div className="card">
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0B5D3B', marginBottom: '12px' }}>Contact Trust Desk</h4>
              <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '14px' }}>
                For inquiries, volunteer assistance, or questions about care sponsorship:
              </p>
              <p style={{ fontSize: '13px', color: '#1E2D24', marginBottom: '8px' }}><strong>Helpline:</strong> +91 94444 56789</p>
              <p style={{ fontSize: '13px', color: '#1E2D24' }}><strong>Email:</strong> support@thodu.sriddha.com</p>
            </div>
          </div>
        )}

        {/* 19. PROFILE & SETTINGS */}
        {currentScreen === 'profile_settings' && (
          <div>
            {renderHeader('Profile & Settings', 'family_dashboard')}

            <div className="card" style={{ textAlign: 'center', padding: '20px 14px' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#E8F5E9', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>
                AS
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E2D24' }}>Anita Sharma</h3>
              <p style={{ fontSize: '12px', color: '#6B7C72' }}>+91 98765 43210</p>
              <span className="badge badge-success" style={{ marginTop: '6px' }}>Verified Guardian</span>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div onClick={() => setCurrentScreen('workspace_select')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Switch Role Workspace</span>
                <ChevronRight size={18} color="#6B7C72" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Language: English / Telugu</span>
                <ChevronRight size={18} color="#6B7C72" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Accessibility (High Contrast, Large Font)</span>
                <ChevronRight size={18} color="#6B7C72" />
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', color: '#C62828', borderColor: '#C62828' }} onClick={() => setCurrentScreen('login')}>
              Log Out
            </button>
          </div>
        )}

        {/* 20. NOTIFICATIONS */}
        {currentScreen === 'notifications' && (
          <div>
            {renderHeader('Notifications', 'family_dashboard')}

            <div className="card">
              <div style={{ display: 'flex', gap: '10px' }}>
                <CheckCircle2 size={18} color="#2E7D32" />
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Booking Confirmed</h5>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Household Support scheduled for 10 Mar 2026, 10:00 AM.</p>
                  <span style={{ fontSize: '10px', color: '#8A9990' }}>10 mins ago</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} color="#E65100" />
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Sponsorship Update</h5>
                  <p style={{ fontSize: '12px', color: '#6B7C72' }}>Your Elder Care Support application is under review.</p>
                  <span style={{ fontSize: '10px', color: '#8A9990' }}>Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Navigation for main tabs */}
      {showBottomNav && (
        <div className="bottom-nav">
          <button 
            className={`nav-item ${currentScreen === 'family_dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('family_dashboard')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <button 
            className={`nav-item ${currentScreen === 'my_bookings' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('my_bookings')}
          >
            <Calendar size={20} />
            <span>Bookings</span>
          </button>
          <button 
            className={`nav-item ${currentScreen === 'care_team' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('care_team')}
          >
            <Users size={20} />
            <span>Care Team</span>
          </button>
          <button 
            className={`nav-item ${currentScreen === 'help_support' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('help_support')}
          >
            <HelpCircle size={20} />
            <span>Support</span>
          </button>
          <button 
            className={`nav-item ${currentScreen === 'profile_settings' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('profile_settings')}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}
