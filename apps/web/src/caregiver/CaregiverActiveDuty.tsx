import React, { useState } from 'react';
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, Save, Heart, Shield,
  Activity, MapPin, Phone, User, Check, ArrowRight
} from 'lucide-react';
import { SalariedCaregiver, CaregiverVisit } from './types';

interface CaregiverActiveDutyProps {
  caregiver: SalariedCaregiver;
  activeVisit?: CaregiverVisit;
  onUpdateVisit: (visitId: string, updates: any) => Promise<void>;
  onTriggerSos: (notes: string) => Promise<void>;
}

export const CaregiverActiveDuty: React.FC<CaregiverActiveDutyProps> = ({
  caregiver,
  activeVisit,
  onUpdateVisit,
  onTriggerSos
}) => {
  const [bp, setBp] = useState(activeVisit?.vitals?.bp || '120/80');
  const [pulse, setPulse] = useState(activeVisit?.vitals?.pulse || '74 bpm');
  const [spo2, setSpo2] = useState(activeVisit?.vitals?.spo2 || '98%');
  const [sugar, setSugar] = useState(activeVisit?.vitals?.sugar || '135 mg/dL');
  const [notes, setNotes] = useState(activeVisit?.caregiverNotes || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state for checklist items
  const [tasks, setTasks] = useState(() => {
    if (activeVisit?.checklistCompleted && activeVisit.checklistCompleted.length > 0) {
      return activeVisit.checklistCompleted;
    }
    return [
      { task: 'Arrive at Home & Verify Elder Wellbeing', done: true, time: '10:00 AM' },
      { task: 'Record Clinical Vitals (BP, Pulse, SpO2, Blood Sugar)', done: true, time: '10:15 AM' },
      { task: 'Supervise Doctor-Prescribed Morning Medication', done: true, time: '10:35 AM' },
      { task: 'Assisted Walking / Gentle Mobility Exercise (20 mins)', done: false },
      { task: 'Nutritional Meal Preparation / Hydration Assistance', done: false },
      { task: 'Elder Comfort & Bedroom Safety Check', done: false }
    ];
  });

  if (!activeVisit) {
    return (
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '48px 24px', textAlign: 'center' }}>
        <Calendar size={48} color="#CBD5E1" style={{ marginBottom: 14 }} />
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: '0 0 6px 0' }}>No Active Care Visit In-Progress</h3>
        <p style={{ fontSize: '13px', color: '#688273', margin: '0 0 20px 0' }}>
          You do not have an ongoing care shift right now. Check your shift roster or clock in when you arrive at the beneficiary's home.
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

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await onUpdateVisit(activeVisit.id, {
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

  const handleCompleteVisit = async () => {
    if (!window.confirm(`Confirm completion of care shift for ${activeVisit.beneficiaryName}?`)) return;
    setSaving(true);
    try {
      await onUpdateVisit(activeVisit.id, {
        status: 'Completed',
        vitals: { bp, pulse, spo2, sugar },
        checklistCompleted: tasks,
        caregiverNotes: notes || 'Care visit completed successfully according to care plan.'
      });
      alert('Care shift marked as COMPLETED! Vitals and duty logs recorded.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. BENEFICIARY ON-DUTY HERO CARD */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#166534', textTransform: 'uppercase' }}>
              ● Shift In Progress
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#F1F5F9', color: '#475569' }}>
              Booking: {activeVisit.bookingNumber}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1B382B', margin: 0 }}>
            {activeVisit.beneficiaryName}
          </h2>
          <p style={{ fontSize: '13px', color: '#5A6E63', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={13} color="#0B5D3B" />
            {activeVisit.serviceAddress}
          </p>
          <p style={{ fontSize: '12px', color: '#7E9287', margin: '4px 0 0 0' }}>
            Guardian Contact: <strong>{activeVisit.guardianPhone || '+91 98765 43210'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onTriggerSos(`Caregiver ${caregiver.fullName} triggered emergency SOS at ${activeVisit.beneficiaryName}'s home!`)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', padding: '10px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            <AlertTriangle size={15} /> Emergency Alert
          </button>

          <button
            onClick={handleCompleteVisit}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11,93,59,0.25)' }}
          >
            <CheckCircle2 size={16} /> Complete Shift ✓
          </button>
        </div>
      </div>

      {/* 2. CLINICAL VITALS RECORDING & CHECKLIST GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Left Card: Clinical Vitals Input */}
        <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={20} color="#166534" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Record Home Clinical Vitals</h3>
              <p style={{ fontSize: '11px', color: '#688273', margin: '2px 0 0 0' }}>Syncs immediately to Family and Admin Console</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                value={bp}
                onChange={e => setBp(e.target.value)}
                placeholder="120/80"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Pulse Rate (BPM)
              </label>
              <input
                type="text"
                value={pulse}
                onChange={e => setPulse(e.target.value)}
                placeholder="74 bpm"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Oxygen SpO2 (%)
              </label>
              <input
                type="text"
                value={spo2}
                onChange={e => setSpo2(e.target.value)}
                placeholder="98%"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                Blood Sugar (mg/dL)
              </label>
              <input
                type="text"
                value={sugar}
                onChange={e => setSugar(e.target.value)}
                placeholder="135 mg/dL"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Caregiver Shift Observation Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Beneficiary was in good spirits. Assisted with breakfast and morning walk..."
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <button
            onClick={handleSaveProgress}
            disabled={saving}
            style={{ width: '100%', padding: '12px', background: savedSuccess ? '#16A34A' : '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            {saving ? 'Saving...' : (savedSuccess ? '✓ Vitals & Notes Saved!' : 'Save & Sync Vitals →')}
          </button>
        </div>

        {/* Right Card: Daily Care Checklist */}
        <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="#0B5D3B" /> Care Plan Checklist
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
              {tasks.filter(t => t.done).length} / {tasks.length} Done
            </span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
            Tap each task as you complete it during your visit:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((task, idx) => (
              <div
                key={idx}
                onClick={() => toggleTask(idx)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: task.done ? '#F0FDF4' : '#F8FAF9',
                  border: task.done ? '1.5px solid #BBF7D0' : '1px solid #E5E9E6',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '6px',
                    background: task.done ? '#16A34A' : '#FFF',
                    border: task.done ? 'none' : '2px solid #CBD5E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFF'
                  }}>
                    {task.done && <Check size={14} />}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: task.done ? 700 : 500, color: task.done ? '#14532D' : '#334155' }}>
                    {task.task}
                  </span>
                </div>

                {task.time && (
                  <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>
                    {task.time}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
