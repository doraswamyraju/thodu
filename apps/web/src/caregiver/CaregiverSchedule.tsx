import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Search, Filter, MapPin, Eye, X } from 'lucide-react';
import { CaregiverVisit } from './types';

interface CaregiverScheduleProps {
  visits: CaregiverVisit[];
}

export const CaregiverSchedule: React.FC<CaregiverScheduleProps> = ({ visits }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<CaregiverVisit | null>(null);

  const filtered = visits.filter(v => {
    const matchesFilter = filter === 'ALL' || v.status === filter;
    const matchesSearch = !search ||
      v.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      v.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      v.bookingNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>My Shift Schedule & History</h3>
          <p style={{ fontSize: '12px', color: '#688273', margin: '3px 0 0 0' }}>All scheduled, completed, and past care visits assigned to you</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'In Progress', 'Scheduled', 'Completed'].map(status => (
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

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F8FAF9', borderBottom: '1.5px solid #E5E9E6', textAlign: 'left', color: '#5A6E63' }}>
              <th style={{ padding: '12px 14px' }}>Booking Ref</th>
              <th style={{ padding: '12px 14px' }}>Beneficiary</th>
              <th style={{ padding: '12px 14px' }}>Service</th>
              <th style={{ padding: '12px 14px' }}>Date & Slot</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#8A9E93' }}>
                  No shifts found matching this filter.
                </td>
              </tr>
            ) : (
              filtered.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #F0F2F1' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0B5D3B' }}>{v.bookingNumber}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1B382B' }}>{v.beneficiaryName}</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>{v.serviceName}</td>
                  <td style={{ padding: '12px 14px', color: '#5A6E63' }}>{v.scheduledDate} • {v.scheduledTimeSlot}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: v.status === 'Completed' ? '#E8F5E9' : v.status === 'In Progress' ? '#DCFCE7' : '#FEF3C7', color: v.status === 'Completed' ? '#1B5E3C' : v.status === 'In Progress' ? '#166534' : '#B45309' }}>
                      ● {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedVisit(v)}
                      style={{ background: '#F1F5F3', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: '#0B5D3B', cursor: 'pointer' }}
                    >
                      <Eye size={12} style={{ display: 'inline', marginRight: 4 }} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedVisit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#1B382B' }}>Shift Details ({selectedVisit.bookingNumber})</h3>
              <button onClick={() => setSelectedVisit(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>{selectedVisit.beneficiaryName}</p>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#5A6E63' }}>{selectedVisit.serviceAddress}</p>
            {selectedVisit.vitals && (
              <div style={{ background: '#F8FAF9', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px' }}>
                <strong>Vitals:</strong> BP {selectedVisit.vitals.bp || '120/80'} • Pulse {selectedVisit.vitals.pulse || '74'} • SpO2 {selectedVisit.vitals.spo2 || '98%'} • Sugar {selectedVisit.vitals.sugar || '135'}
              </div>
            )}
            <button onClick={() => setSelectedVisit(null)} style={{ width: '100%', padding: '10px', background: '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
