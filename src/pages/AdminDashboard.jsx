import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Search, 
  Check, 
  X, 
  Clock, 
  FileText, 
  Layers, 
  BarChart3, 
  Lock, 
  Eye 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search queries
  const [docSearch, setDocSearch] = useState('');
  const [patSearch, setPatSearch] = useState('');
  const [apptSearch, setApptSearch] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, docsRes, patsRes, apptsRes, logsRes] = await Promise.all([
        api.get('/admin/statistics'),
        api.get('/admin/doctors?limit=50'),
        api.get('/admin/patients?limit=50'),
        api.get('/admin/appointments?limit=50'),
        api.get('/admin/audit-logs?limit=50'),
      ]);
      setStats(statsRes.data);
      setDoctors(docsRes.data.doctors || []);
      setPatients(patsRes.data || []);
      setAppointments(apptsRes.data.appointments || []);
      setAuditLogs(logsRes.data.logs || []);
    } catch (err) {
      error(err.message || 'Failed to load administrative analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleDoctorApproval = async (docId, currentApproved) => {
    try {
      await api.put(`/admin/doctors/${docId}/approve?is_approved=${!currentApproved}`);
      success(`Doctor credential approval updated to ${!currentApproved}`);
      loadAdminData();
    } catch (err) {
      error(err.message || 'Failed to update approval');
    }
  };

  const handleToggleDoctorActive = async (docId, currentActive) => {
    try {
      await api.put(`/admin/doctors/${docId}/toggle-active?is_active=${!currentActive}`);
      success(`Doctor account status set to ${!currentActive ? 'ACTIVE' : 'DEACTIVATED'}`);
      loadAdminData();
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
            <ShieldCheck size={18} />
            <span>EXECUTIVE OVERSIGHT</span>
          </div>
          <h1 className="title-xl">Hospital Administration & System Telemetry</h1>
          <p className="text-muted text-sm" style={{ marginTop: '0.2rem' }}>
            System-wide provider credentials, patient volumes, appointment flow, and regulatory audit compliance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <BarChart3 size={16} /> },
            { id: 'doctors', label: 'Doctor Management', icon: <Stethoscope size={16} /> },
            { id: 'patients', label: 'Patient Directory', icon: <Users size={16} /> },
            { id: 'appointments', label: 'Appointment Oversight', icon: <Calendar size={16} /> },
            { id: 'audit', label: 'System Audit Logs', icon: <Lock size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--slate-600)',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              <StatCard
                title="Total Registered Patients"
                value={stats?.total_patients || 0}
                icon={<Users size={24} />}
                color="primary"
              />
              <StatCard
                title="Licensed Physicians"
                value={stats?.total_doctors || 0}
                icon={<Stethoscope size={24} />}
                color="secondary"
                subtitle={`${stats?.active_doctors || 0} currently active`}
              />
              <StatCard
                title="Total Consultations"
                value={stats?.total_appointments || 0}
                icon={<Calendar size={24} />}
                color="primary"
              />
              <StatCard
                title="Completed Visits"
                value={stats?.completed_appointments || 0}
                icon={<Activity size={24} />}
                color="success"
              />
            </div>

            {/* Visual Analytics Graphs & Breakdown */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
              marginBottom: '2rem',
            }}>
              {/* Status Distribution */}
              <div className="card">
                <h3 className="title-md" style={{ marginBottom: '1.25rem' }}>Appointment Status Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats && Object.entries(stats.appointments_by_status).map(([st, count]) => {
                    const totalAppts = stats.total_appointments || 1;
                    const pct = Math.round((count / totalAppts) * 100);
                    return (
                      <div key={st}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 600 }}>{st}</span>
                          <span className="text-muted">{count} visits ({pct}%)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: st === 'CONFIRMED' ? 'var(--success)' : st === 'PENDING' ? 'var(--warning)' : st === 'COMPLETED' ? 'var(--primary)' : 'var(--danger)',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specialty Distribution */}
              <div className="card">
                <h3 className="title-md" style={{ marginBottom: '1.25rem' }}>Physician Specialty Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {stats?.specialty_distribution.map((spec) => (
                    <div key={spec.specialization} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--slate-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{spec.specialization}</span>
                      <span className="badge badge-default">{spec.count} Doctors</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Trend Bars */}
            <div className="card">
              <h3 className="title-md" style={{ marginBottom: '1.25rem' }}>Monthly Consultation Velocity</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '180px', paddingTop: '1rem', paddingBottom: '0.5rem' }}>
                {stats?.monthly_appointments.map((m) => {
                  const maxCount = 60;
                  const heightPct = Math.min(100, Math.max(15, (m.count / maxCount) * 100));
                  return (
                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>{m.count}</span>
                      <div style={{
                        width: '100%',
                        maxWidth: '42px',
                        height: `${heightPct}%`,
                        backgroundColor: 'var(--primary)',
                        borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                        transition: 'height 0.3s ease',
                      }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.5rem' }}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCTORS MANAGEMENT */}
        {activeTab === 'doctors' && (
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className="title-md">Hospital Doctors Directory ({doctors.length})</h3>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Filter doctors..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', height: '38px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Hospital</th>
                    <th>Fee</th>
                    <th>Approval</th>
                    <th>Account Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors
                    .filter((d) => !docSearch || d.full_name.toLowerCase().includes(docSearch.toLowerCase()) || d.specialization.toLowerCase().includes(docSearch.toLowerCase()))
                    .map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={d.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.full_name}`}
                              alt={d.full_name}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.9rem' }}>{d.full_name}</strong>
                              <div className="text-muted text-xs">{d.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{d.specialization}</td>
                        <td>{d.hospital_name}</td>
                        <td><strong>${d.consultation_fee.toFixed(2)}</strong></td>
                        <td>
                          <span className={`badge ${d.is_approved ? 'badge-confirmed' : 'badge-pending'}`}>
                            {d.is_approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${d.is_active ? 'badge-confirmed' : 'badge-cancelled'}`}>
                            {d.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleToggleDoctorApproval(d.id, d.is_approved)}
                              className="btn btn-secondary btn-sm"
                              title={d.is_approved ? 'Revoke Approval' : 'Approve Doctor'}
                            >
                              {d.is_approved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleToggleDoctorActive(d.id, d.is_active)}
                              className={`btn btn-sm ${d.is_active ? 'btn-danger' : 'btn-success'}`}
                            >
                              {d.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PATIENTS DIRECTORY */}
        {activeTab === 'patients' && (
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className="title-md">Registered Patients Directory ({patients.length})</h3>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={patSearch}
                  onChange={(e) => setPatSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', height: '38px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>DOB</th>
                    <th>Emergency Contact</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {patients
                    .filter((p) => !patSearch || p.full_name.toLowerCase().includes(patSearch.toLowerCase()) || p.email.toLowerCase().includes(patSearch.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.full_name}`}
                              alt={p.full_name}
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <strong style={{ fontSize: '0.9rem' }}>{p.full_name}</strong>
                              <div className="text-muted text-xs">{p.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-default" style={{ fontWeight: 700 }}>
                            {p.blood_group || 'N/A'}
                          </span>
                        </td>
                        <td>{p.phone || 'N/A'}</td>
                        <td>{p.date_of_birth || 'N/A'}</td>
                        <td>{p.emergency_contact_phone || 'N/A'}</td>
                        <td>
                          <span className="text-muted text-xs">
                            {new Date(p.created_at).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: APPOINTMENTS OVERSIGHT */}
        {activeTab === 'appointments' && (
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className="title-md">Platform Consultations Stream ({appointments.length})</h3>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Search doctor or patient..."
                  value={apptSearch}
                  onChange={(e) => setApptSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem', height: '38px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments
                    .filter((a) => !apptSearch || a.patient_name.toLowerCase().includes(apptSearch.toLowerCase()) || a.doctor_name.toLowerCase().includes(apptSearch.toLowerCase()))
                    .map((a) => (
                      <tr key={a.id}>
                        <td><strong>#{a.id}</strong></td>
                        <td>{a.patient_name}</td>
                        <td>Dr. {a.doctor_name}</td>
                        <td>{a.doctor_specialization}</td>
                        <td>{a.appointment_date} at {a.appointment_time}</td>
                        <td><Badge status={a.status} /></td>
                        <td>
                          <Link to={`/appointments/${a.id}`} className="btn btn-secondary btn-sm">
                            <Eye size={13} />
                            <span>Timeline</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="title-md">Regulatory & Security Audit Log</h3>
                <p className="text-muted text-xs">Immutable chronological activity stream</p>
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor Email</th>
                    <th>Role</th>
                    <th>Action Event</th>
                    <th>Entity</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td>
                        <strong>{log.user_email || 'System'}</strong>
                      </td>
                      <td>
                        <span className="badge badge-default" style={{ fontSize: '0.68rem' }}>
                          {log.role || 'GUEST'}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.78rem', backgroundColor: 'var(--slate-100)', padding: '2px 6px', borderRadius: '4px', color: 'var(--primary)' }}>
                          {log.action}
                        </code>
                      </td>
                      <td>{log.entity} #{log.entity_id || ''}</td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                          {log.details || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
