from fastapi import APIRouter, Depends, Query, Request, status, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from backend.core.database import get_db
from backend.schemas.appointment import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentCancelRequest,
    AppointmentResponse,
    AppointmentListResponse
)
from backend.services.appointment_service import AppointmentService
from backend.utils.dependencies import get_current_user, require_roles
from backend.models.user import User, UserRole

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED, summary="Book an appointment (Double-booking protected)")
def book_appointment(
    data: AppointmentCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else None
    if current_user.role != UserRole.PATIENT.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can schedule appointments. Please log in as a patient."
        )

    patient_id = current_user.patient_profile.id
    return AppointmentService.create_appointment(
        db=db,
        patient_id=patient_id,
        data=data,
        current_user=current_user,
        ip_address=ip
    )

@router.get("", response_model=AppointmentListResponse, summary="List appointments (filtered by current user role)")
def list_appointments(
    patient_id: Optional[int] = Query(None, description="Admin only: filter by patient"),
    doctor_id: Optional[int] = Query(None, description="Admin only: filter by doctor"),
    status: Optional[str] = Query(None, description="Filter by status: PENDING, CONFIRMED, COMPLETED, REJECTED, CANCELLED, ALL"),
    date: Optional[str] = Query(None, description="Filter by appointment date YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return AppointmentService.list_appointments(
        db=db,
        current_user=current_user,
        patient_id=patient_id,
        doctor_id=doctor_id,
        status_filter=status,
        date_filter=date
    )

@router.get("/{appointment_id}", response_model=AppointmentResponse, summary="Get appointment details")
def get_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appt = AppointmentService.get_appointment_by_id(db, appointment_id)
    # Check permission
    if current_user.role == UserRole.PATIENT.value and appt.patient_id != current_user.patient_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    if current_user.role == UserRole.DOCTOR.value and appt.doctor_id != current_user.doctor_profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return appt

@router.put("/{appointment_id}/status", response_model=AppointmentResponse, summary="Transition appointment status")
def update_status(
    appointment_id: int,
    status_update: AppointmentStatusUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else None
    return AppointmentService.update_appointment_status(
        db=db,
        appointment_id=appointment_id,
        status_update=status_update,
        current_user=current_user,
        ip_address=ip
    )

@router.put("/{appointment_id}/cancel", response_model=AppointmentResponse, summary="Cancel an appointment")
def cancel_appointment(
    appointment_id: int,
    cancel_data: AppointmentCancelRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else None
    status_update = AppointmentStatusUpdate(
        status="CANCELLED",
        cancellation_reason=cancel_data.cancellation_reason
    )
    return AppointmentService.update_appointment_status(
        db=db,
        appointment_id=appointment_id,
        status_update=status_update,
        current_user=current_user,
        ip_address=ip
    )

@router.delete("/{appointment_id}", summary="Cancel appointment (Admin only)")
def delete_appointment(
    appointment_id: int,
    request: Request,
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    ip = request.client.host if request.client else None
    status_update = AppointmentStatusUpdate(
        status="CANCELLED",
        cancellation_reason="Administrative cancellation"
    )
    AppointmentService.update_appointment_status(
        db=db,
        appointment_id=appointment_id,
        status_update=status_update,
        current_user=current_admin,
        ip_address=ip
    )
    return {"detail": "Appointment cancelled by administrator"}
