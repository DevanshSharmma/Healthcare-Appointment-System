import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import AvailabilityScheduler from '../components/doctor/AvailabilityScheduler';
import MedicalRecordModal from '../components/patient/MedicalRecordModal';
import PrescriptionModal from '../components/patient/PrescriptionModal';
import { 
  Calendar, 
  Clock, 
  Check, 
  X, 
  CheckCircle2, 
  FileText, 
  Pill, 
  Settings, 
  UserCheck, 
  Eye, 
  AlertCircle 
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals state
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [selectedApptForRecord, setSelectedApptForRecord] = useState(null);
  const [selectedApptForRx, setSelectedApptForRx] = useState(null);

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      error(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      let notes = '';
      if (newStatus === 'REJECTED') {
        notes = window.prompt('Please provide a reason for declining this appointment:');
        if (!notes) return;
      }

      await api.put(`/appointments/${apptId}/status`, {
        status: newStatus,
        doctor_notes: notes || `Marked as ${newStatus} by attending doctor.`,
        cancellation_reason: newStatus === 'REJECTED' ? notes : null,
      });

      success(`Appointment #${apptId} transitioned to ${newStatus}`);
      fetchDoctorAppointments();
    } catch (err) {
      error(err.message || 'Status transition failed.');
    }
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter((a) => a.appointment_date === todayStr);
  const pendingRequests = appointments.filter((a) => a.status === 'PENDING');
  const upcomingConfirmed = appointments.filter((a) => a.status === 'CONFIRMED');
  const completedTotal = appointments.filter((a) => a.status === 'COMPLETED');

  const filteredList = appointments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'TODAY') return a.appointment_date === todayStr;
    return a.status === filterStatus;
  });

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
              Good morning, {user?.full_name?.split(',')[0] || 'Doctor'}
            </h1>
            <p className="text-muted text-sm" style={{ marginTop: '0.2rem' }}>
              Manage today's clinical consultations, patient requests, and weekly schedules.
            </p>
          </div>

          <button
            onClick={() => setIsAvailabilityOpen(true)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Settings size={16} />
            <span>Configure Availability Hours</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <StatCard
            title="Today's Schedule"
            value={todaysAppointments.length}
            icon={<Clock size={24} />}
            color="primary"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            icon={<AlertCircle size={24} />}
            color="warning"
          />
          <StatCard
            title="Upcoming Confirmed"
            value={upcomingConfirmed.length}
            icon={<Calendar size={24} />}
            color="secondary"
          />
          <StatCard
            title="Completed Consultations"
            value={completedTotal.length}
            icon={<CheckCircle2 size={24} />}
            color="success"
          />
        </div>

        {/* Appointments Management Table */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="title-md">Patient Appointments Schedule</h3>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['ALL', 'TODAY', 'PENDING', 'CONFIRMED', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-muted text-sm" style={{ padding: '1rem' }}>Loading appointments...</p>
          ) : filteredList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Calendar size={36} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontWeight: 600 }}>No Appointments Found</h4>
              <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>
                There are currently no patient consultations matching this filter.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Patient Name</th>
                    <th>Consultation Date & Time</th>
                    <th>Reason / Symptoms</th>
                    <th>Status</th>
                    <th>Clinical Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <strong>#{appt.id}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{appt.patient_name}</span>
                        {appt.patient_phone && (
                          <div className="text-muted text-xs">{appt.patient_phone}</div>
                        )}
                      </td>
                      <td>
                        <strong>{appt.appointment_date}</strong>
                        <div className="text-muted text-xs">{appt.appointment_time}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                          {appt.reason}
                        </span>
                      </td>
                      <td>
                        <Badge status={appt.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Link
                            to={`/appointments/${appt.id}`}
                            className="btn btn-secondary btn-sm"
                            title="View appointment history"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </Link>

                          {/* PENDING ACTIONS */}
                          {appt.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'CONFIRMED')}
                                className="btn btn-success btn-sm"
                                title="Confirm appointment"
                              >
                                <Check size={13} />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                                className="btn btn-danger btn-sm"
                                title="Decline request"
                              >
                                <X size={13} />
                                <span>Decline</span>
                              </button>
                            </>
                          )}

                          {/* CONFIRMED ACTIONS */}
                          {appt.status === 'CONFIRMED' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                                className="btn btn-primary btn-sm"
                                title="Mark consultation completed"
                              >
                                <CheckCircle2 size={13} />
                                <span>Complete</span>
                              </button>
                            </>
                          )}

                          {/* COMPLETED or CONFIRMED: Clinical EMR & Rx */}
                          {(appt.status === 'CONFIRMED' || appt.status === 'COMPLETED') && (
                            <>
                              <button
                                onClick={() => setSelectedApptForRecord(appt)}
                                className="btn btn-secondary btn-sm"
                                title="Add diagnosis and doctor notes"
                              >
                                <FileText size={13} color="var(--primary)" />
                                <span>Record</span>
                              </button>
                              <button
                                onClick={() => setSelectedApptForRx(appt)}
                                className="btn btn-secondary btn-sm"
                                title="Issue multi-item digital prescription"
                              >
                                <Pill size={13} color="var(--secondary)" />
                                <span>Rx</span>
                              </button>
                            </>
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

        {/* Availability Scheduler Modal */}
        <Modal
          isOpen={isAvailabilityOpen}
          onClose={() => setIsAvailabilityOpen(false)}
          title="Clinical Availability Hours & Slots Configuration"
          maxWidth="700px"
        >
          {user?.doctor_id && (
            <AvailabilityScheduler doctorId={user.doctor_id} />
          )}
        </Modal>

        {/* Medical Record Modal */}
        {selectedApptForRecord && (
          <MedicalRecordModal
            isOpen={!!selectedApptForRecord}
            onClose={() => setSelectedApptForRecord(null)}
            appointment={selectedApptForRecord}
            onCreated={() => fetchDoctorAppointments()}
          />
        )}

        {/* Prescription Modal */}
        {selectedApptForRx && (
          <PrescriptionModal
            isOpen={!!selectedApptForRx}
            onClose={() => setSelectedApptForRx(null)}
            appointment={selectedApptForRx}
            onCreated={() => fetchDoctorAppointments()}
          />
        )}
      </div>
    </div>
  );
}
