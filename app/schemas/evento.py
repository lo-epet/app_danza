from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class EventoBase(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: date
    hora: Optional[time] = None

class EventoCreate(BaseModel):
    titulo: str
    fecha: date
    hora: Optional[time] = None
    descripcion: Optional[str] = None
    alumno_id: Optional[int] = None
    usuario_id: int


class EventoResponse(EventoBase):
    id: int
    usuario_id: Optional[int]
    alumno_id: Optional[int]

    class Config:
        orm_mode = True
