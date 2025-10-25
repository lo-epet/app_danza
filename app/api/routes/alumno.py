from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import SessionLocal
from app.models.alumno import Alumno
from app.schemas.alumno import AlumnoCreate, AlumnoResponse
from app.models.usuarios import Usuario
from app.security.auth import get_current_user
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os

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



@router.get("/pdf")
def generar_pdf_alumnos(db: Session = Depends(get_db)):
    alumnos = db.query(Alumno).all()

    os.makedirs("archivos/pdf", exist_ok=True)
    ruta_pdf = "archivos/pdf/listado_alumnos.pdf"
    c = canvas.Canvas(ruta_pdf, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "Listado de Alumnos")

    c.setFont("Helvetica", 12)
    y = height - 80
    for alumno in alumnos:
        linea = f"{alumno.nombre} - {alumno.email} - DNI: {alumno.dni}"
        c.drawString(50, y, linea)
        y -= 20
        if y < 50:
            c.showPage()
            y = height - 50

    c.save()
    return FileResponse(ruta_pdf, media_type="application/pdf", filename="listado_alumnos.pdf")

