from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Alumno(Base):
    __tablename__ = "alumnos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    dni = Column(String(20), unique=True, nullable=False)
    email = Column(String(150), nullable=False)
    ciudad = Column(String(100))
    edad = Column(Integer)
    fecha_alta = Column(DateTime, default=datetime.utcnow)

    # relaciones inversas
    pagos = relationship("Pago", back_populates="alumno", cascade="all, delete-orphan")
    documentos = relationship("Documento", back_populates="alumno", cascade="all, delete-orphan")
    eventos = relationship("Evento", back_populates="alumno", passive_deletes=True)
