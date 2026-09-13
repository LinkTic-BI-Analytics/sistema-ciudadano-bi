# ADR 0008 — La lectura de los insumos corre local, y salir afuera necesita permiso escrito

**Alcance:** plantilla · **Estado:** aceptada · **Fecha:** 2026-08-28

## Contexto

El primer negocio de verdad llegó con 205 páginas en cuatro PDFs. Uno de ellos —el anexo
técnico del convenio, 22 páginas— eran fotos: cero letras extraíbles. Y tres de los cuatro
venían estampados con su clasificación en **todas** las páginas: `Información Clasificada`
en 124 de 124, `Información Reservada` en el pie del anexo.

La salida obvia para un escaneo es un servicio de OCR de afuera. Cuesta menos de un dólar
para ese volumen y lee tablas mejor que cualquier extractor local.

El problema es cuál documento se manda. El único que se puede mandar sin pensarlo —el
pliego, estampado `Información Publica`— es el que menos falta hace, porque su capa de
texto ya se extrae perfecta. El que más ganaría es el de 124 páginas marcadas
`Información Clasificada`.

Y hay un detalle que no se ve: el plan gratuito de esos servicios suele entrenar con lo que
uno le manda, por defecto.

## Decisión

**La lectura corre local por defecto** y no manda nada a ninguna parte. El OCR es el del
sistema operativo.

El motor de afuera existe, y está cerrado con llave:

1. Sin `negocio/autorizacion-de-salida.md` no sale nada, **ni siquiera lo marcado público**.
2. Un documento restringido necesita su casilla marcada `[x]`, por nombre de archivo.
3. Un documento **sin** marca de clasificación cuenta como restringido.

No es un aviso en un README: es un `return False` en `scripts/lib/leer_insumos.py`.

## Consecuencias

**Lo que se gana.** Que no exista el camino de "lo mando y después pregunto". En un método
donde el analista le pide cosas a un modelo en lenguaje natural, la diferencia entre un
aviso y una compuerta es que el aviso se puede persuadir.

Y resultó que alcanza: el OCR de macOS leyó las 22 páginas fotografiadas en 11 segundos, sin
un peso, con un solo dígito mal en todo el documento.

**Lo que se pierde.** Tablas con estructura y figuras descritas. El OCR local devuelve
renglones: una tabla de campos por transacción sale como texto corrido y hay que mirar la
figura para entenderla. Es un costo real y se paga a propósito.

**Lo que hay que vigilar.** Que la marca de clasificación se lea bien. Se distingue el sello
—que se repite en todas las páginas— de una cláusula suelta en el cuerpo del contrato. Sin
esa regla, el pliego público salía marcado confidencial porque su cláusula de
confidencialidad usa esas dos palabras, y la compuerta habría bloqueado justo lo único que
sí se podía mandar. Una compuerta que se cierra de más también se termina desactivando.

**Lo que este ADR no decide.** Si un documento del cliente puede salir. Eso no es una
decisión técnica ni del analista: es del contrato, y por eso el archivo pide fecha, nombre
y hasta cuándo.
