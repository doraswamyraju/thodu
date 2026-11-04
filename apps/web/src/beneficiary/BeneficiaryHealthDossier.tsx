import React from 'react';
import { Heart, ShieldCheck, Activity, Phone, FileText, UserCheck } from 'lucide-react';
import { Beneficiary } from './types';

interface BeneficiaryHealthDossierProps {
  beneficiary: Beneficiary;
}

export const BeneficiaryHealthDossier: React.FC<BeneficiaryHealthDossierProps> = ({ beneficiary }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
      {/* Clinical Profile Card */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} color="#DC2626" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Clinical Care Profile</h3>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>Diagnosed conditions & mobility needs</p>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 800 }}>Diagnosed Conditions</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '8px' }}>
            {beneficiary.medicalConditions && beneficiary.medicalConditions.length > 0 ? (
              beneficiary.medicalConditions.map((c, idx) => (
                <span key={idx} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  {c}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#64748B' }}>Age-related daily assistance</span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#F8FAF9', padding: '14px', borderRadius: '12px' }}>
            <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Blood Group</span>
            <p style={{ fontSize: '16px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>{beneficiary.bloodGroup || 'O+'}</p>
          </div>
          <div style={{ background: '#F8FAF9', padding: '14px', borderRadius: '12px' }}>
            <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Mobility Level</span>
            <p style={{ fontSize: '15px', fontWeight: 800, color: '#1B382B', margin: '4px 0 0 0' }}>{beneficiary.mobilityStatus || 'Assisted Walking'}</p>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Drug / Food Allergies</span>
          <div style={{ marginTop: '6px', background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px', borderRadius: '10px', color: '#B91C1C', fontSize: '13px', fontWeight: 600 }}>
            {beneficiary.allergies || 'No known drug or food allergies recorded.'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Daily Living & Accessibility Notes</span>
          <p style={{ fontSize: '13px', color: '#475569', margin: '6px 0 0 0', lineHeight: 1.5 }}>
            {beneficiary.accessibilityNeeds || 'Walking accompaniment, diabetic diet supervision, gentle knee exercise.'}
          </p>
        </div>
      </div>

      {/* Doctor & Identity Dossier */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} color="#0B5D3B" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Doctor & Identity Verification</h3>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>Attending doctor & registered documents</p>
          </div>
        </div>

        {/* Doctor Info Box */}
        <div style={{ background: '#F8FAF9', border: '1.5px solid #E5E9E6', padding: '18px', borderRadius: '14px' }}>
          <p style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 800, margin: 0 }}>Primary Attending Physician</p>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: '4px 0' }}>{beneficiary.emergencyDoctorName || 'Dr. S. K. Raman (Apollo Tirupati)'}</p>
          <p style={{ fontSize: '13px', color: '#0B5D3B', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Phone size={13} /> {beneficiary.emergencyDoctorPhone || '+91 98480 11223'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#F8FAF9', padding: '14px', borderRadius: '12px' }}>
            <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Aadhaar Card</span>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#334155', margin: '4px 0 0 0' }}>{beneficiary.aadhaarNumber || 'Verified'}</p>
          </div>
          {beneficiary.udidNumber ? (
            <div style={{ background: '#F8FAF9', padding: '14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>UDID Disability ID</span>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0B5D3B', margin: '4px 0 0 0' }}>{beneficiary.udidNumber}</p>
            </div>
          ) : (
            <div style={{ background: '#F8FAF9', padding: '14px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Verification Tier</span>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#1B5E3C', margin: '4px 0 0 0' }}>Direct KYC Verified</p>
            </div>
          )}
        </div>

        <div>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Emergency Guardian Contacts</span>
          <div style={{ marginTop: '6px', background: '#F8FAF9', padding: '12px 16px', borderRadius: '12px', fontSize: '13px' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#1B382B' }}>
              {beneficiary.primaryGuardian || 'Anita Sharma'} ({beneficiary.relationship || 'Guardian'})
            </p>
            <p style={{ margin: 0, color: '#5A6E63' }}>
              Primary: <strong>{beneficiary.primaryContact}</strong>
              {beneficiary.alternateGuardianPhone && ` • Alternate: ${beneficiary.alternateGuardianPhone}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
