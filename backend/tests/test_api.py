# backend/tests/test_api.py
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from main import app
from database import get_db

# Arrancamos el cliente de pruebas
client = TestClient(app)

# --- 4. TEST CON MOCK (Lo exige el TP) ---
def test_crear_paciente_con_mock_de_db():
    # Arrange: Creamos un Impostor (Mock) de la sesión de la base de datos
    mock_db_session = MagicMock()
    
    # Configuramos el impostor para que diga "no encontré ningún paciente con ese DNI"
    mock_db_session.query().filter().first.return_value = None

    # --- EL ARREGLO MÁGICO ---
    # Simulamos que al llamar a "db.refresh()", la base de datos le asigna el ID 1
    def simular_refresh(instancia):
        instancia.id = 1
    
    mock_db_session.refresh.side_effect = simular_refresh
    # ------------------------

    # Inyectamos el impostor en FastAPI
    app.dependency_overrides[get_db] = lambda: mock_db_session

    paciente_nuevo = {
        "nombre": "Juan",
        "apellido": "Perez",
        "dni": "12345678",
        "telefono": "1122334455"
    }

    # Act: Hacemos la petición HTTP al endpoint
    response = client.post("/pacientes/", json=paciente_nuevo)

    # Assert: Comprobamos el resultado HTTP
    assert response.status_code == 200
    
    # Assert del MOCK: Verificamos que el sistema guardó y refrescó el dato
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()
    mock_db_session.refresh.assert_called_once()

    # Limpiamos el impostor
    app.dependency_overrides.clear()