# Autorización de salida

> ➤ Cópialo a `negocio/autorizacion-de-salida.md` y llénalo. **Mientras ese archivo no
> exista, ningún documento del cliente sale de la máquina** — que es como tiene que estar
> mientras nadie haya autorizado nada. Borra las líneas ➤ al llenar.

Qué documentos de `negocio/insumos/` pueden salir de esta máquina hacia un servicio de
afuera, quién lo autorizó y cuándo.

**Esto no es un trámite: es la compuerta.** `scripts/leer-insumos.sh --motor mistral` lee
este archivo y **se niega** a mandar un documento restringido que no esté marcado con `[x]`
aquí abajo. Un documento sin marca de clasificación cuenta como restringido: uno que no dice
qué es no autoriza nada.

Por defecto el script corre **local** y no manda nada a ninguna parte. Esta lista solo aplica
cuando alguien pide explícitamente el motor de afuera.

## Antes de marcar una casilla

Tres preguntas, y la tercera es la que se salta todo el mundo:

1. **¿Qué dice el documento de sí mismo?** El sello del pie de página manda sobre lo que uno
   crea. `Información Reservada` y `Información Clasificada` no son adornos.
2. **¿Hay una cláusula de confidencialidad en el contrato?** Un pliego suele traerla, y suele
   cubrir los anexos técnicos aunque el anexo no lo repita.
3. **¿Quién puede autorizar esto de verdad?** No es quien tiene los archivos en el
   computador. Si la respuesta es *"pues yo creo que sí"*, la respuesta es no.

## Adónde iría

> ➤ Una fila por servicio. La última columna es la que hay que averiguar de verdad, no
> suponer: **qué hace ese servicio con lo que le mandas, y en qué plan estás.**

| Servicio | Para qué | Qué hace con los datos |
|---|---|---|
| Mistral · `mistral-ocr-latest` | Leer tablas y figuras mejor que el OCR local | Los planes pagos no entrenan con lo que se manda y guardan 30 días para monitoreo de abuso. **El plan gratuito "Experiment" sí entrena por defecto** y hay que desactivarlo a mano. *Zero Data Retention* solo existe en el plan Scale |

## Lo autorizado

> ➤ Marca `[x]` solo lo que esté autorizado de verdad. El nombre tiene que ser el del
> archivo, tal cual está en `negocio/insumos/` — el script lo busca por texto exacto.

- [ ] `<nombre del archivo.pdf>`

## El registro

> ➤ Sin fecha y sin nombre esto no es una autorización: es una lista. La última columna
> importa porque una autorización que no vence se convierte en permiso permanente para algo
> que se pidió una vez.

| Fecha | Quién autorizó | Qué | Para qué | Hasta cuándo |
|---|---|---|---|---|
|  |  |  |  |  |

> ➤ Y debajo, en un párrafo, **por qué se autorizó eso y no más**. Es lo que alguien va a
> leer dentro de seis meses cuando quiera mandar el resto.
