# InkBoard AI: Prototipo de asistente ERP simplificado

## 1. Visión general
InkBoard AI es una solución híbrida web/móvil para microempresas, feriantes y comerciantes que necesitan registrar operaciones cotidianas sin procesos administrativos complejos. El sistema combina un modelo de lenguaje (LLM) con una interfaz conversacional y tarjetas de acceso rápido que permiten controlar inventario, ventas, créditos y recordatorios en segundos. El asistente entiende instrucciones en lenguaje natural ("Vendí 30 unidades de las tazas esmaltadas") y ejecuta acciones sobre la base de datos, manteniendo siempre una bitácora que los usuarios pueden revisar y ajustar.

## 2. Principales casos de uso
1. **Registro de ventas y fiado**
   - El usuario dicta: "Vendí 30 unidades de café molido a Juan Pérez, fiado".
   - El LLM crea el movimiento de inventario, actualiza el saldo del cliente y registra la promesa de pago.
2. **Gestión de reservas**
   - Mensaje: "Reserva 10 manteles para la clienta Z para mañana a las 10".
   - El asistente bloquea inventario, crea un recordatorio y ofrece notificar al cliente.
3. **Control de asistencia y turnos**
   - Mensaje: "María llegó a las 8:05" o "Genera el turno de tarde para Pedro y Lucía".
   - El sistema marca la asistencia y organiza turnos rotativos.
4. **Seguimiento de proveedores**
   - Mensaje: "Confirma con el proveedor de frutas la entrega del viernes".
   - Se crea una tarea con fecha límite y se adjunta al proveedor correspondiente.
5. **Recordatorios inteligentes**
   - Mensaje: "Recuérdame llamar al cliente José mañana".
   - El asistente agenda la notificación y ofrece un resumen al inicio de la jornada.

## 3. Experiencia de usuario
### 3.1 Aplicación móvil
- **Encabezado** con el logotipo/pluma de InkBoard AI.
- **Módulo conversacional** fijo en la parte superior para dictar o escribir.
- **Tarjetas inteligentes** que el LLM rellena dinámicamente con hallazgos relevantes (por ejemplo, "Detecté 3 pedidos en WhatsApp, ¿quieres guardarlos?").
- **Panel de accesos directos** a información clave:
  - Clientes / Fiados: listado con saldo resumido y CTA para abrir ficha.
  - Inventario: barras de progreso para niveles críticos.
  - Proveedores: accesos para confirmar órdenes.
- **Barra inferior de navegación** con Inicio, Historial (timeline de acciones del asistente) y Configuración.

### 3.2 Aplicación web
- **Dashboard responsive** que replica la conversación a la izquierda y widgets configurables a la derecha.
- **Tablas interactivas** para inventario, clientes y proveedores con filtros de voz/teclado.
- **Panel de automatizaciones** donde se pueden definir reglas (por ejemplo, "si el stock baja del 10%, avisa"), respaldado por prompts preconfigurados.

## 4. Arquitectura funcional
1. **Capa de interacción**
   - Canal móvil (Flutter/React Native) y web (React/Vite) compartiendo componentes UI.
   - Motor de voz a texto/texto a voz opcional.
2. **Capa de orquestación AI**
   - Middleware que transforma las instrucciones en planes de acción (Chain-of-Thought + herramientas).
   - Catálogo de herramientas/aplicaciones (actualizar inventario, crear recordatorio, registrar turno, etc.).
3. **Base de datos operacional**
   - Esquema relacional ligero (PostgreSQL o Supabase) con tablas para productos, movimientos, clientes, cuentas por cobrar, reservas, empleados, asistencias, turnos, proveedores y recordatorios.
4. **Bitácora auditable**
   - Cada acción ejecutada por el asistente se registra con contexto, autor y capacidad de revertir.
5. **Módulo de notificaciones**
   - Integración con WhatsApp/Telegram, email y notificaciones push.

## 5. Modelado de datos base
| Entidad | Campos clave | Descripción |
| --- | --- | --- |
| `products` | `id`, `name`, `sku`, `stock`, `min_stock`, `unit_price` | Catálogo de productos. |
| `inventory_movements` | `id`, `product_id`, `type`, `quantity`, `reference`, `performed_by`, `performed_at` | Entrada/salida de inventario. |
| `customers` | `id`, `name`, `contact`, `credit_limit`, `balance` | Clientes y fiados. |
| `customer_orders` | `id`, `customer_id`, `status`, `due_date`, `note` | Reservas y pedidos. |
| `employees` | `id`, `name`, `role`, `contact` | Empleados y roles. |
| `shifts` | `id`, `employee_id`, `date`, `shift_type`, `start_time`, `end_time` | Turnos y horarios. |
| `attendance_logs` | `id`, `employee_id`, `timestamp`, `event_type`, `source` | Llegadas y salidas. |
| `reminders` | `id`, `title`, `description`, `due_at`, `priority`, `channel` | Recordatorios y notificaciones. |
| `suppliers` | `id`, `name`, `contact`, `usual_products`, `notes` | Proveedores. |
| `audit_log` | `id`, `action`, `payload`, `executed_by`, `executed_at`, `status` | Histórico auditable de acciones del asistente. |

## 6. Flujo conversacional ejemplo
1. Usuario: "Vendí 30 unidades de X producto a la clienta Z, fiado".
2. LLM interpreta la intención (venta + crédito) y valida stock.
3. Si hay stock suficiente:
   - Resta 30 unidades de inventario.
   - Crea un movimiento de crédito en `customer_orders`.
   - Actualiza el saldo de la clienta.
   - Agrega un recordatorio con la fecha de pago acordada.
   - Responde con un resumen y opciones para ajustes.
4. Si el stock es insuficiente:
   - Ofrece alternativas: generar pedido a proveedor o parcial.

## 7. Seguridad y controles
- Confirmaciones explícitas para operaciones críticas (borrar, mover stock masivo).
- Roles de usuario (dueño, empleado, contador) con diferentes permisos para aprobar acciones del asistente.
- Revisión periódica de prompts y logs para evitar alucinaciones del LLM.

## 8. Hoja de ruta sugerida
1. Prototipo conversacional (front-end mock + backend simulado).
2. Integración con base de datos real y acciones CRUD.
3. Automatizaciones predefinidas (alertas de stock, recordatorios de cobro).
4. Panel web avanzado y reportes.
5. Integraciones externas (facturación, marketplaces, medios de pago).

## 9. Métricas de éxito
- Tiempo promedio para registrar una venta o reserva.
- % de tareas registradas por voz vs. manualmente.
- Reducción de errores de inventario.
- Retención de usuarios activos semanalmente.
- Feedback cualitativo sobre claridad de la interfaz conversacional.

## 10. Próximos pasos para el prototipo UX
- Crear wireframes de alta fidelidad basados en el mockup inicial (mobile y web).
- Definir biblioteca de componentes (botones, tarjetas, modales) con estilo consistente.
- Preparar guías de conversación (tone of voice, sugerencias contextuales).
- Validar con 3-5 comerciantes reales mediante pruebas guiadas.
