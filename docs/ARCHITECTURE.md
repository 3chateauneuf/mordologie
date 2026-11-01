# Arquitectura de Planner (Rails)

## Principio obligatorio

Código comprensible para otra persona, con responsabilidades separadas y cambios
pequeños. No añadir CSS ni JavaScript a las vistas ERB. Los controladores no
deben implementar lógica visual ni SQL que pertenezca a un modelo o consulta.
Conservar el comportamiento y los datos durante refactorizaciones.

## Dónde está cada cosa

- `app/controllers/planner_controller.rb`: datos de la agenda y búsqueda.
- `app/controllers/time_blocks_controller.rb`: alta, edición y eliminación,
  parámetros permitidos y autorización sobre el usuario autenticado.
- `app/models/time_block.rb`: reglas y validaciones de bloques y tags.
- `app/views/planner/index.html.erb`: composición de la pantalla.
- `app/views/planner/_week_header.html.erb`: título, semana y acciones.
- `app/views/planner/_week_summary.html.erb`: indicadores semanales.
- `app/views/planner/_calendar.html.erb`: cuadrícula, eventos y navegación.
- `app/views/time_blocks/_form.html.erb`: campos HTML del formulario compartido.
- `app/views/time_blocks/{new,edit}.html.erb`: contenedores de diálogo.
- `public/styles/foundation.css`: estilos generales y calendario base.
- `public/styles/time-block-editor.css`: formulario y reglas responsivas del editor.
- `public/styles/mobile.css`: barra de navegación y vista diaria móvil.
- `public/styles/dialogs.css`: diálogos, overlay, acciones guardar/eliminar.
- `public/scripts/week-calendar.js`: selección de horario y navegación de agenda.
- `public/scripts/time-block-form.js`: duración, tags y validación en el navegador.
- `public/planner-dialog.js`: cierre compartido de diálogos en escritorio.
- `test/`: pruebas de validación, autenticación y operaciones críticas.

Estas rutas estáticas están servidas por Rails desde `public/`. Los scripts
con `defer` se cargan solo en las pantallas que los necesitan. Si se adopta
un pipeline de assets más adelante, migrarlo como una tarea explícita.

## Convención de diálogos

Los diálogos usan `data-planner-dialog`, `data-dismiss-url` y
`data-planner-dialog-panel`. El script compartido proporciona Escape,
clic sobre el fondo y control de foco. No duplicar esa lógica.
En móvil se utiliza una pantalla completa.

## Integridad y despliegues

No modificar la base antigua de Dodonews ni las tablas del Mordologie original.
La rama `planner-rails` se despliega en Railway. Antes de dar una tarea por
finalizada, comprobar las pruebas pertinentes y el estado del despliegue;
un estado `SUCCESS` no equivale a una prueba de interacción en navegador.

## Checklist para cada cambio

1. ¿Puedo explicar qué archivo tiene cada responsabilidad?
2. ¿He evitado duplicaciones y eliminado código muerto?
3. ¿El flujo funciona en escritorio, móvil, teclado y con el usuario actual?
4. ¿Hay una prueba o un procedimiento de verificación reproducible?
5. ¿He confirmado el despliegue sin afirmar pruebas que no ejecuté?

## Inicio de jornada configurable

`users.calendar_start_hour` guarda la preferencia horaria (00–23), con
06:00 por defecto. `CalendarPreferencesController` valida y guarda únicamente
en la cuenta autenticada. La agenda muestra desde esa hora y amplía el rango
automáticamente cuando hay bloques anteriores. En móvil no se autodesplaza al
primer bloque; se respeta el inicio de jornada. Las actividades anteriores
no fuerzan el comienzo del calendario: aparece un acceso explícito para mostrar
las horas previas, y las actividades que cruzan el inicio siguen visibles.
La selección de hora es un formulario compacto que se guarda al cambiar
(`public/scripts/calendar-preferences.js`) y conserva un botón accesible sin JS.
Sus estilos viven en `public/styles/calendar-preferences.css` y deben mantener
la cabecera estable en escritorio y móvil.

Para cambiar este comportamiento, actualizar modelo, migración, controlador,
vista y pruebas de forma conjunta. No guardar esta preferencia en localStorage.

## Validación visual de la agenda

Las pruebas de sistema con Chrome usan los mismos formularios y clics que un
usuario: hora de inicio, navegación entre semanas, diálogos y pantalla móvil.
Guardan capturas de datos ficticios en los artefactos temporales de GitHub Actions.
En móvil el selector semanal identifica el día; no se repite una cabecera diaria
ni se crea una segunda barra de desplazamiento dentro del calendario.

## Bandeja de pendientes

`PlanningTask` es la intención persistente sin fecha obligatoria. Guarda título,
categoría, duración estimada y notas. `scheduled_block_id` es opcional y único:
una tarea pendiente no tiene bloque; una tarea programada referencia exactamente
un `TimeBlock`. El bloqueo transaccional evita programar la misma tarea en dos
pestañas simultáneamente. Los bloques preexistentes siguen independientes.

Al retirar un bloque vinculado, se copian los cambios realizados al pendiente y
se elimina solo la reserva horaria. Los pendientes pertenecen estrictamente al
usuario autenticado. El enlace «Planifier» abre el formulario de bloques si se necesita personalizar.
Arrastrar desde el panel ejecuta directamente `PlanningTasks::Scheduler` usando
la duración estimada ya guardada: muestra una previsualización de la hora y
envía un POST normal protegido por CSRF, sin diálogo adicional. La validación
es del servidor; si el horario excede la medianoche, no se crea ningún bloque.
Los solapamientos se permiten y se anuncian al usuario.

No agregar un segundo campo `status` para duplicar lo que ya expresa la relación.
La bandeja queda en `_pending_tasks.html.erb`, sus estilos en
`public/styles/pending-tasks.css` y el gesto drag-and-drop en `public/scripts/pending-calendar-drag.js`.
`public/scripts/week-calendar.js` controla únicamente la creación de nuevos
bloques desde un espacio vacío de la agenda. Los gestos táctiles utilizan el enlace explícito para planificar.

## Confirmación destructiva compartida

`public/scripts/confirm-destroy.js` gestiona las confirmaciones para todos
los `form[data-confirm-destroy]`, tanto en el diálogo de edición como en la
bandeja principal. `planner-dialog.js` gestiona únicamente los diálogos.
