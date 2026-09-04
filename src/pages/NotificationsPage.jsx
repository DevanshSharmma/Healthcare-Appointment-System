import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, CheckCircle2, Clock, Calendar, Pill, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [filter, setFilter] = useState('ALL');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.is_read;
    return true;
  });

  const getNotificationIcon = (type) => {
    if (type?.includes('PRESCRIPTION')) return <Pill size={18} color="var(--secondary)" />;
    if (type?.includes('RECORD')) return <FileText size={18} color="var(--primary)" />;
    if (type?.includes('CONFIRMED')) return <CheckCircle2 size={18} color="var(--success)" />;
    return <Calendar size={18} color="var(--primary)" />;
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 className="title-xl">Notification Center</h1>
            <p className="text-muted text-sm" style={{ marginTop: '0.2rem' }}>
              Stay updated on your consultations, clinical documentation, and scheduling alerts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <CheckCheck size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`btn btn-sm ${filter === 'UNREAD' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="card" style={{ padding: '0.5rem' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <Bell size={36} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontWeight: 600 }}>No Notifications</h4>
              <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>
                You're completely up to date.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderBottom: '1px solid var(--slate-100)',
                    backgroundColor: n.is_read ? '#ffffff' : 'var(--primary-light)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {getNotificationIcon(n.notification_type)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {n.title}
                      </h4>
                      <span className="text-muted text-xs">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                      {n.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      {n.reference_id && (
                        <Link
                          to={`/appointments/${n.reference_id}`}
                          style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
                        >
                          View Appointment Details &rarr;
                        </Link>
                      )}
                      {!n.is_read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textDecoration: 'underline' }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
