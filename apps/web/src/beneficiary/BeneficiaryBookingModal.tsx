import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, ShieldCheck, Heart, User, MapPin, HelpCircle } from 'lucide-react';
import { Beneficiary, CareService } from './types';

interface BeneficiaryBookingModalProps {
  beneficiary: Beneficiary;
  services?: CareService[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => Promise<void>;
}

export const BeneficiaryBookingModal: React.FC<BeneficiaryBookingModalProps> = ({
  beneficiary,
  services = [],
  isOpen,
  onClose,
  onSubmit
}) => {
  // Default to first active service or fallback to basic
  const activeServices = services.filter(s => s.isActive !== false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => activeServices[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [fundingRoute, setFundingRoute] = useState<'SUBSIDY' | 'SELF'>('SUBSIDY');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentService = activeServices.find(s => s.id === selectedServiceId) || activeServices[0];
  const isEnquiryOnly = currentService?.pricingType === 'ENQUIRY_CUSTOM';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isSubsidized = fundingRoute === 'SUBSIDY';
      const baseFeePaise = isEnquiryOnly ? 0 : (currentService?.pricePaise || 45000);
      
      await onSubmit({
        beneficiaryName: beneficiary.fullName,
        serviceName: currentService?.name || 'Household Support',
        scheduledDate,
        scheduledTimeSlot: timeSlot,
        serviceAddress: beneficiary.address || 'Tirupati, Andhra Pradesh',
        fundingType: isSubsidized ? 'Trust Sponsored' : (isEnquiryOnly ? 'Custom Enquiry' : 'Family Paid'),
        totalAmountPaise: baseFeePaise,
        subsidyAmountPaise: isSubsidized ? baseFeePaise : 0,
        familyPayablePaise: isSubsidized ? 0 : baseFeePaise,
        paymentMode: isSubsidized ? 'TRUST_GRANT' : (isEnquiryOnly ? 'ENQUIRY_CUSTOM' : 'ONLINE_UPI'),
        paymentStatus: isSubsidized ? 'SUBSIDIZED' : (isEnquiryOnly ? 'PENDING' : 'PAID'),
        specialNotes: isEnquiryOnly 
          ? `[CUSTOM ENQUIRY: Coordinator will call with quote] ${specialNotes}` 
          : specialNotes
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '16px' }}>
      <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '540px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1B382B', margin: 0 }}>Schedule Caregiver Visit</h3>
            <p style={{ fontSize: '12px', color: '#688273', margin: '2px 0 0 0' }}>For loved one: <strong>{beneficiary.fullName}</strong></p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F3', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5A6E63' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dynamic Service Selector from Database */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#1B382B' }}>Care Service Required</label>
            <select
              value={currentService?.id || selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
            >
              {activeServices.length > 0 ? (
                activeServices.map(srv => {
                  const label = srv.pricingType === 'ENQUIRY_CUSTOM'
                    ? `${srv.name} (Price on Enquiry)`
                    : `${srv.name} (₹${(srv.pricePaise || 0) / 100} / ${srv.durationHours || 2} hrs)`;
                  return (
                    <option key={srv.id} value={srv.id}>
                      {label}
                    </option>
                  );
                })
              ) : (
                <>
                  <option value="srv-1">Household Support & Meal Preparation (₹450 / 2 hrs)</option>
                  <option value="srv-2">Bedside & Mobility Assistance (₹500 / 2 hrs)</option>
                  <option value="srv-3">Medication & Vitals Supervision (₹400 / 1.5 hrs)</option>
                  <option value="srv-4">Companion Care & Assisted Walking (₹400 / 2 hrs)</option>
                  <option value="srv-5">Physiotherapy & Rehabilitation (₹600 / 1.5 hrs)</option>
                  <option value="srv-6">24/7 Live-in Critical Elder Care (Price on Enquiry)</option>
                </>
              )}
            </select>

            {/* Service Description Banner */}
            {currentService && (
              <div style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '8px', background: isEnquiryOnly ? '#EFF6FF' : '#F8FAF9', border: `1px solid ${isEnquiryOnly ? '#BFDBFE' : '#E5E9E6'}`, fontSize: '11px', color: isEnquiryOnly ? '#1E40AF' : '#5A6E63' }}>
                {isEnquiryOnly ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <HelpCircle size={14} color="#2563EB" />
                    <span><strong>Custom Enquiry Service:</strong> {currentService.description} Price will be quoted by Care Coordinator after assessment.</span>
                  </div>
                ) : (
                  <span>{currentService.description}</span>
                )}
              </div>
            )}
          </div>

          {/* Schedule Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#1B382B' }}>Visit Date</label>
              <input
                type="text"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#1B382B' }}>Preferred Slot</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
              >
                <option value="8:00 AM - 10:00 AM">Morning (8:00 AM - 10:00 AM)</option>
                <option value="10:00 AM - 12:00 PM">Late Morning (10:00 AM - 12:00 PM)</option>
                <option value="2:00 PM - 4:00 PM">Afternoon (2:00 PM - 4:00 PM)</option>
                <option value="5:00 PM - 7:00 PM">Evening (5:00 PM - 7:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Funding Choice */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#1B382B' }}>Care Financing Route</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => setFundingRoute('SUBSIDY')}
                style={{
                  padding: '12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                  border: fundingRoute === 'SUBSIDY' ? '2px solid #0B5D3B' : '1.5px solid #E2E8F0',
                  background: fundingRoute === 'SUBSIDY' ? '#E8F5E9' : '#FFF'
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0B5D3B', margin: 0 }}>Partner Subsidy Grant</p>
                <p style={{ fontSize: '10px', color: '#5A6E63', margin: '3px 0 0 0' }}>Covered under Sri Divyang Seva Kendram Trust</p>
              </button>

              <button
                type="button"
                onClick={() => setFundingRoute('SELF')}
                style={{
                  padding: '12px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                  border: fundingRoute === 'SELF' ? '2px solid #0B5D3B' : '1.5px solid #E2E8F0',
                  background: fundingRoute === 'SELF' ? '#E8F5E9' : '#FFF'
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B382B', margin: 0 }}>
                  {isEnquiryOnly ? 'Custom Invoice' : 'Direct Family Pay'}
                </p>
                <p style={{ fontSize: '10px', color: '#5A6E63', margin: '3px 0 0 0' }}>
                  {isEnquiryOnly ? 'Invoice issued post-assessment' : 'Pay digitally via UPI or Card'}
                </p>
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#1B382B' }}>
              {isEnquiryOnly ? 'Describe Patient Needs & Clinical Details *' : 'Caregiver Instructions / Dietary Needs'}
            </label>
            <textarea
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder={isEnquiryOnly ? "Describe condition, doctor instructions, oxygen/mobility requirement..." : "e.g. Ensure blood pressure is recorded before meal..."}
              rows={3}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', padding: '14px', background: '#0B5D3B', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {submitting ? 'Dispatching...' : (isEnquiryOnly ? 'Submit Custom Care Enquiry →' : 'Confirm & Dispatch Booking →')}
          </button>
        </form>
      </div>
    </div>
  );
};
