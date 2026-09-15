# Registro — T055 · El rastro del lugar no se pierde

**De dónde sale:** un aporte real —`66FDENVHFGA5`— y esta observación: *«cuando en el lugar se
detecta un departamento o un municipio esto no se está organizando para luego ayudar en la
selección, sino se pierde un poco del rastro»*.

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | 1 prueba del departamento detectado, 1 recorrido | `emparejar.test.ts`, `afinar.spec.ts` |

## Ese aporte sí funcionó, y aun así tenía razón

El relato terminaba con *«en cucuta norte de sarntander»* —con errata— y el aporte quedó en
**Cúcuta (54001)**, confirmado por la persona. El camino feliz funcionaba.

Lo que no funcionaba era todo lo demás:

- si hubiera dicho **«ninguno de estos»**, el selector arrancaba **en blanco**: escoger entre
  1.122 municipios justo después de haber escrito dónde vive;
- si el relato nombraba **solo el departamento** —porque el municipio venía mal escrito, que es
  lo normal— no se usaba para nada.

**Detectar algo y no usarlo es peor que no detectarlo**: se le pide dos veces lo mismo, y la
segunda vez con más trabajo.

## Lo que hay ahora

El departamento que la persona nombró **llega puesto** en el selector, con sus municipios ya
cargados. Eso convierte «escoge entre 1.122» en «confirma el tuyo».

Y se dice de dónde salió: *«Por lo que contaste, parece Norte de Santander. Ya está puesto —
cámbialo si no es»*. Un campo que se rellena solo sin explicación se lee como un dato que metió
alguien, y eso es justo lo que `I2` no quiere.

**Rechazar tampoco borra el rastro.** Al decir «ninguno de estos», ahora queda el departamento
detectado y el filtro con lo que escribió.

## Un detalle que costaba caro

`departamentoEn` escoge **el nombre más largo que encaje**. «Norte de Santander» contiene
«Santander», que es otro departamento a 500 km: sin esa regla, quien vive en Cúcuta acabaría
escogiendo municipios de Bucaramanga.

## Lo que queda abierto

**El lugar declarado sigue siendo un solo texto.** «cucuta norte de sarntander» guarda municipio y
departamento mezclados con el barrio. Separarlos en el registro ayudaría a la revisión, pero
`GEO-01` pide **conservar el texto declarado tal cual** — así que separar sería añadir, no
sustituir, y hace falta decidir dónde vive esa separación.

**El barrio y la vereda siguen sin catálogo** (`Q4`, `V21`): DIVIPOLA llega a centro poblado.
