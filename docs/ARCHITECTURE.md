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
