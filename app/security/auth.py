# auth_utils.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.usuarios import Usuario
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "sub": str(data["id"])
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        print("🔐 Token recibido en backend:", token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("🔍 Payload decodificado:", payload)
        return payload
    except JWTError as e:
        print("❌ Error al decodificar token:", e)
        raise HTTPException(status_code=401, detail="Token inválido")

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
