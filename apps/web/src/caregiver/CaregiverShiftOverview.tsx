import React from 'react';
import {
  Calendar, Clock, CheckCircle2, MapPin, ShieldCheck, UserCheck,
  TrendingUp, Award, ArrowRight, PlayCircle
} from 'lucide-react';
import { SalariedCaregiver, CaregiverVisit } from './types';

interface CaregiverShiftOverviewProps {
  caregiver: SalariedCaregiver;
  todaysVisits: CaregiverVisit[];
  activeVisit?: CaregiverVisit;
  onStartVisit: (visit: CaregiverVisit) => void;
  onNavigateToDuty: () => void;
}

export const CaregiverShiftOverview: React.FC<CaregiverShiftOverviewProps> = ({
  caregiver,
  todaysVisits,
  activeVisit,
  onStartVisit,
  onNavigateToDuty
}) => {
  const completedCount = todaysVisits.filter(v => v.status === 'Completed').length;
  const pendingVisits = todaysVisits.filter(v => v.status !== 'Completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. WELCOME & SHIFT ROSTER STATUS */}
      <div style={{ background: 'linear-gradient(135deg, #063A24 0%, #0B4D31 100%)', borderRadius: '20px', padding: '28px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: '#A7F3D0', textTransform: 'uppercase' }}>
            ● Salaried Caregiver Workforce
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px 0' }}>
            Good Day, {caregiver.fullName}!
          </h2>
          <p style={{ fontSize: '13px', color: '#C4D6CC', margin: 0 }}>
            Assigned Shift: <strong>{caregiver.workingShift || 'Day Shift (08:00 AM - 02:00 PM)'}</strong> • Zone: <strong>{caregiver.zone}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#A7F3D0', textTransform: 'uppercase', fontWeight: 700 }}>Today's Shifts</span>
            <p style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>{todaysVisits.length}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#A7F3D0', textTransform: 'uppercase', fontWeight: 700 }}>Completed</span>
            <p style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0' }}>{completedCount}</p>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE VISIT HIGHLIGHT (If in progress) */}
      {activeVisit && (
        <div style={{ background: '#FFF', borderRadius: '20px', border: '2px solid #16A34A', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, boxShadow: '0 4px 16px rgba(22,163,74,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={26} color="#166534" />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>Current Active Visit</span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: '2px 0' }}>{activeVisit.beneficiaryName}</h3>
              <p style={{ fontSize: '12px', color: '#5A6E63', margin: 0 }}>
                {activeVisit.serviceName} • {activeVisit.scheduledTimeSlot}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToDuty}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16A34A', color: '#FFF', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
          >
            Open Active Shift Workspace →
          </button>
        </div>
      )}

      {/* 3. TODAY'S SHIFT ASSIGNMENT SCHEDULE */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: '0 0 16px 0' }}>
          Today's Scheduled Elder Care Shifts
        </h3>

        {todaysVisits.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#8A9E93' }}>
            <Calendar size={40} color="#CBD5E1" style={{ marginBottom: 8 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No care shifts assigned for today.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {todaysVisits.map(visit => {
              const isOngoing = visit.status === 'In Progress';
              const isDone = visit.status === 'Completed';

              return (
                <div
                  key={visit.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
                    padding: '16px 20px', borderRadius: '14px',
                    background: isOngoing ? '#F0FDF4' : (isDone ? '#F8FAF9' : '#FFF'),
                    border: isOngoing ? '1.5px solid #BBF7D0' : '1px solid #E5E9E6'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '10px',
                      background: isDone ? '#E2E8F0' : (isOngoing ? '#DCFCE7' : '#EFF6FF'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isDone ? <CheckCircle2 size={20} color="#475569" /> : <Clock size={20} color={isOngoing ? '#166534' : '#1D4ED8'} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1B382B', margin: 0 }}>
                          {visit.beneficiaryName}
                        </h4>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: isDone ? '#E2E8F0' : (isOngoing ? '#DCFCE7' : '#FEF3C7'), color: isDone ? '#475569' : (isOngoing ? '#166534' : '#B45309') }}>
                          {visit.status}
                        </span>
                      </div>

                      <p style={{ fontSize: '12px', color: '#5A6E63', margin: '3px 0 0 0' }}>
                        {visit.serviceName} • {visit.scheduledTimeSlot}
                      </p>
                      <p style={{ fontSize: '11px', color: '#7E9287', margin: '2px 0 0 0' }}>
                        <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
                        {visit.serviceAddress}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isOngoing ? (
                      <button
                        onClick={onNavigateToDuty}
                        style={{ background: '#16A34A', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        In Progress (View)
                      </button>
                    ) : isDone ? (
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                        ✓ Shift Logged
                      </span>
                    ) : (
                      <button
                        onClick={() => onStartVisit(visit)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                      >
                        <PlayCircle size={14} /> Clock-In & Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
