# backend/tests/test_logica.py
import pytest
from datetime import datetime, timedelta
from validadores import validar_dni, validar_telefono, validar_fecha_turno, ValidacionError

# --- 1. TESTS PARAMETRIZADOS (Lo exige el TP) ---
@pytest.mark.parametrize("dni_valido", ["1234567", "12345678"])
def test_validar_dni_correcto(dni_valido):
    # Act & Assert
    assert validar_dni(dni_valido) is True

# --- 2. TESTS DE ERROR (Lo exige el TP) ---
@pytest.mark.parametrize("dni_invalido", ["123456", "123456789", "1234abc", ""])
def test_validar_dni_incorrecto_lanza_error(dni_invalido):
    # Arrange / Act / Assert
    with pytest.raises(ValidacionError) as exc_info:
        validar_dni(dni_invalido)
    assert "El DNI debe tener 7 u 8 números" in str(exc_info.value)

@pytest.mark.parametrize("tel_invalido", ["12345", "12345678901", "abcdefghij"])
def test_validar_telefono_incorrecto(tel_invalido):
    with pytest.raises(ValidacionError):
        validar_telefono(tel_invalido)

# --- 3. REGLA DE FECHAS ---
def test_turno_en_el_futuro_es_valido():
    ahora = datetime(2026, 1, 1, 12, 0)
    turno_futuro = datetime(2026, 1, 2, 12, 0)
    assert validar_fecha_turno(turno_futuro, ahora) is True

def test_turno_en_el_pasado_lanza_error():
    ahora = datetime(2026, 1, 1, 12, 0)
    turno_pasado = datetime(2025, 12, 31, 12, 0)
    with pytest.raises(ValidacionError):
        validar_fecha_turno(turno_pasado, ahora)