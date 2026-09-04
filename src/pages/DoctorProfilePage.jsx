import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import BookingModal from '../components/booking/BookingModal';
import { 
  Star, 
  MapPin, 
  Award, 
  Clock, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const [docRes, availRes] = await Promise.all([
          api.get(`/doctors/${id}`),
          api.get(`/availability/doctor/${id}`),
        ]);
        setDoctor(docRes.data);
        setAvailabilities(availRes.data || []);
      } catch (err) {
        console.error('Failed to load doctor profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="app-container" style={{ maxWidth: '900px', textAlign: 'center', padding: '4rem 0' }}>
          <p className="text-muted">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page-wrapper">
        <div className="app-container" style={{ maxWidth: '900px', textAlign: 'center', padding: '4rem 0' }}>
          <h2 className="title-lg">Specialist Not Found</h2>
          <Link to="/doctors" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Back to Doctors Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
          <Link to="/doctors" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--slate-600)' }}>
            <ArrowLeft size={14} />
            <span>Doctors</span>
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--slate-800)', fontWeight: 600 }}>{doctor.full_name}</span>
        </div>

        {/* Doctor Hero Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            <img
              src={doctor.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.full_name}`}
              alt={doctor.full_name}
              style={{
                width: '130px',
                height: '130px',
                borderRadius: 'var(--radius-xl)',
                objectFit: 'cover',
                border: '2px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
              }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span className="badge badge-pending" style={{ fontSize: '0.75rem' }}>
                  {doctor.specialization}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                  <Star size={16} fill="#f59e0b" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-800)' }}>
                    {doctor.rating.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    ({doctor.reviews_count} patient reviews)
                  </span>
                </div>
              </div>

              <h1 className="title-xl" style={{ marginBottom: '0.35rem' }}>
                {doctor.full_name}
              </h1>

              <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', marginBottom: '1rem' }}>
                {doctor.qualification}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                backgroundColor: 'var(--slate-50)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--slate-700)',
                marginBottom: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--primary)" />
                  <span>{doctor.hospital_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={16} color="var(--primary)" />
                  <span>{doctor.experience_years}+ Years Experience</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={16} color="var(--primary)" />
                  <span>${doctor.consultation_fee.toFixed(2)} Consultation Fee</span>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', maxWidth: '280px' }}
              >
                <Calendar size={18} />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio / About Section */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 className="title-md" style={{ marginBottom: '0.85rem' }}>About Dr. {doctor.full_name.split(' ')[1]}</h3>
          <p style={{ color: 'var(--slate-600)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {doctor.bio || 'Experienced medical practitioner providing personalized care and evidence-based diagnostic treatments.'}
          </p>
        </div>

        {/* Weekly Availability Schedule */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={20} color="var(--primary)" />
            <h3 className="title-md">Weekly Consultation Hours</h3>
          </div>

          {availabilities.length === 0 ? (
            <p className="text-muted text-sm">No regular schedule published. Please check directly with the clinic.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}>
              {availabilities.map((avail) => (
                <div
                  key={avail.id}
                  style={{
                    backgroundColor: 'var(--slate-50)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--slate-800)' }}>
                    {DAYS[avail.day_of_week]}
                  </strong>
                  <span style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                    {avail.start_time} – {avail.end_time}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                    {avail.slot_duration_minutes} min slots
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          doctor={doctor}
        />
      </div>
    </div>
  );
}
