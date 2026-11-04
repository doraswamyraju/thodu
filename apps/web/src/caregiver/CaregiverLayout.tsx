import React, { useState } from 'react';
import {
  Activity, Calendar, Heart, ShieldCheck, User, LogOut, Phone, AlertTriangle,
  Plus, RefreshCw, ChevronDown, Bell, Shield, DollarSign, Award
} from 'lucide-react';
import { SalariedCaregiver, CaregiverVisit, CaregiverNavTab } from './types';
import { CaregiverShiftOverview } from './CaregiverShiftOverview';
import { CaregiverActiveDuty } from './CaregiverActiveDuty';
import { CaregiverSchedule } from './CaregiverSchedule';
import { CaregiverEarnings } from './CaregiverEarnings';
import { CaregiverProfile } from './CaregiverProfile';

interface CaregiverLayoutProps {
  caregiver: SalariedCaregiver;
  bookings: CaregiverVisit[];
  onRefresh: () => void;
  onUpdateVisit: (visitId: string, updates: any) => Promise<void>;
  onTriggerSos: (notes: string) => Promise<void>;
  onLogout: () => void;
}

export const CaregiverLayout: React.FC<CaregiverLayoutProps> = ({
  caregiver,
  bookings,
  onRefresh,
  onUpdateVisit,
  onTriggerSos,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<CaregiverNavTab>('overview');
  const [availability, setAvailability] = useState<'Available' | 'On Duty' | 'Off Duty'>(caregiver.availability || 'Available');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Filter visits assigned to this caregiver
  const myVisits = bookings.filter(b => 
    b.caregiverName && caregiver.fullName &&
    b.caregiverName.toLowerCase().includes(caregiver.fullName.toLowerCase())
  );

  const activeVisit = myVisits.find(v => v.status === 'In Progress');
  const completedVisits = myVisits.filter(v => v.status === 'Completed');

  const navItems = [
    { key: 'overview' as CaregiverNavTab, label: "Shift Roster & Today", icon: Activity },
    { key: 'duty' as CaregiverNavTab, label: "Active Shift Duty", icon: Heart },
    { key: 'schedule' as CaregiverNavTab, label: "Shift Schedule", icon: Calendar },
    { key: 'earnings' as CaregiverNavTab, label: "Salary & Compensation", icon: DollarSign },
    { key: 'profile' as CaregiverNavTab, label: "Staff Profile & Badges", icon: ShieldCheck }
  ];

  const handleStartShift = async (visit: CaregiverVisit) => {
    await onUpdateVisit(visit.id, {
      status: 'In Progress'
    });
    setAvailability('On Duty');
    setActiveTab('duty');
  };

  return (
    <div className="web-layout">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="web-sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '10px 0 0 0' }}>
            Caregiver Workforce Portal
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

        {/* Sidebar Footer with Caregiver Details */}
        <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#FFF' }}>
              {caregiver.fullName.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: '#FFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {caregiver.fullName}
              </p>
              <p style={{ fontSize: '10px', color: '#A7F3D0', margin: 0 }}>Staff: {caregiver.refNumber}</p>
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
              {activeTab === 'overview' && "Shift Roster & Today's Schedule"}
              {activeTab === 'duty' && "Active Care Shift & Vitals Logging"}
              {activeTab === 'schedule' && "Caregiver Shift Schedule"}
              {activeTab === 'earnings' && "Staff Monthly Salary & Payroll"}
              {activeTab === 'profile' && "Caregiver Identity & Badges"}
            </h1>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>
              Salaried Staff Specialist • Zone: {caregiver.zone}
            </p>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            
            {/* Availability Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: availability === 'On Duty' ? '#DCFCE7' : '#F1F5F9', border: `1.5px solid ${availability === 'On Duty' ? '#86EFAC' : '#CBD5E1'}`, padding: '5px 12px', borderRadius: '10px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: availability === 'On Duty' ? '#16A34A' : '#64748B' }} />
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value as any)}
                style={{ background: 'transparent', border: 'none', fontWeight: 800, fontSize: '12px', color: availability === 'On Duty' ? '#166534' : '#334155', cursor: 'pointer', outline: 'none' }}
              >
                <option value="Available">Available for Dispatch</option>
                <option value="On Duty">On Duty (Shift Active)</option>
                <option value="Off Duty">Off Duty</option>
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

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                style={{ width: 38, height: 38, borderRadius: '10px', background: '#FFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155', position: 'relative' }}
              >
                <Bell size={16} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#16A34A', border: '1.5px solid #FFF' }} />
              </button>

              {showNotificationPopup && (
                <div style={{ position: 'absolute', right: 0, top: '46px', width: '280px', background: '#FFF', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #E5E9E6', padding: '16px', zIndex: 110 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#1B382B' }}>Caregiver Dispatch Alerts</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '11px', color: '#475569' }}>
                    <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#0B5D3B' }}>Roster Dispatched</p>
                      <p style={{ margin: '2px 0 0 0' }}>Your next elder shift starts at {activeVisit?.scheduledTimeSlot || '10:00 AM'}.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="web-content" style={{ paddingBottom: '90px' }}>
          {activeTab === 'overview' && (
            <CaregiverShiftOverview
              caregiver={caregiver}
              todaysVisits={myVisits}
              activeVisit={activeVisit}
              onStartVisit={handleStartShift}
              onNavigateToDuty={() => setActiveTab('duty')}
            />
          )}

          {activeTab === 'duty' && (
            <CaregiverActiveDuty
              caregiver={caregiver}
              activeVisit={activeVisit}
              onUpdateVisit={onUpdateVisit}
              onTriggerSos={onTriggerSos}
            />
          )}

          {activeTab === 'schedule' && (
            <CaregiverSchedule
              visits={myVisits}
            />
          )}

          {activeTab === 'earnings' && (
            <CaregiverEarnings
              caregiver={caregiver}
              completedVisitsCount={completedVisits.length}
            />
          )}

          {activeTab === 'profile' && (
            <CaregiverProfile
              caregiver={caregiver}
            />
          )}
        </div>
      </main>

      {/* Floating Emergency SOS */}
      <div style={{ position: 'fixed', right: 28, bottom: 28, zIndex: 90 }}>
        <button
          onClick={() => onTriggerSos(`Emergency SOS signaled by salaried caregiver ${caregiver.fullName} (${caregiver.phone})`)}
          title="Emergency Responder SOS"
          style={{ width: 54, height: 54, borderRadius: '50%', background: '#DC2626', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgba(220,38,38,0.4)', animation: 'pulse 2s infinite' }}
        >
          <AlertTriangle size={24} />
        </button>
      </div>
    </div>
  );
};
