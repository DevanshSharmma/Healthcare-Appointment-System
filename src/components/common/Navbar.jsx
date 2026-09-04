import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Activity, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  ShieldCheck, 
  CheckCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getDashboardPath = () => {
    if (role === 'DOCTOR') return '/doctor';
    if (role === 'ADMIN') return '/admin';
    return '/patient';
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
              Medi<span style={{ color: 'var(--primary)' }}>Pulse</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--slate-400)', fontWeight: 600, marginTop: '-3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Healthcare Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link to="/doctors" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--slate-600)', transition: 'color 0.15s' }}>
            Find Doctors
          </Link>
          <a href="/#how-it-works" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--slate-600)', transition: 'color 0.15s' }}>
            How It Works
          </a>

          {isAuthenticated && (
            <Link to={getDashboardPath()} style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-600)',
                    backgroundColor: showNotifications ? 'var(--slate-100)' : 'transparent',
                    position: 'relative',
                    transition: 'background-color 0.15s'
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'var(--danger)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      boxShadow: '0 0 0 2px #ffffff'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Drawer */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    width: '360px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 200,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--slate-50)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="badge badge-pending" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}
                        >
                          <CheckCheck size={14} />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            style={{
                              padding: '0.85rem 1rem',
                              borderBottom: '1px solid var(--slate-100)',
                              backgroundColor: notif.is_read ? '#ffffff' : 'var(--primary-light)',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                              <strong style={{ fontSize: '0.825rem', color: 'var(--slate-900)' }}>{notif.title}</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                                {new Date(notif.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.35 }}>
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div style={{ padding: '0.65rem 1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--slate-50)' }}>
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        View all notifications &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--slate-200)',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.15s'
                  }}
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-800)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.full_name.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {role}
                    </span>
                  </div>
                  <ChevronDown size={14} color="var(--slate-400)" />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                    overflow: 'hidden',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--slate-100)' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-900)' }}>{user.full_name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{user.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setShowUserMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--slate-700)',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <Calendar size={16} />
                      <span>My Dashboard</span>
                    </Link>

                    {role === 'PATIENT' && (
                      <Link
                        to="/patient/profile"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.85rem',
                          color: 'var(--slate-700)',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        <UserIcon size={16} />
                        <span>Medical Profile</span>
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--slate-100)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.85rem',
                          color: 'var(--danger)',
                          textAlign: 'left'
                        }}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ display: 'none', color: 'var(--slate-700)' }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
