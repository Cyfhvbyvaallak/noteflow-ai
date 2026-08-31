from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.connection import get_db
from app.models.user import User
from app.core.config import settings
from app.core.security import verify_password, get_password_hash
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/settings", tags=["Settings & Profile"])

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

@router.get("/status")
def get_system_status():
    has_openai = bool(settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("your_"))
    return {
        "ai_engine": "OpenAI Live API" if has_openai else "Intelligent Academic Demo Engine",
        "openai_model": settings.OPENAI_MODEL if has_openai else "Academic Heuristic Engine",
        "demo_mode_active": not has_openai,
        "database_type": "MySQL" if settings.DATABASE_URL.startswith("mysql") else "SQLite",
        "stt_provider": "OpenAI Whisper" if has_openai else "Intelligent Demo Transcriber"
    }

@router.put("/profile")
def update_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.name:
        current_user.name = data.name.strip()
    if data.email:
        existing = db.query(User).filter(User.email == data.email.strip(), User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="This email is already in use by another account.")
        current_user.email = data.email.strip()
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully.", "user": current_user}

@router.post("/change-password")
def change_password(
    data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password does not match.")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")
    
    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully."}

@router.delete("/account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted permanently."}
