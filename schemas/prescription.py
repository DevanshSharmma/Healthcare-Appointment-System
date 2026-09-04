from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PrescriptionItemBase(BaseModel):
    medicine_name: str = Field(..., min_length=1)
    dosage: str = Field(..., min_length=1)          # e.g., "500 mg"
    frequency: str = Field(..., min_length=1)       # e.g., "Twice daily"
    duration: str = Field(..., min_length=1)        # e.g., "7 days"
    instructions: Optional[str] = None             # e.g., "Take with food"

class PrescriptionItemCreate(PrescriptionItemBase):
    pass

class PrescriptionItemResponse(PrescriptionItemBase):
    id: int
    prescription_id: int

    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    appointment_id: int
    notes: Optional[str] = None
    items: List[PrescriptionItemCreate] = Field(..., min_length=1)

class PrescriptionResponse(BaseModel):
    id: int
    appointment_id: int
    patient_id: int
    doctor_id: int
    notes: Optional[str] = None
    patient_name: str
    doctor_name: str
    doctor_specialization: str
    doctor_hospital: str
    created_at: datetime
    updated_at: datetime
    items: List[PrescriptionItemResponse]

    class Config:
        from_attributes = True

class PrescriptionListResponse(BaseModel):
    total: int
    prescriptions: List[PrescriptionResponse]
