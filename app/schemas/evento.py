from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class EventoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: date
    hora: Optional[time] = None

class EventoCreate(EventoBase):
    alumno_id: Optional[int] = None
    usuario_id: Optional[int] = None

class EventoResponse(EventoBase):
    id: int
    alumno_id: Optional[int]
    usuario_id: Optional[int]

    class Config:
        orm_mode = True
