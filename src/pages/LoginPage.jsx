import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Activity, Lock, Mail, UserCheck, Stethoscope, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const redirectAfterLogin = (role) => {
    if (role === 'DOCTOR') navigate('/doctor');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/patient');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please provide email and password.');
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      success(`Welcome back, ${loggedInUser.full_name}!`);
      redirectAfterLogin(loggedInUser.role);
    } catch (err) {
      error(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickLogin = async (targetRole) => {
    try {
      setDemoLoading(targetRole);
      const loggedInUser = await demoLogin(targetRole);
      success(`Authenticated as ${loggedInUser.role}: ${loggedInUser.full_name}`);
      redirectAfterLogin(loggedInUser.role);
    } catch (err) {
      error(err.message || '1-Click demo authentication failed.');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="app-container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.25rem 2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}>
              <Activity size={24} />
            </div>
            <h2 className="title-lg">Sign In to MediPulse</h2>
            <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>
              Access your appointments, medical history, and clinical records.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.3rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.3rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!demoLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', height: '44px', fontSize: '0.95rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* 1-Click Fast Auth Shortcuts */}
          <div style={{ margin: '1.75rem 0 1rem 0', position: 'relative', textAlign: 'center' }}>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', position: 'absolute', top: '50%', left: 0, right: 0 }} />
            <span style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              padding: '0 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--slate-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              1-Click Demo Login
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              type="button"
              disabled={loading || !!demoLoading}
              onClick={() => handle1ClickLogin('PATIENT')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
            >
              <UserCheck size={16} color="var(--primary)" />
              <div style={{ textAlign: 'left', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>1-Click Patient</span>
                <span className="text-muted text-xs">john.doe@patient.com</span>
              </div>
            </button>

            <button
              type="button"
              disabled={loading || !!demoLoading}
              onClick={() => handle1ClickLogin('DOCTOR')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
            >
              <Stethoscope size={16} color="var(--secondary)" />
              <div style={{ textAlign: 'left', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>1-Click Doctor</span>
                <span className="text-muted text-xs">sarah.jenkins@healthcare.com</span>
              </div>
            </button>

            <button
              type="button"
              disabled={loading || !!demoLoading}
              onClick={() => handle1ClickLogin('ADMIN')}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
            >
              <Shield size={16} color="var(--warning)" />
              <div style={{ textAlign: 'left', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>1-Click Admin</span>
                <span className="text-muted text-xs">admin@healthcare.com</span>
              </div>
            </button>
          </div>

          {/* Footer link */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create Patient Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
