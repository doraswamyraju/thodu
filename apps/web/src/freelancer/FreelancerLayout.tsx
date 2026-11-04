import React, { useState } from 'react';
import {
  Activity, Calendar, Heart, ShieldCheck, User, LogOut, Phone, AlertTriangle,
  Plus, RefreshCw, ChevronDown, Bell, Shield, DollarSign, Radio, Wallet
} from 'lucide-react';
import { FreelanceCaregiver, GigBroadcastBooking, CaregiverPayout, FreelancerNavTab } from './types';
import { FreelancerBroadcasts } from './FreelancerBroadcasts';
import { FreelancerActiveGig } from './FreelancerActiveGig';
import { FreelancerMyGigs } from './FreelancerMyGigs';
import { FreelancerWallet } from './FreelancerWallet';
import { FreelancerProfile } from './FreelancerProfile';

interface FreelancerLayoutProps {
  caregiver?: FreelanceCaregiver;
  bookings: GigBroadcastBooking[];
  payouts: CaregiverPayout[];
  onRefresh: () => void;
  onAcceptGig: (bookingId: string) => Promise<void>;
  onUpdateGig: (bookingId: string, updates: any) => Promise<void>;
  onRequestPayout: (amount: number, upiId: string) => Promise<void>;
  onTriggerSos: (notes: string) => Promise<void>;
  onLogout: () => void;
}

export const FreelancerLayout: React.FC<FreelancerLayoutProps> = ({
  caregiver,
  bookings,
  payouts,
  onRefresh,
  onAcceptGig,
  onUpdateGig,
  onRequestPayout,
  onTriggerSos,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<FreelancerNavTab>('broadcasts');
  const [availability, setAvailability] = useState<'Available' | 'On Duty' | 'Off Duty'>(caregiver?.availability || 'Available');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Safe fallback if caregiver is loading from API
  const activeCg: FreelanceCaregiver = caregiver || {
    id: 'cg-2',
    refNumber: 'TH-CAR-1002',
    fullName: 'K. Ramesh',
    phone: '+91 98765 22222',
    email: 'ramesh.k@thodu.org',
    gender: 'Male',
    age: 38,
    address: 'Near Alipiri Gate, Tirupati - 517507',
    pincode: '517507',
    employmentType: 'Freelance / Gig',
    verificationStatus: 'Verified',
    rating: 4.9,
    ratingReviewsCount: 214,
    activeAssignments: 1,
    skills: ['Cooking Assistance', 'Errands', 'Medication Reminders'],
    zone: 'T.T.D. Colony',
    availability: 'Available',
    avatarBg: '#E1F5FE',
    latitude: 13.6335,
    longitude: 79.4180
  };

  // Filter broadcasts and accepted gigs
  const broadcastBookings = bookings.filter(b => b.status === 'Awaiting Assignment' || b.broadcasted);
  const myGigs = bookings.filter(b =>
    b.caregiverName && activeCg.fullName &&
    b.caregiverName.toLowerCase().includes(activeCg.fullName.toLowerCase())
  );

  const activeGig = myGigs.find(g => g.status === 'In Progress' || g.status === 'Confirmed');

  const navItems = [
    { key: 'broadcasts' as FreelancerNavTab, label: "Gig Radar & Broadcasts", icon: Radio },
    { key: 'active_gig' as FreelancerNavTab, label: "Active Gig Shift", icon: Activity },
    { key: 'my_gigs' as FreelancerNavTab, label: "My Accepted Shifts", icon: Calendar },
    { key: 'wallet' as FreelancerNavTab, label: "Earnings Wallet", icon: Wallet },
    { key: 'profile' as FreelancerNavTab, label: "Partner Profile", icon: ShieldCheck }
  ];

  const handleAcceptAndOpen = async (bookingId: string) => {
    await onAcceptGig(bookingId);
    setActiveTab('active_gig');
  };

  return (
    <div className="web-layout">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="web-sidebar">
        <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#93C5FD', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '10px 0 0 0' }}>
            Gig Caregiver Partner Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? '#0B5D3B' : 'transparent',
                  color: isActive ? '#FFF' : '#C4D6CC',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  width: '100%'
                }}
              >
                <Icon size={18} color={isActive ? '#34D399' : '#8A9E93'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#FFF' }}>
              {activeCg.fullName.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: '#FFF' }}>{activeCg.fullName}</p>
              <p style={{ fontSize: '10px', color: '#93C5FD', margin: 0 }}>Freelance Partner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN AREA */}
      <main className="web-main">
        <header className="web-topbar">
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0B5D3B', margin: 0 }}>
              {activeTab === 'broadcasts' && "Nearby Broadcasted Care Gigs"}
              {activeTab === 'active_gig' && "Ongoing Care Shift Workspace"}
              {activeTab === 'my_gigs' && "Fulfilled Care Shifts"}
              {activeTab === 'wallet' && "Gig Earnings Wallet & Payout Requests"}
              {activeTab === 'profile' && "Freelancer Verification Badges"}
            </h1>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>
              Gig Partner ID: {activeCg.refNumber} • Zone: {activeCg.zone}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Availability */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EFF6FF', border: '1.5px solid #BFDBFE', padding: '5px 12px', borderRadius: '10px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: availability === 'Available' ? '#2563EB' : '#16A34A' }} />
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value as any)}
                style={{ background: 'transparent', border: 'none', fontWeight: 800, fontSize: '12px', color: '#1E40AF', cursor: 'pointer', outline: 'none' }}
              >
                <option value="Available">Online (Accepting Gigs)</option>
                <option value="On Duty">On Duty</option>
                <option value="Off Duty">Offline</option>
              </select>
            </div>

            <button
              onClick={onRefresh}
              style={{ background: '#FFF', border: '1px solid #CBD5E1', color: '#334155', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Refresh
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </header>

        <div className="web-content" style={{ paddingBottom: '90px' }}>
          {activeTab === 'broadcasts' && (
            <FreelancerBroadcasts
              caregiver={activeCg}
              broadcastBookings={broadcastBookings}
              onAcceptGig={handleAcceptAndOpen}
              onNavigateToActiveGig={() => setActiveTab('active_gig')}
              activeGig={activeGig}
            />
          )}

          {activeTab === 'active_gig' && (
            <FreelancerActiveGig
              caregiver={activeCg}
              activeGig={activeGig}
              onUpdateGig={onUpdateGig}
              onTriggerSos={onTriggerSos}
            />
          )}

          {activeTab === 'my_gigs' && (
            <FreelancerMyGigs
              gigs={myGigs}
            />
          )}

          {activeTab === 'wallet' && (
            <FreelancerWallet
              caregiver={activeCg}
              payouts={payouts}
              onRequestPayout={onRequestPayout}
            />
          )}

          {activeTab === 'profile' && (
            <FreelancerProfile
              caregiver={activeCg}
            />
          )}
        </div>
      </main>

      {/* Floating SOS */}
      <div style={{ position: 'fixed', right: 28, bottom: 28, zIndex: 90 }}>
        <button
          onClick={() => onTriggerSos(`Emergency SOS from freelance caregiver ${activeCg.fullName}`)}
          style={{ width: 54, height: 54, borderRadius: '50%', background: '#DC2626', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgba(220,38,38,0.4)', animation: 'pulse 2s infinite' }}
        >
          <AlertTriangle size={24} />
        </button>
      </div>
    </div>
  );
};
