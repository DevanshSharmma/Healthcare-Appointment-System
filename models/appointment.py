from datetime import datetime, timezone
import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from backend.core.database import Base

class AppointmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False, index=True)
    appointment_date = Column(String(10), nullable=False, index=True)  # YYYY-MM-DD
    appointment_time = Column(String(10), nullable=False, index=True)  # HH:MM
    status = Column(String(20), default=AppointmentStatus.PENDING.value, nullable=False, index=True)
    reason = Column(Text, nullable=False)
    doctor_notes = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    
    # Universal unique lock key for active bookings: "{doctor_id}_{date}_{time}".
    # Set to NULL upon CANCELLED or REJECTED to release the slot for other patients.
    active_slot_key = Column(String(100), unique=True, nullable=True, index=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    medical_record = relationship("MedicalRecord", back_populates="appointment", uselist=False, cascade="all, delete-orphan")
    prescription = relationship("Prescription", back_populates="appointment", uselist=False, cascade="all, delete-orphan")

# Composite index for optimized doctor schedule queries
Index("idx_doc_date_time", Appointment.doctor_id, Appointment.appointment_date, Appointment.appointment_time)
