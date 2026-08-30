from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# PACIENTES
class PacienteBase(BaseModel):
    nombre: str
    apellido: str  # NUEVO CAMPO
    dni: str
    telefono: Optional[str] = None

class PacienteCreate(PacienteBase): pass

class PacienteResponse(PacienteBase):
    id: int
    class Config: from_attributes = True

# MEDICOS
class MedicoBase(BaseModel):
    nombre: str
    especialidad: str

class MedicoCreate(MedicoBase): pass

class MedicoResponse(MedicoBase):
    id: int
    class Config: from_attributes = True

# TURNOS
class TurnoCreate(BaseModel):
    paciente_id: int
    medico_id: int
    fecha_hora: datetime

class TurnoResponse(BaseModel):
    id: int
    fecha_hora: datetime
    estado: str
    paciente: PacienteResponse 
    medico: MedicoResponse
    
    class Config: from_attributes = True