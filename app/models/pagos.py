from sqlalchemy import Column, Integer, Numeric, Date, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Pago(Base):
    __tablename__ = "pagos"

    id = Column(Integer, primary_key=True, index=True)
    alumno_id = Column(Integer, ForeignKey("alumnos.id", ondelete="CASCADE"), nullable=False)
    monto = Column(Numeric(10,2), nullable=False)
    fecha_pago = Column(Date, nullable=False)
    estado = Column(String(50), default="pendiente")
    comprobante_url = Column(Text)

    alumno = relationship("Alumno", back_populates="pagos")
