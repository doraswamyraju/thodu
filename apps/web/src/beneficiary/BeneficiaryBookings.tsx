import React, { useState } from 'react';
import { Calendar, Plus, Clock, Search, Filter, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { Beneficiary, CareBooking } from './types';

interface BeneficiaryBookingsProps {
  beneficiary: Beneficiary;
  bookings: CareBooking[];
  onOpenBookModal: () => void;
}

export const BeneficiaryBookings: React.FC<BeneficiaryBookingsProps> = ({
  beneficiary,
  bookings,
  onOpenBookModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = bookings.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesQuery = !searchQuery ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.caregiverName && b.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  return (
    <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Care Bookings & Schedule History</h3>
          <p style={{ fontSize: '12px', color: '#688273', margin: '4px 0 0 0' }}>All scheduled, ongoing, and completed care visits for {beneficiary.fullName}</p>
        </div>
        <button
          onClick={onOpenBookModal}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '11px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11,93,59,0.2)' }}
        >
          <Plus size={16} /> Book Care Visit
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['ALL', 'In Progress', 'Confirmed', 'Scheduled', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1px solid #E5E9E6',
                background: filterStatus === status ? '#0B5D3B' : '#FFF',
                color: filterStatus === status ? '#FFF' : '#5A6E63',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {status === 'ALL' ? 'All Bookings' : status}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={14} color="#688273" style={{ position: 'absolute', left: 12, top: 11 }} />
          <input
            type="text"
            placeholder="Search booking ref, service..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8FAF9', borderBottom: '1.5px solid #E5E9E6', textAlign: 'left', color: '#5A6E63' }}>
              <th style={{ padding: '12px 14px' }}>Booking Ref</th>
              <th style={{ padding: '12px 14px' }}>Care Service</th>
              <th style={{ padding: '12px 14px' }}>Date & Schedule</th>
              <th style={{ padding: '12px 14px' }}>Assigned Caregiver</th>
              <th style={{ padding: '12px 14px' }}>Funding Tier</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A9E93' }}>
                  No care bookings found matching your filter.
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #F0F2F1' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0B5D3B' }}>{b.bookingNumber}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1B382B' }}>{b.serviceName}</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>{b.scheduledDate} • {b.scheduledTimeSlot}</td>
                  <td style={{ padding: '12px 14px' }}>{b.caregiverName || 'Dispatching...'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: b.fundingType === 'Trust Sponsored' ? '#E8F5E9' : '#FFF3E0', color: b.fundingType === 'Trust Sponsored' ? '#1B5E3C' : '#E65100' }}>
                      {b.fundingType}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: b.status === 'Completed' ? '#E8F5E9' : b.status === 'In Progress' ? '#E0F2FE' : '#FEF3C7', color: b.status === 'Completed' ? '#1B5E3C' : b.status === 'In Progress' ? '#0369A1' : '#B45309' }}>
                      ● {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

