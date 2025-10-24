from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Importar routers
from app.api.routes.auth_routes import router as auth_router
from app.api.controllers.usuario_controller import router as usuario_router
from app.api.routes import pagos_routes, alumno, documentos, evento

# Importar función para iniciar el scheduler
from app.scheduler.scheduler import iniciar_scheduler

# Crear instancia de FastAPI ✅
app = FastAPI(title="App Danza")

# Aplicar middleware CORS ✅
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Iniciar el scheduler ✅
iniciar_scheduler()

# Registrar rutas ✅
app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(pagos_routes.router)
app.include_router(alumno.router)
app.include_router(documentos.router)
app.include_router(evento.router)

# Servir archivos estáticos desde la carpeta "archivos" ✅
app.mount("/archivos", StaticFiles(directory="archivos"), name="archivos")