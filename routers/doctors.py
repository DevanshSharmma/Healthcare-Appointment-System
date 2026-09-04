from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from backend.core.database import get_db
from backend.schemas.doctor import DoctorResponse, DoctorListResponse, DoctorUpdate
from backend.schemas.user import UserRegister
from backend.services.doctor_service import DoctorService
from backend.services.auth_service import AuthService
from backend.utils.dependencies import get_current_user, require_roles
from backend.models.user import User, UserRole
from backend.models.doctor import Doctor

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("", response_model=DoctorListResponse, summary="Discover and filter doctors")
def list_doctors(
    search: Optional[str] = Query(None, description="Search by name, specialty, hospital"),
    specialization: Optional[str] = Query(None, description="Filter by clinical specialty"),
    hospital: Optional[str] = Query(None, description="Filter by hospital or clinic"),
    min_rating: Optional[float] = Query(None, ge=1.0, le=5.0, description="Minimum doctor rating"),
    max_fee: Optional[float] = Query(None, ge=0.0, description="Maximum consultation fee"),
    sort_by: str = Query("rating_desc", description="Sort order: rating_desc, experience_desc, fee_asc, fee_desc, name_asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return DoctorService.list_doctors(
        db=db,
        search=search,
        specialization=specialization,
        hospital=hospital,
        min_rating=min_rating,
        max_fee=max_fee,
        sort_by=sort_by,
        page=page,
        limit=limit
    )

@router.get("/{doctor_id}", response_model=DoctorResponse, summary="Get doctor profile details")
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    return DoctorService.get_doctor_by_id(db, doctor_id)

@router.post("", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED, summary="Create new doctor profile (Admin only)")
def create_doctor(
    doc_data: UserRegister,
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    doc_data.role = UserRole.DOCTOR.value
    token_resp = AuthService.register_user(db, doc_data)
    return DoctorService.get_doctor_by_id(db, token_resp.doctor_id)

@router.put("/{doctor_id}", response_model=DoctorResponse, summary="Update doctor profile")
def update_doctor(
    doctor_id: int,
    update_data: DoctorUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Authorization: Doctor can update their own profile; Admin can update any
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    if current_user.role == UserRole.DOCTOR.value and doctor.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your own profile")
    elif current_user.role not in [UserRole.DOCTOR.value, UserRole.ADMIN.value]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    return DoctorService.update_doctor(db, doctor_id, update_data)

@router.delete("/{doctor_id}", summary="Deactivate/Delete doctor (Admin only)")
def delete_doctor(
    doctor_id: int,
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    doctor.is_active = False
    db.commit()
    return {"detail": "Doctor profile deactivated successfully"}
