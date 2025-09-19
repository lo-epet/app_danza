from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.documentos import Documento
from app.models.alumno import Alumno
import shutil
import os

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

    # Guardar archivo en carpeta
    nombre_archivo = f"{alumno_id}_{archivo.filename}"
    ruta_destino = os.path.join("archivos", nombre_archivo)
    with open(ruta_destino, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    # Crear registro en la base
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
