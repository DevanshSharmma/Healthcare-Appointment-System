import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-color)',
      padding: '3.5rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Medi<span style={{ color: 'var(--primary)' }}>Pulse</span>
              </span>
            </div>
            <p className="text-muted text-sm" style={{ lineHeight: 1.6, maxWidth: '280px' }}>
              Enterprise-grade healthcare appointment and clinical workflow management for modern patients, specialists, and hospital networks.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-800)' }}>
              Patient Solutions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link to="/doctors" className="text-muted text-sm" style={{ transition: 'color 0.15s' }}>Find Doctors</Link></li>
              <li><Link to="/patient" className="text-muted text-sm" style={{ transition: 'color 0.15s' }}>Patient Dashboard</Link></li>
              <li><Link to="/patient/profile" className="text-muted text-sm" style={{ transition: 'color 0.15s' }}>Medical Records</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-800)' }}>
              Specialties
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><span className="text-muted text-sm">Cardiovascular Health</span></li>
              <li><span className="text-muted text-sm">Neurology & Spine</span></li>
              <li><span className="text-muted text-sm">Dermatology & Laser</span></li>
              <li><span className="text-muted text-sm">Pediatric Care</span></li>
              <li><span className="text-muted text-sm">Orthopedic Surgery</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-800)' }}>
              Security & Compliance
            </h4>
            <p className="text-muted text-sm" style={{ lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Engineered with HIPAA-aligned role-based access, end-to-end encrypted sessions, and full audit trails.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>SOC2 & HIPAA Compliant Architecture</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--slate-400)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} MediPulse Healthcare Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built for modern clinical excellence</span>
            <Heart size={14} color="var(--danger)" fill="var(--danger)" />
          </div>
        </div>
      </div>
    </footer>
  );
}
