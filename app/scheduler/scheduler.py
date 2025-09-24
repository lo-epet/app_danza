from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.models.eventos import Evento

# Instancia global del scheduler
scheduler = BackgroundScheduler()

def verificar_eventos():
    db: Session = SessionLocal()
    ahora = datetime.now().replace(second=0, microsecond=0)
    eventos = db.query(Evento).filter(
        Evento.fecha == ahora.date(),
        Evento.hora == ahora.time()
    ).all()

    for evento in eventos:
        print(f"🔔 Recordatorio: {evento.titulo} para usuario {evento.usuario_id}")
        # Acá iría la lógica para enviar notificación push, email, etc.

# Agregamos la tarea programada
scheduler.add_job(verificar_eventos, 'interval', minutes=1)

# Función para iniciar el scheduler desde main.py
def iniciar_scheduler():
    print("🟢 Scheduler iniciado")
    scheduler.start()
