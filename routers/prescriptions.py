from fastapi import APIRouter, Depends, Request, status, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionResponse,
    PrescriptionListResponse
)
from backend.services.prescription_service import PrescriptionService
from backend.utils.dependencies import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED, summary="Create multi-item prescription (Doctors only)")
def create_prescription(
    data: PrescriptionCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else None
    return PrescriptionService.create_prescription(db, data, current_user, ip_address=ip)

@router.get("/patient/{patient_id}", response_model=PrescriptionListResponse, summary="Get prescriptions for a patient")
def get_patient_prescriptions(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return PrescriptionService.get_prescriptions_by_patient(db, patient_id, current_user)

@router.get("/{prescription_id}", response_model=PrescriptionResponse, summary="Get specific prescription by ID")
def get_prescription(
    prescription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rx = PrescriptionService.get_prescription_by_id(db, prescription_id)
    if current_user.role == "PATIENT" and rx.patient_id != current_user.patient_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return rx
