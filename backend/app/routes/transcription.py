import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.lecture import Lecture, LectureStatus, SourceType
from app.models.transcript import Transcript
from app.models.summary import Summary
from app.models.key_point import KeyPoint
from app.models.revision_note import RevisionNote
from app.models.quiz import Quiz, Question
from app.models.user import User
from app.core.config import settings
from app.services.auth_service import get_current_user
from app.services.stt_service import transcribe_audio_file
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import generate_summary, generate_key_points, generate_revision_notes, generate_quiz

router = APIRouter(prefix="/api/transcription", tags=["Transcription"])

@router.post("")
async def transcribe_and_process(
    file: UploadFile = File(...),
    title: str = Form(...),
    subject: str = Form(...),
    source_type: str = Form("AUDIO_UPLOAD"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate extension
    filename = file.filename or "upload.wav"
    ext = os.path.splitext(filename)[1].lower()
    allowed_exts = [".mp3", ".wav", ".m4a", ".mp4", ".pdf"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: MP3, WAV, M4A, MP4, PDF."
        )

    # Save file to disk
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    # Create lecture record
    source_enum = SourceType.AUDIO_UPLOAD.value
    if ext == ".pdf":
        source_enum = SourceType.PDF_UPLOAD.value
    elif ext == ".mp4":
        source_enum = SourceType.VIDEO_UPLOAD.value
    elif source_type == "RECORDING":
        source_enum = SourceType.RECORDING.value

    lecture = Lecture(
        user_id=current_user.id,
        title=title,
        subject=subject,
        source_type=source_enum,
        file_path=file_path,
        duration=0,
        status=LectureStatus.TRANSCRIBING.value
    )
    db.add(lecture)
    db.commit()
    db.refresh(lecture)

    try:
        # Step 1: Speech-to-Text or PDF Extraction
        if ext == ".pdf":
            transcript_text = extract_text_from_pdf(file_path)
            duration = 180
            detected_lang = "en"
        else:
            stt_result = transcribe_audio_file(file_path, lecture.title, lecture.subject)
            transcript_text = stt_result["transcript"]
            duration = stt_result["duration"]
            detected_lang = stt_result["language"]

        lecture.duration = duration
        lecture.status = LectureStatus.TRANSCRIBED.value
        db.commit()

        # Step 2: Store Transcript
        transcript = Transcript(
            lecture_id=lecture.id,
            transcript_text=transcript_text,
            language=detected_lang
        )
        db.add(transcript)
        db.commit()

        # Step 3: AI Processing (Summary, Key Points, Revision Notes, Quiz)
        lecture.status = LectureStatus.GENERATING.value
        db.commit()

        summary_text = generate_summary(transcript_text, lecture.title, lecture.subject)
        summary = Summary(lecture_id=lecture.id, summary_text=summary_text)
        db.add(summary)

        key_points_data = generate_key_points(transcript_text, lecture.title, lecture.subject)
        key_points = KeyPoint(lecture_id=lecture.id, content=key_points_data)
        db.add(key_points)

        revision_data = generate_revision_notes(transcript_text, lecture.title, lecture.subject)
        revision = RevisionNote(lecture_id=lecture.id, content=revision_data)
        db.add(revision)

        quiz_questions = generate_quiz(transcript_text, lecture.title, lecture.subject)
        quiz = Quiz(lecture_id=lecture.id, title=f"Practice Quiz: {lecture.title}")
        db.add(quiz)
        db.flush()

        for q in quiz_questions:
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
            "lecture_id": lecture.id,
            "title": lecture.title,
            "subject": lecture.subject,
            "status": lecture.status,
            "duration": lecture.duration,
            "transcript_snippet": transcript_text[:200] + "...",
            "message": "Lecture successfully transcribed and processed by AI!"
        }

    except Exception as e:
        lecture.status = LectureStatus.FAILED.value
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process lecture: {str(e)}"
        )
