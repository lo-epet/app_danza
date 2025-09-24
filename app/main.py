from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Importar routers
from app.api.routes import pagos_routes
from app.api.routes import auth_routes
from app.api.routes import alumno
from app.api.routes import documentos  # Este sí tiene router

from app.api.routes import evento


# Importar función para iniciar el scheduler
from app.scheduler.scheduler import iniciar_scheduler

# Crear instancia de FastAPI
app = FastAPI(title="App Danza")

# Iniciar el scheduler
iniciar_scheduler()

# Registrar rutas
app.include_router(auth_routes.router)
app.include_router(pagos_routes.router)
app.include_router(alumno.router)
app.include_router(documentos.router)  # Esta línea va acá
app.include_router(evento.router)
