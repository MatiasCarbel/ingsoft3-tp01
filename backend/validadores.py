# backend/validadores.py
from datetime import datetime

class ValidacionError(Exception):
    pass

def validar_dni(dni: str) -> bool:
    if not dni.isdigit() or not (7 <= len(dni) <= 8):
        raise ValidacionError("El DNI debe tener 7 u 8 números")
    return True

def validar_telefono(telefono: str) -> bool:
    if telefono and (not telefono.isdigit() or len(telefono) != 10):
        raise ValidacionError("El teléfono debe tener exactamente 10 números")
    return True

def validar_fecha_turno(fecha_hora: datetime, ahora: datetime = None) -> bool:
    if ahora is None:
        ahora = datetime.now()
    if fecha_hora < ahora:
        raise ValidacionError("La fecha del turno no puede ser en el pasado")
    return True