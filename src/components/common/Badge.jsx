import React from 'react';

export default function Badge({ status, text }) {
  const normalized = (status || '').toUpperCase();
  let className = 'badge-default';

  if (normalized === 'PENDING') className = 'badge-pending';
  else if (normalized === 'CONFIRMED') className = 'badge-confirmed';
  else if (normalized === 'COMPLETED') className = 'badge-completed';
  else if (normalized === 'CANCELLED' || normalized === 'REJECTED') className = 'badge-cancelled';

  return (
    <span className={`badge ${className}`}>
      {text || status}
    </span>
  );
}
