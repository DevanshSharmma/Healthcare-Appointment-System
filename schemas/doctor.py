from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DoctorBase(BaseModel):
    specialization: str
    qualification: str
    experience_years: int = 0
    hospital_name: str
    consultation_fee: float = 50.0
    bio: Optional[str] = None

class DoctorCreate(DoctorBase):
    user_id: int

class DoctorUpdate(BaseModel):
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    hospital_name: Optional[str] = None
    consultation_fee: Optional[float] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None

class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    rating: float
    reviews_count: int
    is_approved: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class DoctorListResponse(BaseModel):
    total: int
    page: int
    limit: int
    doctors: List[DoctorResponse]
