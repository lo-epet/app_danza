from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
import shutil
import os

from app.database.database import SessionLocal
from app.schemas.pago import PagoCreate, PagoResponse
from app.models.pagos import Pago
from app.models.alumno import Alumno
from app.api.controllers import pagos_controller
from app.security.auth import decode_access_token
from app.security.auth import get_current_user, create_access_token, verify_password, get_password_hash


router = APIRouter(prefix="/pagos", tags=["pagos"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔐 Verificación de usuario actual con JWT
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return payload.get("sub")  # email del usuario

# =====================
# CRUD
# =====================

@router.get("/", response_model=List[PagoResponse])
def listar_pagos(db: Session = Depends(get_db)):
    return pagos_controller.get_pagos(db)

@router.post("/", response_model=PagoResponse)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    nuevo_pago = Pago(**pago.dict())
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago

@router.get("/alumno/{alumno_id}", response_model=List[PagoResponse])
def listar_pagos_por_alumno(alumno_id: int, db: Session = Depends(get_db)):
    pagos = db.query(Pago).filter(Pago.alumno_id == alumno_id).all()
    return [
        {
            "id": pago.id,
            "alumno_id": pago.alumno_id,
            "descripcion": pago.descripcion,
            "comprobante_url": f"archivos/pagos/{os.path.basename(pago.comprobante_url)}",
            "monto": pago.monto,
            "fecha_pago": pago.fecha_pago,
            "estado": pago.estado
        }
        for pago in pagos
    ]

@router.delete("/{pago_id}")
def eliminar_pago(pago_id: int, db: Session = Depends(get_db)):
    pago = db.query(Pago).filter(Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    db.delete(pago)
    db.commit()
    return {"detail": "Pago eliminado correctamente"}
# =====================
# CARGA DE COMPROBANTES
# =====================

@router.post("/upload", response_model=PagoResponse)
def subir_comprobante(
    alumno_id: int = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    alumno = db.query(Alumno).filter_by(id=alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")

    if not archivo.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF")

    os.makedirs("archivos/pagos", exist_ok=True)
    nombre_archivo = f"{alumno_id}_{archivo.filename}"
    ruta_destino = os.path.join("archivos/pagos", nombre_archivo)

    with open(ruta_destino, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    nuevo_pago = Pago(
        comprobante_url=ruta_destino,
        alumno_id=alumno_id,
        descripcion=f"Comprobante de pago {archivo.filename}",  # ✅ agregado
        estado="pendiente"  # opcional, pero recomendable
    )
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago

# =====================
# DESCARGA DE COMPROBANTES
# =====================

@router.get("/descargar/{pago_id}")
def descargar_comprobante(pago_id: int, db: Session = Depends(get_db)):
    pago = db.query(Pago).filter(Pago.id == pago_id).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Comprobante no encontrado")

    ruta = pago.comprobante_url
    if not os.path.exists(ruta):
        raise HTTPException(status_code=404, detail=f"Archivo no encontrado en: {ruta}")

    return FileResponse(path=ruta, filename=os.path.basename(ruta))

# =====================
# ENDPOINT PROTEGIDO
# =====================

@router.get("/mis-pagos", response_model=List[PagoResponse])
def listar_mis_pagos(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    alumno = db.query(Alumno).filter(Alumno.email == current_user).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db.query(Pago).filter(Pago.alumno_id == alumno.id).all()
