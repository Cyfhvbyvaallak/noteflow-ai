from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, PasswordChangeRequest, ForgotPasswordRequest
from app.schemas.lecture import LectureCreate, LectureUpdate, LectureResponse, LectureDetailResponse
from app.schemas.ai import (
    TranscriptResponse,
    SummaryResponse,
    KeyPointResponse,
    RevisionNoteResponse,
    QuizResponse,
    QuestionItem,
    QuizSubmitRequest,
    QuizAttemptResult,
    AIProcessRequest,
)
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.schemas.quiz import QuizCreate, QuizAttemptResponse, QuizSummaryCard
from app.schemas.search import SearchResultItem, GlobalSearchResponse, DashboardResponse

__all__ = [
    "UserCreate",
    "UserLogin",
    "UserResponse",
    "TokenResponse",
    "PasswordChangeRequest",
    "ForgotPasswordRequest",
    "LectureCreate",
    "LectureUpdate",
    "LectureResponse",
    "LectureDetailResponse",
    "TranscriptResponse",
    "SummaryResponse",
    "KeyPointResponse",
    "RevisionNoteResponse",
    "QuizResponse",
    "QuestionItem",
    "QuizSubmitRequest",
    "QuizAttemptResult",
    "AIProcessRequest",
    "NoteCreate",
    "NoteUpdate",
    "NoteResponse",
    "QuizCreate",
    "QuizAttemptResponse",
    "QuizSummaryCard",
    "SearchResultItem",
    "GlobalSearchResponse",
    "DashboardResponse",
]
