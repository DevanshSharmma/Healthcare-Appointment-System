from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.patient import Patient
from backend.models.user import User, UserRole
from backend.schemas.patient import PatientResponse, PatientUpdate
from backend.utils.dependencies import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/{patient_id}", response_model=PatientResponse, summary="Get patient profile")
def get_patient(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")

    # Authorization: Patient can only view own profile; Doctors and Admins can view
    if current_user.role == UserRole.PATIENT.value and patient.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to another patient's profile")

    return PatientResponse(
        id=patient.id,
        user_id=patient.user_id,
        full_name=patient.user.full_name,
        email=patient.user.email,
        phone=patient.user.phone,
        avatar_url=patient.user.avatar_url,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        blood_group=patient.blood_group,
        emergency_contact_name=patient.emergency_contact_name,
        emergency_contact_phone=patient.emergency_contact_phone,
        address=patient.address,
        allergies=patient.allergies,
        medical_history=patient.medical_history,
        created_at=patient.created_at
    )

@router.put("/{patient_id}", response_model=PatientResponse, summary="Update patient medical profile")
def update_patient(
    patient_id: int,
    update_data: PatientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")

    if current_user.role == UserRole.PATIENT.value and patient.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    data_dict = update_data.model_dump(exclude_unset=True)

    # Handle user level fields
    if "full_name" in data_dict:
        patient.user.full_name = data_dict.pop("full_name")
    if "phone" in data_dict:
        patient.user.phone = data_dict.pop("phone")

    for field, value in data_dict.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    return PatientResponse(
        id=patient.id,
        user_id=patient.user_id,
        full_name=patient.user.full_name,
        email=patient.user.email,
        phone=patient.user.phone,
        avatar_url=patient.user.avatar_url,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        blood_group=patient.blood_group,
        emergency_contact_name=patient.emergency_contact_name,
        emergency_contact_phone=patient.emergency_contact_phone,
        address=patient.address,
        allergies=patient.allergies,
        medical_history=patient.medical_history,
        created_at=patient.created_at
    )
