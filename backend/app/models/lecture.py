from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum
from app.database.connection import Base

class SourceType(str, enum.Enum):
    RECORDING = "RECORDING"
    AUDIO_UPLOAD = "AUDIO_UPLOAD"
    VIDEO_UPLOAD = "VIDEO_UPLOAD"
    PDF_UPLOAD = "PDF_UPLOAD"

class LectureStatus(str, enum.Enum):
    UPLOADED = "UPLOADED"
    TRANSCRIBING = "TRANSCRIBING"
    TRANSCRIBED = "TRANSCRIBED"
    GENERATING = "GENERATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False, index=True)
    source_type = Column(String(50), default="AUDIO_UPLOAD", nullable=False)
    file_path = Column(String(500), nullable=True)
    duration = Column(Integer, default=0)  # in seconds
    status = Column(String(50), default="UPLOADED", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="lectures")
    transcript = relationship("Transcript", back_populates="lecture", uselist=False, cascade="all, delete-orphan")
    summary = relationship("Summary", back_populates="lecture", uselist=False, cascade="all, delete-orphan")
    key_points = relationship("KeyPoint", back_populates="lecture", cascade="all, delete-orphan")
    revision_notes = relationship("RevisionNote", back_populates="lecture", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lecture", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="lecture")
