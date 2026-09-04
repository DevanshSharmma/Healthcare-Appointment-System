from pydantic import BaseModel, Field
from typing import Optional, List

class DoctorAvailabilityBase(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6)  # 0=Monday, 6=Sunday
    start_time: str = Field(..., pattern=r"^([01]\d|2[0-3]):[0-5]\d$")  # HH:MM
    end_time: str = Field(..., pattern=r"^([01]\d|2[0-3]):[0-5]\d$")    # HH:MM
    slot_duration_minutes: int = Field(30, ge=15, le=120)
    is_active: bool = True

class DoctorAvailabilityCreate(DoctorAvailabilityBase):
    doctor_id: Optional[int] = None  # If not passed, determined by authenticated doctor

class DoctorAvailabilityUpdate(BaseModel):
    day_of_week: Optional[int] = Field(None, ge=0, le=6)
    start_time: Optional[str] = Field(None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    end_time: Optional[str] = Field(None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    slot_duration_minutes: Optional[int] = Field(None, ge=15, le=120)
    is_active: Optional[bool] = None

class DoctorAvailabilityResponse(DoctorAvailabilityBase):
    id: int
    doctor_id: int

    class Config:
        from_attributes = True

class SlotItem(BaseModel):
    time: str
    is_available: bool
    reason_unavailable: Optional[str] = None

class DaySlotsResponse(BaseModel):
    doctor_id: int
    date: str  # YYYY-MM-DD
    day_of_week: int
    day_name: str
    is_working_day: bool
    slots: List[SlotItem]
