# ADR 0005 — El ejemplo viaja con la plantilla

**Alcance:** plantilla · **Estado:** aceptada

## Contexto

Las plantillas traen instrucciones adentro, y aun así hay una distancia grande entre leer
*"la columna Por qué cita el principio del que sale y, cuando la falla ya ocurrió, qué
costó"* y saber escribir esa columna.

Quien va a operar esto no programa y no vio el proyecto original. Aprende comparando, no
leyendo instrucciones.

## Decisión

`ejemplo/` trae un negocio completo y terminado: dominio, especificación, vacíos y un módulo
ya bajado a requerimiento formal. Es de solo lectura, no se cita nunca desde `negocio/`, y
`/descubrir` ofrece borrarlo una vez.

## Consecuencias

Hay que mantenerlo. Cada vez que cambie una plantilla, el ejemplo queda desactualizado y hay
que revisarlo — y un ejemplo desactualizado enseña mal, que es peor que no tener ejemplo.

Se paga porque `ejemplo/modulo-reservas.md` va a ser el archivo más leído del repositorio:
es lo que alguien abre cuando no sabe qué escribir.

El riesgo del otro lado es confundirlo con el negocio real. Por eso está en una sola carpeta
de raíz, declarado de solo lectura en `AGENTS.md`, y con oferta explícita de borrarlo.
