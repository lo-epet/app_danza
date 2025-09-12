# app/models/user.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.models.usuario_materia import usuario_materia
from app.database.database import Base

class User(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    mail = Column(String(100), unique=True, nullable=False, index=True)
    contrasena = Column(String(255), nullable=False)
    is_profe = Column(Boolean, nullable=False, default=False)
    dni = Column(String(20), nullable=True)

    materias = relationship(
        "Materia",
        secondary=usuario_materia,
        back_populates="usuarios"
    )
