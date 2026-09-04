from fastapi import APIRouter, Depends, Request, status, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordResponse,
    MedicalRecordListResponse
)
from backend.services.medical_service import MedicalService
from backend.utils.dependencies import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/medical-records", tags=["Medical Records"])

@router.post("", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED, summary="Create a medical record (Doctors only)")
def create_medical_record(
    data: MedicalRecordCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else None
    return MedicalService.create_medical_record(db, data, current_user, ip_address=ip)

@router.get("/patient/{patient_id}", response_model=MedicalRecordListResponse, summary="Get medical history for a patient")
def get_patient_records(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return MedicalService.get_records_by_patient(db, patient_id, current_user)

@router.get("/{record_id}", response_model=MedicalRecordResponse, summary="Get specific medical record by ID")
def get_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = MedicalService.get_record_by_id(db, record_id)
    # Check authorization
    if current_user.role == "PATIENT" and record.patient_id != current_user.patient_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return record
