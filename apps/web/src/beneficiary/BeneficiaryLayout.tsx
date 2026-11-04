import React, { useState } from 'react';
import {
  Activity, Calendar, Heart, ShieldCheck, User, LogOut, Phone, AlertTriangle,
  Plus, RefreshCw, ChevronDown, Bell, Shield
} from 'lucide-react';
import { Beneficiary, CareBooking, BeneficiaryNavTab } from './types';
import { BeneficiaryOverview } from './BeneficiaryOverview';
import { BeneficiaryBookings } from './BeneficiaryBookings';
import { BeneficiaryHealthDossier } from './BeneficiaryHealthDossier';
import { BeneficiarySubsidies } from './BeneficiarySubsidies';
import { BeneficiaryBookingModal } from './BeneficiaryBookingModal';
import { BeneficiaryEmergencySosModal } from './BeneficiaryEmergencySosModal';

interface BeneficiaryLayoutProps {
  beneficiaries: Beneficiary[];
  bookings: CareBooking[];
  caregivers?: any[];
  onRefresh: () => void;
  onBookCare: (bookingData: any) => Promise<void>;
  onTriggerSos: (beneficiaryId: string, notes: string) => Promise<void>;
  onSwitchToAdmin: () => void;
  onLogout: () => void;
}

export const BeneficiaryLayout: React.FC<BeneficiaryLayoutProps> = ({
  beneficiaries,
  bookings,
  onRefresh,
  onBookCare,
  onTriggerSos,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<BeneficiaryNavTab>('overview');
  const [selectedBenId, setSelectedBenId] = useState<string>(() => beneficiaries[0]?.id || 'ben-1');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const activeBen = beneficiaries.find(b => b.id === selectedBenId) || beneficiaries[0] || {} as Beneficiary;

  // Filter bookings for this active beneficiary
  const benBookings = bookings.filter(b =>
    b.beneficiaryId === activeBen.id ||
    (b.beneficiaryName && activeBen.fullName && b.beneficiaryName.toLowerCase() === activeBen.fullName.toLowerCase())
  );

  const activeBooking = benBookings.find(b => b.status === 'In Progress' || b.status === 'Confirmed' || b.status === 'Scheduled');
  const completedBookings = benBookings.filter(b => b.status === 'Completed');

  const navItems = [
    { key: 'overview' as BeneficiaryNavTab, label: "Today's Care & Status", icon: Activity },
    { key: 'bookings' as BeneficiaryNavTab, label: 'Care Bookings', icon: Calendar },
    { key: 'health' as BeneficiaryNavTab, label: 'Health Dossier', icon: Heart },
    { key: 'subsidies' as BeneficiaryNavTab, label: 'Grants & Subsidies', icon: ShieldCheck }
  ];

  return (
    <div className="web-layout">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="web-sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '10px 0 0 0' }}>
            Family & Beneficiary Portal
          </p>
        </div>

        {/* Navigation Links */}
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
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.15s ease',
                  width: '100%'
                }}
              >
                <Icon size={18} color={isActive ? '#34D399' : '#8A9E93'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Family Guardian Profile */}
        <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#FFF' }}>
              AS
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: '#FFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {activeBen.primaryGuardian || 'Anita Sharma'}
              </p>
              <p style={{ fontSize: '10px', color: '#A7F3D0', margin: 0 }}>Family Guardian</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW AREA */}
      <main className="web-main">
        
        {/* Top Header Bar */}
        <header className="web-topbar">
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0B5D3B', margin: 0 }}>
              {activeTab === 'overview' && "Today's Care & Health Monitor"}
              {activeTab === 'bookings' && "Care Service Bookings"}
              {activeTab === 'health' && "Comprehensive Health Dossier"}
              {activeTab === 'subsidies' && "Partner Grants & Subsidies"}
            </h1>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>
              Family Care Management • Tirupati Service Region
            </p>
          </div>

          {/* Right Header: Active Loved One Switcher, Refresh, Notification Bell, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            
            {/* Active Loved One Selector in Topbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F0FDF4', border: '1.5px solid #BBF7D0', padding: '6px 12px', borderRadius: '10px' }}>
              <User size={15} color="#0B5D3B" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>Active Loved One:</span>
              <select
                value={selectedBenId}
                onChange={e => setSelectedBenId(e.target.value)}
                style={{ background: 'transparent', color: '#0B5D3B', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer', outline: 'none' }}
              >
                {beneficiaries.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.fullName} ({b.relationship || b.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              title="Refresh Live Data"
              style={{ background: '#FFF', border: '1px solid #CBD5E1', color: '#334155', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}
            >
              <RefreshCw size={14} /> Refresh
            </button>

            {/* Notification Bell Icon */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                title="Notifications"
                style={{ width: 38, height: 38, borderRadius: '10px', background: '#FFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155', position: 'relative' }}
              >
                <Bell size={16} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#16A34A', border: '1.5px solid #FFF' }} />
              </button>

              {/* Notification Popup Dropdown */}
              {showNotificationPopup && (
                <div style={{ position: 'absolute', right: 0, top: '46px', width: '280px', background: '#FFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #E5E9E6', padding: '16px', zIndex: 110 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#1B382B' }}>Care Notifications</span>
                    <span style={{ fontSize: '10px', background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Live</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '11px', color: '#475569' }}>
                    <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#0B5D3B' }}>Caregiver In Transit</p>
                      <p style={{ margin: '2px 0 0 0' }}>Anitha is scheduled to arrive at {activeBooking?.scheduledTimeSlot || '10:00 AM'}.</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1B382B' }}>Trust Grant Active</p>
                      <p style={{ margin: '2px 0 0 0' }}>100% Subsidized care sponsored by Sri Divyang Seva Kendram Trust.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Icon Button */}
            <button
              onClick={onLogout}
              title="Log Out"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="web-content" style={{ paddingBottom: '90px' }}>
          {activeTab === 'overview' && (
            <BeneficiaryOverview
              beneficiary={activeBen}
              activeBooking={activeBooking}
              completedBookings={completedBookings}
              onOpenBookModal={() => setIsBookModalOpen(true)}
              onOpenSosModal={() => setIsSosModalOpen(true)}
            />
          )}

          {activeTab === 'bookings' && (
            <BeneficiaryBookings
              beneficiary={activeBen}
              bookings={benBookings}
              onOpenBookModal={() => setIsBookModalOpen(true)}
            />
          )}

          {activeTab === 'health' && (
            <BeneficiaryHealthDossier
              beneficiary={activeBen}
            />
          )}

          {activeTab === 'subsidies' && (
            <BeneficiarySubsidies
              beneficiary={activeBen}
            />
          )}
        </div>
      </main>

      {/* 3. FLOATING ACTION BUTTONS (Always accessible on screen) */}
      <div style={{ position: 'fixed', right: 28, bottom: 28, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 90 }}>
        {/* Floating Book Care Visit */}
        <button
          onClick={() => setIsBookModalOpen(true)}
          title="Schedule Care Visit"
          style={{ width: 54, height: 54, borderRadius: '50%', background: '#0B5D3B', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgba(11,93,59,0.35)', transition: 'transform 0.2s' }}
        >
          <Plus size={24} />
        </button>

        {/* Floating Emergency SOS */}
        <button
          onClick={() => setIsSosModalOpen(true)}
          title="Emergency Rapid Response SOS"
          style={{ width: 54, height: 54, borderRadius: '50%', background: '#DC2626', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgba(220,38,38,0.4)', animation: 'pulse 2s infinite' }}
        >
          <AlertTriangle size={24} />
        </button>
      </div>

      {/* 4. MOBILE BOTTOM NAVIGATION DOCK (Rendered in mobile/responsive views) */}
      <div className="mobile-bottom-dock" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', borderTop: '1px solid #E5E9E6', padding: '8px 16px', zIndex: 100, justifyContent: 'space-around', alignItems: 'center' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'transparent', border: 'none', color: isActive ? '#0B5D3B' : '#8A9E93', cursor: 'pointer', fontSize: '10px', fontWeight: isActive ? 700 : 500 }}
            >
              <Icon size={20} color={isActive ? '#0B5D3B' : '#8A9E93'} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 5. MODALS */}
      <BeneficiaryBookingModal
        beneficiary={activeBen}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSubmit={onBookCare}
      />

      <BeneficiaryEmergencySosModal
        beneficiary={activeBen}
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        onTriggerSos={onTriggerSos}
      />
    </div>
  );
};
