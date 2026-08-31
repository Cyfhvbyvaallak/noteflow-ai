from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models.user import User
from app.models.lecture import Lecture
from app.models.note import Note
from app.models.summary import Summary
from app.models.revision_note import RevisionNote
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.search import DashboardResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Total counts
    total_lectures = db.query(Lecture).filter(Lecture.user_id == current_user.id).count()
    total_notes = db.query(Note).filter(Note.user_id == current_user.id).count()
    
    total_summaries = (
        db.query(Summary)
        .join(Lecture, Summary.lecture_id == Lecture.id)
        .filter(Lecture.user_id == current_user.id)
        .count()
    )
    
    quiz_attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).all()
    quizzes_completed = len(quiz_attempts)
    
    if quizzes_completed > 0:
        avg_score = round(sum([float(a.percentage) for a in quiz_attempts]) / quizzes_completed, 1)
    else:
        avg_score = 0.0

    # Recent Lectures (up to 5)
    recent_lectures_objs = (
        db.query(Lecture)
        .filter(Lecture.user_id == current_user.id)
        .order_by(Lecture.created_at.desc())
        .limit(5)
        .all()
    )
    recent_lectures = [
        {
            "id": l.id,
            "title": l.title,
            "subject": l.subject,
            "duration": l.duration,
            "status": l.status,
            "source_type": l.source_type,
            "created_at": l.created_at.isoformat() if l.created_at else None
        }
        for l in recent_lectures_objs
    ]

    # Recent Notes (up to 5)
    recent_notes_objs = (
        db.query(Note)
        .filter(Note.user_id == current_user.id)
        .order_by(Note.updated_at.desc())
        .limit(5)
        .all()
    )
    recent_notes = [
        {
            "id": n.id,
            "title": n.title,
            "subject": n.subject,
            "tags": n.tags,
            "is_favorite": n.is_favorite,
            "snippet": (n.content[:140] + "...") if len(n.content) > 140 else n.content,
            "updated_at": n.updated_at.isoformat() if n.updated_at else None
        }
        for n in recent_notes_objs
    ]

    # Upcoming Revision queue (from latest revision notes)
    revision_notes_objs = (
        db.query(RevisionNote)
        .join(Lecture, RevisionNote.lecture_id == Lecture.id)
        .filter(Lecture.user_id == current_user.id)
        .order_by(RevisionNote.created_at.desc())
        .limit(4)
        .all()
    )
    upcoming_revisions = []
    for r in revision_notes_objs:
        content = r.content if isinstance(r.content, dict) else {}
        quick_pts = content.get("quick_revision_points", [])
        exam_focus = content.get("exam_focus", [])
        upcoming_revisions.append({
            "id": r.id,
            "lecture_id": r.lecture_id,
            "lecture_title": r.lecture.title if r.lecture else "Lecture Topic",
            "subject": r.lecture.subject if r.lecture else "General",
            "topic": content.get("topic", r.lecture.title if r.lecture else "Revision"),
            "points_count": len(quick_pts),
            "sample_point": quick_pts[0] if quick_pts else "Review core lecture concepts",
            "exam_focus": exam_focus[:2] if exam_focus else ["Key terminology & definitions"]
        })

    # Quiz performance trends
    quiz_perf = [
        {
            "attempt_id": a.id,
            "quiz_title": a.quiz.title if a.quiz else "Quiz",
            "score": a.score,
            "percentage": float(a.percentage),
            "date": a.completed_at.strftime("%b %d") if a.completed_at else ""
        }
        for a in quiz_attempts[-6:]
    ]

    return DashboardResponse(
        student_name=current_user.name,
        total_lectures=total_lectures,
        total_notes=total_notes,
        total_summaries=total_summaries,
        quizzes_completed=quizzes_completed,
        average_quiz_score=avg_score,
        recent_lectures=recent_lectures,
        recent_notes=recent_notes,
        upcoming_revisions=upcoming_revisions,
        quiz_performance=quiz_perf
    )
