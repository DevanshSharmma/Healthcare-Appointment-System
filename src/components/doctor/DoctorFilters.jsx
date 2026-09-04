import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function DoctorFilters({
  search,
  setSearch,
  specialization,
  setSpecialization,
  hospital,
  setHospital,
  minRating,
  setMinRating,
  maxFee,
  setMaxFee,
  sortBy,
  setSortBy,
  onReset,
}) {
  const specialties = [
    'All',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Pediatrics',
    'Orthopedic Surgery',
    'General Physician',
  ];

  const hospitals = [
    'All',
    'St. Jude Heart & Vascular Institute',
    'Apex Neuroscience & Spine Center',
    'Manhattan Dermatology & Skin Surgery',
    'Pacific Children\'s Medical Group',
    'Metropolitan Orthopedics & Sports Medicine',
  ];

  return (
    <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'flex-end',
      }}>
        {/* Search Input */}
        <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 1' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Search size={14} />
            <span>Search Specialist / Hospital</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by doctor name or clinic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Specialization Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Specialty</label>
          <select
            className="form-select"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Hospital Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Hospital / Clinic</label>
          <select
            className="form-select"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
          >
            {hospitals.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sort Order</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="experience_desc">Most Experienced</option>
            <option value="fee_asc">Consultation Fee: Low to High</option>
            <option value="fee_desc">Consultation Fee: High to Low</option>
            <option value="name_asc">Alphabetical (A - Z)</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Minimum Rating</label>
          <select
            className="form-select"
            value={minRating || ''}
            onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Any Rating</option>
            <option value="4.5">★ 4.5 & above</option>
            <option value="4.8">★ 4.8 & above</option>
            <option value="4.9">★ 4.9 & above</option>
          </select>
        </div>

        {/* Reset Button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.4rem', height: '42px' }}
          >
            <RotateCcw size={15} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
