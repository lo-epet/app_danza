from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
