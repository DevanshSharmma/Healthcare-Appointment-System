import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.core.database import engine, Base
from backend.utils.seed import seed_database
from backend.routers.health import router as health_router
from backend.routers.auth import router as auth_router
from backend.routers.doctors import router as doctors_router
from backend.routers.patients import router as patients_router
from backend.routers.availability import router as availability_router
from backend.routers.appointments import router as appointments_router
from backend.routers.medical_records import router as medical_records_router
from backend.routers.prescriptions import router as prescriptions_router
from backend.routers.notifications import router as notifications_router
from backend.routers.admin import router as admin_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("healthcare.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema & seed initial enterprise data
    logger.info("Initializing MediPulse Healthcare Platform backend...")
    try:
        Base.metadata.create_all(bind=engine)
        seed_database()
        logger.info("Database schema and seed verification complete.")
    except Exception as e:
        logger.error(f"Startup database initialization warning: {e}")
    yield
    # Shutdown
    logger.info("Shutting down MediPulse Healthcare Platform backend.")

app = FastAPI(
    title="MediPulse — Healthcare Appointment & Patient Management API",
    description="""
    Production-grade Healthcare SaaS API powering doctor discovery, real-time availability scheduling,
    double-booking protected appointment workflows, electronic medical records (EMR),
    multi-item prescription management, role-based access control, and administrative analytics.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler to prevent raw stack trace exposure
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error at {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Our engineering team has been notified."}
    )

# Include API Routers
app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(doctors_router, prefix="/api")
app.include_router(patients_router, prefix="/api")
app.include_router(availability_router, prefix="/api")
app.include_router(appointments_router, prefix="/api")
app.include_router(medical_records_router, prefix="/api")
app.include_router(prescriptions_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/", include_in_schema=False)
def root_redirect():
    return {
        "platform": "MediPulse Healthcare Platform",
        "documentation": "/docs",
        "health": "/api/health",
        "status": "Operational"
    }
