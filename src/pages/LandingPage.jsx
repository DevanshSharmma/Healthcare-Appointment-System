import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import DoctorCard from '../components/doctor/DoctorCard';
import BookingModal from '../components/booking/BookingModal';
import { 
  Heart, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.get('/doctors?limit=3&sort_by=rating_desc');
        setFeaturedDoctors(res.data.doctors || []);
      } catch (err) {
        console.error('Failed to load featured doctors', err);
      } finally {
        setLoadingDocs(false);
      }
    }
    loadFeatured();
  }, []);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  const specialties = [
    { name: 'Cardiology', desc: 'Heart care, hypertension & diagnostic cardiology', count: '14 Specialists', icon: '❤️' },
    { name: 'Neurology', desc: 'Brain, spine, migraine & neurodegenerative care', count: '9 Specialists', icon: '🧠' },
    { name: 'Dermatology', desc: 'Clinical dermatology, skin surgery & cosmetics', count: '12 Specialists', icon: '✨' },
    { name: 'Pediatrics', desc: 'Comprehensive neonatal, infant & adolescent care', count: '18 Specialists', icon: '👶' },
    { name: 'Orthopedics', desc: 'Joint replacement, sports injury & spine therapy', count: '11 Specialists', icon: '🦴' },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
        padding: '5rem 0 4rem 0',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div className="app-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--primary)',
              marginBottom: '1.25rem',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <Sparkles size={15} />
              <span>Next-Generation Healthcare Scheduling</span>
            </div>

            <h1 className="title-hero" style={{ marginBottom: '1.25rem' }}>
              Your Health, <br />
              <span style={{ color: 'var(--primary)' }}>Our Priority</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--slate-600)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '520px',
            }}>
              Connect with trusted healthcare professionals and manage your appointments seamlessly.
              Real-time availability, double-booking protected scheduling, and integrated digital prescriptions.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/doctors" className="btn btn-primary btn-lg">
                <span>Find a Doctor</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Book Appointment
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--slate-200)',
            }}>
              <div>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>100%</h4>
                <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verified Specialists</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>0%</h4>
                <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Double Bookings</p>
              </div>
              <div>
                <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>4.9 ★</h4>
                <p className="text-muted text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Patient Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xl)',
              padding: '2rem',
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Verified Care Guarantee</h4>
                  <p className="text-muted text-xs">Direct access to board-certified physicians</p>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-confirmed">Confirmed Booking</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Today at 10:30 AM</span>
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Dr. Sarah Jenkins, MD, FACC</p>
                <p className="text-muted text-xs">Cardiology &bull; St. Jude Heart Institute</p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--slate-600)',
                padding: '0.5rem 0',
              }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Instant confirmation without phone wait times</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--slate-600)',
                padding: '0.5rem 0',
              }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Real-time concurrency & slot lock protection</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--slate-600)',
                padding: '0.5rem 0',
              }}>
                <CheckCircle2 size={16} color="var(--success)" />
                <span>Encrypted medical records and structured prescriptions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Seamless Process
            </span>
            <h2 className="title-xl" style={{ marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              How MediPulse Works
            </h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>
              Booking your consultation and managing treatment history takes less than two minutes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Discover Specialists
              </h3>
              <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                Filter verified doctors by clinical specialty, hospital affiliation, consultation fee, and peer ratings.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--secondary-light)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Select Live Slot
              </h3>
              <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                Choose from calculated 30-minute availability slots with automated conflict detection and past-slot prevention.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: 800,
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Receive Care & Rx
              </h3>
              <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                Consult with your doctor, track your appointment timeline, and access digital prescriptions and medical notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALTIES SECTION */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--slate-50)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Comprehensive Care
              </span>
              <h2 className="title-xl" style={{ marginTop: '0.35rem' }}>
                Top Clinical Specialties
              </h2>
            </div>
            <Link to="/doctors" className="btn btn-outline btn-sm">
              Explore All Specialties &rarr;
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {specialties.map((spec) => (
              <div
                key={spec.name}
                onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(spec.name)}`)}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{spec.icon}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{spec.name}</h4>
                <p className="text-muted text-xs" style={{ marginBottom: '1rem', lineHeight: 1.5 }}>
                  {spec.desc}
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {spec.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Experienced Specialists
              </span>
              <h2 className="title-xl" style={{ marginTop: '0.35rem' }}>
                Featured Physicians
              </h2>
            </div>
            <Link to="/doctors" className="btn btn-primary btn-sm">
              Browse Directory
            </Link>
          </div>

          {loadingDocs ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p className="text-muted">Loading specialists...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}>
              {featuredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} onBook={handleBook} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US & SECURITY */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--slate-900)', color: '#ffffff' }}>
        <div className="app-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Platform Reliability
            </span>
            <h2 className="title-xl" style={{ color: '#ffffff', marginTop: '0.35rem', marginBottom: '1rem' }}>
              Engineered with Modern Enterprise Architecture
            </h2>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Built from the ground up to prevent scheduling collisions, enforce strict access policies, and safeguard confidential health records.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Zero Double Booking Guarantee</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                    Row-level isolation and database uniqueness constraints prevent accidental overlapping slots.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Multi-Level Security & RBAC</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                    Patients access only their own medical history; doctors treat authorized cases; admins oversee audit logs.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <CheckCircle2 color="#34d399" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Digital EMR & Prescriptions</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                    Multi-item structured prescriptions and full diagnostic reports linked to verified visits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--slate-800)',
            border: '1px solid var(--slate-700)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Ready to Book Your Care?
            </h3>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Join thousands of patients who have transformed their clinical experience with MediPulse.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '1rem' }}>
              Create Patient Account
            </Link>
            <Link to="/login" style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
              Already registered? <span style={{ color: '#ffffff', textDecoration: 'underline' }}>Sign In Here</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          doctor={selectedDoctor}
        />
      )}
    </div>
  );
}
