from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal

class PagoBase(BaseModel):
    monto: Decimal
    fecha_pago: date
    estado: Optional[str] = "pendiente"
    comprobante_url: Optional[str] = None

class PagoCreate(PagoBase):
    alumno_id: int

class PagoResponse(PagoBase):
    id: int
    alumno_id: int

    class Config:
        orm_mode = True
