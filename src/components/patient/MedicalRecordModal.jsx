import React, { useState } from 'react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';

export default function MedicalRecordModal({ isOpen, onClose, appointment, onCreated }) {
  const { success, error } = useToast();
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim() || !symptoms.trim()) {
      error('Diagnosis and symptoms are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/medical-records', {
        appointment_id: appointment.id,
        diagnosis: diagnosis.trim(),
        symptoms: symptoms.trim(),
        clinical_notes: clinicalNotes.trim() || null,
        treatment_plan: treatmentPlan.trim() || null,
        follow_up_date: followUpDate || null,
      });
      success('Electronic medical record saved successfully');
      if (onCreated) onCreated(res.data);
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Clinical Medical Record — Apt #${appointment?.id}`}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Patient</label>
          <input
            type="text"
            className="form-input"
            value={appointment?.patient_name || ''}
            disabled
            style={{ backgroundColor: 'var(--slate-50)' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Primary Diagnosis *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Essential hypertension, Sinus tachycardia"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Presenting Symptoms *</label>
          <textarea
            className="form-textarea"
            placeholder="Describe patient reported symptoms and observations..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Doctor Examination & Clinical Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Vital signs, auscultation findings, lab orders..."
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Treatment Plan & Recommendations</label>
          <textarea
            className="form-textarea"
            placeholder="Therapy recommendations, dietary advice, activity limits..."
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Recommended Follow-up Date</label>
          <input
            type="date"
            className="form-input"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving Record...' : 'Save Medical Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
