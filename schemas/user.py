from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    role: str = "PATIENT"  # PATIENT, DOCTOR, ADMIN
    # Optional patient fields during registration
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    address: Optional[str] = None
    # Optional doctor fields if registered as doctor
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = 0
    hospital_name: Optional[str] = None
    consultation_fee: Optional[float] = 50.0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None

    class Config:
        from_attributes = True
