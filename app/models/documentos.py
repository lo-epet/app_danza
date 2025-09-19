from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)
    alumno_id = Column(Integer, ForeignKey("alumnos.id", ondelete="CASCADE"), nullable=False)
    tipo = Column(String(100))
    url_archivo = Column(Text, nullable=False)
    fecha_subida = Column(TIMESTAMP(timezone=True), server_default=func.now())

    alumno = relationship("Alumno", back_populates="documentos")
