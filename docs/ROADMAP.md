# Hoja de ruta de Planner

Lo que viene, en orden. Cada entrada se hace en su propia rama y su pull
request. Al terminar una, pasa a «Hecho» con su número de PR.

Principio de diseño: el buen diseño hace simple la herramienta, y ese es su
valor. Ante la duda, quitar antes que añadir.

## En curso

- **Áreas de vida.** Las categorías pasan a ser tres áreas fijas con colores
  distintos: Trabajo (azul), Vida (verde) y Aprendizaje (ámbar). Reunión pasa
  a Trabajo con #reunión y Pausa a Vida con #pausa.
- **Diálogo más ligero e indicadores.**
  - en el diálogo, la hora de fin se edita a mano y recalcula la duración;
    desaparece el bloque «Horario real»;
  - regla: antes de empezar se edita lo previsto; una vez empezado, lo real
    (lo previsto se conserva tal como se creó);
  - iconos de nota y etiquetas en los bloques, y una ficha con ellas al pasar
    el ratón;
  - la hora de fin del calendario se reconoce como editable (icono de reloj);
  - versiones en scripts y estilos para que el navegador no use copias antiguas.

## Más adelante

- **Sección de análisis: previsto frente a real.** Una sección propia, aparte
  de la agenda:
  - el tiempo por área (Trabajo, Vida, Aprendizaje) cada semana, para ver el
    equilibrio;
  - la diferencia por día y por área;
  - las tareas que más se subestiman;
  - duraciones sugeridas a partir del historial al planificar una tarea.
- **Áreas a medida.** Cambiar el nombre y el color de las tres áreas de base
  (que no se pueden borrar) y crear áreas propias, hasta unas 6–8.
- **Lo previsto desde Google Calendar.** Importar los eventos de la agenda de
  Google como bloques previstos; lo real se sigue registrando en Planner.

## Hecho

- Hora de fin visible y editable en cada bloque, «Terminar ahora», arrastrar
  el borde inferior y bloques solapados uno al lado del otro (#18).
- Al mover un bloque, su tiempo real se mueve con él (#19).
- Deshacer y rehacer con Ctrl+Z / Ctrl+Shift+Z, y duplicar con Shift + arrastrar (#20).
- Interfaz en varios idiomas (español por defecto y francés) y esta hoja de ruta (#21).
- Rediseño «Épuré»: barra única, real frente a previsto por día, línea de la
  hora actual, bloques sin franja lateral (#22).
