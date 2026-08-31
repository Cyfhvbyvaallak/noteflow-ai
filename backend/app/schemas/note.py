from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: str
    subject: Optional[str] = "General"
    tags: Optional[str] = ""
    is_favorite: Optional[bool] = False
    lecture_id: Optional[int] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    tags: Optional[str] = None
    is_favorite: Optional[bool] = None

class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
