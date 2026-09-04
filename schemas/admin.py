from pydantic import BaseModel
from typing import List, Dict, Any

class AdminStatsResponse(BaseModel):
    total_patients: int
    total_doctors: int
    total_appointments: int
    pending_appointments: int
    confirmed_appointments: int
    completed_appointments: int
    cancelled_appointments: int
    active_doctors: int
    total_prescriptions: int
    total_medical_records: int
    appointments_by_status: Dict[str, int]
    monthly_appointments: List[Dict[str, Any]]
    specialty_distribution: List[Dict[str, Any]]
