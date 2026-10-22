# Etapa 1: Build 
FROM python:3.10-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


# --- Etapa 2: Tests (LA NUEVA BARRERA) ---
FROM build AS test
RUN pip install --user pytest pytest-cov httpx
COPY . .
# Le sacamos el --omit de acá:
ENTRYPOINT ["python", "-m", "pytest", "--cov=.", "--cov-report=xml:/out/coverage.xml", "--cov-fail-under=80"]


# Etapa 3: Runtime 
FROM python:3.10-slim AS final
WORKDIR /app
COPY --from=build /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]