from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from app.database.database import get_db
from app.models.usuarios import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, UsuarioUpdate
from app.security.auth import decode_access_token, get_password_hash
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

# ✅ Crear nuevo usuario
@router.post("/crear", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    hashed_password = get_password_hash(usuario.password)

    nuevo = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password=hashed_password
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# ✅ Obtener perfil actual
@router.get("/me", response_model=UsuarioResponse)
def obtener_mi_perfil(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    user_id = int(payload["sub"])
    usuario_actual = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario_actual:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return usuario_actual

# ✅ Actualizar perfil
@router.put("/actualizar", response_model=UsuarioResponse)
def actualizar_perfil(
    datos: UsuarioUpdate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            raise HTTPException(status_code=401, detail="Token inválido")

        user_id = int(payload["sub"])
        usuario_actual = db.query(Usuario).filter(Usuario.id == user_id).first()
        if not usuario_actual:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        if datos.nombre is not None:
            usuario_actual.nombre = datos.nombre
        if datos.email is not None:
            usuario_actual.email = datos.email
        if datos.password:
            usuario_actual.password = get_password_hash(datos.password)

        db.commit()
        db.refresh(usuario_actual)
        return usuario_actual

    except Exception as e:
        db.rollback()
        return JSONResponse(status_code=500, content={"detail": str(e)})
