# Evidencias — TP1

## 1. Push directo a main rechazado
<img width="835" height="385" alt="image" src="https://github.com/user-attachments/assets/d7db2b5d-c507-49b6-91e9-f49c527add39" />

*GitHub rechaza el push en la terminal porque la rama `main` está protegida mediante las rules/policies y la regla alcanza también al dueño del repositorio (Do not allow bypassing).*

## 2. Aviso de conflicto en el Pull Request
<img width="943" height="783" alt="image" src="https://github.com/user-attachments/assets/81fdf10d-672d-4a7b-b44f-6965e8ddc5de" />

*Al intentar mergear la rama B, GitHub avisa que no se puede integrar automáticamente porque ambas ramas (A y B) modificaron la misma línea del archivo.*

## 3. Marcadores de conflicto en el editor
<img width="943" height="783" alt="image" src="https://github.com/user-attachments/assets/21071da8-b717-4a3f-a5f8-266d6f350ea9" />

*Vista del editor antes de resolver el conflicto. Se observan los marcadores (`<<<<<<<`, `=======`, `>>>>>>>`) que separan la versión que viene en la rama actual y la que ya estaba en `main`.*

## 4. Release publicada
<img width="943" height="783" alt="image" src="https://github.com/user-attachments/assets/c71066a3-654c-4052-9e76-7a21aa282cd2" />

*La release `v1.0.0` publicada correctamente en el repositorio.*

# Evidencias TP2
## docker compose up -d desde cero y el sistema funcionando end-to-end,
<img width="1860" height="376" alt="Screenshot from 2026-08-31 14-27-38" src="https://github.com/user-attachments/assets/9e5dad54-7620-4099-86d5-a9fd8ffc55a9" />
<img width="836" height="493" alt="Screenshot from 2026-08-31 14-29-38" src="https://github.com/user-attachments/assets/ca0b8d0a-93af-4074-8d13-63f7ce980ae7" />
<img width="836" height="493" alt="Screenshot from 2026-08-31 14-32-48" src="https://github.com/user-attachments/assets/f11feff4-5d90-475c-95c7-cbab525a6a42" />
Se demuestra el levantamiento del sistema completo mediante docker compose up -d desde cero. Los contenedores de frontend, backend y la base de datos se encuentran en ejecución, y la aplicación web es capaz de registrar un paciente exitosamente, confirmando la correcta comunicación entre los tres servicios.

## la prueba de persistencia (down / up conserva datos; down -v los limpia),
<img width="771" height="277" alt="Screenshot from 2026-08-31 14-33-27" src="https://github.com/user-attachments/assets/3ff6a40a-6bc1-44c6-a43c-2f50d64c6257" />
<img width="835" height="502" alt="Screenshot from 2026-08-31 14-33-42" src="https://github.com/user-attachments/assets/dc88ea5e-b822-4615-a29d-bae38c2f40b1" />
Al ejecutar docker compose down y luego volver a levantar los servicios con docker compose up -d, el registro del paciente creado anteriormente se conserva intacto. Esto comprueba que los datos sobreviven a la destrucción de los contenedores gracias a la correcta configuración del volumen nombrado (db_data)

<img width="778" height="276" alt="Screenshot from 2026-08-31 14-34-40" src="https://github.com/user-attachments/assets/a577a951-66e4-454b-86ff-0d5717f78d34" />
<img width="829" height="458" alt="Screenshot from 2026-08-31 14-34-56" src="https://github.com/user-attachments/assets/3df49de5-c29c-41f3-9220-e79ac39d3268" />
Al ejecutar docker compose down -v, se destruyen explícitamente tanto los contenedores como los volúmenes asociados. Al levantar el sistema nuevamente, la lista de pacientes se muestra vacía, demostrando que la base de datos se inicializó desde cero al no encontrar su volumen.

## comparación de tamaño imagen final vs imagen de SDK,
<img width="955" height="132" alt="Screenshot from 2026-08-31 14-39-01" src="https://github.com/user-attachments/assets/72e11706-f7f8-43e8-9a6e-10751bed97c0" />
En la siguiente captura se comprueba la eficiencia de los Dockerfiles multi-stage. Se observa cómo la imagen base del SDK utilizada para compilar el frontend (node:22-alpine) pesa considerablemente más que la imagen mínima de ejecución (nginx:alpine) y que nuestra imagen final de producción. 

## las imágenes publicadas en el registry.
<img width="840" height="531" alt="Screenshot from 2026-08-31 14-39-38" src="https://github.com/user-attachments/assets/15afe7c2-c9c0-45cb-a839-4abc09e12800" />
Publicación exitosa de las imágenes del backend y frontend en GitHub Container Registry (ghcr.io).
