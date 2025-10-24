from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(200), nullable=False)  # hash
    nombre = Column(String(100), nullable=False)  # ✅ mejor marcar como obligatorio

    # Relación con eventos
    eventos = relationship("Evento", back_populates="usuario", passive_deletes=True)
    alumnos = relationship("Alumno", back_populates="usuario")  # ✅ debe existir

