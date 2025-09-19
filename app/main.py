from fastapi import FastAPI
from app.api.routes import pagos_routes
from app.api.routes import auth_routes
from app.models import alumno, usuarios, pagos, documentos, eventos
from app.api.routes import alumno
from app.api.routes import documentos
from app.models.documentos import Documento







app = FastAPI(title="App Danza")

# Rutas
app.include_router(auth_routes.router)
app.include_router(pagos_routes.router)
app.include_router(alumno.router)
app.include_router(documentos.router)