from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Paciente(Base):
    __tablename__ = "pacientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False) # NUEVO CAMPO
    dni = Column(String(20), unique=True, index=True, nullable=False)
    telefono = Column(String(20))
    
    turnos = relationship("Turno", back_populates="paciente")

class Medico(Base):
    __tablename__ = "medicos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    especialidad = Column(String(100), nullable=False)
    
    turnos = relationship("Turno", back_populates="medico")

class Turno(Base):
    __tablename__ = "turnos"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id = Column(Integer, ForeignKey("medicos.id"), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    estado = Column(String(20), default="Pendiente")

    paciente = relationship("Paciente", back_populates="turnos")
    medico = relationship("Medico", back_populates="turnos")