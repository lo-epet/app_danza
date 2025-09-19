from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from app.database.database import SessionLocal
from app.models.usuarios import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
from app.security.auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📝 Registro de usuario
@router.post("/register", response_model=UsuarioResponse)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    user_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if user_existente:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")

    hashed_password = get_password_hash(usuario.password)
    nuevo_usuario = Usuario(email=usuario.email, nombre=usuario.nombre, password=hashed_password)

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario

# 📥 Esquema para login
class LoginRequest(BaseModel):
    email: str
    password: str

# 🔐 Login con JSON
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    email = data.email
    password = data.password

    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}
