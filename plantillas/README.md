# Las plantillas

La forma en blanco de cada documento, con las instrucciones adentro.

## Cómo se usan

Los comandos las leen y las copian a `negocio/` cuando hace falta. **No las llenes aquí**:
si las llenas, el siguiente negocio arranca con tu contenido.

## La marca ➤

Toda instrucción va en una línea de cita que empieza con `> ➤`. Sirve para dos cosas: se
distingue del contenido a simple vista, y se puede buscar.

> **Un documento con una sola línea `> ➤` adentro está sin terminar.** Y se lee como si
> estuviera listo, que es peor que estar visiblemente incompleto — alguien va a tomar una
> decisión con una sección que en realidad nadie llenó.

Para encontrarlas: `grep -rn "^> ➤" negocio/`

## Qué hay

| Plantilla | Para qué | La usa |
|---|---|---|
| [lectura-documental.md](lectura-documental.md) | Qué dicen los documentos del cliente y qué preguntar por culpa de ellos | `/leer` |
| [dominio.md](dominio.md) | El mapa corto del negocio | `/descubrir` |
| [notas-de-descubrimiento.md](notas-de-descubrimiento.md) | Las frases textuales de la persona, sin editar | `/descubrir` |
| [especificacion.md](especificacion.md) | Las reglas, con sus cinco familias de códigos | `/especificar` |
| [bitacora.md](bitacora.md) | Un frente construido, con sus casillas | `/frente` |
| [vacios.md](vacios.md) | Lo que la construcción reveló | `/vacios` |
| [revision.md](revision.md) | Qué se revisa, qué preguntan las personas y qué brechas quedaron abiertas | `/validar` |
| [mostrar-el-mvp.md](mostrar-el-mvp.md) | Cómo se le enseña a la persona | a mano |
| [pliego-de-preguntas.md](pliego-de-preguntas.md) | **Preguntas para que alguien las conteste solo**, y el contexto con que arranca una conversación nueva | `/preguntar` |
| [autorizacion-de-salida.md](autorizacion-de-salida.md) | **Qué documentos del cliente pueden salir de la máquina** | a mano, antes de `--motor mistral` |
| [persona.md](persona.md) | Una persona validadora | `/validar` |
| [modulo.md](modulo.md) | **El entregable para el equipo de desarrollo** | `/entregar` |
| [adr.md](adr.md) | Una decisión con su porqué | a mano |
