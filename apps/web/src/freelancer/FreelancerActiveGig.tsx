import React, { useState } from 'react';
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, Heart, Shield, MapPin, Check
} from 'lucide-react';
import { FreelanceCaregiver, GigBroadcastBooking } from './types';

interface FreelancerActiveGigProps {
  caregiver: FreelanceCaregiver;
  activeGig?: GigBroadcastBooking;
  onUpdateGig: (bookingId: string, updates: any) => Promise<void>;
  onTriggerSos: (notes: string) => Promise<void>;
}

export const FreelancerActiveGig: React.FC<FreelancerActiveGigProps> = ({
  caregiver,
  activeGig,
  onUpdateGig,
  onTriggerSos
}) => {
  const [bp, setBp] = useState(activeGig?.vitals?.bp || '120/80');
  const [pulse, setPulse] = useState(activeGig?.vitals?.pulse || '72 bpm');
  const [spo2, setSpo2] = useState(activeGig?.vitals?.spo2 || '99%');
  const [sugar, setSugar] = useState(activeGig?.vitals?.sugar || '130 mg/dL');
  const [notes, setNotes] = useState(activeGig?.caregiverNotes || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [tasks, setTasks] = useState(() => {
    if (activeGig?.checklistCompleted && activeGig.checklistCompleted.length > 0) {
      return activeGig.checklistCompleted;
    }
    return [
      { task: 'Check-In at Home Address & Welcome Elder', done: true, time: '09:00 AM' },
      { task: 'Check & Record Clinical Vitals', done: true, time: '09:15 AM' },
      { task: 'Elder Living Assistance & Meal Prep', done: false },
      { task: 'Prescription Medication Supervised', done: false },
      { task: 'Accompanied Walking / Physical Movement', done: false }
    ];
  });

  if (!activeGig) {
    return (
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '48px 24px', textAlign: 'center' }}>
        <Calendar size={48} color="#CBD5E1" style={{ marginBottom: 14 }} />
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: '0 0 6px 0' }}>No Active Gig In Progress</h3>
        <p style={{ fontSize: '13px', color: '#688273', margin: '0 0 20px 0' }}>
          Accept an available care shift from the Broadcast radar to start earning.
        </p>
      </div>
    );
  }

  const toggleTask = (index: number) => {
    const updated = [...tasks];
    const isNowDone = !updated[index].done;
    updated[index].done = isNowDone;
    updated[index].time = isNowDone ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
    setTasks(updated);
  };

  const handleSaveVitals = async () => {
    setSaving(true);
    try {
      await onUpdateGig(activeGig.id, {
        vitals: { bp, pulse, spo2, sugar },
        checklistCompleted: tasks,
        caregiverNotes: notes
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteGig = async () => {
    if (!window.confirm(`Complete this care shift for ${activeGig.beneficiaryName}? Payout will credit to your wallet.`)) return;
    setSaving(true);
    try {
      await onUpdateGig(activeGig.id, {
        status: 'Completed',
        vitals: { bp, pulse, spo2, sugar },
        checklistCompleted: tasks,
        caregiverNotes: notes || 'Gig completed successfully.'
      });
      alert('Care gig completed successfully! Payout recorded in wallet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Active Gig Header Card */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#166534', textTransform: 'uppercase' }}>
              ● Ongoing Freelance Gig
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#F1F5F9', color: '#475569' }}>
              Ref: {activeGig.bookingNumber}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1B382B', margin: 0 }}>
            {activeGig.beneficiaryName}
          </h2>
          <p style={{ fontSize: '13px', color: '#5A6E63', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} color="#0B5D3B" />
            {activeGig.serviceAddress}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onTriggerSos(`Freelance caregiver ${caregiver.fullName} emergency beacon at ${activeGig.beneficiaryName} residence.`)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            <AlertTriangle size={15} /> Emergency SOS
          </button>

          <button
            onClick={handleCompleteGig}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11,93,59,0.25)' }}
          >
            <CheckCircle2 size={16} /> Complete & Claim Payout ✓
          </button>
        </div>
      </div>

      {/* Vitals & Checklist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Vitals Form */}
        <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} color="#166534" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Record Elder Vitals</h3>
              <p style={{ fontSize: '11px', color: '#688273', margin: '2px 0 0 0' }}>Syncs live to the Family and Admin dashboard</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>Blood Pressure</label>
              <input type="text" value={bp} onChange={e => setBp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>Pulse Rate</label>
              <input type="text" value={pulse} onChange={e => setPulse(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>Oxygen SpO2</label>
              <input type="text" value={spo2} onChange={e => setSpo2(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>Blood Sugar</label>
              <input type="text" value={sugar} onChange={e => setSugar(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>Visit Observations / Field Notes</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Note any assistance provided..." style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>

          <button onClick={handleSaveVitals} disabled={saving} style={{ width: '100%', padding: '12px', background: savedSuccess ? '#16A34A' : '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            {saving ? 'Syncing...' : (savedSuccess ? '✓ Vitals Synced' : 'Sync Vitals & Notes →')}
          </button>
        </div>

        {/* Tasks Checklist */}
        <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Required Gig Care Tasks</h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Tap as you complete duties:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map((task, idx) => (
              <div
                key={idx}
                onClick={() => toggleTask(idx)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px', borderRadius: '10px', cursor: 'pointer',
                  background: task.done ? '#F0FDF4' : '#F8FAF9',
                  border: task.done ? '1.5px solid #BBF7D0' : '1px solid #E5E9E6'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '6px', background: task.done ? '#16A34A' : '#FFF', border: task.done ? 'none' : '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                    {task.done && <Check size={12} />}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: task.done ? 700 : 500, color: task.done ? '#14532D' : '#334155' }}>{task.task}</span>
                </div>
                {task.time && <span style={{ fontSize: '10px', color: '#166534', fontWeight: 700 }}>{task.time}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
