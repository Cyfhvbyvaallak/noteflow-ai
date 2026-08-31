from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.quiz import Quiz, Question, QuizAttempt
from app.models.lecture import Lecture
from app.models.user import User
from app.schemas.ai import QuizResponse, QuizSubmitRequest, QuizAttemptResult
from app.schemas.quiz import QuizSummaryCard, QuizAttemptResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/quizzes", tags=["Quiz System"])

@router.get("", response_model=List[QuizSummaryCard])
def list_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quizzes = (
        db.query(Quiz)
        .join(Lecture, Quiz.lecture_id == Lecture.id)
        .filter(Lecture.user_id == current_user.id)
        .all()
    )
    result = []
    for q in quizzes:
        attempts = db.query(QuizAttempt).filter(
            QuizAttempt.quiz_id == q.id,
            QuizAttempt.user_id == current_user.id
        ).all()
        best_score = max([float(a.percentage) for a in attempts]) if attempts else None
        result.append(QuizSummaryCard(
            id=q.id,
            lecture_id=q.lecture_id,
            title=q.title,
            lecture_title=q.lecture.title if q.lecture else "Lecture",
            subject=q.lecture.subject if q.lecture else "General",
            question_count=len(q.questions),
            attempts_count=len(attempts),
            best_score=best_score,
            created_at=q.created_at
        ))
    return result

@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz_detail(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).join(Lecture).filter(
        Quiz.id == quiz_id,
        Lecture.user_id == current_user.id
    ).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    return quiz

@router.post("/{quiz_id}/submit", response_model=QuizAttemptResult)
def submit_quiz_answers(
    quiz_id: int,
    submission: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).join(Lecture).filter(
        Quiz.id == quiz_id,
        Lecture.user_id == current_user.id
    ).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")

    total_questions = len(quiz.questions)
    if total_questions == 0:
        raise HTTPException(status_code=400, detail="Quiz has no questions.")

    correct_count = 0
    breakdown = []

    for q in quiz.questions:
        user_answer = submission.answers.get(q.id) or submission.answers.get(str(q.id))
        is_correct = False
        if user_answer and str(user_answer).strip().upper() == q.correct_answer.strip().upper():
            is_correct = True
            correct_count += 1

        breakdown.append({
            "question_id": q.id,
            "question": q.question,
            "user_answer": user_answer,
            "correct_answer": q.correct_answer,
            "is_correct": is_correct,
            "explanation": q.explanation,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
        })

    percentage = round((correct_count / total_questions) * 100.0, 2)

    # Save attempt
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=correct_count,
        percentage=percentage
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return QuizAttemptResult(
        quiz_id=quiz.id,
        score=correct_count,
        total_questions=total_questions,
        percentage=percentage,
        results=breakdown,
        completed_at=attempt.completed_at
    )

@router.get("/attempts/history", response_model=List[QuizAttemptResponse])
def get_quiz_attempt_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).order_by(QuizAttempt.completed_at.desc()).all()

    result = []
    for a in attempts:
        result.append(QuizAttemptResponse(
            id=a.id,
            user_id=a.user_id,
            quiz_id=a.quiz_id,
            score=a.score,
            percentage=float(a.percentage),
            completed_at=a.completed_at,
            quiz_title=a.quiz.title if a.quiz else "Quiz",
            lecture_title=a.quiz.lecture.title if a.quiz and a.quiz.lecture else "Lecture"
        ))
    return result
