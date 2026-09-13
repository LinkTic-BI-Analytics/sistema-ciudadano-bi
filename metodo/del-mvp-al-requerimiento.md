# Del MVP al requerimiento

Cómo se baja un módulo a un documento que un equipo de desarrollo pueda implementar en la
tecnología que use. Es la única etapa que produce algo para alguien de afuera.

## Cuándo un módulo está listo para bajarse

- Se construyó y **alguien lo usó** delante de nosotros.
- Las reglas que lo gobiernan no han cambiado en la última vuelta.
- Lo que quedó abierto está anotado en `vacios.md`, no en la cabeza de nadie.

**No se espera a que todo el producto esté completo.** Esperar es como no entregar nunca, y
es el modo de falla más común de este método: construir es más entretenido que escribir.

## Los tres movimientos

### 1 · Recortar el grafo

Parte del recorrido del módulo. Junta los `R` que lo gobiernan. Y **arrastra todo lo que
esos `R` citan**: las `C`, los `P`, las `I`, las entradas del glosario y los casos de
verificación.

Si un código citado no cabe en el módulo, el módulo está mal cortado. Dilo y vuelve a
cortar, en vez de dejar el enlace roto — un enlace que apunta a un archivo que el equipo no
recibió es peor que no citarlo.

### 2 · Traducir, no copiar

Todo lo que sea decisión de implementación del MVP sale: la tabla, el framework, el
componente, el nombre de la función.

Lo que era **una regla disfrazada de tabla** se reescribe como regla. Ejemplo: si en el MVP
una reserva tenía una columna `estado` con cuatro valores posibles, en el módulo eso no es
una columna: es una taxonomía cerrada de cuatro estados, con qué hace pasar de uno a otro.
El equipo decidirá si es una columna, una tabla aparte o un campo calculado.

La sección **"Los datos que este módulo necesita"** es donde vive esto: dice qué tiene que
poder existir, de quién es y cuánto tiene que durar — nunca en qué motor ni en qué tabla.

### 3 · Declarar el contrato

Qué recibe, qué entrega, y qué asume garantizado por otro. Sin esa sección un módulo
autocontenido es un módulo autista: cada equipo asume que el otro valida, y nadie valida.

## La prueba del sobre cerrado

Antes de dar por terminado un módulo, léelo como si fuera lo único que tienes:

- [ ] Cada código que se cita se resuelve adentro del archivo.
- [ ] Cada regla tiene al menos un caso de verificación.
- [ ] Cada invariante dice qué se rompe cuando falla.
- [ ] No queda una sola referencia a un archivo que el equipo no recibió.
- [ ] Nadie tiene que preguntar qué significa una palabra.

Si algo falla, se arregla antes de entregar. Un módulo que llega con un hueco enseña al
equipo a preguntar, y preguntar es exactamente lo que este documento existe para evitar.

## Lo que hace valioso a este documento

Un requerimiento escrito antes de construir es una hipótesis. Este trae dos cosas que aquel
no puede traer:

- **Evidencia de uso.** La sección "lo que el MVP probó y lo que no" dice qué se vio con
  gente de verdad y qué se asumió. Un equipo que sabe cuáles partes están probadas sabe
  dónde puede correr y dónde tiene que preguntar.
- **Los vacíos ya resueltos.** Las decisiones que la construcción obligó a tomar ya están
  tomadas, con su porqué. Son las que en un proyecto normal se toman en el chat, sin
  registro, tres meses después.

## Al cerrar

Anota **de qué versión del MVP salió**. Si el MVP sigue cambiando, hay que poder saber si el
módulo entregado quedó viejo.

Y haz la pregunta de [cosecha.md](cosecha.md): qué de esto se repetiría en otro negocio.
Es el único momento en que alguien tiene la respuesta fresca.
