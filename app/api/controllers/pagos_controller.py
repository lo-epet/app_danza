from sqlalchemy.orm import Session
from app.models.pagos import Pago
from app.schemas.pago import PagoCreate

def get_pagos(db: Session):
    """Lista todos los pagos"""
    return db.query(Pago).all()

def get_pago(db: Session, pago_id: int):
    """Obtiene un pago por ID"""
    return db.query(Pago).filter(Pago.id == pago_id).first()

def create_pago(db: Session, pago: PagoCreate):
    """Crea un pago nuevo"""
    db_pago = Pago(**pago.dict())
    db.add(db_pago)
    db.commit()
    db.refresh(db_pago)
    return db_pago

def delete_pago(db: Session, pago_id: int):
    """Elimina un pago por ID"""
    db_pago = db.query(Pago).filter(Pago.id == pago_id).first()
    if db_pago:
        db.delete(db_pago)
        db.commit()
        return True
    return False
