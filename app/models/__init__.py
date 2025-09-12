# app/models/__init__.py
from app.database.database import Base
from app.models.user import User
from app.models.materias import Materia
from app.models.usuario_materia import usuario_materia  # ✅ minúscula, es una variable Table

__all__ = ["Base", "User", "Materia", "usuario_materia"]