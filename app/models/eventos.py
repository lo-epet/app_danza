from sqlalchemy import Column, Integer, String, Text, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Evento(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    descripcion = Column(Text)
    fecha = Column(Date, nullable=False)
    hora = Column(Time)

    alumno_id = Column(Integer, ForeignKey("alumnos.id", ondelete="SET NULL"))
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"))

    alumno = relationship("Alumno", back_populates="eventos")
    usuario = relationship("Usuario")
