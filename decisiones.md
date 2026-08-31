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