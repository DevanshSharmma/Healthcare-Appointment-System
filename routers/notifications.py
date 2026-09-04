from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.notification import NotificationListResponse, NotificationResponse
from backend.services.notification_service import NotificationService
from backend.utils.dependencies import get_current_user
from backend.models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=NotificationListResponse, summary="Get notifications for the logged-in user")
def get_my_notifications(
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return NotificationService.get_user_notifications(db, current_user.id, limit=limit)

@router.put("/{notification_id}/read", response_model=NotificationResponse, summary="Mark notification as read")
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return NotificationService.mark_as_read(db, notification_id, current_user.id)

@router.put("/read-all", summary="Mark all notifications as read")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated = NotificationService.mark_all_as_read(db, current_user.id)
    return {"detail": f"Marked {updated} notifications as read"}
