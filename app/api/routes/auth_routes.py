from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from app.database.database import get_db
from app.models.usuarios import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse
import os
from dotenv import load_dotenv



# 🔐 Cargar variables de entorno
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# 🔐 Configuración de bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔐 Configuración de OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ✅ Verificar contraseña
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ✅ Hashear contraseña
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# ✅ Crear token de acceso
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "sub": str(data["id"])  # ✅ Campo obligatorio para identificar al usuario
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ✅ Decodificar token
def decode_access_token(token: str) -> dict:
    try:
        print("🔐 Token recibido en backend:", token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("🔍 Payload decodificado:", payload)
        return payload
    except JWTError as e:
        print("❌ Error al decodificar token:", e)
        raise HTTPException(status_code=401, detail="Token inválido")

# ✅ Obtener usuario actual desde el token
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Usuario:
    print("📥 Token recibido por get_current_user:", token)
    payload = decode_access_token(token)

    try:
        user_id = int(payload.get("sub", 0))
    except ValueError:
        print("❌ ID inválido en token:", payload.get("sub"))
        raise HTTPException(status_code=401, detail="ID de usuario inválido en el token")

    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        print("❌ Usuario no encontrado con ID:", user_id)
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    print("✅ Usuario autenticado:", usuario.email)
    return usuario


# 🚪 Crear router
router = APIRouter(prefix="/auth", tags=["auth"])

# 📝 Registro de usuario
@router.post("/register", response_model=UsuarioResponse)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    user_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if user_existente:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")

    hashed_password = get_password_hash(usuario.password)
    nuevo_usuario = Usuario(
        email=usuario.email,
        nombre=usuario.nombre,
        password=hashed_password
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario

# 🔐 Login usando email como identificador
@router.post("/login")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"id": user.id},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}

# 👤 Endpoint para obtener datos del perfil
@router.get("/me", response_model=UsuarioResponse)
def get_profile(usuario: Usuario = Depends(get_current_user)):
    return usuario
    
