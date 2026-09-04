import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Pill, 
  Plus, 
  ArrowRight, 
  AlertCircle,
  Eye
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apptRes = await api.get('/appointments');
      const appts = apptRes.data.appointments || [];
      setAppointments(appts);

      if (user?.patient_id) {
        const [recRes, rxRes] = await Promise.all([
          api.get(`/medical-records/patient/${user.patient_id}`),
          api.get(`/prescriptions/patient/${user.patient_id}`),
        ]);
        setMedicalRecords(recRes.data.records || []);
        setPrescriptions(rxRes.data.prescriptions || []);
      }
    } catch (err) {
      console.error('Failed to load patient dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleCancelAppointment = async (apptId) => {
    const reason = window.prompt('Please provide a reason for cancelling this appointment:');
    if (!reason) return;

    try {
      await api.put(`/appointments/${apptId}/cancel`, {
        cancellation_reason: reason,
      });
      success('Appointment cancelled successfully.');
      fetchDashboardData();
    } catch (err) {
      error(err.message || 'Failed to cancel appointment.');
    }
  };

  // Stats
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'PENDING' || a.status === 'CONFIRMED'
  );
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledAppointments = appointments.filter((a) => a.status === 'CANCELLED' || a.status === 'REJECTED');

  const nextAppointment = upcomingAppointments[0] || null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 className="title-xl">
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'Patient'}
            </h1>
            <p className="text-muted text-sm" style={{ marginTop: '0.2rem' }}>
              Welcome to your personal healthcare dashboard and clinical overview.
            </p>
          </div>

          <Link to="/doctors" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} />
            <span>Book Consultation</span>
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <StatCard
            title="Upcoming Appointments"
            value={upcomingAppointments.length}
            icon={<Calendar size={24} />}
            color="primary"
          />
          <StatCard
            title="Completed Consultations"
            value={completedAppointments.length}
            icon={<CheckCircle2 size={24} />}
            color="success"
          />
          <StatCard
            title="Cancelled Appointments"
            value={cancelledAppointments.length}
            icon={<XCircle size={24} />}
            color="danger"
          />
          <StatCard
            title="Active Prescriptions"
            value={prescriptions.length}
            icon={<Pill size={24} />}
            color="secondary"
          />
        </div>

        {/* Next Appointment Banner */}
        {nextAppointment && (
          <div className="card" style={{
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <span className="badge badge-pending" style={{ marginBottom: '0.4rem' }}>
                  Next Scheduled Visit
                </span>
                <h3 className="title-md" style={{ color: 'var(--slate-900)' }}>
                  Dr. {nextAppointment.doctor_name} &bull; {nextAppointment.doctor_specialization}
                </h3>
                <p style={{ color: 'var(--slate-700)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <strong>Date:</strong> {nextAppointment.appointment_date} at <strong>{nextAppointment.appointment_time}</strong> ({nextAppointment.doctor_hospital})
                </p>
                <p className="text-muted text-xs" style={{ marginTop: '0.2rem' }}>
                  Reason: {nextAppointment.reason}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to={`/appointments/${nextAppointment.id}`}
                  className="btn btn-primary btn-sm"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </Link>
                <button
                  onClick={() => handleCancelAppointment(nextAppointment.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Table Section */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div className="card-header">
            <h3 className="title-md">Appointment History ({appointments.length})</h3>
            <Link to="/doctors" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Find More Doctors &rarr;
            </Link>
          </div>

          {loading ? (
            <p className="text-muted text-sm" style={{ padding: '1rem' }}>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Calendar size={36} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontWeight: 600 }}>No Appointments Yet</h4>
              <p className="text-muted text-sm" style={{ marginTop: '0.25rem', marginBottom: '1rem' }}>
                Schedule your first consultation with one of our verified specialists.
              </p>
              <Link to="/doctors" className="btn btn-primary btn-sm">
                Book Consultation Now
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <strong>#{appt.id}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>Dr. {appt.doctor_name}</span>
                        <div className="text-muted text-xs">{appt.doctor_hospital}</div>
                      </td>
                      <td>{appt.doctor_specialization}</td>
                      <td>
                        <strong>{appt.appointment_date}</strong>
                        <div className="text-muted text-xs">{appt.appointment_time}</div>
                      </td>
                      <td>
                        <Badge status={appt.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link
                            to={`/appointments/${appt.id}`}
                            className="btn btn-secondary btn-sm"
                            title="View appointment timeline and notes"
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </Link>
                          {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="btn btn-sm"
                              style={{ color: 'var(--danger)', padding: '0.35rem 0.6rem' }}
                              title="Cancel appointment"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Split: Recent Medical Records & Prescriptions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}>
          {/* Medical Records Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--primary)" />
                <h3 className="title-md">Clinical Notes & Records</h3>
              </div>
            </div>

            {medicalRecords.length === 0 ? (
              <p className="text-muted text-sm" style={{ padding: '1rem 0' }}>
                No clinical medical records documented yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {medicalRecords.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--slate-50)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)' }}>{rec.diagnosis}</strong>
                      <span className="text-muted text-xs">{new Date(rec.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted text-xs" style={{ marginBottom: '0.35rem' }}>
                      Attending: Dr. {rec.doctor_name}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-700)', lineHeight: 1.4 }}>
                      {rec.clinical_notes || rec.treatment_plan || 'Consultation documented.'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prescriptions Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pill size={18} color="var(--secondary)" />
                <h3 className="title-md">Prescriptions</h3>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <p className="text-muted text-sm" style={{ padding: '1rem 0' }}>
                No active digital prescriptions on record.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {prescriptions.slice(0, 3).map((rx) => (
                  <div
                    key={rx.id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--slate-50)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)' }}>
                        Rx #{rx.id} &bull; Dr. {rx.doctor_name}
                      </strong>
                      <span className="text-muted text-xs">{new Date(rx.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {rx.items.map((it) => (
                        <span key={it.id} className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                          {it.medicine_name} ({it.dosage})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
