import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import DoctorCard from '../components/doctor/DoctorCard';
import DoctorFilters from '../components/doctor/DoctorFilters';
import BookingModal from '../components/booking/BookingModal';
import { DoctorCardSkeleton } from '../components/common/Skeleton';
import { Stethoscope, AlertCircle } from 'lucide-react';

export default function DoctorDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [hospital, setHospital] = useState('All');
  const [minRating, setMinRating] = useState(null);
  const [maxFee, setMaxFee] = useState(null);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [page, setPage] = useState(1);

  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (specialization && specialization !== 'All') params.append('specialization', specialization);
        if (hospital && hospital !== 'All') params.append('hospital', hospital);
        if (minRating) params.append('min_rating', minRating);
        if (maxFee) params.append('max_fee', maxFee);
        params.append('sort_by', sortBy);
        params.append('page', page);
        params.append('limit', 20);

        const res = await api.get(`/doctors?${params.toString()}`);
        setDoctors(res.data.doctors || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error('Failed to load doctors', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, [debouncedSearch, specialization, hospital, minRating, maxFee, sortBy, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setHospital('All');
    setMinRating(null);
    setMaxFee(null);
    setSortBy('rating_desc');
    setPage(1);
  };

  const handleBook = (doc) => {
    setSelectedDoctor(doc);
    setIsBookingOpen(true);
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <Stethoscope size={18} />
            <span>CLINICAL DIRECTORY</span>
          </div>
          <h1 className="title-xl">Find Your Healthcare Specialist</h1>
          <p className="text-muted" style={{ fontSize: '1rem', marginTop: '0.25rem' }}>
            Discover and book verified doctors across leading medical specialties and partner hospitals.
          </p>
        </div>

        {/* Filter Toolbar */}
        <DoctorFilters
          search={search}
          setSearch={setSearch}
          specialization={specialization}
          setSpecialization={setSpecialization}
          hospital={hospital}
          setHospital={setHospital}
          minRating={minRating}
          setMinRating={setMinRating}
          maxFee={maxFee}
          setMaxFee={setMaxFee}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
        />

        {/* Results Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <p className="text-muted text-sm">
            Showing <strong style={{ color: 'var(--slate-800)' }}>{doctors.length}</strong> of {total} specialists
          </p>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <DoctorCardSkeleton key={n} />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
          }}>
            <AlertCircle size={40} color="var(--slate-400)" style={{ margin: '0 auto 1rem' }} />
            <h3 className="title-md">No Doctors Found</h3>
            <p className="text-muted text-sm" style={{ marginTop: '0.35rem', marginBottom: '1.25rem' }}>
              We couldn't find any specialist matching your selected filter criteria.
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} onBook={handleBook} />
            ))}
          </div>
        )}

        {/* Booking Dialog */}
        {selectedDoctor && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            doctor={selectedDoctor}
          />
        )}
      </div>
    </div>
  );
}
