from sqlalchemy import Column, Integer, String
from app.database.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(200), nullable=False)  # hash
    nombre = Column(String(100))
