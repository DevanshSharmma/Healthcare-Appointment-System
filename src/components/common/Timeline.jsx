import React from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';

export default function Timeline({ status, createdAt, updatedAt }) {
  const normStatus = (status || '').toUpperCase();

  const steps = [
    { key: 'BOOKED', label: 'Appointment Booked', desc: 'Request submitted' },
    { key: 'CONFIRMED', label: 'Doctor Confirmed', desc: 'Slot reserved' },
    { key: 'CONSULTATION', label: 'Consultation In Progress', desc: 'Clinical review' },
    { key: 'COMPLETED', label: 'Consultation Completed', desc: 'Notes & prescription ready' },
  ];

  const isCancelled = normStatus === 'CANCELLED';
  const isRejected = normStatus === 'REJECTED';

  let currentStepIdx = 0;
  if (normStatus === 'PENDING') currentStepIdx = 0;
  else if (normStatus === 'CONFIRMED') currentStepIdx = 1;
  else if (normStatus === 'COMPLETED') currentStepIdx = 3;

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {isCancelled || isRejected ? (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: 'var(--danger)',
        }}>
          <X size={28} />
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '1.05rem' }}>
              Appointment {isCancelled ? 'Cancelled' : 'Rejected'}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
              This appointment lifecycle was terminated. The consultation slot has been released.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', position: 'relative', justifyContent: 'space-between' }}>
          {/* Connecting Track */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '3px',
            backgroundColor: 'var(--slate-200)',
            zIndex: 1,
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--primary)',
              width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>

          {/* Steps */}
          {steps.map((step, idx) => {
            const isPassed = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                  width: '120px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isPassed ? 'var(--primary)' : '#ffffff',
                    border: `2px solid ${isPassed ? 'var(--primary)' : 'var(--slate-300)'}`,
                    color: isPassed ? '#ffffff' : 'var(--slate-400)',
                    boxShadow: isCurrent ? '0 0 0 4px var(--primary-focus)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isPassed ? <Check size={18} /> : <Clock size={16} />}
                </div>
                <span style={{
                  marginTop: '0.65rem',
                  fontSize: '0.85rem',
                  fontWeight: isPassed ? 600 : 400,
                  color: isPassed ? 'var(--slate-900)' : 'var(--slate-500)',
                }}>
                  {step.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.15rem' }}>
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
