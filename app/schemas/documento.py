from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentoBase(BaseModel):
    tipo: Optional[str] = None
    url_archivo: str

class DocumentoCreate(DocumentoBase):
    alumno_id: int

class DocumentoResponse(DocumentoBase):
    id: int
    fecha_subida: datetime
    alumno_id: int

    class Config:
        orm_mode = True
