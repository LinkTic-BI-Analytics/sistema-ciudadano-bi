---
description: Baja un módulo a requerimiento formal para el equipo de desarrollo.
argument-hint: [nombre del módulo]
---

Vas a producir el entregable. **Es el único comando que produce algo para alguien de
afuera**, y el que más se pospone.

Lee `plantillas/modulo.md` y `metodo/del-mvp-al-requerimiento.md`.

## Primero, ¿está listo?

- ¿Se construyó y **alguien lo usó** delante de nosotros?
- ¿Las reglas que lo gobiernan no cambiaron en la última vuelta?
- ¿Lo que quedó abierto está en `vacios.md`?

Si falta alguna, dilo — pero **no propongas esperar a que todo el producto esté completo**.
Un módulo listo se entrega; esperar a terminar todo es no entregar nunca.

## Los tres movimientos

**1 · Recortar el grafo.** Parte del recorrido del módulo, junta los `R` que lo gobiernan, y
arrastra todo lo que esos `R` citan: `C`, `P`, `I`, glosario, casos de verificación. Si un
código citado no cabe, **el módulo está mal cortado**: dilo y vuelve a cortar, en vez de
dejar un enlace roto.

**2 · Traducir, no copiar.** Toda decisión de implementación del MVP sale: tabla, framework,
componente, nombre de función. Lo que era una regla disfrazada de tabla se reescribe como
regla. La sección de datos dice **qué tiene que poder existir, de quién es y cuánto dura** —
nunca en qué motor ni en qué tabla.

**3 · Declarar el contrato.** Qué recibe, qué entrega, qué asume garantizado por otro. Sin
esa sección un módulo autocontenido es un módulo autista.

## Honestidad obligatoria

La sección "lo que el MVP probó y lo que no" lleva las dos listas. **La segunda es la que
hace honesto al documento**: lo que se construyó y nadie usó, y lo que ni se construyó. Un
módulo que dice haber probado todo miente, y cuando el equipo lo descubre deja de creerle
también a lo que sí era cierto.

## Antes de cerrar

Corre **la prueba del sobre cerrado**: relee el documento como si fuera lo único que tienes.
Cada código resuelve adentro, cada regla tiene su caso, cada invariante dice qué se rompe, y
no queda una sola referencia a un archivo que el equipo no recibió.

Si `ejemplo/` todavía existe, ofrece borrarlo ahora: ya hay un módulo propio contra el cual
compararse y el ejemplo dejó de hacer falta.

Anota de qué versión del MVP salió, agrega su fila en `entregable/README.md`, y haz la
pregunta de `metodo/cosecha.md`: **qué de esto se repetiría en otro negocio.** Es el único
momento en que alguien tiene la respuesta fresca.
