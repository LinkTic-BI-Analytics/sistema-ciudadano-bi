# Las referencias

Cuando no hay sistema de diseño, casi siempre **hay referencias**: alguien pasa una captura,
un enlace, *"que se vea como esto"*. Eso sirve, y es de lo que se construye mientras llega
lo demás. Aquí se guardan.

## Una referencia sin decir qué tomarle no sirve

*"Hazlo como Linear"* no dice nada por sí solo. ¿El color? ¿La densidad? ¿Que no tenga
sombras? ¿El tono de los textos? Cada una lleva a una pantalla distinta, y quien la pasó
tenía **una** en la cabeza.

Así que cada referencia se anota con tres cosas, y la tercera es la que vale:

| | |
|---|---|
| **Qué es** | El archivo o el enlace |
| **Quién la pasó y cuándo** | Alguien va a discutir un color y hay que poder volver al origen |
| **Qué hay que tomarle** | En una frase. *"El espaciado, no el color"*. Si no se sabe, **se pregunta**: es la pregunta más barata de todo esto |

Y una cuarta cuando aplique: **qué NO tomarle**. Suele ser más útil que la anterior — *"me
gusta, pero no ese azul"* evita rehacer una pantalla.

## Lo que una referencia no autoriza

**Una referencia no es una decisión de marca.** Que alguien pase un sitio que le gusta no
convierte sus colores en los del cliente. El token que sale de ahí se marca `DE REFERENCIA`
en `mvp/src/producto/tokens.css`, y eso significa: *sirve para construir hoy, no está
decidido, se cae el día que llegue la marca de verdad.*

Los tres orígenes que puede tener un token, y hay que poder distinguirlos de un vistazo:

| Marca | De dónde salió | Cuánto pesa |
|---|---|---|
| **decidido** | Del sistema o la guía que entregó el cliente | Es la marca. No se discute |
| `DE REFERENCIA` | De algo que alguien pasó, con lo que había que tomarle anotado | Sirve para construir. **No está decidido** |
| `PROVISIONAL` | De nada. Lo pusimos nosotros para que no se vea roto | No representa ninguna decisión |

Un archivo donde no se distinguen los tres es un archivo que miente: dentro de un mes nadie
se acuerda de cuál color lo dijo el cliente y cuál lo sacamos de una captura.

---

## Lo que hay hoy

> ➤ Una fila por referencia: qué es, quién la pasó y cuándo, qué hay que tomarle, y qué no.
