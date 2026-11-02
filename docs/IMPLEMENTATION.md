# Registro de implementación

## Base del trabajo

Se conservaron los tres documentos originales. Se revisaron las cuatro páginas de `HCI-app_sketches.pdf` y el alcance técnico del master prompt. Ante diferencias con los bocetos, prevalece el master prompt: el panel derecho muestra asientos, no video; Walkie Talkie, Extra y Map llevan a 404; no se implementa comunicación de audio ni sincronización.

La carpeta no contenía una aplicación, `package.json` ni configuración previa. Se creó un proyecto React + TypeScript + Vite, con Tailwind 4 mediante su plugin oficial y Lucide React. No hay librería adicional de enrutamiento: las rutas hash permiten navegación, historial y recarga en un servidor estático sencillo.

## Fases completadas

1. **Inspección y plan:** revisión de documentos, entorno Node/npm y estructura existente.
2. **Fundación:** configuración del proyecto; tipos en `src/domain/types.ts`; datos en `src/data/seed.ts`; repositorio local con validación de esquema y recuperación; entrada por nombre y navegación.
3. **Interfaces:** estructura de tres columnas ADMIN y vista STAFF adaptable; componentes de avatar, estado, prioridad, formularios y diálogo; navegación móvil y accesos provisionales.
4. **Tareas y permisos:** operaciones puras en `src/domain/service.ts`, asignaciones individuales/libres, validaciones, notificaciones e historial.
5. **Comunicación:** general y canales por equipo; validación central de lectura y publicación; mensajes locales inmediatos.
6. **Tiempo y asientos:** secuencia temporal basada en marcas de tiempo absolutas; controles ADMIN; conteo derivado de incrementos con usuario y fecha.
7. **Verificación:** compilación y pruebas de dominio; comprobación en navegador de los flujos principales y revisión adaptable.

## Decisiones de alcance

- Un usuario pertenece a un equipo como máximo. ADMIN no necesita equipo.
- Integrantes y líder se derivan de `User.teamId` y `User.role`, evitando listas duplicadas que puedan quedar inconsistentes.
- Cada equipo tiene como máximo un líder; designar otro devuelve el anterior a STAFF.
- Solo STAFF del equipo de una tarea libre puede aceptarla. Los líderes pueden cambiar el estado de sus tareas individuales, pero no aceptar tareas libres ni asignar tareas a otras personas.
- Antes de cambiar de equipo a una persona con tareas asignadas, ADMIN debe reasignarlas. La interfaz explica este requisito.
- El último ADMIN no puede degradarse a otro rol.
- La fecha límite está presente en el formulario y es opcional, conforme al modelo de datos del prompt.
- Una tarea libre sin responsable siempre queda Pendiente. El estado no puede avanzar sin responsable.
- El historial registra cambios de campos con valor anterior y nuevo. Los cambios de estado sin efecto no duplican notificaciones.
- ADMIN consulta los asientos y designa el equipo, pero no registra incrementos operativos.
- La duración se configura en segundos para poder demostrar y probar secuencias cortas, con un máximo de 24 horas por segmento.
- Las modificaciones se validan sobre una lectura reciente del repositorio y se guardan como un único documento. No se promete coordinación concurrente entre pestañas.
- No se incluyeron controles para eliminar usuarios o equipos que pudieran dejar referencias históricas inválidas; la gestión comprende alta, edición, roles, integrantes y líderes.

## Pruebas automáticas

`npm test`: 21 pruebas, todas aprobadas en la ejecución inicial.

Cobertura funcional:

- Coherencia de datos de ejemplo y búsqueda de nombres, incluyendo duplicados.
- Creación/asignación individual, notificaciones y registro de actividad.
- Rechazo de creación/edición/asignación por STAFF y líderes.
- Aceptación de tareas libres solo por STAFF del equipo y rechazo de una segunda aceptación.
- Cambios de estado propios, rechazo de tareas ajenas y estados no permitidos.
- Ausencia de notificaciones duplicadas ante operaciones sin cambios.
- Validación de campos, responsable y pertenencia al equipo.
- Acceso de lectura y escritura a canales del equipo, general y ADMIN.
- Gestión de equipos, usuarios, líder único, último ADMIN y reasignación antes de mover personal.
- Conteo exclusivo del equipo designado y reconstrucción del total.
- Avance entre múltiples segmentos, finalización idempotente en cero, pausa, reanudación y reinicio.
- Lectura de notificaciones limitada a su destinatario.
- Filtrado de tareas y actividad del líder.
- Persistencia al recrear el repositorio; datos corruptos o incompatibles preservados.
- Rechazo de estructuras corruptas y conservación del estado ante errores de escritura.

`npm run build`: compilación de TypeScript y generación de producción aprobadas.

## Verificación en navegador

Pruebas locales realizadas con usuarios ficticios, sin servicios externos:

- Entrada como ADMIN y creación de una tarea individual para Mateo Ruiz.
- Recarga: la tarea permanece y la sesión sigue abierta en esa pestaña.
- Mensaje en General: aparece inmediatamente y se conserva después de recargar.
- Cambio a STAFF: la tarea recibida aparece con su notificación; puede marcarse Completada.
- Aceptación de una tarea libre: se reduce la cantidad de disponibles.
- Marcar todas las notificaciones como leídas: el contador pasa a cero.
- Map, Extra y Walkie Talkie muestran la pantalla 404 prevista.
- STAFF de Técnica solo ve General y Técnica en Canales.
- Sofía, del equipo Accesos, suma tres asientos: el total pasa de 184 a 187 y persiste al recargar.
- Lucía, líder de Técnica, ve las tareas del equipo sin botones de crear o aceptar; una ruta ADMIN directa muestra acceso restringido.
- Secuencia de tres segmentos de dos segundos: inicia, continúa después de recargar y termina en 00:00, mostrando Secuencia completada.
- Alta de una persona y un equipo; cambio de equipo y designación de la persona como líder desde la interfaz.
- Restauración de datos: vuelve a la pantalla de entrada y recupera los datos iniciales.
- Revisión visual de ADMIN a 1440 × 1000 y STAFF a 390 × 844.

Las pruebas se ejecutaron en el navegador local de la herramienta. No sustituyen una evaluación de usabilidad con participantes ni pruebas en teléfonos físicos.
