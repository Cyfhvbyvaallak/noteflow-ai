import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.lecture import Lecture, LectureStatus
from app.models.transcript import Transcript
from app.models.summary import Summary
from app.models.key_point import KeyPoint
from app.models.revision_note import RevisionNote
from app.models.quiz import Quiz, Question
from app.models.user import User
from app.schemas.lecture import LectureCreate, LectureResponse, LectureDetailResponse
from app.services.auth_service import get_current_user
from app.services.ai_service import generate_summary, generate_key_points, generate_revision_notes, generate_quiz

router = APIRouter(prefix="/api/lectures", tags=["Lectures"])

@router.get("", response_model=List[LectureResponse])
def get_lectures(
    subject: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Lecture).filter(Lecture.user_id == current_user.id)
    if subject:
        query = query.filter(Lecture.subject == subject)
    if status:
        query = query.filter(Lecture.status == status)
    return query.order_by(Lecture.created_at.desc()).all()

@router.post("", response_model=LectureResponse)
def create_lecture(
    lecture_in: LectureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lecture = Lecture(
        user_id=current_user.id,
        title=lecture_in.title,
        subject=lecture_in.subject,
        source_type=lecture_in.source_type or "AUDIO_UPLOAD",
        duration=lecture_in.duration or 0,
        status=LectureStatus.UPLOADED.value
    )
    db.add(lecture)
    db.commit()
    db.refresh(lecture)
    return lecture

@router.get("/{lecture_id}", response_model=LectureDetailResponse)
def get_lecture_detail(
    lecture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lecture = db.query(Lecture).filter(
        Lecture.id == lecture_id,
        Lecture.user_id == current_user.id
    ).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found.")
    return lecture

@router.delete("/{lecture_id}")
def delete_lecture(
    lecture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lecture = db.query(Lecture).filter(
        Lecture.id == lecture_id,
        Lecture.user_id == current_user.id
    ).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found.")
    
    # Remove file from disk if exists
    if lecture.file_path and os.path.exists(lecture.file_path):
        try:
            os.remove(lecture.file_path)
        except Exception:
            pass

    db.delete(lecture)
    db.commit()
    return {"message": "Lecture deleted successfully.", "id": lecture_id}

@router.post("/{lecture_id}/regenerate", response_model=LectureDetailResponse)
def regenerate_lecture_ai_content(
    lecture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lecture = db.query(Lecture).filter(
        Lecture.id == lecture_id,
        Lecture.user_id == current_user.id
    ).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found.")
    
    if not lecture.transcript or not lecture.transcript.transcript_text:
        raise HTTPException(status_code=400, detail="Cannot regenerate AI content without a transcript.")

    transcript_text = lecture.transcript.transcript_text
    
    # 1. Regenerate Summary
    new_summary = generate_summary(transcript_text, lecture.title, lecture.subject)
    if lecture.summary:
        lecture.summary.summary_text = new_summary
    else:
        lecture.summary = Summary(lecture_id=lecture.id, summary_text=new_summary)

    # 2. Regenerate Key Points
    new_key_points = generate_key_points(transcript_text, lecture.title, lecture.subject)
    # Remove old key points
    db.query(KeyPoint).filter(KeyPoint.lecture_id == lecture.id).delete()
    db.add(KeyPoint(lecture_id=lecture.id, content=new_key_points))

    # 3. Regenerate Revision Notes
    new_revision = generate_revision_notes(transcript_text, lecture.title, lecture.subject)
    db.query(RevisionNote).filter(RevisionNote.lecture_id == lecture.id).delete()
    db.add(RevisionNote(lecture_id=lecture.id, content=new_revision))

    # 4. Regenerate Quiz
    new_quiz_questions = generate_quiz(transcript_text, lecture.title, lecture.subject)
    db.query(Quiz).filter(Quiz.lecture_id == lecture.id).delete()
    quiz = Quiz(lecture_id=lecture.id, title=f"Practice Quiz: {lecture.title}")
    db.add(quiz)
    db.flush()

    for q in new_quiz_questions:
        db.add(Question(
            quiz_id=quiz.id,
            question=q["question"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_answer=q["correct_answer"],
            explanation=q["explanation"]
        ))

    lecture.status = LectureStatus.COMPLETED.value
    db.commit()
    db.refresh(lecture)
    return lecture
