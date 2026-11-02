# Comparación visual con los bocetos

Fecha de cierre: 22 de octubre de 2026.

## Alcance y referencias

Se inspeccionaron las cuatro páginas de [HCI-app_sketches.pdf](HCI-app_sketches.pdf), incluidas las anotaciones de ADMIN (páginas 1–2) y STAFF (páginas 3–4), mediante sus imágenes renderizadas. Se contrastaron con la sección 6 de [MASTER_PROMPT.md](MASTER_PROMPT.md), que concreta qué elementos del boceto forman parte de esta demostración.

También se inspeccionó la imagen `PlayStation 4 Ragnarök Gaming Bundle.png` de la raíz: corresponde a una consola y mandos, no a un boceto de la aplicación. Las capturas anteriores de `docs/screenshots/` documentan la implementación; no se trataron como referencias originales.

Los cambios de esta revisión se limitan a presentación y accesibilidad de los componentes existentes en `src/styles.css`, `src/app/App.tsx` y `src/pages/Tasks.tsx`. No se añadieron funciones, dependencias ni cambios en los servicios de negocio, permisos o almacenamiento.

## Comparación y correcciones

| Elemento solicitado                | Observación inicial                                                                                                                                                          | Resultado                                                                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADMIN: menú, tabla y panel derecho | Las tres zonas existían, pero el encabezado y las tarjetas de resumen desplazaban la tabla demasiado abajo.                                                                  | Se redujeron espacios y elementos decorativos redundantes. La tabla gana protagonismo sin eliminar columnas, filtros ni acciones.                               |
| Menú ADMIN y Countdown             | Countdown ya llevaba a los controles. En pantallas bajas, el perfil y los últimos enlaces quedaban fuera de alcance; el menú móvil oculto seguía disponible para el teclado. | El menú permite desplazamiento vertical. El menú cerrado también se oculta de la navegación asistida; el botón comunica su estado y el panel que controla.      |
| Panel derecho                      | El selector Chat/To-do quedaba muy abajo. Al limitar la altura del panel, las tarjetas podían comprimirse y recortar el enlace del countdown.                                | Tarjetas más compactas, sin contracción; panel adherente y desplazable en escritorio. Se conserva acceso a los contenidos y páginas completas.                  |
| Chat/To-do                         | La alternancia funcionaba, pero el estado seleccionado no estaba comunicado por el botón.                                                                                    | Se conserva el componente y su comportamiento; se añade `aria-pressed` y controles de al menos 44 px de alto.                                                   |
| STAFF: cuatro secciones            | Cabecera, tareas, accesos y navegación existían. Los accesos rápidos comenzaban fuera del primer viewport de 390 × 844.                                                      | Cabecera y resumen más compactos; área de tareas con desplazamiento interno cuando hace falta; accesos rápidos visibles antes y navegación inferior conservada. |
| Banner Online                      | Existente, con aclaración de demo local.                                                                                                                                     | Se conserva «Demo local · Sin sincronización», se mejora contraste y se permite envolver el texto. No se añade detección de conectividad.                       |
| Legibilidad y controles móviles    | Había controles pequeños, textos secundarios muy claros y poco espacio para filtros en móviles estrechos.                                                                    | Áreas de cabecera y filtros de 44 px, accesos de al menos 60/72 px, navegación inferior de al menos 48 px, contraste más oscuro y filtros adaptables.           |
| Móviles de 320 px                  | Cuatro accesos en una sola fila resultaban estrechos.                                                                                                                        | Accesos en dos columnas y filtros en dos filas. Se mantiene desplazamiento vertical para no comprimir el contenido.                                             |
| Textos largos                      | Una descripción sin espacios podía desbordar el detalle de la tarea.                                                                                                         | Ajuste de palabras en títulos, vista previa y detalle; columnas del detalle pueden reducirse. No se oculta ni trunca la descripción.                            |
| Notificaciones en ADMIN móvil      | Una regla que pretendía ocultar ayuda también ocultaba el enlace de notificaciones.                                                                                          | Se acota la regla al botón de ayuda y se conserva la campana.                                                                                                   |
| Walkie Talkie, Extra y Map         | Rutas provisionales existentes.                                                                                                                                              | Se comprobó que las tres abren la pantalla 404 prevista, con regreso a Home. No se implementaron audio, mapa ni funciones Extra.                                |

## Evidencia de distribución

Mediciones del DOM renderizado, en píxeles CSS, con el documento en su posición inicial. Son observaciones del escenario probado, no garantías para cualquier cantidad de contenido.

| Vista y elemento                                |   Antes | Después |
| ----------------------------------------------- | ------: | ------: |
| ADMIN, 1440 × 810: comienzo del panel de tareas | y ≈ 484 | y ≈ 315 |
| ADMIN, 1440 × 810: comienzo de la tabla         | y ≈ 631 | y ≈ 437 |
| ADMIN, 1440 × 810: selector Chat/To-do          | y ≈ 698 | y ≈ 550 |
| STAFF, 390 × 844: comienzo del panel de tareas  | y ≈ 441 | y ≈ 311 |
| STAFF, 390 × 844: comienzo de accesos rápidos   | y ≈ 890 | y ≈ 676 |

En el escenario inicial de ADMIN se pasó de aproximadamente una fila completa y otra parcial a cinco filas completas visibles. En STAFF, con la única tarea inicial de Mateo, los cuatro accesos terminan aproximadamente en y = 771 y la navegación inferior comienza en y = 775: las cuatro secciones quedan accesibles en el primer viewport. Con más tareas, la lista se desplaza; con pantallas más estrechas o bajas también se necesita desplazamiento de página.

Capturas conservadas:

- [ADMIN antes](screenshots/visual-admin-before.jpg) y [ADMIN después](screenshots/visual-admin-after.jpg), viewport de 1440 × 810.
- [STAFF antes](screenshots/visual-staff-before.jpg) y [STAFF después](screenshots/visual-staff-after.jpg), navegador configurado a 390 × 844. La captura anterior es de página completa y la posterior del viewport; las mediciones de la tabla anterior usan el mismo viewport y no comparan la altura de ambos archivos.
- [Detalle con texto largo en móvil de 320 px](screenshots/visual-task-long-mobile.jpg), desplazado hasta los controles inferiores para comprobar que siguen accesibles.

## Comprobaciones ejecutadas

### Navegador

Recorridos interactivos con herramientas en el navegador integrado basado en Chromium. Son pruebas ejecutadas, pero no constituyen una suite E2E automatizada incorporada al proyecto.

La revisión se hizo en `http://127.0.0.1:5176/`, con almacenamiento independiente de los otros puertos de desarrollo. Se creó una tarea sintética de descripción larga asignada a Mateo para probar envoltura y desplazamiento; no se alteraron datos iniciales del código ni se reinició el almacenamiento de los otros orígenes.

| Prueba                                        | Resultado observado                                                                                                                                                                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADMIN 1440 × 810                              | Tres zonas, tabla prioritaria y selector contextual visibles.                                                                                                                                                                                           |
| ADMIN 1280 × 720                              | Tres zonas utilizables, sin desbordamiento horizontal del documento ni de la tabla en el escenario probado. Menú y panel permiten desplazamiento; enlace del countdown sin recorte tras la corrección.                                                  |
| ADMIN 1024 × 768                              | Panel contextual pasa debajo del contenido central, sin desbordamiento horizontal del documento.                                                                                                                                                        |
| ADMIN 768 × 1024                              | Menú desplegable abre y cierra. Cerrado no aparece en la navegación accesible; `aria-expanded` vuelve a `false`. La campana permanece visible.                                                                                                          |
| Countdown del menú ADMIN                      | Abre los controles de secuencia y cierra el menú móvil. No se modificó la secuencia durante esta revisión visual.                                                                                                                                       |
| Selector contextual                           | Chat muestra General; To-do muestra las tareas y acceso a la lista completa. Los botones reflejan la selección.                                                                                                                                         |
| STAFF 390 × 844, 360 × 800 y 320 × 740        | Sin desbordamiento horizontal del documento en las vistas de tareas revisadas. A 320 px, filtros en dos filas y accesos en dos columnas.                                                                                                                |
| Lista STAFF con varias tareas                 | Desplazamiento por teclado hasta la siguiente tarjeta; se abrió su detalle. La región tiene nombre y foco visible.                                                                                                                                      |
| Descripción extensa y palabra sin separadores | Tabla ADMIN y tarjeta STAFF envuelven el texto. El control de estado sigue alcanzable por teclado. El detalle corregido no presenta desbordamiento horizontal a 390 ni a 320 px; los controles inferiores se alcanzan mediante desplazamiento vertical. |
| Tasks, Chat y Channel                         | Abren sus páginas correspondientes. Channel muestra General y Técnica para Mateo.                                                                                                                                                                       |
| Walkie Talkie, Extra y Map                    | Las tres rutas muestran «404» y «Esto llegará en otro momento.», con regreso a Home.                                                                                                                                                                    |
| Consola de la pestaña de revisión             | Sin avisos ni errores registrados al finalizar los recorridos.                                                                                                                                                                                          |

### Regresión y compilación

Ejecutadas después del último cambio de código:

| Comprobación                                                    | Resultado                                                                     |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `npm test`                                                      | **40/40 pruebas correctas**, 0 fallos, 0 omitidas.                            |
| `npm run typecheck`                                             | Correcto, salida 0.                                                           |
| `npm run build`                                                 | Correcto, salida 0. TypeScript y Vite 7.3.7; 1592 módulos, salida en `dist/`. |
| `node node_modules/prettier/bin/prettier.cjs --check src tests` | Correcto.                                                                     |

La suite comprueba acceso por nombre, permisos, asignación y aceptación, estados, notificaciones, canales, countdown, asientos, historial y repositorio. No se presenta esta suite de dominio como prueba automatizada de geometría o accesibilidad visual. Los recorridos funcionales extensos de la auditoría anterior se documentan por separado en [FUNCTIONAL_AUDIT.md](FUNCTIONAL_AUDIT.md); no se afirma que todos se hayan repetido en esta revisión visual.

### Revisión estática

Se revisaron los componentes de distribución, tabla/tarjetas, detalle, navegación y estilos responsive, además de las rutas y condiciones existentes por rol. Los atributos de accesibilidad y las regiones desplazables no introducen mutaciones de negocio. Las rutas 404 continúan explícitas y los accesos a páginas completas permanecen en el panel contextual.

## Diferencias conservadas y límites pendientes

- El boceto ADMIN incluye vídeo y una casilla binaria de tarea. Se mantienen conteo de asientos y los tres estados del prompt principal; no se implementan vídeo ni audio.
- Se conserva la tabla con descripción primero y el botón «Nueva tarea» sobre la tabla, en lugar de trasladarlos a posiciones exactas del dibujo. Ambos componentes ya son funcionales y su ubicación mantiene próxima la acción y su contenido.
- Se conserva la paleta y el sistema de componentes existentes. La comparación busca la distribución conceptual; no reproduce papel cuadriculado, porcentajes exactos ni el dibujo de los iconos.
- En tablet, el panel ADMIN se apila; en móviles estrechos se necesita desplazamiento vertical. Las regiones de tareas y el panel contextual también pueden desplazarse internamente cuando hay contenido abundante. No se fuerza toda la aplicación a caber en una pantalla.
- Se probaron dimensiones de viewport, no teléfonos físicos. Quedan pendientes Safari/iOS, Firefox, teclado virtual móvil, lectores de pantalla reales, zoom de 200 % y una auditoría completa de contraste/accesibilidad. No se afirma conformidad WCAG a partir de esta revisión.
- La suite existente no contiene comparaciones automáticas de capturas. Las capturas y mediciones documentan los escenarios recorridos; no cubren todos los datos, rutas, idiomas o tamaños posibles.

No hizo falta instalar software ni solicitar permisos especiales nuevos para las correcciones.
