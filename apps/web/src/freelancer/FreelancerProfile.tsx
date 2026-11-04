import React from 'react';
import { User, ShieldCheck, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { FreelanceCaregiver } from './types';

interface FreelancerProfileProps {
  caregiver: FreelanceCaregiver;
}

export const FreelancerProfile: React.FC<FreelancerProfileProps> = ({ caregiver }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: '18px', background: caregiver.avatarBg || '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800, color: '#0369A1', border: '1.5px solid #BAE6FD' }}>
            {caregiver.fullName?.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1B382B', margin: 0 }}>{caregiver.fullName}</h2>
            <p style={{ fontSize: '12px', color: '#0369A1', fontWeight: 700, margin: '2px 0 0 0' }}>
              Ref: {caregiver.refNumber} • {caregiver.employmentType}
            </p>
            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-block', marginTop: 4 }}>
              ★ {caregiver.rating} ({caregiver.ratingReviewsCount} Family Reviews)
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: '#F8FAF9', padding: '12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Service Zone</span>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1B382B', margin: '2px 0 0 0' }}>{caregiver.zone}</p>
          </div>
          <div style={{ background: '#F8FAF9', padding: '12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Experience</span>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1B382B', margin: '2px 0 0 0' }}>{caregiver.experienceYears || 8} Years</p>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Specialized Skills</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '6px' }}>
            {caregiver.skills && caregiver.skills.map((s, idx) => (
              <span key={idx} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={20} color="#0B5D3B" /> Partner Verification Badges
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F8FAF9', borderRadius: '10px' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Aadhaar Identity Verification</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#688273' }}>{caregiver.aadhaarNumber || 'Verified'}</p>
            </div>
            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              ✓ KYC Verified
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#F8FAF9', borderRadius: '10px' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Police Clearance Record</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#688273' }}>Clearance Verified</p>
            </div>
            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              ✓ Clean
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', fontSize: '12px', color: '#5A6E63' }}>
          Contact: <strong>{caregiver.phone}</strong> • {caregiver.email}
        </div>
      </div>
    </div>
  );
};

