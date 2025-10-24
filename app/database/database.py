import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔐 Cargar variables del archivo .env
load_dotenv()

# 📦 Leer la URL de conexión desde el entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# 🔗 Crear el engine con soporte SSL si es necesario
engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"} if "sslmode=require" in DATABASE_URL else {}
)

# 🧱 Base para los modelos
Base = declarative_base()

# 🔄 Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🔄 Dependencia para obtener la sesión en endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
