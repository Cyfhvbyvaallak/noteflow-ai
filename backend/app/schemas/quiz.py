from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class QuestionCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: str

class QuizCreate(BaseModel):
    lecture_id: int
    title: str
    questions: List[QuestionCreate]

class QuizAttemptResponse(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    score: int
    percentage: float
    completed_at: Optional[datetime] = None
    quiz_title: Optional[str] = None
    lecture_title: Optional[str] = None

    class Config:
        from_attributes = True

class QuizSummaryCard(BaseModel):
    id: int
    lecture_id: int
    title: str
    lecture_title: str
    subject: str
    question_count: int
    attempts_count: int
    best_score: Optional[float] = None
    created_at: Optional[datetime] = None
