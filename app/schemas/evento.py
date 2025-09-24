from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class EventoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: date
    hora: Optional[time] = None

class EventoCreate(EventoBase):
    alumno_id: Optional[int] = None  # si querés vincularlo a un alumno

class EventoResponse(EventoBase):
    id: int
    usuario_id: Optional[int]
    alumno_id: Optional[int]

    class Config:
        orm_mode = True
