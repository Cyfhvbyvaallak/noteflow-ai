from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lecture_id = Column(Integer, ForeignKey("lectures.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    summary_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    lecture = relationship("Lecture", back_populates="summary")
