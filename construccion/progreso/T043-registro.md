# Registro — T043 · Escoger el municipio se puede deshacer

**Autoridad:** `GEO-01` · `I2` · y tres cosas que dijo una persona usando la pantalla

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 15 recorridos del flujo; 2 nuevos sobre corregir y filtrar | `afinar.spec.ts` |
| 2026-09-14 | Filtro de palabras vacías en la lectura | `lectura-ia.test.ts` |

## Escoger no confirma

Lo dijo así: *«yo pude haberme equivocado en la selección del municipio pero pasa directo sin
posibilidad de seleccionar»*.

Era cierto y era grave. Tocar un municipio lo guardaba y avanzaba. Con 125 en una lista es fácil
tocar la fila de al lado, y **un municipio equivocado es peor que ninguno, porque parece un
dato**: nadie lo va a revisar, porque ya está resuelto.

Ahora escoger solo propone. La pantalla dice *«¿Es RIONEGRO, ANTIOQUIA?»* y espera: **Sí, es
ahí** o **No, cambiar**. Nada se escribe hasta el sí. Vale igual para los candidatos que salen
del relato y para los que se escogen a mano.

## 125 en una lista no se recorren

La cascada por departamento bajó de 1.122 a 125, y 125 en un desplegable siguen siendo
imposibles: hay que bajar por Abejorral, Abriaquí, Alejandría… hasta encontrar el suyo.

Ahora se filtran escribiendo. Sin tildes y sin mayúsculas, porque **nadie escribe «ABRIAQUÍ» con
tilde**; se muestran hasta ocho, y se dice cuántos hay en total para que nadie crea que su
municipio no está.

## «Nos» no es una respuesta

En su pantalla, a *«¿a quiénes les pasa?»* la IA había contestado **«nos»**.

Lo primero fue comprobar el guardián, porque si «nos» no estaba en el relato era un fallo grave.
**Estaba**: lo que se muestra arriba es el fragmento que la IA cortó como problema, no el relato
entero. El guardián funcionaba.

Pero el dato no servía igual. Un pronombre suelto está anclado y no dice nada, y enseñárselo a la
persona es peor que no enseñar nada: **la invita a confirmar un dato vacío**, y después un
revisor lee «afectados: nos» como si fuera una respuesta.

Ahora un valor que solo tiene palabras vacías —«nos», «les», «uno», «todos», «aquí»— se descarta,
y se le pregunta. Lo que sí dice algo en la misma respuesta se conserva: no se tira todo.

## Un solo bloque

«Lo que contaste» y «lo que entendimos» eran dos cajas grises separadas por un hueco, y se leían
como dos cosas sin relación. Son lo mismo: lo que contó, partido. Van en una sola lista.

## Lo que queda abierto

**El barrio y la vereda siguen sin catálogo** (`Q4`, `V21`): DIVIPOLA llega a centro poblado, así
que «la vereda La Martinita» se guarda como texto y no se puede filtrar.

**`Q23`**, el colectivo como entidad, sigue siendo el hueco que más pesa.
