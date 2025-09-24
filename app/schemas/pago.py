from pydantic import BaseModel
from typing import Optional
from datetime import date

# 📥 Para crear un pago desde JSON (no desde archivo)
class PagoCreate(BaseModel):
    alumno_id: int
    descripcion: str
    comprobante_url: str  # ✅ corregido
    monto: Optional[float] = None
    fecha_pago: Optional[date] = None
    estado: Optional[str] = "pendiente"

# 📤 Para devolver pagos al frontend
class PagoResponse(BaseModel):
    id: int
    alumno_id: int
    descripcion: str
    comprobante_url: str  # ✅ corregido
    monto: Optional[float] = None
    fecha_pago: Optional[date] = None
    estado: Optional[str] = None

    class Config:
        orm_mode = True
