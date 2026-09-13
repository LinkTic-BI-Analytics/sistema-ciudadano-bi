# ADR 0009 — El MVP vive en `mvp/`, y es un cajón aparte

**Alcance:** plantilla · **Estado:** aceptada · **Fecha:** 2026-08-28

## Contexto

La regla de partición tiene tres cajones: `negocio/` para lo que se muere con este negocio,
`metodo/` y `plantillas/` para lo que sirve en cualquiera, y `entregable/` para lo que recibe
el equipo de desarrollo.

**El MVP no cabe limpio en ninguno.** Por la regla literal iría en `negocio/`: borrar Product
Hunt dejaría sin sentido su MVP. Pero eso choca con dos cosas:

- **`negocio/` son documentos que todos los comandos leen.** Meter ahí una aplicación con sus
  dependencias y su carpeta de módulos vuelve `negocio/` innavegable, y cada comando que
  recorra la carpeta se tropieza con miles de archivos que no le importan.
- **El MVP tiene que estar versionado, y `negocio/` no siempre lo está.** `metodo/palabras.md`
  dice que un commit del MVP se anota en el entregable para saber de qué versión salió. En un
  descubrimiento con documentos clasificados, `negocio/` se saca de git — y ahí el MVP se
  quedaría sin commits que citar, que es justo lo que hace rastreable al entregable.

## Decisión

**El MVP vive en `mvp/`, en la raíz, y la regla de partición gana un cuarto renglón:**

> Si borrar este negocio lo dejaría sin sentido, va en `negocio/`.
> Si serviría igual para descubrir otro negocio, va en `metodo/` o `plantillas/`.
> **Si es el instrumento que se construye para descubrir, va en `mvp/`.**
> Si es lo que recibe el equipo de desarrollo, va en `entregable/`.

`harness/` sigue siendo otra cosa: lo reusable que se lleva de un proyecto a otro. `mvp/` es
de este negocio y se tira con él.

## Consecuencias

**Lo que se gana.** `negocio/` se queda con los documentos y se puede seguir sacando de git
sin perder los commits del MVP. Y la frase *"el MVP se construye para tirarse"* deja de ser
una advertencia en un README: se ve en la estructura, porque hay una carpeta que se borra
entera y no se lleva nada por delante.

**Lo que se pierde.** Un cajón más que explicar, y una regla de partición de cuatro renglones
en vez de tres. Una regla de tres se recuerda; una de cuatro se consulta.

**Lo que hay que vigilar.** Que nadie escriba documentos del negocio adentro de `mvp/`. La
bitácora, los vacíos y la especificación viven en `negocio/` aunque hablen del código — si
empiezan a colarse notas de dominio entre el código, se pierden cuando el MVP se tire, que es
exactamente lo que este método existe para evitar.
