import React from 'react';
import {
  Radio, Clock, MapPin, DollarSign, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import { FreelanceCaregiver, GigBroadcastBooking } from './types';

interface FreelancerBroadcastsProps {
  caregiver: FreelanceCaregiver;
  broadcastBookings: GigBroadcastBooking[];
  onAcceptGig: (bookingId: string) => Promise<void>;
  onNavigateToActiveGig: () => void;
  activeGig?: GigBroadcastBooking;
}

export const FreelancerBroadcasts: React.FC<FreelancerBroadcastsProps> = ({
  caregiver,
  broadcastBookings,
  onAcceptGig,
  onNavigateToActiveGig,
  activeGig
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. HERO BANNER: GIG RADAR & ZONE */}
      <div style={{ background: 'linear-gradient(135deg, #0A3D28 0%, #135A3C 100%)', borderRadius: '20px', padding: '28px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.18)', color: '#A7F3D0', textTransform: 'uppercase' }}>
            ● Freelance / Gig Dispatch Network
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px 0' }}>
            Welcome, {caregiver.fullName}!
          </h2>
          <p style={{ fontSize: '13px', color: '#D1E7DD', margin: 0 }}>
            Broadcast Radar Active in <strong>{caregiver.zone}</strong> • Per-visit direct earnings
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#A7F3D0', textTransform: 'uppercase', fontWeight: 700 }}>Open Gigs Nearby</span>
            <p style={{ fontSize: '24px', fontWeight: 800, margin: '2px 0 0 0' }}>{broadcastBookings.length}</p>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE ACCEPTED GIG NOTICE (If one is currently ongoing) */}
      {activeGig && (
        <div style={{ background: '#FFF', borderRadius: '20px', border: '2px solid #16A34A', padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, boxShadow: '0 4px 16px rgba(22,163,74,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="#166534" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>Ongoing Gig in Progress</span>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1B382B', margin: '2px 0' }}>{activeGig.beneficiaryName}</h3>
              <p style={{ fontSize: '12px', color: '#5A6E63', margin: 0 }}>
                {activeGig.serviceName} • {activeGig.scheduledTimeSlot} • {activeGig.serviceAddress}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToActiveGig}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16A34A', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
          >
            Open Active Gig Workspace →
          </button>
        </div>
      )}

      {/* 3. BROADCAST GIG OPPORTUNITIES FEED */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '26px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={18} color="#0B5D3B" /> Broadcasted Care Shifts in Your Area
            </h3>
            <p style={{ fontSize: '12px', color: '#688273', margin: '4px 0 0 0' }}>First caregiver to accept secures the booking and direct payout</p>
          </div>
        </div>

        {broadcastBookings.length === 0 ? (
          <div style={{ padding: '44px 16px', textAlign: 'center', color: '#8A9E93' }}>
            <Radio size={42} color="#CBD5E1" style={{ marginBottom: 12 }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#475569', margin: '0 0 4px 0' }}>No broadcasts right now</h4>
            <p style={{ fontSize: '12px', margin: 0 }}>All elder requests in Tirupati are currently fulfilled. New shifts broadcast automatically.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 18 }}>
            {broadcastBookings.map(gig => {
              const payoutEstimateInr = Math.round((gig.totalAmountPaise || 45000) / 100 * 0.75); // 75% caregiver payout

              return (
                <div
                  key={gig.id}
                  style={{
                    background: '#FAFCFB', borderRadius: '16px', border: '1.5px solid #E0E7E3',
                    padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: '#FEF3C7', color: '#B45309' }}>
                        ⚡ Immediate Gig
                      </span>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#0B5D3B' }}>
                        ₹{payoutEstimateInr} <span style={{ fontSize: '11px', fontWeight: 500, color: '#5A6E63' }}>Payout</span>
                      </span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: '0 0 4px 0' }}>
                      {gig.serviceName}
                    </h4>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 8px 0' }}>
                      Caring for: {gig.beneficiaryName}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '12px', color: '#5A6E63', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={13} color="#0B5D3B" /> {gig.scheduledDate} • {gig.scheduledTimeSlot}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={13} color="#0B5D3B" /> {gig.serviceAddress}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAcceptGig(gig.id)}
                    style={{
                      width: '100%', padding: '12px', background: '#0B5D3B', color: '#FFF',
                      border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '13px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 4px 12px rgba(11,93,59,0.2)'
                    }}
                  >
                    Accept Gig & Confirm Shift →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
