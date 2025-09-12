# app/main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.database import get_db, engine
from app import models
from app.models import user, materias, usuario_materia
from app.schemas import materia, usuario_materia
from app.api.routes import user as user_routes, auth as auth_routes
from app.models.user import User
from app.security.auth import get_current_user
from app.models import Base

# Crear tablas
Base.metadata.create_all(bind=engine)

# Crear app
app = FastAPI(
    title="Sistema Educativo API",
    description="API para gestionar profesores, alumnos y materias",
    version="1.0.0",
)

# Incluir routers
app.include_router(user_routes.router, prefix="/user", tags=["Usuarios"])
app.include_router(auth_routes.router, tags=["Autenticación"])

# Ruta raíz
@app.get("/")
async def root():
    return {"message": "¡Bienvenido al Sistema Educativo API!"}

# Health check
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Crear materia (solo profesor)
@app.post("/materias/")
def crear_materia(
    materia: materia.MateriaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_profe:
        raise HTTPException(status_code=403, detail="Solo profesores pueden crear materias")
    nueva_materia = materias.Materia(
    nombre_materia=materia.nombre_materia,
    id_docente=current_user.id_usuario
)

    db.add(nueva_materia)
    db.commit()
    db.refresh(nueva_materia)
    return nueva_materia

# Listar materias
@app.get("/materias/")
def listar_materias(db: Session = Depends(get_db)):
    return db.query(materias.Materia).all()

# Obtener materia por ID
@app.get("/materias/{materia_id}")
def obtener_materia(materia_id: int, db: Session = Depends(get_db)):
    materia_db = db.query(materias.Materia).filter(materias.Materia.id_materia == materia_id).first()
    if not materia_db:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    return materia_db

# Actualizar materia (solo profesor)
@app.put("/materias/{materia_id}")
def actualizar_materia(
    materia_id: int,
    materia: materia.MateriaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_profe:
        raise HTTPException(status_code=403, detail="Solo profesores pueden actualizar materias")
    db_materia = db.query(materias.Materia).filter(materias.Materia.id_materia == materia_id).first()
    if not db_materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    for key, value in materia.dict().items():
        setattr(db_materia, key, value)
    db.commit()
    db.refresh(db_materia)
    return db_materia

# Eliminar materia (solo profesor)
@app.delete("/materias/{materia_id}")
def eliminar_materia(
    materia_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_profe:
        raise HTTPException(status_code=403, detail="Solo profesores pueden eliminar materias")
    materia_db = db.query(materias.Materia).filter(materias.Materia.id_materia == materia_id).first()
    if not materia_db:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    db.delete(materia_db)
    db.commit()
    return {"message": "Materia eliminada correctamente"}

# Asignar materia a usuario (solo profesor)
@app.post("/usuario_materia/")
def asignar_materia(
    usuario_materia: usuario_materia.UsuarioMateriaBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_profe:
        raise HTTPException(status_code=403, detail="Solo profesores pueden asignar materias")
    usuario = db.query(user.User).filter(user.User.id_usuario == usuario_materia.id_usuario).first()
    materia = db.query(materias.Materia).filter(materias.Materia.id_materia == usuario_materia.id_materia).first()
    if not usuario or not materia:
        raise HTTPException(status_code=404, detail="Usuario o materia no encontrados")
    if materia in usuario.materias:
        raise HTTPException(status_code=400, detail="La materia ya está asignada")
    usuario.materias.append(materia)
    db.commit()
    return {"message": "Materia asignada correctamente"}

# Listar materias de un usuario
@app.get("/usuario/{user_id}/materias")
def listar_materias_usuario(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id_usuario != user_id and not current_user.is_profe:
        raise HTTPException(status_code=403, detail="No tienes permiso")
    usuario_db = db.query(user.User).filter(user.User.id_usuario == user_id).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario_db.materias

# Ejecutar app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
