from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.database.connection import get_db
from app.models.lecture import Lecture, LectureStatus
from app.models.transcript import Transcript
from app.models.summary import Summary
from app.models.key_point import KeyPoint
from app.models.revision_note import RevisionNote
from app.models.quiz import Quiz, Question
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services.ai_service import generate_summary, generate_key_points, generate_revision_notes, generate_quiz

router = APIRouter(prefix="/api/ai", tags=["AI Processing Engine"])

class AITextRequest(BaseModel):
    transcript_text: str
    lecture_title: Optional[str] = ""
    subject: Optional[str] = ""

@router.post("/summarize")
def summarize_endpoint(data: AITextRequest):
    if not data.transcript_text or len(data.transcript_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Transcript text is too short to summarize.")
    summary = generate_summary(data.transcript_text, data.lecture_title or "", data.subject or "")
    return {"summary": summary}

@router.post("/key-points")
def key_points_endpoint(data: AITextRequest):
    if not data.transcript_text or len(data.transcript_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Transcript text is too short to extract key points.")
    key_points = generate_key_points(data.transcript_text, data.lecture_title or "", data.subject or "")
    return {"key_points": key_points}

@router.post("/revision")
def revision_endpoint(data: AITextRequest):
    if not data.transcript_text or len(data.transcript_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Transcript text is too short to generate revision material.")
    revision = generate_revision_notes(data.transcript_text, data.lecture_title or "", data.subject or "")
    return {"revision_notes": revision}

@router.post("/quiz")
def quiz_endpoint(data: AITextRequest):
    if not data.transcript_text or len(data.transcript_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Transcript text is too short to generate a practice quiz.")
    quiz_questions = generate_quiz(data.transcript_text, data.lecture_title or "", data.subject or "")
    return {"questions": quiz_questions}

@router.post("/full-process/{lecture_id}")
def full_process_lecture(
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

    if not lecture.transcript:
        raise HTTPException(status_code=400, detail="Lecture does not have a transcript yet.")

    transcript_text = lecture.transcript.transcript_text
    lecture.status = LectureStatus.GENERATING.value
    db.commit()

    try:
        # 1. Summary
        summary_text = generate_summary(transcript_text, lecture.title, lecture.subject)
        if lecture.summary:
            lecture.summary.summary_text = summary_text
        else:
            db.add(Summary(lecture_id=lecture.id, summary_text=summary_text))

        # 2. Key Points
        kp_data = generate_key_points(transcript_text, lecture.title, lecture.subject)
        db.query(KeyPoint).filter(KeyPoint.lecture_id == lecture.id).delete()
        db.add(KeyPoint(lecture_id=lecture.id, content=kp_data))

        # 3. Revision
        rev_data = generate_revision_notes(transcript_text, lecture.title, lecture.subject)
        db.query(RevisionNote).filter(RevisionNote.lecture_id == lecture.id).delete()
        db.add(RevisionNote(lecture_id=lecture.id, content=rev_data))

        # 4. Quiz
        quiz_data = generate_quiz(transcript_text, lecture.title, lecture.subject)
        db.query(Quiz).filter(Quiz.lecture_id == lecture.id).delete()
        quiz = Quiz(lecture_id=lecture.id, title=f"Practice Quiz: {lecture.title}")
        db.add(quiz)
        db.flush()

        for q in quiz_data:
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

        return {
            "status": "success",
            "message": "AI study material generated successfully.",
            "lecture_id": lecture.id
        }
    except Exception as e:
        lecture.status = LectureStatus.FAILED.value
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))
