from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.eventos import Evento
from app.database.database import get_db
from app.schemas.evento import EventoCreate, EventoResponse
from app.models.usuarios import Usuario
from app.security.auth import get_current_user, create_access_token, verify_password, get_password_hash


router = APIRouter(prefix="/eventos", tags=["Eventos"])

# ✅ Crear evento vinculado al usuario autenticado
@router.post("/crear", response_model=EventoResponse)
def crear_evento(
    evento: EventoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user)
):
    print("🔐 Usuario autenticado en /crear:", usuario.email)
    print("📦 Datos recibidos:", evento.dict())

    if evento.usuario_id != usuario.id:
        print("🚫 Mismatch de usuario_id:", evento.usuario_id, "!=", usuario.id)
        raise HTTPException(status_code=403, detail="No podés crear eventos para otro usuario")

    try:
        nuevo_evento = Evento(**evento.dict())
        db.add(nuevo_evento)
        db.commit()
        db.refresh(nuevo_evento)
        print("✅ Evento creado con ID:", nuevo_evento.id)
        return nuevo_evento
    except Exception as e:
        import traceback
        print("❌ Error al crear evento:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error interno al crear el evento")

# ✅ Listar eventos del usuario autenticado
@router.get("/mis-eventos", response_model=list[EventoResponse])
def listar_eventos(usuario: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    print("🔍 Listando eventos para:", usuario.email)
    eventos = db.query(Evento).filter_by(usuario_id=usuario.id).all()
    return eventos

# ✅ Listar todos los eventos (opcional)
@router.get("/todos", response_model=list[EventoResponse])
def listar_todos_eventos(db: Session = Depends(get_db)):
    eventos = db.query(Evento).all()
    return eventos

# ✅ Eliminar evento por ID
@router.delete("/eliminar/{evento_id}")
def eliminar_evento(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter_by(id=evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    db.delete(evento)
    db.commit()
    return {"detail": "Evento eliminado"}
