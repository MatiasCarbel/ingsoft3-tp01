# Decisiones — TP1

## 1. Sobre el conflicto de merge
**¿Por qué Git no pudo resolver el conflicto solo?**
Git no pudo resolverlo automáticamente porque las dos ramas (A y B) modificaron exactamente la misma línea del mismo archivo (`README.md`). Al encontrarse con dos versiones distintas para el mismo texto, Git no puede adivinar cuál es la "correcta" o cuál tiene prioridad, por lo que frena el merge y le delega la decisión a un humano.

**¿Qué habría tenido que pasar para que nunca apareciera?**
Para evitar el conflicto, las ramas deberían haber modificado archivos distintos o líneas diferentes dentro del mismo archivo.

## 2. Problemas encontrados y soluciones
No tuve ningun problema al realizar el ejercicio

## 3. Declaración de uso de IA
Utilize IA nada mas para el armado de los archivos evidencias.md y decisiones.md


# Decisiones TP2
## TP2 — Contenedores
* **Aplicación elegida:** Sistema de gestión de turnos médicos (Backend: FastAPI, Frontend: React/Vite, BD: MySQL). 
* **Contenerización:** Se implementó arquitectura multi-stage obligatoria. En el frontend se utilizó un `rewrite` en `nginx.conf` para limpiar el prefijo `/api/` evitando errores de enrutamiento interno.
* **Uso de IA:** Utilicé Gemini para asistir en la redacción de los Dockerfiles, configuración de Nginx y orquestación con Docker Compose. Tambien para la redaccion de los archivos evidencias.md y decisiones.md.

# Decisiones TP3
## TP3 — Planificación y Trazabilidad

- **Duración del sprint:** Elegí 2 semanas. Según la teoría ágil, los sprints deben durar entre 1 y 4 semanas.
- **Límite de trabajo en progreso (WIP):** Configuré el límite en 2 (al trabajar solo, la regla es 1 persona + 1). 
- **Diagnóstico de la historia mal escrita:** La historia *"Como desarrollador quiero crear la tabla usuarios"* está mal planteada porque es una tarea técnica disfrazada. Una buena Historia de Usuario tiene que cumplir con los criterios INVEST, fundamentalmente aportar **Valor** (la "V") a un usuario real. A un cliente no le importa si existe una tabla en la base de datos, le importa usar el sistema. Yo la reescribiría enfocada en el usuario, por ejemplo: *"Como paciente quiero poder registrarme para acceder a mis turnos"*. Lo de crear la tabla lo pondría simplemente como una Tarea Técnica (`task`) vinculada adentro de esa historia.
- **Problemas encontrados:** Tuve un conflicto local en Git al intentar hacer `pull` por un merge inconcluso de un archivo anterior. Lo resolví abortando el merge y sincronizando forzosamente mi entorno local con la nube mediante `git reset --hard origin/main`. También olvidé poner el comando `Closes` en el PR, lo cual solucioné creando un PR parche con la palabra clave para activar la automatización.
- **Uso de IA:** Utilicé Gemini para poder resolver los problemas encontrados(conflicto al intentar hacer `pull` y cuando me olvidé de usar `Closes`).


## Decisiones TP4 
**Estructura elegida del pipeline:**
Arme un único workflow (`ci.yml`) configurado para que salte cada vez que hago un push o abro un Pull Request hacia `main`. Adentro le metí dos jobs: uno para el `build-backend` y otro para el `build-frontend`. Como los dos componentes son independientes, los puse a correr en paralelo. Así gano un montón de tiempo en cada corrida y no me quedo esperando a que termine uno para que recién arranque el otro.

**Qué cachea el pipeline y qué pasa si desaparece:**
Configuré el caché usando la caché nativa de GitHub Actions (`type=gha`). Lo que estoy cacheando son las capas de las imágenes de Docker. Lo que más se reutiliza (y lo que más tiempo me ahorra) son las capas donde se descargan las dependencias, como el `pip install` del backend o el `npm ci` del frontend. 
Si por algún motivo el caché desaparece, no pasa nada grave: el pipeline no se rompe ni falla, simplemente tarda más porque Docker se ve obligado a descargar y construir todas las capas de nuevo desde cero.

**Por qué el pipeline construye con el Dockerfile:**
En lugar de instalar Node o Python directamente en el runner y compilar ahí, utiutilize el Dockerfile para garantizar que el entorno de CI sea idéntico al entorno de producción. Asi evaluamos exactamente el mismo artefacto que luego será desplegado.

**Problemas encontrados y resoluciones:**
1. Al principio tuve varios problemas de sintaxis con el YAML (errores de indentación o me faltaban palabras clave como `jobs:` al copiar). Lo fui arreglando prestando más atención a la estructura del archivo.
2. Renegué con errores de versiones deprecadas (Node 20) y fallos del tipo "failed to reserve cache" porque GitHub se ponía estricto con el espacio o los permisos. La solución fue actualizar todas las actions a sus últimas versiones (`actions/checkout@v6`, `docker/setup-buildx-action@v4`, `docker/build-push-action@v7`) y sumarle un `ignore-error=true` a la configuración del caché para que no me corte el build si hay algún problema de red o de espacio con GitHub.

**Declaración de uso de IA:**
Durante este TP utilicé a Gemini como asistente técnico. Lo utilice para interpretar los mensajes de error de GitHub Actions, y entender cómo configurar correctamente las versiones nuevas de los actions de Docker. 

# Decisiones TP5 — Calidad automatizada

## Qué lógica elegí testear
Elegí testear la validación de negocio (DNI, Teléfonos y Fechas de turnos) en el backend, y el validador de pacientes y la llamada a la API en el frontend. Opté por estas reglas porque son el núcleo de la aplicación; un bug aquí permitiría guardar datos corruptos en la base de datos o agendar turnos en el pasado, rompiendo la experiencia del usuario y la integridad del sistema.

## Umbral de Coverage
* **Número y métrica:** Establecí un umbral estricto del **80%** en líneas y ramas (configurado en `vite.config.js` para el frontend y con `--cov-fail-under=80` en Python para el backend).
* **Por qué ese número:** El 80% garantiza que la gran mayoría de la lógica clave está probada, dejando un 20% de margen para código difícil de simular. No exijo el 100% para evitar caer en la "ley de Goodhart", donde el equipo empieza a escribir tests vacíos sin `asserts` reales solo para cumplir la métrica (falsa confianza medida con precisión).
* **Qué excluí de la cuenta y por qué:** 
  * En el **backend** excluí el arranque y la configuración (`main.py`, `database.py`), y las clases de datos puras (`models.py`, `schemas.py`) a través del archivo `.coveragerc`. Esto lo hice porque no contienen lógica de negocio propia y testearlos implicaría testear el framework en sí.
  * En el **frontend** utilicé `include: ['src/lib/**', 'src/api/**']` para medir solo la lógica pura y excluir componentes visuales de React. Evaluar la UI por cobertura unitaria da falsos positivos y fragilidad (los componentes visuales se testearán e2e en el TP7).

## Refactorización y Mocks
* **Backend:** Extraje la lógica pura que estaba anidada en los endpoints de `main.py` hacia `validadores.py`. Implementé 8 tests usando `pytest` con estructura AAA. Inyecté `MagicMock()` en el dependency override de FastAPI (`get_db`) y simule el método `refresh()` para evitar que la creación de pacientes toque MySQL.
* **Frontend:** Extraje la lógica de fetch a `pacientesService.js` para que reciba el cliente HTTP (Axios) por parámetro (Inyección de Dependencias). Esto me permitió mockearlo usando `vi.fn()` de Vitest y comprobar que el endpoint y los datos enviados son correctos sin salir a la red.

## Ejercicio de la rama sin cubrir
* **Línea/Rama:** Al medir cobertura local, el condicional `if telefono and (not telefono.isdigit() or len(telefono) != 10):` en `validar_telefono` marcó una rama sin cubrir (el camino donde el teléfono existe pero no cumple con la cantidad de dígitos).
* **Entrada concreta que la recorrería:** Un teléfono de 11 dígitos, como `"12345678901"`.
* **Qué decidí hacer:** Agregué un test parametrizado específico en `test_logica.py` que inyecta teléfonos cortos, largos y con letras, asegurando que la rama de rechazo funcione correctamente y lance el error correspondiente.

## El Pull Request frenado por Calidad (Evidencia)
* **[ACTO 1] Link al PR que fue frenado, arreglado y mergeado:** [LINK](https://github.com/MatiasCarbel/ingsoft3-tp01/pull/28)
* **[ACTO 1] Link a la corrida original en ROJA:** [LINK](https://github.com/MatiasCarbel/ingsoft3-tp01/actions/runs/39758150237?pr=28)
* **[ACTO 2] Link al PR abierto y bloqueado actualmente:** [LINK](https://github.com/MatiasCarbel/ingsoft3-tp01/pull/29)
* **Qué pasó y cómo se arregló (Acto 1):** En el primer intento de subir la función `calcularPrioridadTurno`, el job de Frontend se puso rojo por calidad, no por compilación. Específicamente, el pipeline falló porque olvidé importar la nueva función en el archivo de tests (`ReferenceError: calcularPrioridadTurno is not defined`). Al fallar ese test, Vitest devolvió error y el Quality Gate bloqueó el merge (bajando la cobertura por debajo del 80%). Para arreglarlo, importé la función y escribí sus casos de prueba unitarios (cubriendo las ramas de edad y urgencia). Esto restauró el coverage, el pipeline se puso en verde y destrabó el botón de Merge.

## Declaración de uso de IA
Utilicé a Gemini como asistente técnico. Me ayudó a:
1. Configurar las banderas correctas de Pytest/Vitest en los Dockerfiles.
2. Resolver el error de inyección de variable de base de datos (`DATABASE_URL`) falsa para que SQLAlchemy no rompa el CI en GitHub Actions.
3.Armado del decisiones.md.
Verifiqué localmente cada test ejecutando `pytest` y `npm run test:ci` e interpretando los logs antes de cada commit.