import React from 'react';
import { DollarSign, Award, Calendar, CheckCircle2, FileText, Download } from 'lucide-react';
import { SalariedCaregiver } from './types';

interface CaregiverEarningsProps {
  caregiver: SalariedCaregiver;
  completedVisitsCount: number;
}

export const CaregiverEarnings: React.FC<CaregiverEarningsProps> = ({
  caregiver,
  completedVisitsCount
}) => {
  const baseSalary = caregiver.monthlySalaryInr || 22000;
  const shiftIncentive = completedVisitsCount * 150; // Incentive per visit completed above threshold
  const totalPayable = baseSalary + shiftIncentive;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. MONTHLY SALARY SUMMARY */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#166534', textTransform: 'uppercase' }}>
            ● Regular Staff Monthly Payroll
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1B382B', margin: '8px 0 2px 0' }}>
            Current Month Compensation
          </h2>
          <p style={{ fontSize: '13px', color: '#688273', margin: 0 }}>
            Pay Period: <strong>November 1 - November 30, 2026</strong> • Bank Transfer on 1st
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Net Estimated Salary</span>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0 0 0' }}>
            ₹{totalPayable.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 2. SALARY BREAKDOWN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Base Staff Pay</span>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#1B382B', margin: '6px 0 2px 0' }}>₹{baseSalary.toLocaleString()}</p>
          <span style={{ fontSize: '12px', color: '#5A6E63' }}>Guaranteed Monthly Salary</span>
        </div>

        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Shift Performance Bonus</span>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#16A34A', margin: '6px 0 2px 0' }}>+ ₹{shiftIncentive.toLocaleString()}</p>
          <span style={{ fontSize: '12px', color: '#5A6E63' }}>{completedVisitsCount} shifts completed this cycle</span>
        </div>

        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>PF & ESIC Insurance</span>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#0369A1', margin: '6px 0 2px 0' }}>Covered (100%)</p>
          <span style={{ fontSize: '12px', color: '#5A6E63' }}>Health & Accidental Coverage Active</span>
        </div>
      </div>

      {/* 3. RECENT PAYROLL SLIPS */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1B382B', margin: '0 0 16px 0' }}>Official Salary Slips</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { month: 'October 2026', amount: '₹23,500', status: 'Disbursed', date: '01 Nov 2026' },
            { month: 'September 2026', amount: '₹22,800', status: 'Disbursed', date: '01 Oct 2026' },
            { month: 'August 2026', amount: '₹22,000', status: 'Disbursed', date: '01 Sep 2026' }
          ].map((slip, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F8FAF9', borderRadius: '12px', fontSize: '13px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#1B382B' }}>Payslip — {slip.month}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#688273' }}>Disbursed on {slip.date} via Bank Transfer</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontWeight: 800, color: '#0B5D3B' }}>{slip.amount}</span>
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {slip.status}
                </span>
                <button
                  onClick={() => alert(`Downloading salary slip for ${slip.month}...`)}
                  style={{ background: '#FFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Download size={12} /> Slip
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
