from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import SessionLocal
from app.models.alumno import Alumno
from app.schemas.alumno import AlumnoCreate, AlumnoResponse
from app.models.usuarios import Usuario
from app.security.auth import get_current_user

router = APIRouter(prefix="/alumnos", tags=["alumnos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔍 Listar solo los alumnos del usuario autenticado
@router.get("/", response_model=List[AlumnoResponse])
def listar_alumnos(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user)
):
    return db.query(Alumno).filter(Alumno.usuario_id == usuario.id).all()

# ➕ Crear alumno vinculado al usuario autenticado
@router.post("/", response_model=AlumnoResponse)
def create_alumno(
    alumno: AlumnoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user)
):
    db_alumno = Alumno(**alumno.dict(), usuario_id=usuario.id)
    db.add(db_alumno)
    db.commit()
    db.refresh(db_alumno)
    return db_alumno

# 🗑️ Eliminar alumno solo si pertenece al usuario autenticado
@router.delete("/{alumno_id}")
def delete_alumno(
    alumno_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user)
):
    alumno = db.query(Alumno).filter(
        Alumno.id == alumno_id,
        Alumno.usuario_id == usuario.id
    ).first()

    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado o no autorizado")

    db.delete(alumno)
    db.commit()
    return {"detail": f"Alumno con ID {alumno_id} eliminado correctamente"}
