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
- `app/views/planner/_toolbar.html.erb`: la barra única de la agenda (semana,
  previsto y real, buscar, ajustes, «+ Bloque»), que se muestra dentro de la
  barra superior mediante `content_for :toolbar`.
- `app/views/planner/_calendar.html.erb`: cuadrícula, totales por día, línea
  de la hora actual y eventos.
- `app/views/time_blocks/_form.html.erb`: campos HTML del formulario compartido.
- `app/views/time_blocks/{new,edit}.html.erb`: contenedores de diálogo.
- `public/styles/foundation.css`: estilos generales y calendario base.
- `public/styles/planner-toolbar.css`: barra de la agenda, menú de ajustes,
  totales por día y línea de la hora actual.
- `public/scripts/calendar-now-line.js`: coloca la línea de la hora actual.
- `public/scripts/calendar-hovercard.js`: ficha de cada bloque al pasar el ratón.
- `public/styles/time-block-editor.css`: formulario y reglas responsivas del editor.
- `public/styles/mobile.css`: barra de navegación y vista diaria móvil.
- `public/styles/dialogs.css`: diálogos, overlay, acciones guardar/eliminar.
- `public/scripts/week-calendar.js`: selección de horario y navegación de agenda.
- `public/scripts/time-block-form.js`: duración, tags y validación en el navegador.
- `public/planner-dialog.js`: cierre compartido de diálogos en escritorio.
- `config/locales/es.yml`, `fr.yml`: todos los textos de la interfaz, con las
  mismas claves en cada idioma. Los textos de los scripts están bajo `js`.
- `public/scripts/i18n.js`: `plannerText(clave, valores)` para los scripts;
  se carga antes que los demás.
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

## Idiomas

Ningún texto visible se escribe directamente en vistas, controladores,
modelos, servicios ni scripts: va en `config/locales/<idioma>.yml`, en los
dos idiomas a la vez. En las vistas, `t(".clave")`; en el resto,
`I18n.t("ruta.clave")`; en los scripts, `plannerText("clave")`. Los errores
de validación usan símbolos (`errors.add(:end_at, :after_start)`).

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
La hora de inicio y el idioma están en el menú de ajustes de la barra; se
guardan al cambiar (`public/scripts/calendar-preferences.js`) y conservan un
botón accesible sin JS.

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

## Regresión: arrastrar debe programar, no abrir un formulario

El gesto del panel de pendientes se prueba de extremo a extremo en Chrome:
`drag_to` produce un bloque persistido con duración estimada, sin mostrar
`planner-dialog-panel`. La API POST `schedule_planning_task` tiene pruebas
separadas para validación, doble programación, pertenencia al usuario y
solapamientos no bloqueantes. No sustituir estos resultados con pruebas que
solo comprueben que se abre una ventana.

## Arrastrar del calendario a standby

La devolución usa POST /time_blocks/:id/return_to_inbox con autenticación y
protección CSRF. El servicio PlanningTasks::ReturnToInbox gestiona la
transacción: reutiliza la tarea vinculada o crea una para un bloque nacido
directamente en la agenda. Solo después elimina el bloque.

Una migración aditiva conserva etiquetas y minutos realizados, además del
título, categoría, duración y notas. El Scheduler repone esos datos cuando
se programa de nuevo. La eliminación explícita sigue siendo distinta de
devolver a espera.

El módulo calendar-to-inbox.js gestiona solo el gesto inverso. Cada bloque
tiene su propio formulario generado por Rails en _return_to_inbox_forms.html.erb.
JavaScript selecciona ese formulario por ID y lo envía sin modificar su acción.
Rails puede vincular el token CSRF al método y a la URL; modificar form.action
invalida el token y produce HTTP 422 en producción. Esta regla está protegida
por una prueba real de navegador con allow_forgery_protection activado.
Las pruebas cubren el ida y vuelta, la reutilización del registro,
la seguridad entre cuentas y los duplicados.

## Reprogramar un bloque dentro del calendario

Arrastrar un bloque de hora o día mantiene su ID, duración, categoría,
notas, etiquetas, tiempo real y vínculo con el pendiente original.
TimeBlocks::Rescheduler valida fechas y cuartos de hora, bloquea la fila y
guarda el nuevo intervalo. Los solapamientos se permiten y se anuncian.
Un intervalo que pase de medianoche se rechaza sin modificar el anterior.

calendar-block-move.js únicamente interpreta el gesto y muestra una
previsualización. _reschedule_forms.html.erb genera un formulario Rails
con un token CSRF propio por bloque, sin cambiar jamás su destino en JS.
Se comprueba el movimiento en la misma jornada y entre días en Chrome
con CSRF activado, además de límites, aislamiento entre usuarios y datos.


## Diferenciar devolver a espera y eliminar definitivamente

En el editor de cualquier bloque programado existen dos operaciones distintas:
«Remettre en attente» utiliza POST `return_to_inbox` y conserva la
`PlanningTask` (o la crea si el bloque era independiente).
«Supprimer définitivement» utiliza DELETE `time_blocks/:id` después de
una confirmación explícita. `TimeBlocks::DeletePermanently` elimina
transaccionalmente el bloque y cualquier `PlanningTask` vinculada; no deja
un pendiente huérfano. La supresión desde el panel de pendientes continúa
eliminando solo ese pendiente.

No reutilizar DELETE para devolver a espera. La interfaz y los tests deben
distinguir siempre ambos recorridos, incluidos los bloques que ya tienen
un pendiente vinculado.

## Previsto y real

- **Previsto:** `start_at` y `end_at`, lo que se planifica al crear el bloque
  (más adelante también lo que llegue de Google Calendar).
- **Real:** `actual_start_clock` y `actual_end_clock` (HH:MM, el mismo día).
  `ActualTimeTracking` las valida y deriva `actual_minutes`.

Regla: **lo que ves es lo que editas.** Antes de que un bloque empiece, sus
horas son el plan. Una vez empezado, lo que se cambia (en el calendario o en
el diálogo) es lo real, y lo previsto se conserva tal como se creó.

En el diálogo hay un solo inicio, duración y fin. El fin es editable y
recalcula la duración (`public/scripts/time-block-form.js`); el servidor
recibe la duración. Para un bloque empezado, el controlador solo escribe las
horas reales si inicio o duración cambiaron, así que editar el título nunca
inventa horas reales. Cambiar de día mueve también el plan, con las mismas
horas. Los campos reales no se aceptan directamente desde el formulario.
Las duraciones se cuentan en minutos de reloj (01:00 + 180 min termina a las
04:00 aunque ese día cambie la hora).

El diálogo envía `schedule_mode` (`planned` o `actual`). Si el bloque empezó
mientras estaba abierto, no se guarda: se vuelve a mostrar con sus horas
reales y un aviso.

Los minutos reales históricos sin relojes se conservan. Los datos reales se
mantienen al devolver un bloque a la bandeja y volver a planificarlo.

## Notas, etiquetas y ficha al pasar el ratón

Todos los bloques llevan `data-preview-*`; los que tienen nota o etiquetas
muestran además sus iconos. `public/scripts/calendar-hovercard.js` muestra
esos datos en una ficha al pasar el ratón (solo con ratón), con los gestos
posibles. No se usan `title` nativos en el calendario: se superponían a la
ficha. La pista para crear un bloque está en el lateral «Por planificar».

## Versiones de scripts y estilos

`planner_asset("/scripts/x.js")` añade `?v=<huella del archivo>`. Cada
publicación que cambia un archivo le da una dirección nueva, así que los
navegadores no siguen usando una copia antigua. Todo `<script>` y
`<link rel="stylesheet">` de la plantilla pasa por ese helper.
