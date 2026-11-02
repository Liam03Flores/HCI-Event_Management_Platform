# Auditoría funcional — Event Management Platform

Fecha: **21 de octubre de 2026**, America/Mexico_City. Los registros del sistema en UTC corresponden al 22 de octubre.

## Resultado

Los **20 criterios de aceptación** de `docs/MASTER_PROMPT.md` se revisaron contra el código. Todos cuentan con comprobaciones ejecutadas, con el alcance indicado en la matriz. Después de corregir los hallazgos, **40/40 pruebas automatizadas pasan**, TypeScript pasa y la compilación de producción termina correctamente. Los recorridos de navegador comprobados funcionan. Esto no equivale a una certificación de todos los navegadores, dispositivos o condiciones de almacenamiento.

Se corrigieron siete grupos de errores y se hicieron explícitas las tres rutas provisionales exigidas por el prompt. No se añadieron funcionalidades de producto, dependencias ni cambios de diseño. La hoja de estilos no se modificó.

La prueba de navegador utilizó `http://127.0.0.1:5174`, con datos ficticios independientes del origen habitual en el puerto 5173. No se restablecieron los datos del usuario. Los archivos de código se modificaron en el proyecto compartido y están disponibles en VS Code.

## Evidencia y comprobaciones ejecutadas

### Pruebas automatizadas

| Comprobación | Resultado ejecutado |
|---|---|
| Estado inicial: `npm test` | 21/21 correctas. La suite existente no detectaba los casos nuevos. |
| Reproducción previa a las correcciones: diez pruebas `AUD-01` a `AUD-06` | 10/10 fallaban, reproduciendo los problemas descritos abajo. |
| Primera repetición tras corregirlos | 31/31 correctas: 21 existentes + 10 regresiones. |
| Suite final: `npm test` | **40/40 correctas**, 0 fallidas, 0 omitidas. Incluye otras nueve pruebas de aceptación. |
| `npm run typecheck` | Correcto, código de salida 0. |
| `npm run build` | Correcto, código de salida 0. TypeScript + Vite 7.3.7, 1592 módulos; genera `dist/`. |
| `node node_modules/prettier/bin/prettier.cjs --check src tests` | Correcto. |

Pruebas reproducibles: `tests/domain.test.ts` (21) y `tests/audit.test.ts` (19). Se ejecutan con el runner de Node mediante `npm test`. Las pruebas del repositorio utilizan un almacenamiento en memoria que implementa la interfaz `Storage`; las verificaciones de localStorage real se hicieron además en el navegador. No se confunden ambos tipos de evidencia.

La suite añadida comprueba, entre otros casos, todas las operaciones administrativas contra STAFF y líderes, lectura/publicación por cada combinación de usuario y canal, destinatarios exactos de notificaciones, límites temporales del countdown y reconstrucción completa del repositorio después de guardar cada operación. Los bucles de casos forman parte de las 40 pruebas; no se cuentan como pruebas adicionales.

### Recorridos ejecutados en navegador

Prueba interactiva asistida por herramientas en el navegador integrado; no es una suite E2E incluida en `npm test`.

| ID | Recorrido y resultado observado |
|---|---|
| B01 | Nombre inexistente rechazado; ` ALEX MORGAN ` entra como ADMIN; `lucia torres` entra como líder. Se creó otro Mateo Ruiz en un equipo diferente y la entrada mostró ambas opciones. Elegir Técnica abrió el STAFF correcto. |
| B02 | ADMIN creó «AUDITORÍA · Asignación individual» para Mateo. Mateo recibió la notificación y cambió Pendiente → En curso → Completada. Tras recargar seguía completada. ADMIN cambió su prioridad y el estado permaneció Completada. |
| B03 | ADMIN publicó «AUDITORÍA · Tarea libre». Mateo la aceptó: disponibles bajó de 3 a 2 y la tarea pasó a sus asignadas. Elena no la encontró entre sus disponibles. ADMIN recibió el aviso de aceptación. |
| B04 | ADMIN creó el equipo Auditoría, añadió un integrante y lo designó líder. Equipo, miembro y liderazgo persistieron al recargar. |
| B05 | Mateo publicó en General y Técnica; el mensaje apareció inmediatamente. El mensaje de General permaneció después de recargar. El acceso directo a `#/chat/welcome` rechazó a Mateo y no mostró el editor de mensajes. |
| B06 | STAFF recibió rechazo en `#/people`; el líder recibió rechazo en `#/teams`. El líder pudo consultar la tarea de Mateo sin controles de edición o asignación. Su countdown no mostró botones de control. |
| B07 | ADMIN cambió las duraciones a 3, 5 y 3 segundos, inició, pausó y recargó: conservó la pausa. Reanudó y se observó el segundo segmento. Tras otra recarga la secuencia terminó en **00:00**, segmento 3/3, «Terminada». |
| B08 | Mateo no tuvo controles para incrementar asientos. Sofía, de Accesos, sumó 7: **184 → 191**. Al recargar se conservó el total y el registro con autor/fecha. ADMIN consultó 191 sin botón de incremento. |
| B09 | Mateo marcó todas sus notificaciones como leídas y, tras recargar, el indicador mostró 0. El historial del líder mostró las acciones de su equipo. El historial ADMIN mostró creación, asignación, aceptación, transiciones de estado, edición y el incremento de asientos con actor y hora. |
| B10 | ADMIN probado a 1440 × 1000. STAFF probado a 390 × 844 y 320 × 740. Se inspeccionaron las capturas y no se observó desbordamiento horizontal en las vistas móviles comprobadas. |
| B11 | Los enlaces Walkie Talkie, Extra y Map abrieron la pantalla intencional 404, con regreso a Home. |
| B12 | Se observó una pantalla vacía durante la recarga de módulos de desarrollo, con `AppProvider requerido` en consola. Tras corregirlo, una nueva edición del proveedor y del servicio conservó pantalla y sesión. La comparación de consola no mostró errores ni avisos nuevos desde esa corrección hasta terminar los recorridos. |

El primer arranque del servidor quedó inaccesible desde el navegador debido al aislamiento del entorno. Se inició el servidor local con el permiso de ejecución correspondiente y se verificó respuesta HTTP 200. No fue necesario instalar software. Un intento de localizar el texto «Finalizado» no coincidió con la etiqueta real «Terminada»; se inspeccionó el estado y se confirmó 00:00. Ese fallo de selector no se contabiliza como fallo del producto.

## Errores encontrados y correcciones

| Hallazgo | Impacto y corrección | Verificación posterior |
|---|---|---|
| AUD-01: el guardado extendía todo el objeto recibido | Permitía sobrescribir estado, ID y metadatos desde campos extra; un formulario antiguo podía revertir un estado recién actualizado. El servicio y el editor ahora seleccionan únicamente los seis campos editables. | Tres regresiones automatizadas + B02. |
| AUD-02: cadena vacía interpretada como ausencia de datos | Un valor guardado `""` provocaba inicialización silenciosa. Ahora solo una clave inexistente inicializa la demo; una cadena vacía activa recuperación y conserva los bytes. | Regresión con cadena vacía, sin sustitución del contenido. |
| AUD-03: validación insuficiente de datos persistidos | Se aceptaban valores enumerados convertibles a texto, como arrays, y combinaciones imposibles del countdown. El guardado tampoco validaba antes de sustituir la copia anterior. Se exigen strings reales, coherencia temporal y un estado válido antes de escribir. | Tres regresiones: enums, snapshots temporales e intento de guardado inválido; la copia anterior permanece. |
| AUD-04: selectores confiaban en el rol recibido | Un objeto de usuario antiguo o alterado podía ampliar las listas de tareas, canales e historial. Los selectores resuelven ahora el usuario y su rol desde los datos actuales. No se afirma que esto constituya autenticación real. | Regresión con STAFF presentado como ADMIN y usuario inexistente. |
| AUD-05: cambio implícito de estado sin registro | Republicar como libre una tarea en curso la devolvía a Pendiente, pero no registraba esa transición. Ahora se añade el registro `task-status`, además de la edición. | Regresión que exige «En curso → Pendiente» en el historial. |
| AUD-06: tipos de campos de tarea insuficientemente validados | Se aceptaba una fecha numérica y algunos valores inválidos fallaban de forma poco clara. Se validan descripción, fecha y responsable antes de construir la operación. | Regresión para fecha numérica, responsable vacío y descripción nula. |
| AUD-07: identidad del contexto durante Fast Refresh | Compartir el contexto y el proveedor en el mismo módulo podía producir `AppProvider requerido` tras cambios de código. Se movieron el contexto y `useApp` a `src/app/store.ts`; el módulo del proveedor exporta únicamente el componente. | Reproducción y repetición real B12; typecheck y build finales correctos. |

También se añadieron casos explícitos en el enrutamiento para `/walkie-talkie`, `/extra` y `/map`. Ya mostraban la pantalla 404 mediante el caso general, pero el prompt pedía rutas explícitas. El resultado visual sigue igual y se comprobó en B11.

Archivos de implementación afectados: `src/domain/service.ts`, `src/services/repository.ts`, `src/pages/Tasks.tsx`, `src/app/context.tsx`, `src/app/store.ts` y `src/app/App.tsx`. Los restantes cambios en páginas y `CountdownDisplay.tsx` solo actualizan la importación de `useApp`. Se añadió `tests/audit.test.ts` y este informe con capturas.

## Matriz de los 20 criterios

**A** = prueba automatizada ejecutada; **N** = recorrido de navegador ejecutado; **E** = revisión estática. «Conforme» se refiere al alcance comprobado, no a las pruebas pendientes de la sección siguiente. Las referencias `ACC-xx` corresponden a nombres dentro de `tests/audit.test.ts`.

| Nº | Criterio | Evidencia ejecutada | Revisión estática | Resultado |
|---|---|---|---|---|
| 1 | Entrada por nombre y rol asignado | A: normalización, duplicados, desconocidos, ACC-01. N: B01. | E: `Login.tsx`, `findUsersByName`, sesión por ID y rol resuelto desde usuarios. | Conforme |
| 2 | Tarea individual y notificación | A: creación, destinatario único, historial. N: B02. | E: `saveTask`, `notify`, `NotificationsPage`. | Conforme, corregido AUD-01/06 |
| 3 | Publicación libre y aceptación STAFF | A: equipo autorizado, restricciones del líder, ACC-03/04. N: B03. | E: `acceptTask` y controles de Tasks. | Conforme |
| 4 | Una tarea aceptada deja de estar disponible | A: segunda aceptación rechazada y desaparición para otro STAFF. N: B03 con Mateo y Elena. | E: comprobación del estado actual y filtros de disponibles. | Conforme; concurrencia entre pestañas pendiente |
| 5 | Solo tres estados | A: los tres estados, rechazo de estado inválido, AUD-01/03. N: B02. | E: tipo `TaskStatus`, selects y validación. | Conforme, corregido AUD-01/03 |
| 6 | STAFF no modifica tareas ajenas | A: llamadas directas rechazadas; matriz administrativa. N: B02/B03/B06. | E: estado solo del responsable; editor solo ADMIN. | Conforme |
| 7 | Líder no crea ni asigna | A: creación/edición/asignación rechazadas; actualización propia permitida. N: B06. | E: controles de líder y permisos centrales. | Conforme |
| 8 | ADMIN gestiona equipos, integrantes y líderes | A: creación, cambio de líder, último ADMIN y tareas sin equipo incoherente. N: B04. | E: `People.tsx`, `saveUser`, `saveTeam`. | Conforme |
| 9 | Acceso autorizado al canal general | A: matriz para ADMIN, líder, STAFF y STAFF sin equipo. N: B05. | E: `accessibleChannels`, `readMessages`, `ChatPage`. | Conforme |
| 10 | Canal de equipo solo para miembros y ADMIN | A: matriz de lectura/publicación, rechazo de canal inexistente. N: B05/B06. | E: validación tanto al consultar como al publicar. | Conforme, endurecido AUD-04 |
| 11 | Mensajes persisten al recargar | A: repositorio reconstruido, ACC-11/14/16/17. N: B05, General. | E: guardado de mensajes en el estado persistido. | Conforme |
| 12 | ADMIN configura y controla countdown | A: permisos, segmentos inválidos, inicio/pausa/reanudar/reinicio/detención. N: B07; líder sin controles en B06. | E: editor, ordenación y restricciones mientras corre. | Conforme en controles comprobados |
| 13 | Avance automático y finalización en 00:00 | A: límites exactos, varios segmentos transcurridos, finalización idempotente. N: B07. | E: cálculo mediante `endsAt`, reconciliación periódica y presentación. | Conforme |
| 14 | Equipo designado incrementa asientos | A: incrementos válidos, cambio de equipo responsable, líder del equipo autorizado. N: B08. | E: `incrementSeats`, `seatTotal`, `SeatsPage`. | Conforme |
| 15 | Otros equipos no modifican el conteo | A: llamadas directas de ajenos y ADMIN rechazadas; valores inválidos rechazados. N: B08. | E: control oculto y validación del servicio. | Conforme |
| 16 | Historial de acciones relevantes | A: creación/asignación/aceptación/edición/estados/asientos y metadatos. N: B09. | E: registros con actor, entidad, tipo y fecha. | Conforme, corregido AUD-05 |
| 17 | Persistencia en el mismo navegador | A: reconstrucción tras cada operación, corrupción, cuota/bloqueo simulados, temporizador persistido. N: B02/B04/B05/B07/B08/B09. | E: repositorio, orden guardar → actualizar UI, claves de localStorage y sessionStorage. | Conforme, corregido AUD-02/03 |
| 18 | ADMIN escritorio y STAFF móvil | N: B10 a 1440, 390 y 320 px. | E: layouts, controles etiquetados, navegación inferior y reglas responsivas existentes. | Conforme en tamaños y vistas probados |
| 19 | Walkie Talkie, Extra y Map → 404 provisional | N: B11, los tres enlaces. | E: rutas explícitas y `NotFoundPage`. | Conforme |
| 20 | Compila y se ejecuta sin errores bloqueantes conocidos | A: test/typecheck/build correctos. N: recorridos B01–B12; sin errores nuevos tras AUD-07. | E: stack/configuración, dependencias e importaciones. | Conforme en entorno local probado |

## Pruebas pendientes y límites

- **No ejecutado:** Safari, Firefox, dispositivos físicos, lector de pantalla y recorrido completo solo con teclado. La inspección de etiquetas y capturas no sustituye esas pruebas.
- **No ejecutado:** cierre y reapertura del proceso completo del navegador, navegación privada, cuota real agotada y localStorage realmente bloqueado en el navegador. Bloqueo, corrupción y fallo de escritura sí se probaron con dobles de almacenamiento; las recargas sí utilizaron localStorage real.
- **No ejecutado:** suspensión real del equipo, cambio manual de su reloj ni aceptación simultánea desde dos pestañas. Los saltos de tiempo se probaron de forma determinista en la lógica. El reloj depende del dispositivo y localStorage no proporciona transacciones entre pestañas.
- **Cobertura parcial de UI:** crear/reordenar/eliminar segmentos, reiniciar/detener desde los diálogos y cambiar el equipo de asientos no se recorrieron en el navegador durante esta auditoría. Se revisó el código; reinicio/detención/designación y validación de segmentos sí tienen pruebas automatizadas. No se afirma cobertura E2E exhaustiva.
- **Compilación de producción:** se generó `dist/`, pero el recorrido interactivo se hizo contra el servidor de desarrollo. No se desplegó ni se probó un hosting externo.
- La aplicación sigue siendo una demo local sin autenticación real ni sincronización. Conocer un nombre permite seleccionar esa identidad; editar el almacenamiento desde herramientas del navegador queda fuera de una garantía de seguridad. Las restricciones auditadas son reglas de interfaz y lógica de negocio.
- No hay garantía de coordinación simultánea entre pestañas o dispositivos. La prueba de aceptación exclusiva es secuencial y usa el estado actualizado.
- Los textos «D−4» y «A 4 días del evento» forman parte del escenario fijo de demostración; no son un contador de días recalculado. El countdown funcional auditado es la secuencia de segmentos.

No queda un bloqueo que requiera instalar algo o conceder un permiso especial adicional para trabajar en el proyecto. No se modificaron los archivos ajenos a la aplicación.

## Capturas de esta auditoría

Estas capturas se generaron en esta ejecución; `staff-mobile.jpg`, de una revisión anterior, no se usa como evidencia actual.

- [Dashboard ADMIN](screenshots/audit-dashboard-desktop.jpg)
- [Countdown finalizado](screenshots/audit-countdown-desktop.jpg)
- [Historial ADMIN](screenshots/audit-history-desktop.jpg)
- [Asientos STAFF en móvil](screenshots/audit-seats-mobile.jpg)

## Repetir las verificaciones

Desde la carpeta del proyecto:

```powershell
npm test
npm run typecheck
npm run build
node node_modules/prettier/bin/prettier.cjs --check src tests
npm run dev -- --port 5174
```

Si PowerShell bloquea `npm.ps1`, usar `npm.cmd`. Para repetir los recorridos con datos iniciales, usar otro puerto disponible o restaurar únicamente el origen de prueba mediante Configuración. No restaurar el origen que contenga trabajo que se quiera conservar.
