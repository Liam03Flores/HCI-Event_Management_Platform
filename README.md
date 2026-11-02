# Event Management Platform

Aplicación local de coordinación de eventos. Interfaz en español, con un centro de operaciones para ADMIN y una vista móvil para STAFF y líderes. El evento «Encuentro Aurora» y sus usuarios son ficticios.

## Ejecutar desde VS Code

Abre esta carpeta en VS Code y ejecuta en su terminal:

```powershell
npm install
npm run dev
```

Abre **http://127.0.0.1:5173/**. Mantén la terminal abierta mientras uses la aplicación. Los cambios en el código se reflejan automáticamente.

Si PowerShell no encuentra npm o bloquea `npm.ps1`, usa su ejecutable instalado:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

Requisitos: Node.js 22.18+ o 24 LTS (las pruebas usan soporte nativo de TypeScript). Desarrollo verificado con Node 24.20.0. No requiere Docker, base de datos, claves, cuentas externas ni variables de entorno.

## Entrar a la demostración

Escribe un nombre completo o pulsa un usuario de ejemplo para rellenarlo y luego pulsa **Entrar al espacio**.

| Nombre | Rol | Equipo | Qué probar |
| --- | --- | --- | --- |
| Alex Morgan | ADMIN | Administración | Crear tareas, gestionar equipos, controlar countdown |
| Mateo Ruiz | STAFF | Técnica | Aceptar tareas libres y actualizar tareas propias |
| Sofía Vega | STAFF | Accesos | Contar asientos y consultar tareas |
| Lucía Torres | Líder | Técnica | Consultar tareas y actividad de su equipo |
| Elena Cruz | STAFF | Técnica | Comprobar que una tarea aceptada ya no está disponible |
| Pablo Luna | STAFF | Accesos | Registrar incrementos de asientos |
| Diego Sol | Líder | Producción | Consultar el equipo y sus tareas asignadas |

Para probar otro rol, cierra sesión desde el menú de ADMIN o desde **Profile**. Los roles solo pueden cambiarlos los administradores. La entrada por nombre **no es autenticación segura**.

## Funcionalidades

- Tareas individuales y libres, con prioridad, equipo, responsable y fecha límite opcional.
- Estados exclusivos: Pendiente, En curso y Completada.
- Validaciones de permisos en las operaciones de negocio; los líderes no crean ni asignan tareas.
- Gestión de usuarios, integrantes, equipos y líderes desde ADMIN.
- Canal general y canales privados para integrantes de cada equipo y ADMIN.
- Mensajes, notificaciones internas y registro de actividad persistentes.
- Countdown con segmentos editables y ordenables, inicio, pausa, reanudación, reinicio y avance automático hasta 00:00.
- Conteo de asientos por un equipo designado; el total se reconstruye sumando registros.
- ADMIN con menú, tabla central y panel de countdown/asientos/chat/To-do.
- STAFF con tareas, estado Online de demostración, accesos rápidos y navegación inferior.
- Rutas 404 intencionales para Walkie Talkie, Extra y Map.

## Datos locales y restauración

La aplicación usa `localStorage`, con esquema versión 1 y la clave `event-management-platform:v1`. Solo inicializa datos cuando no existe una copia guardada. Se conserva la sesión por pestaña con `sessionStorage`.

Los datos pertenecen al navegador, perfil y origen utilizados. Usa siempre la misma dirección y puerto: `localhost` y `127.0.0.1` tienen almacenamientos distintos. No hay sincronización entre dispositivos, perfiles o pestañas; realiza la demostración en una sola pestaña cambiando de usuario.

En **Configuración → Restaurar datos de ejemplo**, ADMIN puede reemplazar los cambios por los datos iniciales, después de una confirmación. Se cierra la sesión y la fecha del evento se fija nuevamente cuatro días después de la restauración.

Si los datos están dañados o son incompatibles, la aplicación no los sobrescribe: muestra una pantalla de recuperación con descarga de copia y restauración explícita. Los fallos de escritura se muestran como error y no actualizan el estado de la operación.

## Verificación

```powershell
npm run build
npm test
npm run typecheck
```

- `build`: verifica TypeScript y genera `dist/` con Vite.
- `test`: ejecuta las pruebas de reglas de negocio, permisos, countdown y repositorio con el ejecutor de Node.
- `typecheck`: verifica tipos sin generar la aplicación.
- `format`: aplica el formato de código del proyecto con Prettier (herramienta de desarrollo).

Las pruebas de navegador realizadas y las decisiones del alcance están documentadas en `docs/IMPLEMENTATION.md`.

## Organización del código

```text
src/
  app/          Contexto de estado, navegación y estructura de ADMIN/STAFF
  components/   Controles compartidos, modal y presentación del countdown
  data/         Datos iniciales de demostración
  domain/       Tipos, permisos, operaciones puras y cálculo temporal
  pages/        Entrada, tareas, equipos, personal, chat y operaciones
  services/     Repositorio local y gestión de la sesión
  styles.css    Estilos adaptables y Tailwind
tests/          Pruebas de dominio y persistencia
docs/           Documentación original y registro de implementación
```

Las interfaces no escriben en `localStorage`. `domain/service.ts` valida las operaciones y produce un estado nuevo; `services/repository.ts` lo guarda. Esto permite cambiar el almacenamiento sin reescribir las reglas de negocio.

## Límites intencionales

No incluye backend, Supabase, PostgreSQL, autenticación real, sincronización, funcionamiento offline gestionado, push, correo, audio, mapas, venta de boletos ni múltiples eventos. El banner Online expresa el escenario de demostración y no comprueba conectividad. Los controles locales de rol pueden manipularse desde las herramientas del navegador y no son una barrera de seguridad de producción.

El countdown depende del reloj del dispositivo y continúa según el tiempo transcurrido incluso al cerrar y reabrir la página. Cambiar manualmente ese reloj afecta al contador. Mientras está en marcha o pausado, detén la secuencia antes de editar sus segmentos.

Configuración de herramientas basada en la [guía de Vite](https://vite.dev/guide/) y la [integración oficial de Tailwind con Vite](https://tailwindcss.com/docs/installation/using-vite).
