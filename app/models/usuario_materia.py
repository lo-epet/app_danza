# app/models/usuario_materia.py
from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database.database import Base

usuario_materia = Table(
    "usuario_materia",
    Base.metadata,
    Column("id_usuario", Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), primary_key=True),  # ✅ usuarios, no usuario
    Column("id_materia", Integer, ForeignKey("materias.id_materia", ondelete="CASCADE"), primary_key=True)  # ✅ materias, no materia
)