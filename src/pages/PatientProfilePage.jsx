import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Phone, Calendar, Heart, ShieldAlert, FileText, Edit2, Save, X } from 'lucide-react';

export default function PatientProfilePage() {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    address: '',
    allergies: '',
    medical_history: '',
  });

  const fetchProfile = async () => {
    if (!user?.patient_id) return;
    try {
      setLoading(true);
      const res = await api.get(`/patients/${user.patient_id}`);
      setPatient(res.data);
      setFormData({
        full_name: res.data.full_name || '',
        phone: res.data.phone || '',
        date_of_birth: res.data.date_of_birth || '',
        gender: res.data.gender || '',
        blood_group: res.data.blood_group || '',
        emergency_contact_name: res.data.emergency_contact_name || '',
        emergency_contact_phone: res.data.emergency_contact_phone || '',
        address: res.data.address || '',
        allergies: res.data.allergies || '',
        medical_history: res.data.medical_history || '',
      });
    } catch (err) {
      error(err.message || 'Failed to load medical profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/patients/${user.patient_id}`, formData);
      success('Medical profile updated successfully');
      setIsEditing(false);
      fetchProfile();
      refreshUser();
    } catch (err) {
      error(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="app-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p className="text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="title-xl">Patient Medical Profile</h1>
            <p className="text-muted text-sm" style={{ marginTop: '0.2rem' }}>
              Your confidential clinical baseline, allergies, and emergency medical contacts.
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {isEditing ? <X size={15} /> : <Edit2 size={15} />}
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date_of_birth}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={formData.blood_group}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.emergency_contact_name}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.emergency_contact_phone}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--danger)' }}>Known Drug & Environmental Allergies</label>
              <textarea
                className="form-textarea"
                value={formData.allergies}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Latex, Sulfa drugs"
                style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Past Medical History / Chronic Conditions</label>
              <textarea
                className="form-textarea"
                value={formData.medical_history}
                disabled={!isEditing}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                placeholder="e.g. Hypertension, childhood asthma, previous surgeries"
                style={{ backgroundColor: !isEditing ? 'var(--slate-50)' : '#ffffff' }}
              />
            </div>

            {isEditing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
