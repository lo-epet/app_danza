from sqlalchemy import Column, Integer, Numeric, Date, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Pago(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)  # ✅ correcto

    alumno_id = Column(Integer, ForeignKey("alumnos.id", ondelete="CASCADE"), nullable=False)

    descripcion = Column(String(100), nullable=False)         # Ej: "comprobante1605"
    comprobante_url = Column(Text, nullable=False)
            # Ruta del PDF guardado

    monto = Column(Numeric(10, 2), nullable=True)             # Opcional
    fecha_pago = Column(Date, nullable=True)                  # Opcional
    estado = Column(String(50), default="pendiente")          # Opcional: "pendiente", "aprobado", etc.

    alumno = relationship("Alumno", back_populates="pagos")
