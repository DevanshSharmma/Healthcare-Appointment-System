from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.core.database import get_db
from backend.schemas.availability import (
    DoctorAvailabilityCreate,
    DoctorAvailabilityUpdate,
    DoctorAvailabilityResponse,
    DaySlotsResponse
)
from backend.services.availability_service import AvailabilityService
from backend.utils.dependencies import get_current_user, require_roles
from backend.models.user import User, UserRole
from backend.models.doctor import Doctor

router = APIRouter(prefix="/availability", tags=["Availability"])

@router.post("", response_model=DoctorAvailabilityResponse, status_code=status.HTTP_201_CREATED, summary="Create doctor availability period")
def create_availability(
    data: DoctorAvailabilityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.DOCTOR.value:
        doctor_id = current_user.doctor_profile.id
    elif current_user.role == UserRole.ADMIN.value:
        if not data.doctor_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="doctor_id must be provided by admin")
        doctor_id = data.doctor_id
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors or admins can set availability")

    return AvailabilityService.create_availability(db, doctor_id, data)

@router.get("/doctor/{doctor_id}", response_model=List[DoctorAvailabilityResponse], summary="Get doctor's weekly availability rules")
def get_doctor_availability(doctor_id: int, db: Session = Depends(get_db)):
    return AvailabilityService.get_doctor_availabilities(db, doctor_id)

@router.get("/doctor/{doctor_id}/slots", response_model=DaySlotsResponse, summary="Get calculated 30-min appointment slots for a specific date")
def get_doctor_slots_for_date(
    doctor_id: int,
    date: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Date in format YYYY-MM-DD"),
    db: Session = Depends(get_db)
):
    return AvailabilityService.generate_slots_for_date(db, doctor_id, date)

@router.put("/{availability_id}", response_model=DoctorAvailabilityResponse, summary="Update availability schedule")
def update_availability(
    availability_id: int,
    data: DoctorAvailabilityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.DOCTOR.value:
        doctor_id = current_user.doctor_profile.id
    elif current_user.role == UserRole.ADMIN.value:
        # Admin can update on behalf of doctor
        from backend.models.availability import DoctorAvailability
        item = db.query(DoctorAvailability).filter(DoctorAvailability.id == availability_id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Availability schedule not found")
        doctor_id = item.doctor_id
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    return AvailabilityService.update_availability(db, availability_id, doctor_id, data)

@router.delete("/{availability_id}", summary="Delete availability schedule")
def delete_availability(
    availability_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.DOCTOR.value:
        doctor_id = current_user.doctor_profile.id
    elif current_user.role == UserRole.ADMIN.value:
        from backend.models.availability import DoctorAvailability
        item = db.query(DoctorAvailability).filter(DoctorAvailability.id == availability_id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Availability schedule not found")
        doctor_id = item.doctor_id
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    return AvailabilityService.delete_availability(db, availability_id, doctor_id)
