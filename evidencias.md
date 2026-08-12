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

