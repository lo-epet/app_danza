from sqlalchemy.orm import Session
from app.models.pagos import Pago
from app.schemas.pago import PagoCreate

# 📥 Crear un nuevo pago desde JSON
def create_pago(db: Session, pago: PagoCreate):
    nuevo_pago = Pago(
        alumno_id=pago.alumno_id,
        descripcion=pago.descripcion,
        comprobante_url=pago.comprobante_url,
        monto=pago.monto,
        fecha_pago=pago.fecha_pago,
        estado=pago.estado
    )
    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)
    return nuevo_pago

# 📤 Listar todos los pagos
def get_pagos(db: Session):
    return db.query(Pago).all()

# 📤 Listar pagos por alumno
def get_pagos_por_alumno(db: Session, alumno_id: int):
    return db.query(Pago).filter(Pago.alumno_id == alumno_id).all()
