from sqlalchemy import Column, Integer, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.connection import Base

class KeyPoint(Base):
    __tablename__ = "key_points"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lecture_id = Column(Integer, ForeignKey("lectures.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(JSON, nullable=False)  # List of objects: [{"title": "...", "description": "..."}]
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    lecture = relationship("Lecture", back_populates="key_points")
