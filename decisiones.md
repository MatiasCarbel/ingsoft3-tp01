# Enlaces de este TP

*1. Paquetes Públicos en el Registry:*
- Imagen Frontend: [FRONTEND](https://github.com/MatiasCarbel/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-frontend)
- Imagen Backend: [BACKEND](https://github.com/MatiasCarbel/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-backend)

*2. Evidencia de la Cadena de Publicación:*
- Corrida de un PR: [PULL REQUEST RUN](https://github.com/MatiasCarbel/ingsoft3-tp01/actions/runs/40052094763)
- Corrida de la rama main: [RUN](https://github.com/MatiasCarbel/ingsoft3-tp01/actions/runs/40052178637)

*3. Entornos Vivos (Render):*
- URL Frontend QA: [FRONTEND-QA](https://tp01-front-qa.onrender.com)
- URL Frontend PROD: [FRONTEND-PROD](https://tp01-front-prod.onrender.com)

## Enlaces del TP7
**1. Paquetes Públicos en el Registry:**
- Imagen Frontend: [URL PAQUETE FRONTEND](https://github.com/MatiasCarbel/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-frontend)
- Imagen Backend: [URL PAQUETE BACKEND](https://github.com/MatiasCarbel/ingsoft3-tp01/pkgs/container/ingsoft3-tp01-backend)

**2. Evidencia del Gate de Promoción (Verde/Rojo):**
- Corrida fallida (Integración Verde / E2E Rojo): [LINK CORRIDA QUE FALLÓ](https://github.com/MatiasCarbel/ingsoft3-tp01/actions/runs/40232988577)
- Corrida exitosa: [LINK ÚLTIMA CORRIDA EN VERDE](https://github.com/MatiasCarbel/ingsoft3-tp01/actions/runs/40234627903)

**3. Entornos Vivos:**
- URL QA Front: [https://tp01-front-qa.onrender.com](https://tp01-front-qa.onrender.com)
- URL PROD Front: [https://tp01-front-prod.onrender.com](https://tp01-front-prod.onrender.com)

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


# TP6 - Continuous Delivery: Environments, Aprobaciones y Deployment Patterns

## 1. El Artefacto y el Registry
El artefacto se publica **solo** cuando la verificación del pipeline de CI pasa a estado verde. Si el pipeline publicara la imagen incluso con los tests rotos, el registry dejaría de ser una garantía de calidad; se convertiría simplemente en un depósito de construcciones fallidas. Esta garantía no está hecha con un `if` de estado, sino que depende del **orden de los pasos**: construir y publicar es el último paso del *job*. Si los tests fallan antes, el proceso se interrumpe y nunca se llega a la publicación.

## 2. Continuous Delivery vs. Continuous Deployment
En este trabajo implementé **Continuous Delivery (Entrega Continua)**. Cada código integrado pasa de forma automática a QA, pero su pase a Producción está frenado por una aprobación manual humana. Para este contexto es lo correcto, ya que el despliegue a PROD deja de ser un evento puramente técnico y se convierte en una decisión de negocio, dándome la oportunidad de revisar que todo funcione bien en el entorno de pruebas antes de impactar a los usuarios finales.

## 3. Diseño de la Cadena y Alcance de Secrets
El pipeline modela la promoción utilizando la sintaxis `needs:` para encadenar *jobs* de forma secuencial y `if: github.ref == 'refs/heads/main'` para bloquear los despliegues en Pull Requests, asegurando que solo el código integrado avance. 
En cuanto a los secretos, utilicé **Environment Secrets**. Los hooks de QA solo existen para el entorno `qa`, y los de PROD están encapsulados en `production`. Así, aplico el principio de mínimo privilegio: el código que no cuenta con aprobación hacia PROD no tiene visibilidad física de las credenciales para desplegar en ese entorno.

## 4. Criterios de Aprobación (Gate Humano)
Antes de aprobar un pase a Producción, como responsable reviso:
1. Que QA haya finalizado su despliegue y su correspondiente *smoke test* esté en verde.
2. Qué tipo de cambios trae el commit: si hay modificaciones en las variables de entorno o la conexión a la BD, requiere revisión manual extra.
3. El estado del equipo o del servicio (por ejemplo, evitar aprobar si otro desarrollador está a punto de mergear otro PR para no pisar versiones).

## 5. Letra Chica del Free Tier y Limitaciones
El free tier de Render impone límites estrictos: los servicios se duermen ("idle") tras 15 minutos sin tráfico, y cuando reciben un request tienen un *cold start* de casi 1 minuto. Mi pipeline maneja esto dentro del *smoke test*, ejecutando bucles (`for` con `sleep 20`) que reintentan hasta 30 veces. Además, agrego `--max-time 10` al comando `curl` para evitar que el job quede colgado eternamente esperando la respuesta inicial.

## 6. La Reconstrucción en Render (Limitación de Garantía)
Actualmente, el hook que usamos le pide a Render que **vuelva a construir** la aplicación desde el repositorio. Esto rompe parcialmente la promesa de promover "lo mismo que se verificó", porque lo que termina corriendo en QA y PROD no es mi imagen verificada del registry, sino un nuevo *build*. Si una imagen base o dependencia externa cambia entre un *build* y otro, la versión en PROD podría diferir de la de QA.

## 7. Qué prueba y qué no prueba el Smoke Test
El *smoke test* prueba que el proceso levantó correctamente (`/health`), que hay conexión con la base de datos (con una ruta de la API) y que el Nginx está sirviendo la web. Sin embargo, **no prueba qué versión está corriendo**. Como el hook de Render responde instantáneamente y buildea en segundo plano, el curl del *smoke test* puede dar verde contra la versión antigua si se ejecuta antes de que termine el despliegue real.

## 8. Estrategia de Despliegue y Plan de Rollback
Para un escenario de producción real con usuarios activos, elegiría implementar el patrón **Blue-Green Deployment**. 

**¿Por qué esta estrategia?**
- **Riesgo y Rollback:** Actualmente nuestro despliegue en Render tiene un *cold start* y un pequeño downtime mientras se levanta el contenedor. Con Blue-Green, tendríamos dos entornos idénticos (Azul y Verde). Desplegamos la nueva versión en el Verde, le corremos tests exhaustivos, y si todo está bien, simplemente cambiamos el enrutador/balanceador de carga para que apunte al Verde. El downtime es cero. Si algo falla, el **rollback es instantáneo**: solo volvemos a apuntar el router al entorno Azul.
- **Costo:** El costo de infraestructura es mayor (requiere pagar el doble de servidores, al menos durante la ventana de despliegue), pero se justifica totalmente por la disponibilidad y la seguridad que le da al negocio.
- **Observabilidad que nos falta hoy:** Actualmente solo tenemos un *smoke test* ciego que hace un `curl` y espera un código HTTP 200. Para hacer Blue-Green o Canary de verdad, nos falta monitoreo real (métricas DORA, etc) para medir latencia, consumo de CPU y tasa de errores (ej. cantidad de HTTP 500) en el entorno Verde antes de decidir apagar el Azul. También requeriría que las migraciones de nuestra Base de Datos sean siempre retrocompatibles, ya que ambos entornos compartirían la misma BD de Producción durante el cambio.

**Mi Plan de Rollback:**
Si un despliegue en PROD falla, el plan de acción es volver a la versión segura anterior:
1. Busco el SHA del último deploy exitoso en la pestaña *Deployments* de GitHub.
2. Desde mi terminal local, disparo manualmente los dos Deploy Hooks de Render (API y Front de PROD) pasándoles el parámetro `&ref=$SHA_ANTERIOR`. (Ej: curl -fsS "https://api.render.com/deploy/HOOK_API_PROD&ref=EL_SHA_ANTERIOR" y curl -fsS "https://api.render.com/deploy/HOOK_FRONT_PROD&ref=EL_SHA_ANTERIOR")
3. Según la prueba que cronometré en la solapa *Deploys* de Render, este rollback tarda **37.1s** segundos en figurar como "Live".


## 9. Declaración de Uso de IA
Utilicé IA para comprender el uso de las plantillas `.template` en Nginx (variables de entorno dinámicas), depurar errores 502/404 generados por fallos en el proxy, y estructurar sintácticamente los jobs del `ci.yml`. Todo el código y los pasos proporcionados fueron comprobados mediante pruebas manuales en la consola de Render y verificando las corridas de Actions en mi repositorio.

## TP7 - Contenedores, Integración y E2E

**1. Build once, deploy many:**
El problema del TP6 era que Render reconstruía el código desde el repositorio en cada despliegue, por lo que la versión de PROD podía diferir de la testeada en QA si se resolvía una dependencia de forma distinta. Ahora la unidad de release es la imagen inmutable de Docker. Construimos una sola vez, publicamos en ghcr.io y todos los entornos ejecutan exactamente los mismos binarios verificados.

**2. Estrategia de etiquetas:**
Utilizamos la etiqueta `sha-<commit>` en el registry para garantizar trazabilidad exacta hacia el código que originó la imagen. No publicamos `latest` porque es un puntero mutable; si se redespliega `latest`, no hay certeza de qué versión exacta se está ejecutando. En Render, configuramos los servicios apuntando a un `sha-` base mediante *Existing Image*, pero el hook de nuestro pipeline actualiza la imagen en cada despliegue pasando el parámetro `imgURL`. Finalmente, el tag de git `v7.0.0` marca el commit exacto que fue promovido a Producción.

**3. De la release a la imagen:**
Con el comando `git rev-list -n1 v7.0.0` obtenemos el SHA del commit que está corriendo en Producción. Como nuestra imagen en ghcr.io se etiqueta directamente con ese mismo SHA, la correspondencia es directa y en un solo paso.

**4. Verificación de ejecución (y límites del smoke test):**
Para comprobar desde afuera que Render está ejecutando la imagen y no reconstruyendo, revisamos la pestaña *Events* del servicio. El log debe decir "Triggered via Deploy Hook" detallando explícitamente el `sha-<commit>`. El smoke test solo pregunta si la aplicación responde HTTP 200; si el despliegue falla silenciosamente, el smoke test podría dar verde interactuando con la versión anterior que sigue viva, por eso no basta para probar qué artefacto se está ejecutando.

**5. Selección de flujos E2E e Integración:**
- **E2E:** Elegimos flujos que simulan el camino crítico del usuario en el navegador: alta de paciente exitosa (crear, ver, borrar), manejo de errores (DNI inválido) y carga inicial de la UI. Dejamos fuera validaciones exhaustivas de reglas de negocio aisladas, ya que eso le corresponde a los unitarios.
- **Integración:** Probamos el endpoint principal interactuando con la base de datos real y el rechazo HTTP 400 por la API. La regla es probar que nuestra API y su base de datos se entienden correctamente, sin simulaciones en el medio.

**6. El diagnóstico del par Verde/Rojo:**
En la corrida fallida, Integración dio Verde y E2E dio Rojo. Esto nos indicó instantáneamente, sin mirar el código, que la API y la Base de Datos estaban sanas (Fila 1 de la tabla de diagnóstico), pero que el frontend estaba enviando mal los datos o fallando en la interfaz. Si hubiéramos roto la API, Integración habría dado Rojo y E2E ni siquiera habría corrido por el bloqueo de dependencias.

**7. Integración Amplia vs Estrecha:**
Elegimos la integración *amplia* (golpeando la API de QA ya desplegada). Aunque la integración estrecha (levantar la API y BD descartable dentro del runner del CI) llega antes en la cadena, la amplia nos ahorró configuración compleja y nos permitió usar el entorno realista que el pipeline ya había levantado.

**8. Cold start y Flaky tests:**
Manejamos el cold start del free tier configurando un `timeout` de 60 segundos y 1 `retry` en `playwright.config.js`. Esto evita que un test falle solo porque el servidor tardó en despertar. Un test *flaky* es aquel que pasa a veces y a veces no; esconder esto detrás de reintentos infinitos es peligroso porque entrena al equipo a ignorar los fallos.

**9. Misma imagen del front en QA y PROD:**
Logramos que la misma imagen de frontend sirva para QA y PROD leyendo `URL_API` mediante el `default.conf.template` de Nginx. Render inyecta la variable al iniciar el contenedor, permitiendo que el binario apunte al backend correcto sin reconstruir el código.

**10. Declaración de uso de IA:**
Utilicé IA para adaptar el setup de Playwright, estructurar los comandos `curl` del CI con `imgURL`, agregar las etiquetas `aria-label` de accesibilidad en los componentes React para los selectores de E2E. Verifiqué su funcionamiento interactuando directamente con la consola de GitHub Actions y modificando selectores clave para validar los bloqueos.

# TP8 - Infraestructura como Código (IaC)

1. **Riel elegido y versiones fijadas:**
Utilizamos el riel canónico (Terraform local contra Neon y Render). Fijamos estrictamente las versiones de los providers (`kislerdm/neon` en `0.18.0` y `render-oss/render` en `1.9.1`) porque las APIs de los proveedores mutan y no declarar la versión podría romper nuestro `init` o el despliegue el día de mañana.

2. **Declaración del entorno preprod (Aislamiento total):**
Decidimos declarar únicamente un entorno nuevo (`preprod`), dejando QA y PROD intactos y fuera de la gestión de este código. Esto nos permite tener un entorno de pruebas idéntico a producción que podemos destruir (`terraform destroy`) y recrear (`terraform apply`) a demanda, esquivando los límites de cuota (750hs mensuales) del free tier de Render que nos habrían suspendido la cuenta entera.

3. **Derivación dinámica de conexiones:**
Ninguna credencial o URL se copió manualmente en el código. La cadena de conexión a la base de datos se deriva de los atributos inyectados por el provider de Neon (`database_host`, `password`, etc.), y Nginx lee dinámicamente la URL de la API porque utilizamos `render_web_service.api.url` como variable de entorno del frontend. Esto elimina el clásico error humano de apuntar un front de QA a una base de PROD.

4. **El estado y su aislamiento:**
El estado (`terraform.tfstate`) no se subió al repositorio porque contiene atributos sensibles (contraseñas de la base de datos) en texto plano. Quedó aislado en mi máquina local protegido por el `.gitignore`. Comprendo que, en un equipo de trabajo real, este estado debe migrarse a un *remote backend* (como un bucket S3 con bloqueo) para que todos comparen contra la misma memoria y evitar pisar la infraestructura del otro.

5. **Drift y los límites de Terraform:**
El `plan` lee el estado, no la cuenta completa de los proveedores. Si alguien elimina mi base de `preprod` a mano, Terraform lo detecta y lo recrea en el próximo `apply` (drift detectado). Sin embargo, si alguien crea una base de datos nueva en Neon por fuera de mi código, el plan dirá "No changes" porque Terraform solo vigila los recursos que él mismo declaró.

6. **Declaración de uso de IA:**
Utilicé IA para estructurar el formato de los bloques HCL respetando la documentación de los providers `neon` y `render`y formatear los comandos de la CLI de Terraform. Verifiqué personalmente la creación, navegación y posterior destrucción del entorno efímero mediante mi terminal local.

# TP9 - DevSecOps, Observabilidad y Feedback Continuo

- **Dependabot:** Mergeé el PR de actualización de la dependencia "chore(deps-dev): bump globals from 15.15.0 to 17.13.0 in /frontend" porque todos los checks de integración continua dieron verde, garantizando que no rompe el sistema.
- **UptimeRobot:** El monitor tardó 5 minutos con 20 segundos aproximadamente en avisarme de la caída al suspender el servicio en Render. 
- **Sentry:** La operación más usada fue GET pacientes y la más lenta fue POST turno con un P95 de 1.83S.
- **Uso de IA:** Se utilizó IA para entender la configuración de Sentry, UptimeRobot, dependabot.yml y los comandos Git. Todo fue validado en los respectivos dashboards (Sentry/Render/UptimeRobot).
