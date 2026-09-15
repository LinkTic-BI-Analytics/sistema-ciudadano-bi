# Registro — T049 · La pieza gráfica

**Autoridad:** `negocio/requisitos/pieza-grafica-de-convocatoria-v1.md` (`PIE-01` … `PIE-04`),
escrito **antes** de codificar, a partir de la decisión de Miguel Gómez del 15 de septiembre

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | Requisito escrito y carpeta `negocio/requisitos/` con su autoridad | `LEEME.md` |
| 2026-09-15 | 7 pruebas de la pieza, 3 del resolutor de tokens | `pieza.test.ts`, `tokens-leer.test.ts` |
| 2026-09-15 | 2 recorridos de descarga | `qr.spec.ts` |

## El requisito primero

Lo pidió así el negocio —*«podemos documentarlo en el req y luego hacerlo para que quede
documentado»*— y es lo correcto: la cadena de autoridad pone la especificación por encima del
código, y un requisito escrito después de codificar solo describe lo que uno ya hizo.

Como `especificacion-v0-2026-09-13/` está congelada y `fuentes-2026-09-11/` llegó de fuera, lo
nuestro necesitaba sitio propio: `negocio/requisitos/`, con un `LEEME.md` que dice **de qué
decisión y de qué fecha sale cada documento**. Un requisito sin origen es indistinguible de una
idea que tuvo quien lo estaba codificando.

## Por dónde se rompía

Hasta hoy el sistema daba el enlace y su QR, y ahí se acababa. La pieza la armaba alguien aparte,
**copiando los datos a mano**.

Y ahí es por donde se rompe: alguien copia la fecha vieja, o el lugar con una errata, o se olvida
de decir que hay transporte. **Un afiche con la fecha equivocada no se corrige: ya está pegado.**

Ahora la pieza se genera del mismo registro que alimenta la agenda pública. Si el encuentro
cambia, lo que cambia es el registro, y la pieza siguiente sale bien.

## Lo que toda pieza lleva, y lo que no se rellena

Siempre: convocatoria, título, **fecha entera y con zona horaria** —«12/10» es octubre o
diciembre según quién lo lea, y «a las 9» no dice nada sin decir dónde son las 9—, lugar o
virtual, el QR **con su dirección legible al lado**, y las dos frases de límite: que se puede
aportar sin asistir, y que registrar no es un compromiso de obra.

**La ausencia se omite, no se rellena.** Si nadie declaró ayudas, la pieza no dice «sin ayudas»:
no dice nada. Escribir «sin transporte» donde nadie decidió que no lo hubiera convierte un dato
que falta en una negativa, **y alguien deja de ir por eso**. Hay una prueba que busca esas
negativas inventadas.

**Un encuentro cancelado no produce pieza**, y uno presencial sin lugar tampoco: un afiche sin
dónde no sirve para ir.

Cuatro formatos —afiche, volante, publicación cuadrada, historia— en PNG y SVG. Cada formato es
una pieza del enlace, no un evento distinto.

## Los colores no se copiaron

Una pieza descargada **no puede leer variables CSS**: un SVG que se va a imprimir lleva los
colores dentro. Copiarlos a mano habría sido el mismo error que este proyecto ya cometió tres
veces con las clases — un valor copiado se queda quieto mientras el sistema de diseño se mueve, y
nadie se entera hasta que la pieza sale de otro color que la web.

Así que se leen de la misma hoja que usa el producto, resolviendo los alias en cadena. Un token
que no existe **falla** en vez de dejar el elemento sin color.

## Lo que queda abierto

**`Q31`, nueva: ¿quién autoriza una imagen con personas?** `PIE-03` prohíbe usar fotos de
personas identificables sin autorización escrita, y no dice quién la recoge ni dónde queda. Una
convocatoria pública no autoriza a usar la cara de quien fue a la anterior.

**No hay subida de imagen todavía.** El generador la acepta; la pantalla para cargarla no existe.

**No se registra qué pieza se generó ni cuándo.** `PIE-01` lo pide —*«un asiento de qué se
generó, para qué pieza, cuándo y por quién»*— y hoy la descarga no deja rastro. Es lo primero que
falta para poder saber qué material circuló.

**Sin plantillas por entidad ni edición libre**, a propósito: el valor de esto es que todas las
piezas se parezcan y digan lo mismo.
