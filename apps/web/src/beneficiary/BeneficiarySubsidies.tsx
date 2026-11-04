import React from 'react';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, AlertCircle } from 'lucide-react';
import { Beneficiary } from './types';

interface BeneficiarySubsidiesProps {
  beneficiary: Beneficiary;
}

export const BeneficiarySubsidies: React.FC<BeneficiarySubsidiesProps> = ({ beneficiary }) => {
  return (
    <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={28} color="#0B5D3B" />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Philanthropic Partner Grant & Subsidies</h3>
          <p style={{ fontSize: '12px', color: '#688273', margin: '3px 0 0 0' }}>Empowering families through subsidized and grant-funded elder care</p>
        </div>
      </div>

      {/* Grant Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <div style={{ background: '#F8FAF9', border: '1px solid #E5E9E6', padding: '20px', borderRadius: '14px' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 800 }}>Funding Partner</span>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#0B5D3B', margin: '6px 0 2px 0' }}>Sri Divyang Seva Kendram Trust</p>
          <span style={{ fontSize: '12px', color: '#5A6E63' }}>Charitable Care Endowment</span>
        </div>

        <div style={{ background: '#F8FAF9', border: '1px solid #E5E9E6', padding: '20px', borderRadius: '14px' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 800 }}>Approved Subsidy Tier</span>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#1B5E3C', margin: '6px 0 2px 0' }}>
            {beneficiary.subsidyTier || '100% Trust Covered'}
          </p>
          <span style={{ fontSize: '12px', color: '#5A6E63' }}>100% Subsidized Care Visits</span>
        </div>

        <div style={{ background: '#F8FAF9', border: '1px solid #E5E9E6', padding: '20px', borderRadius: '14px' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 800 }}>Ration / Identity Record</span>
          <p style={{ fontSize: '15px', fontWeight: 800, color: '#334155', margin: '6px 0 2px 0' }}>
            {beneficiary.rationCardNumber || beneficiary.udidNumber || 'Verified BPL Card'}
          </p>
          <span style={{ fontSize: '12px', color: '#5A6E63' }}>Verified on Central Portal</span>
        </div>
      </div>

      {/* Explanatory Box */}
      <div style={{ borderLeft: '4px solid #0B5D3B', background: '#F8FAF9', padding: '18px 20px', borderRadius: '0 12px 12px 0' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1B382B', margin: 0 }}>How does the partner funding work?</h4>
        <p style={{ fontSize: '12px', color: '#5A6E63', margin: '6px 0 16px 0', lineHeight: 1.6 }}>
          Under our philanthropic collaboration with <strong>Sri Divyang Seva Kendram Trust</strong>, elderly individuals and disabled persons holding BPL or UDID cards receive verified daily living assistance with 0% family copay. The Trust directly settles caregiver remuneration from donor endowments.
        </p>

        <button
          onClick={() => alert(`Grant extension request submitted for ${beneficiary.fullName}. The Trust desk will contact ${beneficiary.primaryContact} within 4 working hours.`)}
          style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
        >
          Request Grant Extension / Additional Hours →
        </button>
      </div>
    </div>
  );
};
