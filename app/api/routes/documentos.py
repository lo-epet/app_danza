from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.documentos import Documento
from app.models.alumno import Alumno
from app.models.usuarios import Usuario
import shutil
import os

from app.security.auth import get_current_user  # ✅ ya devuelve Usuario

router = APIRouter(prefix="/documentos", tags=["documentos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload_documento(
    alumno_id: int = Form(...),
    tipo: str = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    os.makedirs("archivos/documentos", exist_ok=True)

    nombre_archivo = f"{alumno_id}_{archivo.filename}"
    ruta_destino = os.path.join("archivos/documentos", nombre_archivo)
    with open(ruta_destino, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    nuevo_doc = Documento(
        tipo=tipo,
        url_archivo=ruta_destino,
        alumno_id=alumno_id
    )
    db.add(nuevo_doc)
    db.commit()
    db.refresh(nuevo_doc)

    return {
        "detail": "Archivo subido correctamente",
        "documento_id": nuevo_doc.id,
        "nombre": archivo.filename,
        "tipo": tipo
    }

@router.get("/alumno/{alumno_id}")
def listar_documentos_por_alumno(alumno_id: int, db: Session = Depends(get_db)):
    documentos = db.query(Documento).filter(Documento.alumno_id == alumno_id).all()

    return [
        {
            "id": doc.id,
            "nombre": os.path.basename(doc.url_archivo),
            "tipo": doc.tipo,
            "url": f"https://app-danza-sv9i.onrender.com/{doc.url_archivo}"
        }
        for doc in documentos
    ]

@router.delete("/{id}")
def eliminar_documento(id: int, db: Session = Depends(get_db)):
    doc = db.query(Documento).filter(Documento.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    db.delete(doc)
    db.commit()
    return {"detail": "Documento eliminado correctamente"}

