# Qué es esta carpeta y qué autoridad tiene

Es la especificación tal como quedó el **13 de septiembre de 2026**, antes de pasar por el
método de este repositorio. La redactó el equipo por encargo de Miguel Gómez; su propio
`LEEME.md` lo dice en dos lados: *«propuesta nuestra, sin acordar»* y *«no acuerdo
institucional»*.

**No está en `negocio/insumos/` a propósito.** `insumos/` es para documentos que trae el
cliente, y está fuera de git por el [ADR 0008](../../decisiones/0008-la-lectura-corre-local.md).
Esto es trabajo propio, así que se versiona.

## Qué autoridad tiene hoy

Es el **nivel 3** de la cadena de autoridad (`metodo/construccion-solida-y-paralela.md` §1):
la especificación vigente del negocio. Manda sobre cualquier plan y sobre el código. **No
manda** sobre una decisión explícita de Miguel ni sobre un módulo entregable vigente.

## Por qué no se puede construir todavía sobre ella

Su propio tablero de estado (`LEEME.md`) responde **«¿Se puede entregar? → NO»**. Lo que
falta, con el archivo donde se ve:

| Hueco | Dónde |
|---|---|
| 12 decisiones sin tomar | `vacios.md` §2 — y ninguna tiene llena la columna «qué bloquea» |
| Ningún acuerdo transversal escrito | `acuerdos.md` tiene 4 líneas |
| Ninguna integración catalogada, mientras la spec menciona 6 | `integraciones.md` tiene 4 líneas |
| §3 Principios, §4 Taxonomías, §8 Rituales, §9 Fallas, §10 Estado | `especificacion.md`, todas vacías |
| Los 10 módulos declaran `Depende de: —` | `modulos/*.md` |
| Ningún módulo tiene una casilla del sobre cerrado marcada | `modulos/*.md` §14 |
| Ningún mecanismo de identidad, ni para los 9 roles internos ni para el «comprobante seguro» | no aparece en ningún archivo |

## Qué la va a reemplazar

La Pista A del plan de estructuración la normaliza contra `plantillas/especificacion.md` y
produce `negocio/especificacion.md`, `negocio/vacios.md`, `negocio/acuerdos.md` y
`negocio/integraciones.md`. **Cuando eso pase, esta carpeta deja de ser autoridad y queda
como antecedente**, igual que `referencia-institucional.md` quedó como antecedente de
`direccion-visual.md` en el sistema de diseño.

Mientras tanto: esta carpeta es la fuente, y `negocio/especificacion.md` no existe.
