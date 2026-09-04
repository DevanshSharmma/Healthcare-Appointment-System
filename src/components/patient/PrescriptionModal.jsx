import React, { useState } from 'react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import { Plus, Trash2, Pill } from 'lucide-react';

export default function PrescriptionModal({ isOpen, onClose, appointment, onCreated }) {
  const { success, error } = useToast();
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([
      ...items,
      { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate each item
    for (const item of items) {
      if (!item.medicine_name.trim() || !item.dosage.trim() || !item.frequency.trim() || !item.duration.trim()) {
        error('Please fill in all required medication fields (Name, Dosage, Frequency, Duration).');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await api.post('/prescriptions', {
        appointment_id: appointment.id,
        notes: notes.trim() || null,
        items: items.map((it) => ({
          medicine_name: it.medicine_name.trim(),
          dosage: it.dosage.trim(),
          frequency: it.frequency.trim(),
          duration: it.duration.trim(),
          instructions: it.instructions?.trim() || null,
        })),
      });
      success('Digital prescription issued successfully');
      if (onCreated) onCreated(res.data);
      onClose();
    } catch (err) {
      error(err.message || 'Failed to generate prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue Digital Prescription — Apt #${appointment?.id}`}
      maxWidth="720px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="text-sm" style={{ fontWeight: 600 }}>Patient: {appointment?.patient_name}</p>
            <p className="text-muted text-xs">Doctor: {appointment?.doctor_name}</p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Plus size={15} color="var(--primary)" />
            <span>Add Medication</span>
          </button>
        </div>

        {/* Prescription Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--slate-50)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  <Pill size={15} color="var(--primary)" />
                  <span>Medication #{idx + 1}</span>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    style={{ color: 'var(--danger)', padding: '2px', display: 'flex' }}
                    title="Remove medicine"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
              }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Medicine Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Amoxicillin"
                    value={item.medicine_name}
                    onChange={(e) => handleItemChange(idx, 'medicine_name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Dosage *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 500 mg"
                    value={item.dosage}
                    onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Frequency *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Twice daily"
                    value={item.frequency}
                    onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Duration *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 7 days"
                    value={item.duration}
                    onChange={(e) => handleItemChange(idx, 'duration', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0, marginTop: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Instructions / Dietary Directions</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Take with water after breakfast"
                  value={item.instructions}
                  onChange={(e) => handleItemChange(idx, 'instructions', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-group" style={{ marginTop: '1.25rem' }}>
          <label className="form-label">Doctor's Clinical Notes / Pharmacist Instructions</label>
          <textarea
            className="form-textarea"
            placeholder="Special advisory, drug interaction warnings, refill policy..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Issuing...' : 'Issue Prescription'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
