from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.user import UserRegister, UserLogin, Token, UserResponse
from backend.services.auth_service import AuthService
from backend.utils.dependencies import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED, summary="Register a new user (Patient or Doctor)")
def register(reg_data: UserRegister, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else None
    return AuthService.register_user(db=db, reg_data=reg_data, ip_address=ip)

@router.post("/login", response_model=Token, summary="Authenticate user and retrieve JWT access token")
def login(login_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else None
    return AuthService.authenticate_user(db=db, login_data=login_data, ip_address=ip)

@router.get("/me", response_model=UserResponse, summary="Get current authenticated user profile")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthService.get_me_details(db, current_user)
