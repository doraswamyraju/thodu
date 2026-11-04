import React, { useState } from 'react';
import {
  Calendar, Plus, Clock, Search, Filter, CheckCircle2, ChevronRight, User,
  MapPin, Phone, AlertCircle, FileText, X, Check, MoreVertical, Eye, Edit2, RotateCcw
} from 'lucide-react';
import { Beneficiary, CareBooking } from './types';

interface BeneficiaryBookingsProps {
  beneficiary: Beneficiary;
  bookings: CareBooking[];
  onOpenBookModal: () => void;
  onUpdateBooking?: (bookingId: string, updateData: any) => Promise<void>;
  onCancelBooking?: (bookingId: string) => Promise<void>;
  onRefresh?: () => void;
}

export const BeneficiaryBookings: React.FC<BeneficiaryBookingsProps> = ({
  beneficiary,
  bookings,
  onOpenBookModal,
  onUpdateBooking,
  onCancelBooking,
  onRefresh
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<CareBooking | null>(null);
  const [rescheduleBooking, setRescheduleBooking] = useState<CareBooking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('10:00 AM - 12:00 PM');
  const [updating, setUpdating] = useState(false);

  // Status Metrics
  const totalCount = bookings.length;
  const inProgressCount = bookings.filter(b => b.status === 'In Progress').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Scheduled').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  const filtered = bookings.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesQuery = !searchQuery ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.caregiverName && b.caregiverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.serviceAddress && b.serviceAddress.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !onUpdateBooking) return;
    setUpdating(true);
    try {
      await onUpdateBooking(rescheduleBooking.id, {
        scheduledDate: newDate || rescheduleBooking.scheduledDate,
        scheduledTimeSlot: newSlot,
        status: 'Scheduled'
      });
      setRescheduleBooking(null);
      if (onRefresh) onRefresh();
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelClick = async (booking: CareBooking) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${booking.bookingNumber}?`)) return;
    if (onCancelBooking) {
      await onCancelBooking(booking.id);
    } else if (onUpdateBooking) {
      await onUpdateBooking(booking.id, { status: 'Cancelled' });
    }
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 1. TOP METRICS STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="#166534" />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#688273', fontWeight: 700, textTransform: 'uppercase' }}>Total Visits</span>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#1B382B', margin: '2px 0 0 0' }}>{totalCount}</p>
          </div>
        </div>

        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} color="#1D4ED8" />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#688273', fontWeight: 700, textTransform: 'uppercase' }}>Active / In Transit</span>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#1D4ED8', margin: '2px 0 0 0' }}>{inProgressCount}</p>
          </div>
        </div>

        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#B45309" />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#688273', fontWeight: 700, textTransform: 'uppercase' }}>Scheduled / Confirmed</span>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#B45309', margin: '2px 0 0 0' }}>{confirmedCount}</p>
          </div>
        </div>

        <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #E5E9E6', padding: '18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#0B5D3B" />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#688273', fontWeight: 700, textTransform: 'uppercase' }}>Completed Visits</span>
            <p style={{ fontSize: '22px', fontWeight: 800, color: '#0B5D3B', margin: '2px 0 0 0' }}>{completedCount}</p>
          </div>
        </div>
      </div>

      {/* 2. MAIN BOOKINGS DATA TABLE CARD */}
      <div style={{ background: '#FFF', borderRadius: '20px', border: '1px solid #E5E9E6', padding: '24px 28px' }}>
        
        {/* Title Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Care Bookings & Schedule Management</h3>
            <p style={{ fontSize: '12px', color: '#688273', margin: '4px 0 0 0' }}>Manage, reschedule, and track all visits for <strong>{beneficiary.fullName}</strong></p>
          </div>
          
          <button
            onClick={onOpenBookModal}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#0B5D3B', color: '#FFF', border: 'none', padding: '11px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(11,93,59,0.25)' }}
          >
            <Plus size={16} /> Book Care Visit
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['ALL', 'In Progress', 'Confirmed', 'Scheduled', 'Completed', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '7px 16px', borderRadius: '20px', border: '1px solid #E5E9E6',
                  background: filterStatus === status ? '#0B5D3B' : '#FFF',
                  color: filterStatus === status ? '#FFF' : '#5A6E63',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {status === 'ALL' ? `All Bookings (${totalCount})` : status}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={14} color="#688273" style={{ position: 'absolute', left: 12, top: 11 }} />
            <input
              type="text"
              placeholder="Search booking ref, service, caregiver..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Bookings Table */}
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
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#8A9E93' }}>
                    <Calendar size={36} color="#CBD5E1" style={{ marginBottom: 8 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No care bookings found matching this filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F0F2F1' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0B5D3B' }}>
                      {b.bookingNumber}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1B382B' }}>
                      {b.serviceName}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5A6E63' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {b.scheduledDate} • {b.scheduledTimeSlot}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 600, color: b.caregiverName ? '#1B382B' : '#94A3B8' }}>
                        {b.caregiverName || 'Care Coordinator Dispatching...'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: b.fundingType === 'Trust Sponsored' ? '#E8F5E9' : '#FFF3E0', color: b.fundingType === 'Trust Sponsored' ? '#1B5E3C' : '#E65100' }}>
                        {b.fundingType}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: b.status === 'Completed' ? '#E8F5E9' : b.status === 'In Progress' ? '#E0F2FE' : b.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', color: b.status === 'Completed' ? '#1B5E3C' : b.status === 'In Progress' ? '#0369A1' : b.status === 'Cancelled' ? '#DC2626' : '#B45309' }}>
                        ● {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        {/* View Details Drawer / Modal */}
                        <button
                          onClick={() => setSelectedDetailBooking(b)}
                          title="View Visit Details & Checklist"
                          style={{ background: '#F1F5F3', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: '#0B5D3B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Eye size={13} /> View
                        </button>

                        {/* Reschedule Button (for scheduled/confirmed visits) */}
                        {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              setRescheduleBooking(b);
                              setNewDate(b.scheduledDate);
                              setNewSlot(b.scheduledTimeSlot);
                            }}
                            title="Reschedule Slot"
                            style={{ background: '#E0F2FE', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: '#0369A1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <RotateCcw size={12} /> Reschedule
                          </button>
                        )}

                        {/* Cancel Button */}
                        {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancelClick(b)}
                            title="Cancel Booking"
                            style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: '#DC2626', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL: BOOKING DETAIL DOSSIER & CLINICAL CHECKLIST */}
      {selectedDetailBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 130, padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '560px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0B5D3B', textTransform: 'uppercase' }}>Visit Dossier</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: '2px 0 0 0' }}>{selectedDetailBooking.bookingNumber}</h3>
              </div>
              <button onClick={() => setSelectedDetailBooking(null)} style={{ background: '#F1F5F3', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#F8FAF9', padding: '16px', borderRadius: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Service</span>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#1B382B', margin: '2px 0' }}>{selectedDetailBooking.serviceName}</p>
                  <p style={{ fontSize: '12px', color: '#5A6E63', margin: 0 }}>{selectedDetailBooking.scheduledDate} • {selectedDetailBooking.scheduledTimeSlot}</p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Caregiver</span>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#0B5D3B', margin: '2px 0' }}>{selectedDetailBooking.caregiverName || 'Unassigned'}</p>
                  <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>Verified Care Specialist</span>
                </div>
              </div>
            </div>

            {/* Vitals Recorded */}
            {selectedDetailBooking.vitals && (
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', marginBottom: '8px' }}>Home Clinical Vitals Recorded:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <div style={{ background: '#F0FDF4', padding: '10px 6px', borderRadius: '10px', textAlign: 'center', border: '1px solid #DCFCE7' }}>
                    <span style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>BP</span>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#14532D', margin: '2px 0 0 0' }}>{selectedDetailBooking.vitals.bp || '120/80'}</p>
                  </div>
                  <div style={{ background: '#F0FDF4', padding: '10px 6px', borderRadius: '10px', textAlign: 'center', border: '1px solid #DCFCE7' }}>
                    <span style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>Pulse</span>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#14532D', margin: '2px 0 0 0' }}>{selectedDetailBooking.vitals.pulse || '74'}</p>
                  </div>
                  <div style={{ background: '#F0FDF4', padding: '10px 6px', borderRadius: '10px', textAlign: 'center', border: '1px solid #DCFCE7' }}>
                    <span style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>SpO2</span>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#14532D', margin: '2px 0 0 0' }}>{selectedDetailBooking.vitals.spo2 || '98%'}</p>
                  </div>
                  <div style={{ background: '#F0FDF4', padding: '10px 6px', borderRadius: '10px', textAlign: 'center', border: '1px solid #DCFCE7' }}>
                    <span style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>Sugar</span>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#14532D', margin: '2px 0 0 0' }}>{selectedDetailBooking.vitals.sugar || '135'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Checklist */}
            {selectedDetailBooking.checklistCompleted && selectedDetailBooking.checklistCompleted.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', marginBottom: '8px' }}>Care Checklist Progress:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedDetailBooking.checklistCompleted.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: t.done ? '#E8F5E9' : '#F8FAF9', borderRadius: '8px', fontSize: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.done ? '#1B5E3C' : '#5A6E63', fontWeight: t.done ? 700 : 500 }}>
                        {t.done ? <CheckCircle2 size={15} color="#0B5D3B" /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #94A3B8' }} />}
                        {t.task}
                      </span>
                      {t.time && <span style={{ fontSize: '11px', color: '#688273' }}>{t.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Caregiver notes */}
            {selectedDetailBooking.caregiverNotes && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', color: '#7E9287', textTransform: 'uppercase', fontWeight: 700 }}>Caregiver Field Notes</span>
                <p style={{ fontSize: '12px', color: '#334155', background: '#F8FAF9', padding: '10px 12px', borderRadius: '8px', margin: '4px 0 0 0' }}>
                  {selectedDetailBooking.caregiverNotes}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedDetailBooking(null)}
              style={{ width: '100%', padding: '12px', background: '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL: RESCHEDULE VISIT */}
      {rescheduleBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 130, padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Reschedule Care Visit</h3>
                <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>Booking: <strong>{rescheduleBooking.bookingNumber}</strong></p>
              </div>
              <button onClick={() => setRescheduleBooking(null)} style={{ background: '#F1F5F3', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>New Preferred Date</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  placeholder="e.g. Mar 15, 2026 or Tomorrow"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>New Preferred Time Slot</label>
                <select
                  value={newSlot}
                  onChange={e => setNewSlot(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="8:00 AM - 10:00 AM">Morning (8:00 AM - 10:00 AM)</option>
                  <option value="10:00 AM - 12:00 PM">Late Morning (10:00 AM - 12:00 PM)</option>
                  <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM - 4:00 PM)</option>
                  <option value="5:00 PM - 7:00 PM">Evening (5:00 PM - 7:00 PM)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  style={{ flex: 1, padding: '12px', background: '#F1F5F3', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  style={{ flex: 2, padding: '12px', background: '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  {updating ? 'Rescheduling...' : 'Confirm Reschedule →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
