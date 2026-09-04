from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")  # YYYY-MM-DD
    appointment_time: str = Field(..., pattern=r"^([01]\d|2[0-3]):[0-5]\d$")  # HH:MM
    reason: str = Field(..., min_length=3, max_length=1000)

class AppointmentStatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(CONFIRMED|COMPLETED|REJECTED|CANCELLED)$")
    doctor_notes: Optional[str] = None
    cancellation_reason: Optional[str] = None

class AppointmentCancelRequest(BaseModel):
    cancellation_reason: Optional[str] = "Cancelled by user"

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: str
    appointment_time: str
    status: str
    reason: str
    doctor_notes: Optional[str] = None
    cancellation_reason: Optional[str] = None
    patient_name: str
    patient_email: Optional[str] = None
    patient_phone: Optional[str] = None
    doctor_name: str
    doctor_specialization: str
    doctor_hospital: str
    doctor_fee: float
    doctor_avatar: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AppointmentListResponse(BaseModel):
    total: int
    appointments: List[AppointmentResponse]
