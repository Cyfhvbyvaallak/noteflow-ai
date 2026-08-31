from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class TranscriptResponse(BaseModel):
    id: Optional[int] = None
    lecture_id: int
    transcript_text: str
    language: str = "en"
    duration: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SummaryResponse(BaseModel):
    id: Optional[int] = None
    lecture_id: int
    summary_text: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class KeyPointItem(BaseModel):
    title: str
    description: str
    importance: Optional[str] = "High"

class KeyPointResponse(BaseModel):
    id: Optional[int] = None
    lecture_id: int
    content: List[Dict[str, Any]]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ConceptItem(BaseModel):
    concept: str
    explanation: str

class DefinitionItem(BaseModel):
    term: str
    definition: str

class RevisionNoteContent(BaseModel):
    topic: str
    important_concepts: List[ConceptItem]
    definitions: List[DefinitionItem]
    explanations: List[str]
    important_examples: List[str]
    quick_revision_points: List[str]
    exam_focus: Optional[List[str]] = []

class RevisionNoteResponse(BaseModel):
    id: Optional[int] = None
    lecture_id: int
    content: Dict[str, Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuestionItem(BaseModel):
    id: Optional[int] = None
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: str

    class Config:
        from_attributes = True

class QuizResponse(BaseModel):
    id: int
    lecture_id: int
    title: str
    questions: List[QuestionItem] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuizSubmitRequest(BaseModel):
    answers: Dict[int, str]  # question_id -> chosen option (e.g. {1: "B", 2: "A"})

class QuizAttemptResult(BaseModel):
    quiz_id: int
    score: int
    total_questions: int
    percentage: float
    results: List[Dict[str, Any]]
    completed_at: Optional[datetime] = None

class AIProcessRequest(BaseModel):
    lecture_id: int
    transcript_text: Optional[str] = None
