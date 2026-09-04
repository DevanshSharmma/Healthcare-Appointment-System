import React from 'react';

export default function StatCard({ title, value, icon, subtitle, color = 'primary' }) {
  const colorStyles = {
    primary: { bg: 'var(--primary-light)', text: 'var(--primary)' },
    secondary: { bg: 'var(--secondary-light)', text: 'var(--secondary)' },
    warning: { bg: 'var(--warning-light)', text: 'var(--warning)' },
    danger: { bg: 'var(--danger-light)', text: 'var(--danger)' },
    success: { bg: 'var(--success-light)', text: 'var(--success)' },
  };

  const currentTheme = colorStyles[color] || colorStyles.primary;

  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p className="text-muted text-sm" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </p>
        <h3 className="title-xl" style={{ margin: '0.2rem 0', fontWeight: 700 }}>
          {value}
        </h3>
        {subtitle && (
          <p className="text-muted text-xs">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
