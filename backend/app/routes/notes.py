from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/notes", tags=["Notes Management"])

@router.get("", response_model=List[NoteResponse])
def get_user_notes(
    q: Optional[str] = None,
    subject: Optional[str] = None,
    tag: Optional[str] = None,
    favorite_only: Optional[bool] = False,
    sort_by: Optional[str] = "updated_at",
    order: Optional[str] = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Note).filter(Note.user_id == current_user.id)
    
    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            (Note.title.ilike(search_pattern)) | 
            (Note.content.ilike(search_pattern)) |
            (Note.tags.ilike(search_pattern))
        )
    if subject and subject != "All":
        query = query.filter(Note.subject == subject)
    if tag:
        query = query.filter(Note.tags.ilike(f"%{tag}%"))
    if favorite_only:
        query = query.filter(Note.is_favorite == True)

    if sort_by == "title":
        order_col = Note.title
    elif sort_by == "created_at":
        order_col = Note.created_at
    else:
        order_col = Note.updated_at

    if order == "asc":
        query = query.order_by(order_col.asc())
    else:
        query = query.order_by(order_col.desc())

    return query.all()

@router.post("", response_model=NoteResponse)
def create_note(
    note_in: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = Note(
        user_id=current_user.id,
        lecture_id=note_in.lecture_id,
        title=note_in.title,
        content=note_in.content,
        subject=note_in.subject or "General",
        tags=note_in.tags or "",
        is_favorite=note_in.is_favorite or False
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/{note_id}", response_model=NoteResponse)
def get_note_by_id(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    return note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")

    if note_update.title is not None:
        note.title = note_update.title
    if note_update.content is not None:
        note.content = note_update.content
    if note_update.subject is not None:
        note.subject = note_update.subject
    if note_update.tags is not None:
        note.tags = note_update.tags
    if note_update.is_favorite is not None:
        note.is_favorite = note_update.is_favorite

    db.commit()
    db.refresh(note)
    return note

@router.patch("/{note_id}/favorite", response_model=NoteResponse)
def toggle_favorite(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    note.is_favorite = not note.is_favorite
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found.")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully.", "id": note_id}
