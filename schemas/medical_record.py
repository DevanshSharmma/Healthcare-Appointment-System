from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MedicalRecordCreate(BaseModel):
    appointment_id: int
    diagnosis: str = Field(..., min_length=2)
    symptoms: str = Field(..., min_length=2)
    clinical_notes: Optional[str] = None
    treatment_plan: Optional[str] = None
    follow_up_date: Optional[str] = None

class MedicalRecordUpdate(BaseModel):
    diagnosis: Optional[str] = None
    symptoms: Optional[str] = None
    clinical_notes: Optional[str] = None
    treatment_plan: Optional[str] = None
    follow_up_date: Optional[str] = None

class MedicalRecordResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: int
    doctor_id: int
    diagnosis: str
    symptoms: str
    clinical_notes: Optional[str] = None
    treatment_plan: Optional[str] = None
    follow_up_date: Optional[str] = None
    patient_name: str
    doctor_name: str
    doctor_specialization: str
    doctor_hospital: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MedicalRecordListResponse(BaseModel):
    total: int
    records: List[MedicalRecordResponse]
