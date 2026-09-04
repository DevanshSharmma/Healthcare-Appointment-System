import React from 'react';

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', style }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Skeleton width="72px" height="72px" borderRadius="var(--radius-md)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton width="60%" height="22px" />
          <Skeleton width="40%" height="16px" />
          <Skeleton width="80%" height="16px" />
        </div>
      </div>
      <Skeleton width="100%" height="40px" />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Skeleton width="50%" height="38px" />
        <Skeleton width="50%" height="38px" />
      </div>
    </div>
  );
}
