import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Clock, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityScheduler({ doctorId }) {
  const { success, error } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // New shift form state
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/availability/doctor/${doctorId}`);
      setSchedules(res.data);
    } catch (err) {
      error(err.message || 'Failed to load doctor schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchSchedules();
  }, [doctorId]);

  const handleAddShift = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/availability', {
        doctor_id: doctorId,
        day_of_week: Number(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        slot_duration_minutes: Number(slotDuration),
        is_active: true,
      });
      success('Working period added successfully');
      fetchSchedules();
    } catch (err) {
      error(err.message || 'Failed to add shift. Ensure time does not overlap.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShift = async (id) => {
    if (!window.confirm('Remove this availability schedule?')) return;
    try {
      await api.delete(`/availability/${id}`);
      success('Schedule removed');
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      error(err.message || 'Failed to delete schedule');
    }
  };

  return (
    <div>
      {/* Add Shift Form */}
      <form onSubmit={handleAddShift} style={{
        backgroundColor: 'var(--slate-50)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} color="var(--primary)" />
          <span>Add Clinical Working Shift</span>
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem',
          alignItems: 'flex-end',
        }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Day of Week</label>
            <select
              className="form-select"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">End Time</label>
            <input
              type="time"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Slot Duration</label>
            <select
              className="form-select"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              {submitting ? 'Saving...' : 'Add Shift'}
            </button>
          </div>
        </div>
      </form>

      {/* Current Shifts List */}
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Configured Weekly Schedule ({schedules.length})
        </h4>

        {loading ? (
          <p className="text-muted text-sm">Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
            <Clock size={28} color="var(--slate-400)" style={{ margin: '0 auto 0.5rem' }} />
            <p className="text-muted text-sm">No working hours configured yet. Add your clinical hours above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {schedules.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--slate-800)', width: '90px' }}>
                    {DAYS[s.day_of_week]}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)', fontSize: '0.875rem' }}>
                    <Clock size={15} color="var(--primary)" />
                    <span>{s.start_time} &mdash; {s.end_time}</span>
                  </div>
                  <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>
                    {s.slot_duration_minutes} min slots
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteShift(s.id)}
                  style={{ color: 'var(--danger)', padding: '4px', borderRadius: '4px' }}
                  title="Delete shift"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
