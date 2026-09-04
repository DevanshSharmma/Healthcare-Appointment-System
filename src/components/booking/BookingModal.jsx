import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  DollarSign, 
  FileText,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ isOpen, onClose, doctor }) {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsData, setSlotsData] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState(null);

  // Set default date to tomorrow on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // Format YYYY-MM-DD
      const dateStr = tomorrow.toISOString().split('T')[0];
      setSelectedDate(dateStr);
      setSelectedSlot('');
      setReason('');
      setConfirmedAppt(null);
    }
  }, [isOpen, doctor]);

  // Fetch slots whenever selectedDate or doctor changes
  useEffect(() => {
    async function loadSlots() {
      if (!doctor?.id || !selectedDate) return;
      try {
        setSlotsLoading(true);
        const res = await api.get(`/availability/doctor/${doctor.id}/slots?date=${selectedDate}`);
        setSlotsData(res.data);
      } catch (err) {
        setSlotsData(null);
      } finally {
        setSlotsLoading(false);
      }
    }
    if (isOpen && doctor?.id && selectedDate) {
      loadSlots();
    }
  }, [doctor?.id, selectedDate, isOpen]);

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      error('Please sign in to complete your appointment booking.');
      navigate('/login');
      onClose();
      return;
    }

    if (!selectedSlot) {
      error('Please select an appointment time slot.');
      return;
    }

    if (!reason.trim()) {
      error('Please specify the reason for consultation.');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post('/appointments', {
        doctor_id: doctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot,
        reason: reason.trim(),
      });
      setConfirmedAppt(res.data);
      setStep(6); // Move to Step 6: Confirmation
      success('Appointment successfully scheduled!');
    } catch (err) {
      // 409 Conflict handled here
      error(err.message || 'Booking conflict: Slot is unavailable. Please select another slot.');
      // Refresh slots
      if (doctor?.id && selectedDate) {
        const slotsRes = await api.get(`/availability/doctor/${doctor.id}/slots?date=${selectedDate}`);
        setSlotsData(slotsRes.data);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 6 ? 'Booking Confirmed' : `Schedule Consultation — Dr. ${doctor?.full_name?.split(',')[0] || ''}`}
      maxWidth="620px"
    >
      {/* Step Progress Bar (hidden on final confirmation) */}
      {step < 6 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            <span>Step {step} of 5</span>
            <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
              {step === 1 && 'Confirm Specialist'}
              {step === 2 && 'Select Date'}
              {step === 3 && 'Choose Time Slot'}
              {step === 4 && 'Consultation Reason'}
              {step === 5 && 'Review & Confirm'}
            </span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--primary)',
              width: `${(step / 5) * 100}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* STEP 1: Doctor Overview */}
      {step === 1 && (
        <div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)',
          }}>
            <img
              src={doctor?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor?.full_name}`}
              alt={doctor?.full_name}
              style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
            />
            <div>
              <span className="badge badge-pending" style={{ marginBottom: '0.25rem' }}>
                {doctor?.specialization}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                {doctor?.full_name}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                {doctor?.hospital_name}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.35rem' }}>
                Consultation Fee: ${doctor?.consultation_fee?.toFixed(2)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setStep(2)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Continue to Date Selection</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date */}
      {step === 2 && (
        <div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Select Consultation Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
              }}
              className="form-input"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
            <span className="text-muted text-xs" style={{ marginTop: '0.35rem' }}>
              Select any upcoming weekday according to clinical availability.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedDate}
              onClick={() => setStep(3)}
              className="btn btn-primary"
            >
              <span>Select Time Slot</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose Time Slot */}
      {step === 3 && (
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)' }}>
              Available 30-Min Consultation Slots
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Date: {selectedDate}
            </span>
          </div>

          {slotsLoading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div className="skeleton" style={{ width: '100%', height: '120px' }} />
            </div>
          ) : !slotsData || !slotsData.is_working_day ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}>
              <AlertCircle size={28} color="var(--warning)" style={{ margin: '0 auto 0.5rem' }} />
              <h5 style={{ fontWeight: 600, color: 'var(--slate-800)' }}>No Scheduled Clinical Hours</h5>
              <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>
                Dr. {doctor?.full_name?.split(' ')[1]} is not scheduled for consultations on this day. Please pick another date.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
              gap: '0.65rem',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '0.5rem',
            }}>
              {slotsData.slots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.is_available}
                    onClick={() => setSelectedSlot(slot.time)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: isSelected
                        ? '2px solid var(--primary)'
                        : slot.is_available
                        ? '1px solid var(--border-color)'
                        : '1px solid var(--slate-200)',
                      backgroundColor: isSelected
                        ? 'var(--primary-light)'
                        : slot.is_available
                        ? '#ffffff'
                        : 'var(--slate-100)',
                      color: isSelected
                        ? 'var(--primary)'
                        : slot.is_available
                        ? 'var(--slate-800)'
                        : 'var(--slate-400)',
                      cursor: slot.is_available ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    title={slot.reason_unavailable || 'Available slot'}
                  >
                    <div>{slot.time}</div>
                    {!slot.is_available && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--danger)', fontWeight: 500, marginTop: '2px' }}>
                        Unavailable
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => setStep(4)}
              className="btn btn-primary"
            >
              <span>Provide Reason</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Reason for Visit */}
      {step === 4 && (
        <div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>
              Describe Symptoms or Reason for Visit
            </label>
            <textarea
              className="form-textarea"
              placeholder="Please provide details regarding your symptoms, medical concerns, or previous diagnoses..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
            <span className="text-muted text-xs">
              This information is protected under medical privacy and accessible only to your attending doctor.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button onClick={() => setStep(3)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              disabled={!reason.trim()}
              onClick={() => setStep(5)}
              className="btn btn-primary"
            >
              <span>Review Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Confirm */}
      {step === 5 && (
        <div>
          <div style={{
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.65rem' }}>
              <span className="text-muted text-sm">Consulting Specialist:</span>
              <strong style={{ fontSize: '0.9rem' }}>{doctor?.full_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.65rem' }}>
              <span className="text-muted text-sm">Hospital / Clinic:</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--slate-700)' }}>{doctor?.hospital_name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.65rem' }}>
              <span className="text-muted text-sm">Date & Time:</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                {selectedDate} at {selectedSlot}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.65rem' }}>
              <span className="text-muted text-sm">Consultation Fee:</span>
              <strong style={{ fontSize: '0.95rem' }}>${doctor?.consultation_fee?.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-muted text-sm" style={{ display: 'block', marginBottom: '0.25rem' }}>Reason for Visit:</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                {reason}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(4)} className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button
              disabled={bookingLoading}
              onClick={handleBookingSubmit}
              className="btn btn-primary"
            >
              {bookingLoading ? 'Reserving Slot...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Confirmation Screen */}
      {step === 6 && confirmedAppt && (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-light)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 className="title-lg" style={{ color: 'var(--success)', marginBottom: '0.35rem' }}>
            ✓ Appointment Confirmed
          </h3>
          <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
            Your consultation has been booked into the hospital schedule.
          </p>

          <div style={{
            backgroundColor: 'var(--slate-50)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted text-sm">Appointment Reference:</span>
              <strong style={{ color: 'var(--slate-900)' }}>#{confirmedAppt.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted text-sm">Doctor:</span>
              <strong style={{ color: 'var(--slate-900)' }}>{confirmedAppt.doctor_name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted text-sm">Date & Time:</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {confirmedAppt.appointment_date} at {confirmedAppt.appointment_time}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted text-sm">Initial Status:</span>
              <span className="badge badge-pending">PENDING CONFIRMATION</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => {
                onClose();
                navigate('/patient');
              }}
              className="btn btn-primary"
            >
              View in Dashboard
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
