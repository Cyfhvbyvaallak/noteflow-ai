from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.models.lecture import Lecture
from app.models.transcript import Transcript
from app.models.note import Note
from app.models.summary import Summary
from app.models.revision_note import RevisionNote
from app.models.quiz import Quiz, Question
from app.schemas.search import GlobalSearchResponse, SearchResultItem
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/search", tags=["Global Search"])

@router.get("", response_model=GlobalSearchResponse)
def search_global(
    q: str = Query("", min_length=1, description="Search query term"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query_str = q.strip()
    if not query_str:
        return GlobalSearchResponse(query="", total_results=0)

    pattern = f"%{query_str}%"

    # 1. Search Lectures
    matching_lectures = (
        db.query(Lecture)
        .filter(
            Lecture.user_id == current_user.id,
            (Lecture.title.ilike(pattern) | Lecture.subject.ilike(pattern))
        )
        .all()
    )
    lecture_results = [
        SearchResultItem(
            id=l.id,
            type="lecture",
            title=l.title,
            subject=l.subject,
            snippet=f"Lecture in {l.subject} • Status: {l.status} • Duration: {l.duration}s",
            lecture_id=l.id,
            created_at=l.created_at
        )
        for l in matching_lectures
    ]

    # 2. Search Transcripts
    matching_transcripts = (
        db.query(Transcript)
        .join(Lecture, Transcript.lecture_id == Lecture.id)
        .filter(
            Lecture.user_id == current_user.id,
            Transcript.transcript_text.ilike(pattern)
        )
        .all()
    )
    transcript_results = []
    for t in matching_transcripts:
        idx = t.transcript_text.lower().find(query_str.lower())
        start = max(0, idx - 60)
        end = min(len(t.transcript_text), idx + len(query_str) + 60)
        snippet = ("..." if start > 0 else "") + t.transcript_text[start:end] + ("..." if end < len(t.transcript_text) else "")
        transcript_results.append(SearchResultItem(
            id=t.id,
            type="transcript",
            title=f"Transcript: {t.lecture.title if t.lecture else 'Lecture'}",
            subject=t.lecture.subject if t.lecture else "General",
            snippet=snippet,
            lecture_id=t.lecture_id,
            created_at=t.created_at
        ))

    # 3. Search Notes
    matching_notes = (
        db.query(Note)
        .filter(
            Note.user_id == current_user.id,
            (Note.title.ilike(pattern) | Note.content.ilike(pattern) | Note.tags.ilike(pattern))
        )
        .all()
    )
    note_results = []
    for n in matching_notes:
        idx = n.content.lower().find(query_str.lower())
        if idx != -1:
            start = max(0, idx - 50)
            end = min(len(n.content), idx + len(query_str) + 50)
            snippet = ("..." if start > 0 else "") + n.content[start:end] + ("..." if end < len(n.content) else "")
        else:
            snippet = n.title
        note_results.append(SearchResultItem(
            id=n.id,
            type="note",
            title=n.title,
            subject=n.subject,
            snippet=snippet,
            lecture_id=n.lecture_id,
            created_at=n.created_at
        ))

    # 4. Search Summaries
    matching_summaries = (
        db.query(Summary)
        .join(Lecture, Summary.lecture_id == Lecture.id)
        .filter(
            Lecture.user_id == current_user.id,
            Summary.summary_text.ilike(pattern)
        )
        .all()
    )
    summary_results = []
    for s in matching_summaries:
        idx = s.summary_text.lower().find(query_str.lower())
        start = max(0, idx - 50)
        end = min(len(s.summary_text), idx + len(query_str) + 50)
        snippet = ("..." if start > 0 else "") + s.summary_text[start:end] + ("..." if end < len(s.summary_text) else "")
        summary_results.append(SearchResultItem(
            id=s.id,
            type="summary",
            title=f"Summary: {s.lecture.title if s.lecture else 'Lecture'}",
            subject=s.lecture.subject if s.lecture else "General",
            snippet=snippet,
            lecture_id=s.lecture_id,
            created_at=s.created_at
        ))

    # 5. Search Revision Notes
    matching_revisions = (
        db.query(RevisionNote)
        .join(Lecture, RevisionNote.lecture_id == Lecture.id)
        .filter(Lecture.user_id == current_user.id)
        .all()
    )
    revision_results = []
    for r in matching_revisions:
        content_str = str(r.content).lower()
        if query_str.lower() in content_str:
            topic = r.content.get("topic", "Revision Material") if isinstance(r.content, dict) else "Revision"
            revision_results.append(SearchResultItem(
                id=r.id,
                type="revision",
                title=f"Revision: {topic}",
                subject=r.lecture.subject if r.lecture else "General",
                snippet=f"Revision study terms and key concepts for {r.lecture.title if r.lecture else 'Lecture'}",
                lecture_id=r.lecture_id,
                created_at=r.created_at
            ))

    # 6. Search Quiz Questions
    matching_questions = (
        db.query(Question)
        .join(Quiz, Question.quiz_id == Quiz.id)
        .join(Lecture, Quiz.lecture_id == Lecture.id)
        .filter(
            Lecture.user_id == current_user.id,
            (Question.question.ilike(pattern) | Question.explanation.ilike(pattern))
        )
        .all()
    )
    quiz_results = [
        SearchResultItem(
            id=q.quiz_id,
            type="quiz",
            title=f"Quiz Question in {q.quiz.title if q.quiz else 'Quiz'}",
            subject=q.quiz.lecture.subject if q.quiz and q.quiz.lecture else "General",
            snippet=f"Q: {q.question} • Explanation: {q.explanation[:80]}...",
            lecture_id=q.quiz.lecture_id if q.quiz else None,
            created_at=q.quiz.created_at if q.quiz else None
        )
        for q in matching_questions
    ]

    total = (
        len(lecture_results) +
        len(transcript_results) +
        len(note_results) +
        len(summary_results) +
        len(revision_results) +
        len(quiz_results)
    )

    return GlobalSearchResponse(
        query=query_str,
        total_results=total,
        lectures=lecture_results,
        transcripts=transcript_results,
        notes=note_results,
        summaries=summary_results,
        revision_notes=revision_results,
        quizzes=quiz_results
    )
