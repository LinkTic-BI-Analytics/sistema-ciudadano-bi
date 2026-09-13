# Qué es esta carpeta

Los **24 documentos fuente** del proyecto, escritos entre el 11 y el 13 de septiembre de 2026
por el mismo equipo, por encargo de Miguel Gómez.

Llegaron el 2026-09-13, después de descubrir que `negocio/especificacion-v0-2026-09-13/`
citaba seis de ellos y un conjunto llamado `N01`–`N20` —**44 referencias colgando**— que no
habían venido en `Inputs/`. Mientras no estuvieran, **ningún módulo podía pasar la prueba del
sobre cerrado**, cuya cuarta casilla dice: *«no queda una sola referencia a un archivo que el
equipo no recibió»*.

Estaban en `~/Documents/Codex/2026-09-11/…/entregables/`.

## Por qué se versionan y no van en `insumos/`

Igual que la especificación v0: **es trabajo propio**, no documento externo del cliente. Se
buscó marca de clasificación y no hay ninguna — las cuatro coincidencias del grep eran
menciones sueltas sobre *proteger* la identidad de comunidades pequeñas, no sellos de
documento. `negocio/insumos/` queda para lo que sí venga marcado (ADR 0008).

## Qué autoridad tienen

**Todos proponen; ninguno describe un sistema que opere.** Todo lo que dicen es una intención,
incluido lo que suena decidido. Ninguno tiene acuerdo institucional, y varios lo advierten en
su propia primera página.

La excepción es `investigacion_planeacion_ciudadana_colombia_v2.md`, que **sí describe algo
que existe**: la Ley 152 de 1994, el Sistema Nacional de Planeación, el CNP y los Consejos
Territoriales. Es la autoridad más alta del paquete y lo único con peso de evidencia.

## Qué salió de leerlos

[`negocio/lectura-documental.md`](../lectura-documental.md), con nueve preguntas para la
entrevista. La primera es la que nadie había hecho: **¿esto se conecta con el Sistema Nacional
de Planeación, o queda al lado?**
