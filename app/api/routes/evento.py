from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.eventos import Evento
from app.models.usuarios import Usuario
from app.database.database import get_db
from app.schemas.evento import EventoCreate, EventoResponse
from app.auth.auth_utils import get_current_user

router = APIRouter(prefix="/eventos", tags=["Eventos"])


# Crear evento
@router.post("/crear", response_model=EventoResponse)
def crear_evento(
    evento: EventoCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    usuario = db.query(Usuario).filter_by(email=current_user).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    nuevo_evento = Evento(**evento.dict(), usuario_id=usuario.id)
    db.add(nuevo_evento)
    db.commit()
    db.refresh(nuevo_evento)
    return nuevo_evento

# Listar eventos del usuario actual
@router.get("/mis-eventos")
def listar_eventos(current_user: str = Depends(get_current_user)):
    print(f"Usuario autenticado: {current_user}")
    db = next(get_db())

    usuario = db.query(Usuario).filter_by(email=current_user).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    eventos = db.query(Evento).filter_by(usuario_id=usuario.id).all()
    return eventos

# Listar todos los eventos (admin o para frontend calendario)
@router.get("/todos", response_model=list[EventoResponse])
def listar_todos_eventos(db: Session = Depends(get_db)):
    eventos = db.query(Evento).all()
    return eventos
