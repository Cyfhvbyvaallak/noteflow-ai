from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.ai import TranscriptResponse, SummaryResponse, KeyPointResponse, RevisionNoteResponse, QuizResponse

class LectureBase(BaseModel):
    title: str
    subject: str
    source_type: Optional[str] = "AUDIO_UPLOAD"
    duration: Optional[int] = 0

class LectureCreate(LectureBase):
    pass

class LectureUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    status: Optional[str] = None

class LectureResponse(LectureBase):
    id: int
    user_id: int
    file_path: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LectureDetailResponse(LectureResponse):
    transcript: Optional[TranscriptResponse] = None
    summary: Optional[SummaryResponse] = None
    key_points: Optional[List[KeyPointResponse]] = None
    revision_notes: Optional[List[RevisionNoteResponse]] = None
    quizzes: Optional[List[QuizResponse]] = None

    class Config:
        from_attributes = True
