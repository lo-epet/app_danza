from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlumnoBase(BaseModel):
    nombre: str
    dni: str
    email: str
    ciudad: Optional[str] = None
    edad: Optional[int] = None

class AlumnoCreate(AlumnoBase):
    pass

class AlumnoResponse(AlumnoBase):
    id: int
    fecha_alta: datetime

    class Config:
        orm_mode = True
