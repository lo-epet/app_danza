# app/api/controllers/user.py
from fastapi import HTTPException  # ✅ LÍNEA OBLIGATORIA
from sqlalchemy.orm import Session
from app.models.user import User
from app.security.hash import hash_password

def create_user(db: Session, user):
    # Verificar si el mail ya existe
    existing_user = db.query(User).filter(User.mail == user.mail).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # Hashear contraseña
    hashed_password = hash_password(user.contrasena)

    # Crear nuevo usuario
    db_user = User(
        nombre=user.nombre,
        apellido=user.apellido,
        mail=user.mail,
        contrasena=hashed_password,
        is_profe=user.is_profe,
        dni=user.dni
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user