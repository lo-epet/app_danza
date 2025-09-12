# app/api/routes/user.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.controllers.user import create_user
from app.schemas.user import UserCreate
from app.database.database import get_db

router = APIRouter()

@router.post("/")
def create_user_route(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)