# Países — el catálogo del nivel internacional

**Versión: CLDR 48.0.** Está en el archivo `VERSION` y viaja con cada fila sembrada, igual
que la de DIVIPOLA y por la misma razón (`Q5`): los nombres cambian —«Swazilandia» es
«Esuatini» desde 2018— y un corte exportado tiene que seguir siendo reproducible.

## Qué es y qué no

Es el catálogo de la pregunta **«¿desde dónde nos contactas?»** cuando la respuesta está
fuera de Colombia. **No es un catálogo de dónde ocurre el problema**: un problema que este
sistema pueda atender ocurre en un municipio colombiano, y eso lo sigue diciendo DIVIPOLA.

## De dónde sale

| Qué | Fuente |
|---|---|
| El código, de dos letras | ISO 3166-1 alpha-2 · los 249 asignados oficialmente |
| El nombre, en español | CLDR, por el ICU que trae Node (`Intl.DisplayNames`) |

Ninguno de los dos se escribe a mano. Se regenera con:

    ./scripts/paises.sh

El guion **para** si el ICU no conoce alguno de los códigos: un país sembrado con su propio
código por nombre se lee como un error en la pantalla de alguien.

## Por qué dos letras y no cinco dígitos

Conviven en la misma tabla que DIVIPOLA, `participacion.territorio`, y la forma del código
es lo que los distingue sin ambigüedad: **país dos letras, departamento dos dígitos,
municipio cinco, centro poblado ocho**. La restricción `forma_del_codigo` del esquema lo
hace imposible de confundir, y de ahí cuelga la del aporte: un contacto internacional con
código de municipio lo rechaza la base.
