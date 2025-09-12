from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.materia import MateriaResponse  # Ajustá el import según tu estructura

class UserBase(BaseModel):
    nombre: str
    apellido: str
    mail: EmailStr

class UserCreate(UserBase):
    contrasena: str
    is_profe: bool = True
    dni: Optional[str] = None

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    mail: Optional[EmailStr] = None
    is_profe: Optional[bool] = None
    contrasena: Optional[str] = None
    dni: Optional[str] = None

class UserOut(UserBase):
    id_usuario: int
    is_profe: bool
    dni: Optional[str] = None
    materias: List["MateriaResponse"] = []

    model_config = ConfigDict(from_attributes=True)  # Pydantic v2 reemplaza orm_mode
