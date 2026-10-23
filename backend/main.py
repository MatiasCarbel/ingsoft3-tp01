from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas
from database import engine, get_db
from validadores import validar_dni, validar_telefono, validar_fecha_turno, ValidacionError

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Clínica")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"mensaje": "API de Gestión de Clínica funcionando 🚀"}

# --- PACIENTES ---
@app.post("/pacientes/", response_model=schemas.PacienteResponse)
def crear_paciente(paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    # Usamos la lógica pura de validadores.py
    try:
        validar_dni(paciente.dni)
        if paciente.telefono:
            validar_telefono(paciente.telefono)
    except ValidacionError as e:
        raise HTTPException(status_code=400, detail=str(e))

    db_paciente = db.query(models.Paciente).filter(models.Paciente.dni == paciente.dni).first()
    if db_paciente:
        raise HTTPException(status_code=400, detail="El DNI ya está registrado")
    
    nuevo_paciente = models.Paciente(**paciente.model_dump())
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)
    return nuevo_paciente

@app.get("/pacientes/", response_model=list[schemas.PacienteResponse])
def listar_pacientes(db: Session = Depends(get_db)):
    return db.query(models.Paciente).all()

# --- MEDICOS ---
@app.post("/medicos/", response_model=schemas.MedicoResponse)
def crear_medico(medico: schemas.MedicoCreate, db: Session = Depends(get_db)):
    nuevo_medico = models.Medico(**medico.model_dump())
    db.add(nuevo_medico)
    db.commit()
    db.refresh(nuevo_medico)
    return nuevo_medico

@app.get("/medicos/", response_model=list[schemas.MedicoResponse])
def listar_medicos(db: Session = Depends(get_db)):
    return db.query(models.Medico).all()

@app.get("/medicos/{medico_id}/turnos", response_model=list[schemas.TurnoResponse])
def turnos_por_medico(medico_id: int, db: Session = Depends(get_db)):
    return db.query(models.Turno).filter(models.Turno.medico_id == medico_id).all()

# --- TURNOS ---
@app.post("/turnos/", response_model=schemas.TurnoResponse)
def agendar_turno(turno: schemas.TurnoCreate, db: Session = Depends(get_db)):
    try:
        validar_fecha_turno(turno.fecha_hora)
    except ValidacionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    if not db.query(models.Paciente).filter(models.Paciente.id == turno.paciente_id).first():
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    if not db.query(models.Medico).filter(models.Medico.id == turno.medico_id).first():
        raise HTTPException(status_code=404, detail="Médico no encontrado")

    nuevo_turno = models.Turno(**turno.model_dump())
    db.add(nuevo_turno)
    db.commit()
    db.refresh(nuevo_turno)
    return nuevo_turno

@app.get("/turnos/", response_model=list[schemas.TurnoResponse])
def listar_turnos(db: Session = Depends(get_db)):
    return db.query(models.Turno).all()

@app.delete("/turnos/{turno_id}")
def eliminar_turno(turno_id: int, db: Session = Depends(get_db)):
    turno = db.query(models.Turno).filter(models.Turno.id == turno_id).first()
    if not turno:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    
    if turno.fecha_hora <= datetime.now():
        raise HTTPException(status_code=400, detail="No se pueden eliminar turnos que ya pasaron")
         
    db.delete(turno)
    db.commit()
    return {"mensaje": "Turno eliminado con éxito"}

@app.get("/health")
def health_check():
    return {"status": "ok"}