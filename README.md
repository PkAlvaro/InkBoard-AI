# InkBoard-AI

Prototipo conceptual de InkBoard AI, un asistente ERP simplificado orientado a pequeños comerciantes.

## Demo interactiva

El repositorio incluye:

- Una API mínima construida con FastAPI que actúa como agente demo.
- Una interfaz web creada con React + Vite para visualizar inventario, personal y recordatorios generados por el agente.

### Backend (FastAPI)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

La API escucha por defecto en `http://127.0.0.1:8000`. Una vez en marcha, prueba los endpoints con `curl`, Postman o las [FastAPI docs](http://127.0.0.1:8000/docs). Ejemplos:

```bash
curl -X POST http://127.0.0.1:8000/inventory/restock \
  -H "Content-Type: application/json" \
  -d '{"sku": "SKU123", "name": "Manzanas", "amount": 50}'

curl -X POST http://127.0.0.1:8000/agent \
  -H "Content-Type: application/json" \
  -d '{"command": "Vendí 10 unidades de SKU123"}'
```

### Frontend (Vite + React)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El servidor de desarrollo queda disponible en `http://localhost:5173`. Si la API corre en otra URL, define `VITE_API_URL` antes de ejecutar `npm run dev` o `npm run build`:

```bash
VITE_API_URL="http://127.0.0.1:8000" npm run dev
```

La interfaz permite:

- Enviar comandos en español al agente y ver la respuesta JSON (ahora también mediante dictado por voz con síntesis opcional de la respuesta).
- Visualizar el inventario actualizado en tiempo real con acciones rápidas de reposición o venta.
- Revisar logs de empleados generados por los comandos.
- Crear y listar recordatorios asociados a clientes.

## Documentación
- [Prototipo conversacional y arquitectura](docs/design/ai-assistant-erp-prototype.md)

## Descargar un paquete zip de la demo

Ejecuta el script incluido para generar `inkboard-ai-demo.zip` con todos los archivos de la aplicación listos para compartir:

```bash
./scripts/create_demo_zip.sh
```

El script coloca el archivo comprimido en la raíz del repositorio e ignora carpetas internas como `.git`, `node_modules/` y caches de pruebas para mantener el paquete ligero.
