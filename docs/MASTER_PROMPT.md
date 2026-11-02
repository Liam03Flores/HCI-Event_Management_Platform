# MASTER PROMPT — Event Management Platform

## 1. Rol y objetivo

Actúa como un **Senior Frontend Engineer, Software Architect y UX Engineer**, con experiencia en React, TypeScript, aplicaciones de gestión operativa, diseño responsive y desarrollo asistido por IA.

Tu tarea es desarrollar una primera versión funcional de una aplicación web llamada **Event Management Platform**, basada en las especificaciones siguientes.

Debes trabajar directamente sobre los archivos del proyecto abierto en VS Code, si tu entorno dispone de acceso al sistema de archivos y terminal. No te limites a explicar cómo se podría desarrollar: inspecciona el proyecto, implementa las funcionalidades, ejecuta las verificaciones disponibles y corrige los errores que encuentres.

El producto se utilizará para demostrar un escenario realista de organización de un evento cuatro días antes de su realización. Es una versión ligera de la plataforma prevista, no el sistema completo de producción.

**No empieces con una implementación improvisada.** Primero inspecciona el proyecto, identifica su estado y presenta un plan breve. Después avanza por etapas, verificando cada una antes de continuar.

## 2. Contexto del producto

Event Management Platform es una aplicación de coordinación operativa para eventos organizados, como conciertos, producciones teatrales, recitales y conferencias.

Su objetivo es centralizar:

- Organización y seguimiento de tareas.
- Asignación de responsabilidades.
- Coordinación de equipos.
- Comunicación mediante chat.
- Control temporal mediante countdown por segmentos.
- Conteo operativo de asientos.
- Notificaciones internas e historial de actividad.

La plataforma se utiliza tanto durante la preparación previa como durante el evento en vivo. Para la demostración, considera un evento que se encuentra a cuatro días de realizarse, con tareas activas y movimiento moderado.

No es una plataforma de venta de boletos, reservas, descubrimiento de eventos ni una red social.

## 3. Alcance técnico

### Tecnologías

Utiliza:

- React para construir las interfaces.
- TypeScript para definir tipos y detectar errores.
- Vite como entorno de desarrollo y compilación.
- Tailwind CSS para el diseño responsive.
- Lucide React para los iconos.
- `localStorage` para persistir los datos de demostración en el navegador.

Antes de instalar dependencias, inspecciona `package.json`, los archivos de configuración y la estructura existente. Reutiliza las dependencias compatibles y evita instalar paquetes innecesarios.

Si el proyecto todavía no existe, crea una aplicación React + TypeScript con Vite y configura Tailwind según una versión compatible. No mezcles instrucciones de configuración de distintas versiones.

### Arquitectura

Implementa una arquitectura frontend modular, con separación entre:

1. Componentes visuales.
2. Páginas y navegación.
3. Tipos y modelos de datos.
4. Lógica de negocio y validaciones.
5. Servicios de datos y persistencia local.
6. Datos iniciales de demostración.

Los componentes de interfaz no deben modificar directamente `localStorage`. Utiliza una capa de servicios o repositorio que centralice las operaciones de lectura, escritura y actualización.

Mantén las reglas de negocio independientes de la tecnología de almacenamiento. En el futuro se pretende sustituir el repositorio local por una integración con Supabase y PostgreSQL, sin tener que rehacer las interfaces.

No implementes backend, Supabase, PostgreSQL, APIs propias, sincronización entre dispositivos ni microservicios en esta etapa.

### Persistencia

Los datos deben conservarse al recargar la página y al cerrar y volver a abrir el navegador en el mismo perfil, siempre que el almacenamiento local no se haya borrado.

Define una estrategia de inicialización, versionado básico del esquema local y manejo de datos corruptos o incompatibles. No sobrescribas los datos guardados cada vez que se inicia la aplicación.

El sistema debe poder cargar datos de demostración iniciales cuando no existan datos previos. Ofrece un mecanismo claro para restaurar los datos de ejemplo durante las pruebas, sin borrar información de manera inesperada.

La persistencia local no equivale a una base de datos compartida: los cambios no se sincronizan entre dispositivos ni entre perfiles de navegador.

## 4. Roles y permisos

Existen tres roles funcionales:

### ADMIN

Puede:

- Consultar el estado general del evento.
- Crear, editar y supervisar tareas.
- Asignar tareas a una persona concreta o publicarlas como tareas libres.
- Gestionar usuarios, equipos, integrantes y líderes.
- Designar el equipo responsable del conteo de asientos.
- Configurar y controlar los segmentos del countdown.
- Consultar el total de asientos contabilizados.
- Consultar el chat general y los canales de equipo.
- Publicar en el canal general y en los canales de equipo.
- Consultar notificaciones e historial de actividad.

### Líder de equipo

Puede:

- Consultar las tareas y la actividad de su equipo.
- Coordinar a los integrantes de su equipo.
- Participar en los canales autorizados.

**El líder no puede crear ni asignar tareas.** No le concedas permisos de asignación, ni siquiera dentro de su propio equipo. ADMIN es quien administra tareas, usuarios, equipos y roles.

### STAFF

Puede:

- Consultar las tareas asignadas.
- Consultar las tareas libres disponibles.
- Aceptar una tarea libre.
- Cambiar el estado de las tareas que tiene permitido gestionar.
- Recibir notificaciones internas.
- Consultar y utilizar los canales a los que tiene acceso.
- Participar en el conteo de asientos únicamente si pertenece al equipo designado.
- Consultar el countdown.

### Reglas generales de permisos

Los permisos deben validarse en la lógica de negocio, no solo ocultando botones. Las acciones no permitidas deben rechazarse incluso si se invoca directamente el método correspondiente.

Como no existe backend ni autenticación real, estos controles sirven para la demostración funcional, no como mecanismo de seguridad para producción.

## 5. Entrada por nombre

No implementes registro con correo, contraseña, OAuth ni proveedores de autenticación.

La pantalla inicial debe solicitar el nombre del usuario. La aplicación busca ese nombre en la lista local de usuarios configurada por ADMIN y obtiene el rol asignado.

- El usuario no debe poder elegir arbitrariamente su propio rol.
- Si no se encuentra el nombre, muestra un mensaje claro.
- Si existen nombres duplicados, evita iniciar una sesión ambigua. Ofrece una forma de distinguir los usuarios, por ejemplo mostrando el nombre y el equipo.
- Debe existir una acción para cerrar sesión y regresar a la pantalla de entrada.
- Para probar los distintos roles, una persona podrá cerrar sesión e ingresar con otro usuario de demostración en el mismo navegador.
- ADMIN necesita una forma sencilla de asignar roles y equipos a los usuarios de ejemplo.

No presentes esta entrada como autenticación segura. La aplicación es una demostración local.

## 6. Diseño de las interfaces

Utiliza los bocetos proporcionados por el usuario como referencia principal. Si están adjuntos al proyecto o a la conversación, revísalos antes de implementar.

Respeta su distribución conceptual, pero conviértela en una interfaz moderna, coherente, legible y funcional. No es necesario reproducir literalmente el papel cuadriculado.

Utiliza textos de interfaz en español, salvo términos funcionales que deban conservarse por decisión de diseño, como Tasks, Chat, Home, Map y Profile.

### 6.1 ADMIN — escritorio

Diseña la vista principal para escritorio, con una composición visual cercana a 16:9.

Debe tener tres secciones:

**A. Menú lateral persistente**

Incluye accesos claros para:

- Dashboard.
- Tareas.
- Personal.
- Equipos.
- Canales.
- Countdown.
- Conteo de asientos.
- Chat.
- Actividad o historial.
- Configuración, si es necesaria para gestionar los usuarios y roles de demostración.

El menú debe indicar la sección activa. El acceso a Countdown debe abrir los controles de la secuencia temporal.

**B. Sección central de tareas**

La tabla es el elemento principal de la vista ADMIN.

Incluye, como mínimo:

- Responsable.
- Descripción.
- Equipo.
- Prioridad.
- Estado.
- Fecha límite.

Los estados permitidos son únicamente:

- Pendiente.
- En curso.
- Completada.

Las tareas libres sin responsable deben identificarse claramente como disponibles. No crees estados adicionales como bloqueada, aprobada o cancelada sin autorización del usuario.

La tabla debe permitir consultar las tareas y abrir su detalle. Incluye acciones para crear y editar tareas, con controles de permisos.

**C. Panel derecho contextual**

Divide el panel en cuatro partes:

1. Countdown del acto o segmento actual.
2. Conteo de asientos, con total acumulado.
3. Vista previa del chat o de la lista de tareas.
4. Control para alternar entre las vistas previas de Chat y To-do.

El panel derecho es una vista previa. La aplicación también debe ofrecer acceso a las páginas completas de chat y tareas.

### 6.2 STAFF — móvil

Diseña una interfaz vertical, optimizada para una pantalla cercana a 9:20, sin fijar dimensiones que impidan su adaptación a otros teléfonos.

Debe tener cuatro secciones:

**A. Cabecera**

- Nombre del evento.
- Countdown del segmento actual.
- Información de perfil.
- Botón de ayuda.

**B. Área principal modular**

La vista inicial debe mostrar las tareas.

Incluye un banner visual de conexión en la parte superior, con el estado Online.

En esta versión no implementes detección avanzada de desconexión, cola offline, sincronización ni resolución de conflictos. El banner representa el estado previsto para la demostración; no debe fingir que existe sincronización real.

La lista de tareas debe distinguir las asignadas de las disponibles. Las tarjetas deben ser legibles y fáciles de tocar.

**C. Accesos rápidos**

Incluye cuatro accesos grandes:

- Tasks.
- Chat.
- Walkie Talkie.
- Channel.

Tasks abre las tareas; Chat abre la comunicación; Channel permite seleccionar el canal general o un canal de equipo al que el usuario tenga acceso.

Walkie Talkie debe permanecer visible, pero su destino será una página 404 provisional. No implementes audio, permisos de micrófono ni comunicación por voz.

**D. Navegación inferior**

Incluye:

- Home.
- Extra.
- Map.
- Profile.

Extra y Map deben permanecer como accesos visuales sin funcionalidad real. Al pulsarlos, deben navegar a páginas 404 provisionales.

No desarrolles un mapa ni inventes una función para Extra.

### 6.3 Diseño visual

- Utiliza jerarquía tipográfica clara y una paleta consistente.
- Prioriza legibilidad, contraste y estados visuales comprensibles.
- Usa botones suficientemente grandes en móvil.
- Evita interfaces recargadas y decoraciones que compitan con las tareas.
- Asegura que las tablas y los paneles sigan siendo utilizables en pantallas más pequeñas.
- Utiliza componentes reutilizables para botones, campos, tarjetas, badges de estado, navegación y modales.
- Incluye estados vacíos, mensajes de confirmación y mensajes de error comprensibles.
- No copies nombres, fechas, cifras ni datos ficticios de las imágenes de referencia como si fueran datos reales del evento.

## 7. Modelo de datos

Define tipos TypeScript explícitos para las entidades principales. Adapta los nombres técnicos si mejora la consistencia, pero conserva los conceptos.

### Usuario

Debe incluir, al menos:

- Identificador estable.
- Nombre.
- Rol: ADMIN, TEAM_LEADER o STAFF.
- Identificador de equipo, cuando corresponda.

### Equipo

Debe incluir:

- Identificador.
- Nombre.
- Integrantes.
- Líder asignado, si existe.
- Información necesaria para identificar al equipo autorizado para el conteo de asientos.

Un usuario pertenece al equipo que le corresponda. Si la aplicación necesita admitir más de un equipo por usuario, documenta esa decisión y evita introducirla sin necesidad.

### Tarea

Debe incluir:

- Identificador.
- Descripción.
- Prioridad.
- Fecha límite opcional.
- Equipo responsable.
- Tipo de asignación: individual o libre.
- Responsable, cuando esté asignada.
- Estado: Pendiente, En curso o Completada.
- Fecha de creación.
- Usuario creador.
- Fecha de última modificación.
- Información mínima para el historial.

Los campos de prioridad, fecha límite, equipo y descripción son requisitos del formulario de tarea.

Una tarea libre empieza sin responsable. Una tarea individual debe tener un responsable seleccionado.

### Mensaje

Debe incluir:

- Identificador.
- Canal de destino.
- Autor.
- Contenido.
- Fecha y hora.

No implementes conversaciones vinculadas a tareas ni mensajes privados.

### Canal

Debe distinguir:

- Canal general.
- Canal de equipo.

Cada canal de equipo está asociado a un equipo determinado.

### Countdown

Debe representar:

- Secuencia de segmentos.
- Nombre de cada segmento.
- Duración.
- Posición en la secuencia.
- Segmento actual.
- Estado de ejecución: detenido, en marcha, pausado o terminado.
- Información temporal necesaria para calcular el tiempo restante.

### Conteo de asientos

Debe almacenar:

- Total acumulado.
- Incrementos realizados.
- Usuario que realizó cada incremento.
- Fecha y hora de cada registro.

El total debe poder reconstruirse a partir de los incrementos almacenados.

### Notificaciones

Deben incluir:

- Identificador.
- Usuario destinatario.
- Tipo de notificación.
- Mensaje.
- Fecha y hora.
- Estado de lectura.
- Referencia a la tarea, cuando corresponda.

### Historial de actividad

Debe registrar:

- Creación de tareas.
- Asignaciones.
- Cambios de estado.
- Modificaciones de tareas.
- Incrementos del conteo de asientos.

Cada registro debe incluir el actor, la fecha y hora, el tipo de acción y la entidad afectada.

## 8. Reglas de negocio

### 8.1 Creación y asignación de tareas

ADMIN puede crear:

**Tarea individual**
- ADMIN selecciona una persona.
- La tarea se asigna inmediatamente.
- El destinatario recibe una notificación interna.
- No se exige confirmación de recepción ni aceptación.

**Tarea libre**
- ADMIN publica la tarea sin responsable.
- La tarea aparece en la lista de disponibles para el personal autorizado.
- STAFF puede pulsar Aceptar tarea.
- La operación debe comprobar que la tarea sigue disponible.
- Una vez aceptada, se asigna al usuario y desaparece de la lista de disponibles.
- Si otro usuario intenta aceptarla después, la interfaz debe mostrar que ya no está disponible.

Aunque los datos sean locales, centraliza la validación de aceptación para que la regla se pueda reutilizar en una futura implementación con servidor.

Los líderes no pueden crear ni asignar tareas.

### 8.2 Actualización de tareas

STAFF puede cambiar el estado de las tareas que tenga asignadas. No debe poder cambiar arbitrariamente el responsable, la prioridad, el equipo o la fecha límite.

ADMIN puede editar los campos de las tareas.

El líder puede consultar y coordinar las tareas de su equipo, pero no asignarlas ni modificar sus responsables.

Cada modificación relevante debe producir una entrada en el historial.

### 8.3 Chat y canales

Implementa un canal general y canales por equipo.

- ADMIN puede leer y publicar en el canal general y en los canales de equipo.
- Los usuarios pueden leer y publicar en el canal general según las reglas de acceso de la aplicación.
- En un canal de equipo, solo sus integrantes y ADMIN pueden leer y publicar.
- Los usuarios que no pertenezcan a un equipo no deben acceder a su canal.
- Los líderes usan el canal de su equipo con los mismos permisos de publicación que los demás integrantes.
- No hay mensajes privados ni conversaciones por tarea.

Los mensajes nuevos deben aparecer en la interfaz sin recargar la página. Utiliza el estado compartido local de la aplicación.

No implementes actualizaciones entre dispositivos.

### 8.4 Notificaciones

Implementa notificaciones dentro de la aplicación, no correos, SMS ni notificaciones push.

Genera notificaciones para:

- Nuevas asignaciones individuales.
- Aceptación de una tarea libre, con aviso a ADMIN y a los usuarios relevantes si corresponde.
- Cambios importantes de una tarea que afecten al usuario o equipo correspondiente.

Evita generar notificaciones redundantes por cada renderizado. Una notificación debe generarse por una acción de negocio y persistirse como dato.

Incluye un indicador de notificaciones no leídas y una vista sencilla para consultarlas y marcarlas como leídas.

### 8.5 Countdown

ADMIN puede configurar la secuencia de segmentos y la duración de cada uno.

Debe poder:

- Crear y editar segmentos.
- Ordenarlos.
- Iniciar la secuencia.
- Pausarla.
- Reanudarla.
- Reiniciar el segmento actual.

Al finalizar un segmento, el sistema avanza automáticamente al siguiente. Cuando termina el último, el contador muestra 00:00 y la secuencia queda marcada como terminada.

STAFF solo consulta el countdown.

El cálculo del tiempo no debe depender de restar uno por cada renderizado o de asumir que los intervalos se ejecutan con precisión perfecta. Calcula el tiempo restante a partir de referencias temporales y actualiza la presentación periódicamente.

No avances al siguiente segmento varias veces por un mismo vencimiento. Evita que el contador continúe en negativo o reinicie inesperadamente.

### 8.6 Conteo de asientos

ADMIN designa el equipo responsable.

Solo los integrantes de ese equipo pueden registrar incrementos. ADMIN puede consultar el total, pero el conteo operativo corresponde al equipo designado.

La interfaz debe incluir un control claro para registrar un incremento y mostrar el total acumulado.

Cada incremento debe registrarse en el historial, con usuario y fecha. No permitas que un usuario ajeno al equipo modifique el total mediante la interfaz ni mediante una llamada directa a la lógica de negocio.

### 8.7 Historial de actividad

Crea una vista sencilla para consultar la actividad registrada.

Permite identificar qué usuario realizó una acción, qué cambió y cuándo ocurrió. No es necesario desarrollar analítica avanzada, exportaciones ni reportes complejos.

### 8.8 Persistencia local

Implementa operaciones centralizadas para:

- Cargar los datos.
- Guardar los cambios.
- Inicializar datos de ejemplo.
- Actualizar entidades.
- Registrar actividad.
- Gestionar errores de almacenamiento.

Evita guardar objetos duplicados o sobrescribir cambios por actualizaciones de estado desactualizadas.

Documenta cómo restaurar los datos de demostración.

## 9. Datos de demostración

Incluye datos de ejemplo suficientes para probar los flujos completos:

- Un evento.
- Un usuario ADMIN.
- Varios equipos.
- Un líder por lo menos.
- Varios usuarios STAFF.
- Un equipo designado para el conteo de asientos.
- Tareas individuales.
- Tareas libres.
- Tareas en diferentes estados.
- Segmentos de countdown.
- Mensajes en el canal general y en canales de equipo.
- Notificaciones.
- Historial inicial, si es útil.

Utiliza nombres y cifras claramente ficticios y coherentes. No presentes los datos de demostración como información de un evento real.

Los datos iniciales deben cargarse solo cuando corresponda, no cada vez que se abre la aplicación. Los cambios hechos durante la demostración deben persistir en el mismo navegador.

## 10. Navegación y rutas

Organiza la navegación de manera consistente entre ADMIN y STAFF.

Las rutas pueden seguir una estructura sencilla, por ejemplo:

- Dashboard de ADMIN.
- Tareas.
- Personal y equipos.
- Canales y chat.
- Countdown.
- Conteo de asientos.
- Actividad.
- Home de STAFF.
- Tareas de STAFF.
- Chat.
- Perfil.
- Página 404 provisional.

Adapta los nombres y rutas a la estructura real del proyecto. Evita instalar un sistema de enrutamiento adicional si el proyecto ya cuenta con uno compatible.

Walkie Talkie, Extra y Map deben llevar a páginas 404 provisionales mediante rutas explícitas. El error debe ser una pantalla intencional de la aplicación, no un fallo de compilación ni una excepción de JavaScript.

## 11. Accesibilidad y experiencia de usuario

- Usa etiquetas asociadas a los campos.
- Permite navegar por controles mediante teclado cuando corresponda.
- No comuniques los estados solo mediante colores.
- Añade texto legible a los iconos de navegación o sus etiquetas accesibles.
- Muestra confirmaciones al completar acciones importantes.
- Muestra errores claros si falla una operación.
- Evita borrar o reemplazar datos sin confirmación cuando la acción pueda ocasionar pérdida de trabajo.
- Diseña STAFF para uso móvil, con acciones primarias fáciles de tocar.
- Diseña ADMIN para supervisión rápida en escritorio, con una tabla legible y un panel contextual.

## 12. Funcionalidades fuera del alcance

No implementes ahora:

- Supabase o PostgreSQL.
- Backend propio.
- Sincronización entre dispositivos.
- Autenticación real.
- Correo, contraseñas u OAuth.
- Funcionamiento offline, cola de acciones o resolución de conflictos.
- Audio en tiempo real o walkie-talkie funcional.
- Mapa funcional.
- Función para Extra.
- Chat privado.
- Conversaciones asociadas a tareas.
- Venta de boletos o gestión de reservas.
- Gestión de múltiples eventos con aislamiento completo.
- Analítica avanzada.
- Permisos de asignación para líderes de equipo.

Los botones de Walkie Talkie, Extra y Map deben permanecer visibles y llevar a una página 404 provisional.

## 13. Fases de implementación

Trabaja en las siguientes fases, en este orden.

### Fase 0 — Inspección y plan

- Inspecciona la carpeta y los archivos.
- Identifica el estado actual del proyecto.
- Comprueba las versiones de Node.js, npm y las dependencias relevantes cuando el entorno lo permita.
- Identifica bocetos o documentación disponible.
- Presenta un plan breve y los posibles riesgos.
- No sobrescribas archivos existentes sin comprender su función.

### Fase 1 — Fundación

- Configura o verifica React, TypeScript, Vite y Tailwind.
- Define los tipos de datos.
- Organiza carpetas, componentes y servicios.
- Implementa persistencia local y carga de datos de demostración.
- Implementa navegación y entrada por nombre.

### Fase 2 — Interfaces

- Construye el layout de ADMIN.
- Construye el layout móvil de STAFF.
- Implementa la navegación, los componentes compartidos y los estados visuales.
- Comprueba el diseño en escritorio y móvil.

### Fase 3 — Tareas y permisos

- Implementa creación y edición.
- Implementa asignación individual.
- Implementa tareas libres y aceptación.
- Implementa los estados.
- Implementa las validaciones de permisos.
- Añade notificaciones e historial.

### Fase 4 — Comunicación

- Implementa el canal general.
- Implementa los canales de equipo.
- Aplica permisos de lectura y publicación.
- Implementa persistencia de mensajes.

### Fase 5 — Countdown y conteo de asientos

- Implementa la secuencia temporal.
- Implementa el avance automático entre segmentos.
- Implementa la finalización en 00:00.
- Implementa el conteo acumulado y las restricciones del equipo autorizado.

### Fase 6 — Verificación

- Ejecuta las verificaciones disponibles.
- Corrige errores de TypeScript, compilación y ejecución.
- Prueba los flujos principales y los permisos.
- Comprueba que los datos persisten al recargar.
- Comprueba que las rutas provisionales funcionan.
- Revisa la presentación en escritorio y móvil.
- Resume lo implementado, las pruebas realizadas y cualquier limitación pendiente.

No declares una prueba exitosa si no la has ejecutado realmente.

## 14. Criterios de aceptación

La primera versión se considera funcional cuando se cumplen estos puntos:

1. Un usuario puede entrar por nombre y obtiene el rol previamente asignado.
2. ADMIN puede crear una tarea individual y el usuario asignado recibe una notificación interna.
3. ADMIN puede publicar una tarea libre y STAFF puede aceptarla.
4. Una tarea libre aceptada deja de estar disponible.
5. Las tareas admiten únicamente los estados Pendiente, En curso y Completada.
6. STAFF no puede modificar arbitrariamente tareas de otras personas.
7. El líder no puede crear ni asignar tareas.
8. ADMIN puede gestionar equipos, integrantes y líderes.
9. ADMIN y los usuarios autorizados pueden utilizar el canal general.
10. Solo integrantes del equipo y ADMIN pueden publicar en el canal de ese equipo.
11. Los mensajes persisten al recargar la página.
12. ADMIN puede configurar y controlar el countdown.
13. La secuencia avanza entre segmentos y termina en 00:00.
14. El equipo designado puede incrementar el conteo de asientos.
15. Otros equipos no pueden modificarlo.
16. El historial registra las acciones relevantes definidas en este documento.
17. Los datos persisten en el mismo navegador.
18. La interfaz ADMIN funciona en escritorio y STAFF se adapta a móvil.
19. Walkie Talkie, Extra y Map conducen a una página 404 provisional.
20. La aplicación puede compilarse y ejecutarse sin errores conocidos que impidan su uso.

## 15. Reglas de trabajo para el agente

- No inventes funcionalidades que contradigan estas especificaciones.
- Si encuentras una ambigüedad que bloquea una decisión arquitectónica importante, pregunta antes de implementar esa parte.
- Para detalles menores, elige la solución más simple y coherente, y documenta la decisión.
- No sustituyas datos reales del proyecto por datos ficticios sin motivo.
- No añadas dependencias por comodidad cuando puedas resolver el problema con el stack existente.
- No dejes botones principales sin comportamiento.
- No simules funcionalidades fuera de alcance como si fueran reales.
- No ocultes errores de compilación o ejecución.
- No afirmes que existe sincronización entre dispositivos.
- Mantén el código legible, tipado y modular, con nombres claros.
- Evita abstraer en exceso una aplicación de este tamaño.
- Al final de cada fase, resume los archivos principales modificados, las funcionalidades completadas y las verificaciones ejecutadas.

## 16. Primera respuesta esperada

Comienza por la Fase 0.

Primero inspecciona el proyecto y presenta:

1. Un resumen de la estructura existente.
2. Qué tecnologías y dependencias están instaladas.
3. Qué archivos o configuraciones necesitan crearse o modificarse.
4. Un plan de implementación por fases adaptado al estado real del proyecto.
5. Cualquier bloqueo importante que debamos resolver antes de escribir código.

Después de esa inspección, comienza la implementación siguiendo las fases establecidas, salvo que encuentres un bloqueo real que requiera mi intervención.