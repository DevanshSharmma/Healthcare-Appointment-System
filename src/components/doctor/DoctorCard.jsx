import React from 'react';
import { Star, MapPin, Award, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      position: 'relative'
    }}>
      <div>
        {/* Top Header Row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <img
            src={doctor.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.full_name}`}
            alt={doctor.full_name}
            style={{
              width: '76px',
              height: '76px',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              border: '1px solid var(--border-color)',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {doctor.specialization}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: 'auto' }}>
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  {doctor.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                  ({doctor.reviews_count})
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.full_name}
            </h3>

            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.qualification}
            </p>
          </div>
        </div>

        {/* Hospital & Experience meta */}
        <div style={{
          backgroundColor: 'var(--slate-50)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          fontSize: '0.825rem',
          color: 'var(--slate-600)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={15} color="var(--slate-400)" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.hospital_name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={15} color="var(--slate-400)" style={{ flexShrink: 0 }} />
            <span>{doctor.experience_years}+ Years Clinical Practice</span>
          </div>
        </div>

        {doctor.bio && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--slate-600)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {doctor.bio}
          </p>
        )}
      </div>

      {/* Footer Details & CTAs */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--slate-100)',
          paddingTop: '0.85rem',
          marginBottom: '0.85rem'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
              Consultation Fee
            </span>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              ${doctor.consultation_fee.toFixed(2)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span>Accepting Patients</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <Link
            to={`/doctors/${doctor.id}`}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
          >
            View Profile
          </Link>
          <button
            onClick={() => onBook(doctor)}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <span>Book Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
