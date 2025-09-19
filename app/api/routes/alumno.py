from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.alumno import Alumno
from app.schemas.alumno import AlumnoCreate, AlumnoResponse
from fastapi import HTTPException

router = APIRouter(prefix="/alumnos", tags=["alumnos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AlumnoResponse)
def create_alumno(alumno: AlumnoCreate, db: Session = Depends(get_db)):
    db_alumno = Alumno(**alumno.dict())
    db.add(db_alumno)
    db.commit()
    db.refresh(db_alumno)
    return db_alumno



@router.delete("/{alumno_id}")
def delete_alumno(alumno_id: int, db: Session = Depends(get_db)):
    alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    db.delete(alumno)
    db.commit()
    return {"detail": f"Alumno con ID {alumno_id} eliminado correctamente"}

