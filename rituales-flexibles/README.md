# Rituales Flexibles

Primer MVP local para explorar una idea:

- organizar ritos y habitos por grupos demandantes
- evitar horarios rigidos cuando no representan bien la vida real
- sugerir una ventana viva basada en historial, no una hora fija

## Concepto

Cada rito tiene:

- un grupo demandante: salud, deporte, familia, trabajo, curiosidad, hobbies, desarrollo personal
- un nivel de importancia
- reglas practicas
- un historial de realizacion

La sugerencia diaria se calcula asi:

1. busca referencias del mismo periodo del ano pasado
2. si no alcanza, mira semanas cercanas con el mismo ritmo semanal
3. si sigue faltando contexto, usa los ultimos 3 meses

En vez de decir "hazlo a las 07:30", el sistema propone:

- una ventana sugerida
- un limite blando
- una explicacion de por que recomienda eso

## Caso semilla

El proyecto viene con un ejemplo de `Levothyrox`:

- grupo: `salud`
- importancia: `casi vital`
- regla posterior: esperar al menos 30 minutos antes de comer
- recomendacion: flexible, guiada por tu propio historial

## Abrir

Desde esta carpeta:

```bash
python3 -m http.server 8123
```

Luego abre `http://localhost:8123`.
