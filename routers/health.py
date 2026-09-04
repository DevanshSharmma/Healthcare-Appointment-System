from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.core.database import get_db

router = APIRouter(tags=["Health"])

@router.get("/health", summary="Platform Health Check")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    db_type = "unknown"
    try:
        db.execute(text("SELECT 1"))
        db_type = db.bind.dialect.name
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if "unhealthy" not in db_status else "degraded",
        "service": "MediPulse Healthcare Backend",
        "version": "1.0.0",
        "database": {
            "status": db_status,
            "engine": db_type
        }
    }
