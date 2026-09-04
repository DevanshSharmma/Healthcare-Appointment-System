from backend.schemas.user import UserRegister, UserLogin, Token, UserResponse
from backend.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse, DoctorListResponse
from backend.schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from backend.schemas.availability import (
    DoctorAvailabilityCreate,
    DoctorAvailabilityUpdate,
    DoctorAvailabilityResponse,
    DaySlotsResponse,
    SlotItem
)
from backend.schemas.appointment import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentCancelRequest,
    AppointmentResponse,
    AppointmentListResponse
)
from backend.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
    MedicalRecordResponse,
    MedicalRecordListResponse
)
from backend.schemas.prescription import (
    PrescriptionItemCreate,
    PrescriptionItemResponse,
    PrescriptionCreate,
    PrescriptionResponse,
    PrescriptionListResponse
)
from backend.schemas.notification import NotificationResponse, NotificationListResponse
from backend.schemas.audit_log import AuditLogResponse, AuditLogListResponse
from backend.schemas.admin import AdminStatsResponse
