import React, { useState } from 'react';
import {
  Activity, Calendar, Heart, ShieldCheck, User, LogOut, Phone, AlertTriangle,
  Plus, RefreshCw, ChevronDown, Menu, X, ArrowRight, Shield
} from 'lucide-react';
import { Beneficiary, CareBooking, BeneficiaryNavTab } from './types';
import { BeneficiaryOverview } from './BeneficiaryOverview';
import { BeneficiaryBookings } from './BeneficiaryBookings';
import { BeneficiaryHealthDossier } from './BeneficiaryHealthDossier';
import { BeneficiarySubsidies } from './BeneficiarySubsidies';
import { BeneficiaryBookingModal } from './BeneficiaryBookingModal';
import { BeneficiaryEmergencySosModal } from './BeneficiaryEmergencySosModal';

interface BeneficiaryLayoutProps {
  caregivers?: any[];
  beneficiaries: Beneficiary[];
  bookings: CareBooking[];
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
  onSwitchToAdmin,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<BeneficiaryNavTab>('overview');
  const [selectedBenId, setSelectedBenId] = useState<string>(() => beneficiaries[0]?.id || 'ben-1');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="web-layout" style={{ minHeight: '100vh', display: 'flex', background: '#F4F7F5' }}>
      
      {/* 1. LEFT SIDEBAR (Standard Thodu Dark Green Design System) */}
      <aside className={`web-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ width: '260px', background: 'linear-gradient(180deg, #063A24 0%, #0B4D31 50%, #032517 100%)', color: '#FFF', display: 'flex', flexDirection: 'column', padding: '24px 16px', boxSizing: 'border-box', zIndex: 100 }}>
        {/* Brand Header */}
        <div style={{ marginBottom: '28px', padding: '0 8px' }}>
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '8px 0 0 0' }}>
            Family & Beneficiary Portal
          </p>
        </div>

        {/* Enrolled Elders Quick Selector */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '10px', color: '#A7F3D0', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
            Active Loved One
          </span>
          <select
            value={selectedBenId}
            onChange={e => setSelectedBenId(e.target.value)}
            style={{ width: '100%', background: '#08482E', color: '#FFF', border: '1px solid #146B44', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
          >
            {beneficiaries.map(b => (
              <option key={b.id} value={b.id} style={{ background: '#063A24', color: '#FFF' }}>
                {b.fullName} ({b.relationship || b.category})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? '#0B5D3B' : 'transparent',
                  color: isActive ? '#FFF' : '#C4D6CC',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#34D399' : '#8A9E93'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with User Details & Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                AS
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>{activeBen.primaryGuardian || 'Anita Sharma'}</p>
                <p style={{ fontSize: '10px', color: '#A7F3D0', margin: 0 }}>Family Guardian</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Log Out"
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#F87171' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        
        {/* Top Header Bar */}
        <header style={{ background: '#FFF', borderBottom: '1px solid #E5E9E6', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0B5D3B', margin: 0 }}>
              {activeTab === 'overview' && "Today's Care & Health Monitor"}
              {activeTab === 'bookings' && "Care Service Bookings"}
              {activeTab === 'health' && "Comprehensive Health Dossier"}
              {activeTab === 'subsidies' && "Partner Grants & Subsidies"}
            </h1>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>
              Caring for: <strong>{activeBen.fullName}</strong> • Tirupati Service Region
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Quick 1-Tap SOS Header Button */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#DC2626', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', boxShadow: '0 3px 10px rgba(220,38,38,0.25)' }}
            >
              <AlertTriangle size={15} /> 1-Tap SOS
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              style={{ background: '#FFF', border: '1px solid #CBD5E1', color: '#334155', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 600 }}
            >
              <RefreshCw size={13} /> Refresh
            </button>

            {/* Switch to Operations Admin */}
            <button
              onClick={onSwitchToAdmin}
              style={{ background: '#E8F5E9', border: '1.5px solid #A5D6A7', color: '#1B5E3C', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Switch to Operations Admin →
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main style={{ padding: '28px', maxWidth: '1240px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1, paddingBottom: '90px' }}>
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
        </main>
      </div>

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
