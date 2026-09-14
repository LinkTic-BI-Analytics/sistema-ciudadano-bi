# Registro — T041 · El formulario insiste hasta llegar a un municipio

**Autoridad:** el negocio, dicho así: *«un problema sin un lugar donde podamos asociarlo no es
algo que necesitamos»* · `GEO-01` · `I2` · `N02` (que pone el límite a esa exigencia)

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 11 recorridos del flujo de ubicación | `afinar.spec.ts` |
| 2026-09-14 | 10 pruebas del emparejador; **2 vistas fallar** sin paginar | `emparejar.test.ts` |
| 2026-09-14 | 2 pruebas del motivo de la ubicación ciudadana | `ubicacion-ciudadana.test.ts` |

## Lo que pasaba de largo

Alguien escribía **«en mi casa»** y dábamos la pregunta por contestada. El aporte llegaba a la
bandeja sin territorio al que sumarlo, que es como no tenerlo: no se puede agregar al de sus
vecinos ni llegar a quien responde por ese territorio.

Ahora **una ubicación solo cuenta cuando llega a un municipio**. Si el texto no llega, se
insiste:

1. Se le busca el municipio en lo que escribió y se le ofrece para confirmar.
2. Si no hay nada, se le pregunta por el nombre, con buscador sobre DIVIPOLA, y **se le dice qué
   se pierde**: *«sin municipio, tu aporte no se puede sumar al de tus vecinos»*.
3. Si no lo sabe, se le pregunta **dónde vive**.
4. Y entonces se le pregunta aparte si el problema ocurre ahí — porque `GEO-01` dice que una
   dirección residencial **no es** el lugar del problema sin confirmación. El motivo guardado
   distingue las dos rutas, para que un revisor pueda pesarlas distinto.

**Lo que no se hizo: exigirlo.** La especificación dice *«municipio incierto se conserva como
pendiente»* y que esos aportes siguen siendo visibles en revisión. Rechazar un aporte sin lugar
excluiría justo a quien menos puede precisarlo. Se insiste todo lo que se puede y se deja salir.

## 122 municipios que no existían

Buscando por qué el catálogo tardaba, apareció algo peor. **PostgREST corta en 1.000 filas y
responde `200` como si fueran todas.** Hay 1.122 municipios.

Los 122 que faltaban, por orden de código:

> **Valle del Cauca (42) · Casanare (19) · Putumayo (13) · Amazonas (11) · Guainía (8) ·
> Arauca (7) · Vaupés (6) · Tolima (6) · Vichada (4) · Guaviare (4) · San Andrés (2)**

La periferia entera. Quien viviera ahí escribía el nombre de su municipio y le decíamos que no
existe — en un sistema que quiere ser línea de alimentación del sistema nacional de planeación.

**Y nada fallaba.** Las pruebas usaban Rionegro, Medellín y Soacha, que están entre los primeros
mil. Ahora hay una que cuenta contra la base y otra que busca Leticia, Mitú, Puerto Carreño,
Inírida y Buenaventura. Las dos se vieron fallar.

## El comprobante estaba detrás de la lectura

Una prueba fallaba de forma intermitente esperando el código. Parecía un problema de tiempos y
era **de orden**: el comprobante solo se pintaba cuando terminaba de leer el relato. Si el
servidor tardaba, la persona esperaba sin lo único que necesita de nosotros — y el ADR 0012 dice
que se guarda en el primer clic y el código está a la vista desde ese momento.

Ahora sale antes de leer nada.

## «En mi casa» no es un lugar

La instrucción al modelo ahora dice que `lugar` tiene que ser **un sitio que otra persona pueda
encontrar**. Comprobado contra el proveedor real: «en mi casa» y «aquí en mi barrio» vuelven
`null`, y entonces el formulario pregunta.

## Lo que queda abierto

**El barrio y la vereda siguen sin catálogo** (`Q4`, `V21`). «La Martinita» no está en DIVIPOLA
ni va a estar: DIVIPOLA llega a centro poblado. Se guarda como texto.

**No está medido con gente real** si insistir tres veces por la ubicación hace abandonar. Es lo
primero que habría que mirar en el piloto, junto con el costo de las dos pantallas del ADR 0012.
