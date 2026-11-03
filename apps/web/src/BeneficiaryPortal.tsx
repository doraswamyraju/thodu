import React, { useState } from 'react';
import {
  Calendar, Clock, Heart, AlertTriangle, ShieldCheck, User, Phone, 
  MapPin, CheckCircle2, ChevronRight, FileText, ArrowRight,
  Plus, Check, RefreshCw, X, Shield, Activity
} from 'lucide-react';

interface BeneficiaryPortalProps {
  beneficiaries: any[];
  bookings: any[];
  caregivers: any[];
  onRefresh: () => void;
  onBookCare: (bookingData: any) => Promise<void>;
  onTriggerSos: (beneficiaryId: string, notes: string) => Promise<void>;
  onSwitchToAdmin: () => void;
}

export const BeneficiaryPortal: React.FC<BeneficiaryPortalProps> = ({
  beneficiaries,
  bookings,
  caregivers,
  onRefresh,
  onBookCare,
  onTriggerSos,
  onSwitchToAdmin
}) => {
  // Select active beneficiary from enrolled family members
  const [selectedBenId, setSelectedBenId] = useState<string>(() => {
    return beneficiaries[0]?.id || 'ben-1';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'health' | 'subsidy'>('home');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [sosSentSuccess, setSosSentSuccess] = useState(false);
  const [sosNotes, setSosNotes] = useState('Immediate caregiver or medical assistance requested by family.');

  // Booking Form State
  const [bookingService, setBookingService] = useState('Household Support');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [bookingFunding, setBookingFunding] = useState<'SELF' | 'SUBSIDY'>('SUBSIDY');
  const [bookingSpecialNotes, setBookingSpecialNotes] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const activeBen = beneficiaries.find(b => b.id === selectedBenId) || beneficiaries[0] || {};
  
  // Bookings for this active beneficiary
  const benBookings = bookings.filter(b => 
    b.beneficiaryId === activeBen.id || 
    (b.beneficiaryName && activeBen.fullName && b.beneficiaryName.toLowerCase() === activeBen.fullName.toLowerCase())
  );

  const activeVisit = benBookings.find(b => b.status === 'In Progress' || b.status === 'Confirmed' || b.status === 'Scheduled');
  const completedVisits = benBookings.filter(b => b.status === 'Completed');

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);
    try {
      const isSubsidized = bookingFunding === 'SUBSIDY';
      const baseFeePaise = bookingService.includes('Physio') ? 60000 : 45000;
      await onBookCare({
        beneficiaryName: activeBen.fullName,
        serviceName: bookingService,
        scheduledDate: bookingDate,
        scheduledTimeSlot: bookingTimeSlot,
        serviceAddress: activeBen.address || 'Tirupati',
        fundingType: isSubsidized ? 'Trust Sponsored' : 'Family Paid',
        totalAmountPaise: baseFeePaise,
        subsidyAmountPaise: isSubsidized ? baseFeePaise : 0,
        familyPayablePaise: isSubsidized ? 0 : baseFeePaise,
        paymentMode: isSubsidized ? 'TRUST_GRANT' : 'ONLINE_UPI',
        paymentStatus: isSubsidized ? 'SUBSIDIZED' : 'PAID',
        specialNotes: bookingSpecialNotes
      });
      setShowBookingModal(false);
      setBookingSpecialNotes('');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleConfirmSos = async () => {
    setSosSending(true);
    try {
      await onTriggerSos(activeBen.id, sosNotes);
      setSosSentSuccess(true);
      setTimeout(() => {
        setSosSentSuccess(false);
        setShowSosModal(false);
      }, 2500);
    } finally {
      setSosSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7F5', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <header style={{ background: '#0B5D3B', color: '#FFF', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #08482E', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ height: '38px', width: 'auto', background: '#FFF', padding: '3px 8px', borderRadius: '6px' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, background: 'rgba(255,255,255,0.18)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
              FAMILY & BENEFICIARY PORTAL
            </span>
          </div>

          {/* Beneficiary Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '8px' }}>
            <User size={15} color="#A7F3D0" />
            <span style={{ fontSize: '12px', color: '#E2E8F0' }}>Caring for:</span>
            <select 
              value={selectedBenId} 
              onChange={e => setSelectedBenId(e.target.value)}
              style={{ background: 'transparent', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '13px', cursor: 'pointer', outline: 'none' }}
            >
              {beneficiaries.map(b => (
                <option key={b.id} value={b.id} style={{ color: '#0B5D3B' }}>
                  {b.fullName} ({b.relationship || b.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Quick SOS Button */}
          <button 
            onClick={() => setShowSosModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#D32F2F', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(211,47,47,0.4)' }}
          >
            <AlertTriangle size={16} /> 1-Tap Emergency SOS
          </button>

          <button 
            onClick={onRefresh}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>

          {/* Switch View to Operations Admin */}
          <button 
            onClick={onSwitchToAdmin}
            style={{ background: '#FFF', color: '#0B5D3B', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            Switch to Operations Admin →
          </button>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <div style={{ background: '#FFF', borderBottom: '1px solid #E5E9E6', padding: '0 28px', display: 'flex', gap: 24 }}>
        {[
          { key: 'home', label: "Today's Care & Live Status", icon: Activity },
          { key: 'bookings', label: 'My Care Bookings & History', icon: Calendar },
          { key: 'health', label: 'Health Dossier & Doctor', icon: Heart },
          { key: 'subsidy', label: 'Partner Grant & Subsidies', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '14px 4px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                color: isActive ? '#0B5D3B' : '#5A6E63',
                borderBottom: isActive ? '3px solid #0B5D3B' : '3px solid transparent'
              }}
            >
              <Icon size={16} color={isActive ? '#0B5D3B' : '#8A9E93'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '28px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* TAB 1: HOME & TODAY'S CARE */}
        {activeTab === 'home' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div>
              {/* Beneficiary Header Hero Card */}
              <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ width: 68, height: 68, borderRadius: '16px', background: activeBen.avatarBg || '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#0B5D3B', border: '1px solid #C8E6C9' }}>
                    {activeBen.fullName?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1B382B', margin: 0 }}>{activeBen.fullName}</h2>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#E8F5E9', color: '#1B5E3C' }}>
                        {activeBen.category} • {activeBen.age} yrs
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#5A6E63', margin: '4px 0 0 0' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-top' }} />
                      {activeBen.address}
                    </p>
                    <p style={{ fontSize: '12px', color: '#7E9287', margin: '4px 0 0 0' }}>
                      Primary Guardian: <strong>{activeBen.primaryGuardian || 'Anita Sharma'}</strong> ({activeBen.primaryContact || '+91 98765 43210'})
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowBookingModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11,93,59,0.2)' }}
                >
                  <Plus size={16} /> Book Care Visit
                </button>
              </div>

              {/* Active Care Visit Status */}
              <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1B382B', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Activity size={18} color="#0B5D3B" /> Current / Next Scheduled Visit
                  </h3>
                  {activeVisit ? (
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: activeVisit.status === 'In Progress' ? '#E8F5E9' : '#E3F2FD', color: activeVisit.status === 'In Progress' ? '#2E7D32' : '#1565C0' }}>
                      ● {activeVisit.status}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#8A9E93' }}>No active visit right now</span>
                  )}
                </div>

                {activeVisit ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: '#F8FAF9', padding: '18px', borderRadius: '12px', marginBottom: '18px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>Service & Schedule</p>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#1B382B', margin: '4px 0' }}>{activeVisit.serviceName}</p>
                        <p style={{ fontSize: '12px', color: '#5A6E63', margin: 0 }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                          {activeVisit.scheduledDate} • {activeVisit.scheduledTimeSlot}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>Assigned Caregiver</p>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#1B382B', margin: '4px 0' }}>{activeVisit.caregiverName || 'Care Coordinator Dispatching...'}</p>
                        <p style={{ fontSize: '12px', color: '#5A6E63', margin: 0 }}>
                          <ShieldCheck size={12} color="#2E7D32" style={{ display: 'inline', marginRight: 4 }} />
                          Verified Thodu Care Specialist
                        </p>
                      </div>
                    </div>

                    {/* Vitals Recorded */}
                    {activeVisit.vitals && (
                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', marginBottom: '10px' }}>Latest Vitals Recorded at Home:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                          <div style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                            <p style={{ fontSize: '10px', color: '#7E9287', margin: 0 }}>Blood Pressure</p>
                            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>{activeVisit.vitals.bp || '120/80'}</p>
                          </div>
                          <div style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                            <p style={{ fontSize: '10px', color: '#7E9287', margin: 0 }}>Pulse Rate</p>
                            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>{activeVisit.vitals.pulse || '74 bpm'}</p>
                          </div>
                          <div style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                            <p style={{ fontSize: '10px', color: '#7E9287', margin: 0 }}>Oxygen SpO2</p>
                            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>{activeVisit.vitals.spo2 || '98%'}</p>
                          </div>
                          <div style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                            <p style={{ fontSize: '10px', color: '#7E9287', margin: 0 }}>Blood Sugar</p>
                            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>{activeVisit.vitals.sugar || '135 mg/dL'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Caregiver Checklist Progress */}
                    {activeVisit.checklistCompleted && activeVisit.checklistCompleted.length > 0 && (
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', marginBottom: '8px' }}>Daily Care Tasks:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {activeVisit.checklistCompleted.map((c: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: c.done ? '#E8F5E9' : '#F8FAF9', borderRadius: '8px', fontSize: '12px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: c.done ? '#1B5E3C' : '#5A6E63', fontWeight: c.done ? 600 : 400 }}>
                                {c.done ? <CheckCircle2 size={15} color="#2E7D32" /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #CBD5E1' }} />}
                                {c.task}
                              </span>
                              {c.time && <span style={{ fontSize: '11px', color: '#688273' }}>{c.time}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                    <Calendar size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#5A6E63', margin: 0 }}>No active visit right now.</p>
                    <p style={{ fontSize: '12px', color: '#8A9E93', margin: '4px 0 16px 0' }}>Schedule a caregiver visit for morning checkup, meal assistance, or medication supervision.</p>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                    >
                      + Schedule a Visit Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Emergency & Subsidy Highlights */}
            <div>
              {/* Emergency Hotline Card */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '10px' }}>
                  <AlertTriangle size={20} color="#DC2626" />
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#991B1B', margin: 0 }}>Emergency Support</h4>
                </div>
                <p style={{ fontSize: '12px', color: '#7F1D1D', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  In case of sudden breathlessness, chest discomfort, or unexpected fall:
                </p>
                <button 
                  onClick={() => setShowSosModal(true)}
                  style={{ width: '100%', padding: '12px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginBottom: '8px' }}
                >
                  Trigger 1-Tap SOS
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '11px', color: '#991B1B' }}>
                  <Phone size={12} /> Coordinator Hotline: <strong>+91 98480 22334</strong>
                </div>
              </div>

              {/* Partner Subsidy Status Card */}
              <div style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '12px' }}>
                  <ShieldCheck size={18} color="#0B5D3B" />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1B382B', margin: 0 }}>Funding & Subsidy Status</h4>
                </div>
                <div style={{ background: '#E8F5E9', padding: '12px', borderRadius: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#1B5E3C', textTransform: 'uppercase' }}>Active Grant Tier</span>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#0B5D3B', margin: '2px 0 0 0' }}>
                    {activeBen.subsidyTier || '100% Trust Covered (BPL/White Card)'}
                  </p>
                </div>
                <p style={{ fontSize: '12px', color: '#5A6E63', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  Care visits for {activeBen.fullName} are funded through our partner endowment grant supported by <strong>Sri Divyang Seva Kendram Trust</strong>.
                </p>
                <div style={{ fontSize: '11px', color: '#7E9287', borderTop: '1px solid #F0F2F1', paddingTop: '10px' }}>
                  Ration/BPL Number: <strong>{activeBen.rationCardNumber || 'Verified BPL Record'}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY CARE BOOKINGS & HISTORY */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Care Bookings History</h3>
                <p style={{ fontSize: '12px', color: '#688273', margin: '4px 0 0 0' }}>All scheduled, ongoing, and completed care visits for {activeBen.fullName}</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                <Plus size={15} /> Book New Visit
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAF9', borderBottom: '1.5px solid #E5E9E6', textAlign: 'left', color: '#5A6E63' }}>
                    <th style={{ padding: '12px' }}>Booking Ref</th>
                    <th style={{ padding: '12px' }}>Service Name</th>
                    <th style={{ padding: '12px' }}>Date & Slot</th>
                    <th style={{ padding: '12px' }}>Assigned Caregiver</th>
                    <th style={{ padding: '12px' }}>Funding Tier</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {benBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#8A9E93' }}>
                        No care bookings found for this beneficiary.
                      </td>
                    </tr>
                  ) : (
                    benBookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F0F2F1' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#0B5D3B' }}>{b.bookingNumber}</td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{b.serviceName}</td>
                        <td style={{ padding: '12px', color: '#5A6E63' }}>{b.scheduledDate} • {b.scheduledTimeSlot}</td>
                        <td style={{ padding: '12px' }}>{b.caregiverName || 'Unassigned'}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: b.fundingType === 'Trust Sponsored' ? '#E8F5E9' : '#FFF3E0', color: b.fundingType === 'Trust Sponsored' ? '#2E7D32' : '#E65100' }}>
                            {b.fundingType}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: b.status === 'Completed' ? '#E8F5E9' : b.status === 'In Progress' ? '#E3F2FD' : '#FFF9C4', color: b.status === 'Completed' ? '#2E7D32' : b.status === 'In Progress' ? '#1565C0' : '#F57F17' }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HEALTH DOSSIER & DOCTOR */}
        {activeTab === 'health' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={18} color="#D32F2F" /> Clinical Profile & Chronic Conditions
              </h3>
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Diagnosed Conditions</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '6px' }}>
                  {activeBen.medicalConditions && activeBen.medicalConditions.length > 0 ? (
                    activeBen.medicalConditions.map((c: string, idx: number) => (
                      <span key={idx} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                        {c}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Routine Age-related Living Assistance</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '18px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Blood Group</label>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>{activeBen.bloodGroup || 'O+'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Mobility Level</label>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#1B382B', margin: '4px 0 0 0' }}>{activeBen.mobilityStatus || 'Assisted Walking'}</p>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Known Drug / Food Allergies</label>
                <p style={{ fontSize: '13px', color: '#B91C1C', fontWeight: 600, margin: '4px 0 0 0', background: '#FEF2F2', padding: '8px 12px', borderRadius: '8px' }}>
                  {activeBen.allergies || 'No known food or drug allergies reported.'}
                </p>
              </div>
            </div>

            <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} color="#0B5D3B" /> Attending Physician & Identity
              </h3>

              <div style={{ background: '#F8FAF9', padding: '16px', borderRadius: '12px', marginBottom: '18px' }}>
                <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Primary Attending Doctor</p>
                <p style={{ fontSize: '15px', fontWeight: 800, color: '#1B382B', margin: '4px 0' }}>{activeBen.emergencyDoctorName || 'Dr. S. K. Raman (Apollo Tirupati)'}</p>
                <p style={{ fontSize: '13px', color: '#0B5D3B', fontWeight: 700, margin: 0 }}>
                  <Phone size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {activeBen.emergencyDoctorPhone || '+91 98480 11223'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Aadhaar Verification</label>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '4px 0 0 0' }}>{activeBen.aadhaarNumber || 'Verified'}</p>
                </div>
                {activeBen.udidNumber && (
                  <div>
                    <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>UDID Disability Card</label>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B5D3B', margin: '4px 0 0 0' }}>{activeBen.udidNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PARTNER GRANTS & SUBSIDIES */}
        {activeTab === 'subsidy' && (
          <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '20px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={28} color="#0B5D3B" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Philanthropic Partner Grant & Subsidies</h3>
                <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>Providing dignified, subsidized elder care through corporate and trust endowments</p>
              </div>
            </div>

            <div style={{ background: '#F8FAF9', borderRadius: '12px', border: '1px solid #E5E9E6', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Active Grant Pool</p>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0' }}>Sri Divyang Seva Kendram Trust</p>
                  <span style={{ fontSize: '11px', color: '#5A6E63' }}>Charitable Care Endowment Partner</span>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Approved Grant Coverage</p>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#1B5E3C', margin: '4px 0' }}>
                    {activeBen.subsidyTier || '100% Trust Covered'}
                  </p>
                  <span style={{ fontSize: '11px', color: '#5A6E63' }}>Zero out-of-pocket family expense</span>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Verified Identity Card</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '4px 0' }}>
                    {activeBen.rationCardNumber || activeBen.udidNumber || 'Verified BPL Card'}
                  </p>
                  <span style={{ fontSize: '11px', color: '#5A6E63' }}>Authenticated on Central Registry</span>
                </div>
              </div>
            </div>

            <div style={{ borderLeft: '4px solid #0B5D3B', paddingLeft: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1B382B', margin: 0 }}>Need to update subsidy status or apply for expanded hours?</h4>
              <p style={{ fontSize: '12px', color: '#5A6E63', margin: '6px 0 14px 0' }}>
                Families can request additional hours, night-shift attendant coverage, or physiotherapy grants by contacting our care coordination desk.
              </p>
              <button 
                onClick={() => alert(`Coordination request submitted for ${activeBen.fullName}. Our trust desk will call ${activeBen.primaryContact} within 4 hours.`)}
                style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Request Grant Review / Extension
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: BOOK CARE VISIT */}
      {showBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Schedule Care Visit</h3>
                <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>For: <strong>{activeBen.fullName}</strong></p>
              </div>
              <button onClick={() => setShowBookingModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBooking}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Required Care Service</label>
                <select 
                  value={bookingService} 
                  onChange={e => setBookingService(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="Household Support">Household Support & Meal Preparation (₹450 / 2 hrs)</option>
                  <option value="Bedside & Mobility Assistance">Bedside & Mobility Assistance (₹500 / 2 hrs)</option>
                  <option value="Medication & Vitals Supervision">Medication & Vitals Supervision (₹400 / 1.5 hrs)</option>
                  <option value="Companion Care & Walking">Companion Care & Assisted Walking (₹400 / 2 hrs)</option>
                  <option value="Physiotherapy / Disability Support">Physiotherapy / Disability Support (₹600 / 2 hrs)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="text" 
                    value={bookingDate} 
                    onChange={e => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Time Slot</label>
                  <select 
                    value={bookingTimeSlot} 
                    onChange={e => setBookingTimeSlot(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="8:00 AM - 10:00 AM">Morning (8:00 AM - 10:00 AM)</option>
                    <option value="10:00 AM - 12:00 PM">Late Morning (10:00 AM - 12:00 PM)</option>
                    <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM - 4:00 PM)</option>
                    <option value="5:00 PM - 7:00 PM">Evening (5:00 PM - 7:00 PM)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Funding & Payment Route</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setBookingFunding('SUBSIDY')}
                    style={{
                      padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                      border: bookingFunding === 'SUBSIDY' ? '2px solid #0B5D3B' : '1px solid #CBD5E1',
                      background: bookingFunding === 'SUBSIDY' ? '#E8F5E9' : '#FFF'
                    }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#0B5D3B', margin: 0 }}>Partner Subsidy</p>
                    <p style={{ fontSize: '10px', color: '#688273', margin: '2px 0 0 0' }}>Covered by Sri Divyang Seva Kendram Trust Grant</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingFunding('SELF')}
                    style={{
                      padding: '12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                      border: bookingFunding === 'SELF' ? '2px solid #0B5D3B' : '1px solid #CBD5E1',
                      background: bookingFunding === 'SELF' ? '#E8F5E9' : '#FFF'
                    }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', margin: 0 }}>Direct Family Pay</p>
                    <p style={{ fontSize: '10px', color: '#688273', margin: '2px 0 0 0' }}>Pay via UPI / Card at checkout</p>
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Special Instructions / Care Notes</label>
                <textarea 
                  value={bookingSpecialNotes}
                  onChange={e => setBookingSpecialNotes(e.target.value)}
                  placeholder="e.g. Ensure blood sugar is checked before serving breakfast..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={bookingSubmitting}
                style={{ width: '100%', padding: '14px', background: '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
              >
                {bookingSubmitting ? 'Confirming with Dispatch...' : 'Confirm Care Booking →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SOS EMERGENCY */}
      {showSosModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertTriangle size={32} color="#DC2626" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', margin: '0 0 6px 0' }}>
              Trigger Immediate Emergency SOS
            </h3>
            <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 18px 0' }}>
              This will instantly alert the Thodu Dispatch Coordinator and nearest verified field caregivers for <strong>{activeBen.fullName}</strong>.
            </p>

            {sosSentSuccess ? (
              <div style={{ background: '#DCFCE7', padding: '16px', borderRadius: '10px', color: '#166534', fontWeight: 700, fontSize: '14px' }}>
                ✓ SOS Alert Dispatched! Coordinator calling immediately...
              </div>
            ) : (
              <div>
                <textarea 
                  value={sosNotes}
                  onChange={e => setSosNotes(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '12px', marginBottom: '18px', boxSizing: 'border-box' }}
                />

                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={() => setShowSosModal(false)}
                    style={{ flex: 1, padding: '12px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmSos}
                    disabled={sosSending}
                    style={{ flex: 2, padding: '12px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    {sosSending ? 'Broadcasting Alert...' : 'CONFIRM & DISPATCH NOW'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
