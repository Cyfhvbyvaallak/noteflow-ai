from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SearchResultItem(BaseModel):
    id: int
    type: str  # "lecture", "transcript", "note", "summary", "revision", "quiz"
    title: str
    subject: Optional[str] = None
    snippet: str
    lecture_id: Optional[int] = None
    created_at: Optional[datetime] = None

class GlobalSearchResponse(BaseModel):
    query: str
    total_results: int
    lectures: List[SearchResultItem] = []
    transcripts: List[SearchResultItem] = []
    notes: List[SearchResultItem] = []
    summaries: List[SearchResultItem] = []
    revision_notes: List[SearchResultItem] = []
    quizzes: List[SearchResultItem] = []

class DashboardResponse(BaseModel):
    student_name: str
    total_lectures: int
    total_notes: int
    total_summaries: int
    quizzes_completed: int
    average_quiz_score: float
    recent_lectures: List[dict]
    recent_notes: List[dict]
    upcoming_revisions: List[dict]
    quiz_performance: List[dict]
