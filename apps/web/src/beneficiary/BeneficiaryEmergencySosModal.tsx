import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Beneficiary } from './types';

interface BeneficiaryEmergencySosModalProps {
  beneficiary: Beneficiary;
  isOpen: boolean;
  onClose: () => void;
  onTriggerSos: (beneficiaryId: string, notes: string) => Promise<void>;
}

export const BeneficiaryEmergencySosModal: React.FC<BeneficiaryEmergencySosModalProps> = ({
  beneficiary,
  isOpen,
  onClose,
  onTriggerSos
}) => {
  const [notes, setNotes] = useState('Immediate caregiver or medical assistance requested by family.');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSending(true);
    try {
      await onTriggerSos(beneficiary.id, notes);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: '16px' }}>
      <div style={{ background: '#FFF', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '32px 28px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '2px solid #FECACA' }}>
          <AlertTriangle size={36} color="#DC2626" />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#991B1B', margin: '0 0 6px 0' }}>
          Emergency Rapid Response SOS
        </h3>
        <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 20px 0', lineHeight: 1.5 }}>
          This will trigger an immediate high-priority beacon in the Thodu Central Dispatch Console for <strong>{beneficiary.fullName}</strong>.
        </p>

        {success ? (
          <div style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', padding: '18px', borderRadius: '12px', color: '#166534', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <CheckCircle2 size={20} color="#166534" />
            SOS Beacon Sent! Dispatch Coordinator is calling now...
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', display: 'block', marginBottom: '6px' }}>
                Emergency Notes / Situation
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #FECACA', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '12px', color: '#991B1B' }}>
              <PhoneCall size={14} /> Coordinator Direct Line: <strong>+91 98480 22334</strong>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ flex: 1, padding: '12px', background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={sending}
                style={{ flex: 2, padding: '12px', background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}
              >
                {sending ? 'Dispatching...' : 'CONFIRM & DISPATCH SOS'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

