from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import SessionLocal
from app.schemas.pago import PagoCreate, PagoResponse
from app.api.controllers import pagos_controller
from fastapi.security import OAuth2PasswordBearer
from app.security.auth import decode_access_token

router = APIRouter(prefix="/pagos", tags=["pagos"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔑 Verificación de usuario actual con JWT
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return payload.get("sub")   # devuelve el email guardado en el token


# =====================
# ENDPOINTS CRUD
# =====================

@router.get("/", response_model=List[PagoResponse])
def listar_pagos(db: Session = Depends(get_db)):
    return pagos_controller.get_pagos(db)

@router.post("/", response_model=PagoResponse)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    return pagos_controller.create_pago(db, pago)

# =====================
# ENDPOINT PROTEGIDO
# =====================

@router.get("/mis-pagos")
def listar_mis_pagos(current_user: str = Depends(get_current_user)):
    return {"mensaje": f"Pagos del usuario {current_user}"}
