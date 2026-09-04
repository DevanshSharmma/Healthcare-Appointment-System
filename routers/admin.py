from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from backend.core.database import get_db
from backend.schemas.admin import AdminStatsResponse
from backend.schemas.patient import PatientResponse
from backend.schemas.doctor import DoctorListResponse, DoctorResponse
from backend.schemas.appointment import AppointmentListResponse
from backend.schemas.audit_log import AuditLogListResponse
from backend.services.admin_service import AdminService
from backend.services.doctor_service import DoctorService
from backend.services.appointment_service import AppointmentService
from backend.utils.dependencies import require_roles
from backend.models.user import User, UserRole

router = APIRouter(prefix="/admin", tags=["Admin Oversight"])

@router.get("/statistics", response_model=AdminStatsResponse, summary="Get high-level platform KPI and chart analytics")
def get_stats(
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return AdminService.get_platform_statistics(db)

@router.get("/patients", response_model=List[PatientResponse], summary="List and search registered patients")
def list_patients(
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    page: int = Query(1, ge=1),
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return AdminService.get_all_patients(db, search=search, limit=limit, page=page)

@router.get("/doctors", response_model=DoctorListResponse, summary="List all doctors including pending/inactive")
def list_all_doctors(
    search: Optional[str] = Query(None),
    specialization: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return DoctorService.list_doctors(
        db=db,
        search=search,
        specialization=specialization,
        page=page,
        limit=limit,
        include_inactive=True
    )

@router.get("/appointments", response_model=AppointmentListResponse, summary="Admin overview of appointments")
def list_all_appointments(
    patient_id: Optional[int] = Query(None),
    doctor_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return AppointmentService.list_appointments(
        db=db,
        current_user=current_admin,
        patient_id=patient_id,
        doctor_id=doctor_id,
        status_filter=status,
        date_filter=date
    )

@router.get("/audit-logs", response_model=AuditLogListResponse, summary="View system-wide security and activity audit logs")
def get_audit_logs(
    action: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    page: int = Query(1, ge=1),
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return AdminService.get_audit_logs(db, action=action, limit=limit, page=page)

@router.put("/doctors/{doctor_id}/approve", response_model=DoctorResponse, summary="Approve doctor credentials")
def approve_doctor(
    doctor_id: int,
    is_approved: bool = Query(True),
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return AdminService.toggle_doctor_approval(db, doctor_id, is_approved, current_admin)

@router.put("/doctors/{doctor_id}/toggle-active", response_model=DoctorResponse, summary="Activate or deactivate doctor account")
def toggle_doctor_active(
    doctor_id: int,
    is_active: bool = Query(...),
    current_admin: User = Depends(require_roles([UserRole.ADMIN.value])),
    db: Session = Depends(get_db)
):
    return AdminService.toggle_doctor_active(db, doctor_id, is_active, current_admin)
