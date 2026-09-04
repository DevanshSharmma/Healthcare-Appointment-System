import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Timeline from '../components/common/Timeline';
import Badge from '../components/common/Badge';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  Pill, 
  Printer, 
  AlertCircle 
} from 'lucide-react';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [appointment, setAppointment] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/appointments/${id}`);
      setAppointment(res.data);

      // Attempt loading associated record & prescription
      if (res.data.patient_id) {
        try {
          const recRes = await api.get(`/medical-records/patient/${res.data.patient_id}`);
          const matchedRec = recRes.data.records?.find((r) => r.appointment_id === Number(id));
          if (matchedRec) setMedicalRecord(matchedRec);
        } catch (e) {}

        try {
          const rxRes = await api.get(`/prescriptions/patient/${res.data.patient_id}`);
          const matchedRx = rxRes.data.prescriptions?.find((r) => r.appointment_id === Number(id));
          if (matchedRx) setPrescription(matchedRx);
        } catch (e) {}
      }
    } catch (err) {
      error(err.message || 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCancel = async () => {
    const reason = window.prompt('Please provide a reason for cancelling:');
    if (!reason) return;
    try {
      await api.put(`/appointments/${id}/cancel`, { cancellation_reason: reason });
      success('Appointment cancelled.');
      fetchDetails();
    } catch (err) {
      error(err.message || 'Cancellation failed.');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="app-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p className="text-muted">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="page-wrapper">
        <div className="app-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 className="title-md">Appointment Not Found</h2>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '900px' }}>
        {/* Back navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} />
            <span>Print Summary</span>
          </button>
        </div>

        {/* Primary Overview Card */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Consultation Case File
              </span>
              <h1 className="title-lg" style={{ marginTop: '0.2rem' }}>
                Appointment #{appointment.id}
              </h1>
              <p className="text-muted text-xs">
                Requested on {new Date(appointment.created_at).toLocaleString()}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Badge status={appointment.status} />
              {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                <button
                  onClick={handleCancel}
                  className="btn btn-sm"
                  style={{ color: 'var(--danger)', border: '1px solid var(--danger-border)' }}
                >
                  Cancel Visit
                </button>
              )}
            </div>
          </div>

          {/* Visual Lifecycle Timeline */}
          <div style={{
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
          }}>
            <Timeline
              status={appointment.status}
              createdAt={appointment.created_at}
              updatedAt={appointment.updated_at}
            />
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              backgroundColor: '#ffffff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                <Stethoscope size={18} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Attending Physician</h4>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>Dr. {appointment.doctor_name}</p>
              <p className="text-muted text-xs">{appointment.doctor_specialization}</p>
              <p className="text-muted text-xs">{appointment.doctor_hospital}</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', marginTop: '0.35rem' }}>
                Fee: ${appointment.doctor_fee.toFixed(2)}
              </p>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              backgroundColor: '#ffffff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                <User size={18} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Patient Information</h4>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>{appointment.patient_name}</p>
              <p className="text-muted text-xs">{appointment.patient_email || 'Verified patient'}</p>
              <p className="text-muted text-xs">{appointment.patient_phone || 'Phone on file'}</p>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)',
              backgroundColor: '#ffffff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                <Calendar size={18} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Scheduled Slot</h4>
              </div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                {appointment.appointment_date}
              </p>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                {appointment.appointment_time} (30 mins)
              </p>
            </div>
          </div>

          {/* Reason for Visit */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem' }}>Chief Complaint / Visit Reason:</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: 1.5, backgroundColor: 'var(--slate-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
              {appointment.reason}
            </p>
          </div>

          {appointment.doctor_notes && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem' }}>Attending Notes:</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', backgroundColor: 'var(--slate-50)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                {appointment.doctor_notes}
              </p>
            </div>
          )}

          {appointment.cancellation_reason && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.35rem' }}>Cancellation Reason:</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--danger)', backgroundColor: 'var(--danger-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                {appointment.cancellation_reason}
              </p>
            </div>
          )}
        </div>

        {/* Medical Record Section (if exists) */}
        {medicalRecord && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--primary)" />
                <h3 className="title-md">Official Clinical Examination Record</h3>
              </div>
              <span className="text-muted text-xs">
                Recorded {new Date(medicalRecord.created_at).toLocaleDateString()}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Diagnosis:</strong>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {medicalRecord.diagnosis}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Symptoms Observed:</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-800)' }}>
                  {medicalRecord.symptoms}
                </p>
              </div>

              {medicalRecord.clinical_notes && (
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Doctor's Examination Findings:</strong>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-800)', lineHeight: 1.5 }}>
                    {medicalRecord.clinical_notes}
                  </p>
                </div>
              )}

              {medicalRecord.treatment_plan && (
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>Recommended Treatment Plan:</strong>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-800)', lineHeight: 1.5 }}>
                    {medicalRecord.treatment_plan}
                  </p>
                </div>
              )}

              {medicalRecord.follow_up_date && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                    Recommended Follow-up Date: {medicalRecord.follow_up_date}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prescription Section (if exists) */}
        {prescription && (
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={20} color="var(--secondary)" />
                <h3 className="title-md">Digital Prescription (Rx #{prescription.id})</h3>
              </div>
              <span className="text-muted text-xs">
                Issued {new Date(prescription.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="table-container" style={{ marginBottom: '1rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Medication Name</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.items.map((item) => (
                    <tr key={item.id}>
                      <td><strong style={{ color: 'var(--slate-900)' }}>{item.medicine_name}</strong></td>
                      <td>{item.dosage}</td>
                      <td>{item.frequency}</td>
                      <td>{item.duration}</td>
                      <td>{item.instructions || 'As directed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {prescription.notes && (
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <strong>Advisory: </strong>
                <span>{prescription.notes}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
