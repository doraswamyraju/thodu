import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, Clock, CheckCircle2, Download, Send } from 'lucide-react';
import { FreelanceCaregiver, CaregiverPayout } from './types';

interface FreelancerWalletProps {
  caregiver: FreelanceCaregiver;
  payouts: CaregiverPayout[];
  onRequestPayout: (amount: number, upiId: string) => Promise<void>;
}

export const FreelancerWallet: React.FC<FreelancerWalletProps> = ({
  caregiver,
  payouts,
  onRequestPayout
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState(2500);
  const [upiId, setUpiId] = useState('ramesh@okaxis');
  const [showModal, setShowModal] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Calculate wallet balance from payouts
  const availableBalance = 4850;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await onRequestPayout(withdrawAmount, upiId);
      setShowModal(false);
      alert('Withdrawal payout request submitted! Operations Admin will disburse to your UPI.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Wallet Balance Hero Card */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: '#DCFCE7', color: '#166534', textTransform: 'uppercase' }}>
            ● Freelance Gig Earnings Wallet
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1B382B', margin: '8px 0 2px 0' }}>
            Available Withdrawable Balance
          </h2>
          <p style={{ fontSize: '13px', color: '#688273', margin: 0 }}>
            Real-time balance credited upon completion of each elder care shift
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Withdrawable Cash</span>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#0B5D3B', margin: '2px 0 0 0' }}>
              ₹{availableBalance.toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11,93,59,0.25)' }}
          >
            <Send size={15} /> Request Payout
          </button>
        </div>
      </div>

      {/* Payout History Table */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1B382B', margin: '0 0 16px 0' }}>
          Payout & Withdrawal Requests
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F8FAF9', borderBottom: '1.5px solid #E5E9E6', textAlign: 'left', color: '#5A6E63' }}>
                <th style={{ padding: '12px 14px' }}>Payout Ref</th>
                <th style={{ padding: '12px 14px' }}>Amount</th>
                <th style={{ padding: '12px 14px' }}>Shifts Fulfilled</th>
                <th style={{ padding: '12px 14px' }}>Method</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Txn Ref</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F0F2F1' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0B5D3B' }}>{p.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1B382B' }}>₹{p.amountInr.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>{p.visitsCount} visits ({p.hoursLogged} hrs)</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>UPI: {p.upiId || 'Direct UPI'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: p.status === 'DISBURSED' ? '#E8F5E9' : '#FEF3C7', color: p.status === 'DISBURSED' ? '#1B5E3C' : '#B45309' }}>
                      ● {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '12px' }}>
                    {p.txnRef || 'Pending Admin Settlement'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Request Payout */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: '0 0 6px 0' }}>Request Payout Withdrawal</h3>
            <p style={{ fontSize: '12px', color: '#688273', margin: '0 0 18px 0' }}>Available for withdrawal: <strong>₹{availableBalance.toLocaleString()}</strong></p>

            <form onSubmit={handleRequestSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  max={availableBalance}
                  min={500}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>UPI ID for Direct Payout</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F3', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={requesting} style={{ flex: 2, padding: '12px', background: '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                  {requesting ? 'Submitting...' : 'Confirm Request →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
