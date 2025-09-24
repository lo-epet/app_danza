from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models.usuarios import Usuario
from app.database.database import SessionLocal

# Configuración del esquema de autenticación
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Claves de encriptación (usá tus propias claves reales)
SECRET_KEY = "clave_super_secreta"
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        # Verificamos que el usuario exista en la base
        db = SessionLocal()
        usuario = db.query(Usuario).filter_by(email=email).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
