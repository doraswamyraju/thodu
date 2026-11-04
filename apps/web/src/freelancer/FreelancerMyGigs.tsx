import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Search, Filter, MapPin, Eye, X } from 'lucide-react';
import { GigBroadcastBooking } from './types';

interface FreelancerMyGigsProps {
  gigs: GigBroadcastBooking[];
}

export const FreelancerMyGigs: React.FC<FreelancerMyGigsProps> = ({ gigs }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = gigs.filter(g => {
    const matchesFilter = filter === 'ALL' || g.status === filter;
    const matchesSearch = !search ||
      g.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      g.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      g.bookingNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>My Accepted Gigs & Completed Shifts</h3>
          <p style={{ fontSize: '12px', color: '#688273', margin: '3px 0 0 0' }}>All visits fulfilled by you across Tirupati</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'In Progress', 'Confirmed', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1px solid #E5E9E6',
                background: filter === status ? '#0B5D3B' : '#FFF',
                color: filter === status ? '#FFF' : '#5A6E63',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8FAF9', borderBottom: '1.5px solid #E5E9E6', textAlign: 'left', color: '#5A6E63' }}>
              <th style={{ padding: '12px 14px' }}>Ref #</th>
              <th style={{ padding: '12px 14px' }}>Beneficiary</th>
              <th style={{ padding: '12px 14px' }}>Service Name</th>
              <th style={{ padding: '12px 14px' }}>Date & Schedule</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px' }}>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A9E93' }}>
                  No care gigs found for this filter.
                </td>
              </tr>
            ) : (
              filtered.map(g => (
                <tr key={g.id} style={{ borderBottom: '1px solid #F0F2F1' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0B5D3B' }}>{g.bookingNumber}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1B382B' }}>{g.beneficiaryName}</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>{g.serviceName}</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>{g.scheduledDate} • {g.scheduledTimeSlot}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: g.status === 'Completed' ? '#E8F5E9' : '#FEF3C7', color: g.status === 'Completed' ? '#1B5E3C' : '#B45309' }}>
                      ● {g.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, color: '#166534' }}>
                    ₹{Math.round((g.totalAmountPaise || 45000) / 100 * 0.75)}
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

