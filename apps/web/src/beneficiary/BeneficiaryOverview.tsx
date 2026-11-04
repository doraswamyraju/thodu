import React from 'react';
import { Activity, Clock, ShieldCheck, MapPin, CheckCircle2, Phone, Calendar, Heart, Plus, AlertTriangle } from 'lucide-react';
import { Beneficiary, CareBooking } from './types';

interface BeneficiaryOverviewProps {
  beneficiary: Beneficiary;
  activeBooking?: CareBooking;
  completedBookings: CareBooking[];
  onOpenBookModal: () => void;
  onOpenSosModal: () => void;
}

export const BeneficiaryOverview: React.FC<BeneficiaryOverviewProps> = ({
  beneficiary,
  activeBooking,
  completedBookings,
  onOpenBookModal,
  onOpenSosModal
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Beneficiary Status Card */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 68, height: 68, borderRadius: '18px', background: beneficiary.avatarBg || '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800, color: '#0B5D3B', border: '1.5px solid #C8E6C9' }}>
            {beneficiary.fullName?.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1B382B', margin: 0 }}>{beneficiary.fullName}</h2>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#E8F5E9', color: '#1B5E3C' }}>
                {beneficiary.category} • {beneficiary.age} yrs
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#E0F2FE', color: '#0369A1' }}>
                Ref: {beneficiary.refNumber}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#5A6E63', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={13} color="#0B5D3B" />
              {beneficiary.address}
            </p>
            <p style={{ fontSize: '12px', color: '#7E9287', margin: '4px 0 0 0' }}>
              Guardian: <strong>{beneficiary.primaryGuardian || 'Family Guardian'}</strong> ({beneficiary.primaryContact})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onOpenBookModal}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(11,93,59,0.25)' }}
          >
            <Plus size={16} /> Book Care Visit
          </button>
        </div>
      </div>

      {/* Grid: Live Visit & Vitals on Left, Side Highlights on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Main Section: Current / Upcoming Care Visit */}
        <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="#0B5D3B" /> Today's Caregiver Dispatch & Vitals
            </h3>
            {activeBooking ? (
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: activeBooking.status === 'In Progress' ? '#E8F5E9' : '#E0F2FE', color: activeBooking.status === 'In Progress' ? '#1B5E3C' : '#0369A1' }}>
                ● {activeBooking.status}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: '#8A9E93' }}>No active visit right now</span>
            )}
          </div>

          {activeBooking ? (
            <>
              {/* Service & Caregiver Card */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, background: '#F8FAF9', padding: '18px', borderRadius: '14px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Service & Schedule</p>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#1B382B', margin: '4px 0' }}>{activeBooking.serviceName}</p>
                  <p style={{ fontSize: '12px', color: '#5A6E63', margin: 0 }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {activeBooking.scheduledDate} • {activeBooking.scheduledTimeSlot}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Assigned Care Specialist</p>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#1B382B', margin: '4px 0' }}>{activeBooking.caregiverName || 'Care Coordinator Dispatching...'}</p>
                  <p style={{ fontSize: '12px', color: '#0B5D3B', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={13} color="#0B5D3B" /> Verified Background Checked
                  </p>
                </div>
              </div>

              {/* Real-Time Vitals Record */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', marginBottom: '10px' }}>Clinical Vitals Monitored Today:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '12px 8px', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#166534', fontWeight: 600, margin: 0 }}>Blood Pressure</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#14532D', margin: '4px 0 0 0' }}>{activeBooking.vitals?.bp || '124/82'}</p>
                  </div>
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '12px 8px', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#166534', fontWeight: 600, margin: 0 }}>Pulse Rate</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#14532D', margin: '4px 0 0 0' }}>{activeBooking.vitals?.pulse || '74 bpm'}</p>
                  </div>
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '12px 8px', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#166534', fontWeight: 600, margin: 0 }}>Oxygen SpO2</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#14532D', margin: '4px 0 0 0' }}>{activeBooking.vitals?.spo2 || '98%'}</p>
                  </div>
                  <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '12px 8px', borderRadius: '12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#166534', fontWeight: 600, margin: 0 }}>Blood Sugar</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#14532D', margin: '4px 0 0 0' }}>{activeBooking.vitals?.sugar || '138 mg/dL'}</p>
                  </div>
                </div>
              </div>

              {/* Tasks Progress Checklist */}
              {activeBooking.checklistCompleted && activeBooking.checklistCompleted.length > 0 && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', marginBottom: '8px' }}>Daily Care Task Completion:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {activeBooking.checklistCompleted.map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', background: t.done ? '#E8F5E9' : '#F8FAF9', borderRadius: '10px', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.done ? '#1B5E3C' : '#5A6E63', fontWeight: t.done ? 700 : 500 }}>
                          {t.done ? <CheckCircle2 size={16} color="#0B5D3B" /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #94A3B8' }} />}
                          {t.task}
                        </span>
                        {t.time && <span style={{ fontSize: '11px', color: '#688273' }}>{t.time}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <Calendar size={44} color="#CBD5E1" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#5A6E63', margin: 0 }}>No active visit right now.</p>
              <p style={{ fontSize: '12px', color: '#8A9E93', margin: '4px 0 16px 0' }}>Book regular morning assistance, physiotherapy, or vital monitoring for {beneficiary.fullName}.</p>
              <button
                onClick={onOpenBookModal}
                style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                + Schedule Care Visit
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Emergency & Subsidy Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Emergency Card */}
          <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '20px', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '8px' }}>
              <AlertTriangle size={22} color="#DC2626" />
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#991B1B', margin: 0 }}>Emergency Rapid Response</h4>
            </div>
            <p style={{ fontSize: '12px', color: '#7F1D1D', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Immediate emergency assistance with real-time location broadcast to field responders:
            </p>
            <button
              onClick={onOpenSosModal}
              style={{ width: '100%', padding: '13px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(220,38,38,0.25)', marginBottom: '10px' }}
            >
              Trigger 1-Tap SOS
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '12px', color: '#991B1B' }}>
              <Phone size={13} /> Coordinator Hotline: <strong>+91 98480 22334</strong>
            </div>
          </div>

          {/* Partner Subsidy Badge */}
          <div style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: '20px', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '12px' }}>
              <ShieldCheck size={20} color="#0B5D3B" />
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Partner Grant & Subsidy Tier</h4>
            </div>
            <div style={{ background: '#E8F5E9', padding: '14px', borderRadius: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#1B5E3C', textTransform: 'uppercase' }}>Active Grant Tier</span>
              <p style={{ fontSize: '15px', fontWeight: 800, color: '#0B5D3B', margin: '3px 0 0 0' }}>
                {beneficiary.subsidyTier || '100% Trust Covered (BPL/White Card)'}
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#5A6E63', margin: '0 0 12px 0', lineHeight: 1.5 }}>
              Care expenses are subsidized via <strong>Sri Divyang Seva Kendram Trust</strong> charitable care endowments.
            </p>
            <div style={{ fontSize: '11px', color: '#7E9287', borderTop: '1px solid #F0F2F1', paddingTop: '10px' }}>
              Ration / BPL Card: <strong>{beneficiary.rationCardNumber || 'Verified Record'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

