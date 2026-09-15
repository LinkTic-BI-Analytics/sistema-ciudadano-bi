# 0013 · Cuando la persona habla, el audio es el original

**Fecha:** 2026-09-14 · **Estado:** aceptada · **Decide:** Miguel Gómez

## Contexto

`N03` dice que el relato original se conserva y que la síntesis **nunca lo sustituye**. Con
alguien que escribe, el original es obvio: lo que tecleó.

Con alguien que habla, no. Una transcripción **ya es la lectura de una máquina**. Y no es una
lectura fiel: en la primera prueba contra OpenRouter, un audio que decía *«la vereda La
Martinita»* volvió como *«la vereda La Martinica»*. Un nombre de vereda cambiado — que es
exactamente el caso que la especificación anticipa: *«una transcripción cambia acueducto por
alcantarillado; la persona corrige antes de validar»*.

Si se guardara solo el texto, el «original» que `N03` manda conservar sería el error de la
máquina, y no habría con qué volver atrás.

## Decisión

**El audio es el original.** Se guarda, y de él se derivan las transcripciones.

> *«Es posible que luego encontremos una mejor opción para transcribir; en caso de que
> comencemos a detectar errores, también lo podemos hacer. Entonces el audio sería el original.»*

De ahí salen tres consecuencias que el modelo tiene que sostener:

1. **Una transcripción es una versión, no un hecho.** Lleva número, autor —el modelo que la
   produjo, con su nombre— y fecha. La primera la hace la máquina; la persona puede corregirla,
   y eso es otra versión.
2. **Se puede volver a transcribir más tarde** con un proveedor mejor, sin tocar nada de lo
   anterior. Por eso se guarda **qué modelo** produjo cada versión: sin eso no se puede saber
   qué cambió ni por qué.
3. **Un aporte por voz sin grabación no puede existir.** Sería un aporte cuyo original se
   perdió. La base lo impide con una restricción diferida, no con una convención.

`relato_original` sigue guardando la **primera** transcripción y no cambia nunca — es lo que la
persona vio y confirmó. Pero para `canal = 'voz_transcrita'` esa columna **no es el original**:
el original es el archivo, y el nombre de la columna miente un poco. Queda dicho en el esquema
para que nadie lo lea al revés.

## Consecuencias, incluidas las malas

**Guardar voz es más grave que guardar texto.** La voz identifica a una persona aunque las
palabras no lo hagan. Eso convierte `Q29` —qué proveedor, con qué plan, con qué política de
datos y quién es el responsable del tratamiento— de *importante* a **bloqueante**: con texto se
podía posponer; con audio, no.

**Hay que decírselo a la persona antes de grabar**, no en una política que nadie lee. Si
guardamos su voz, tiene que saberlo cuando aprieta el botón.

**Cuesta almacenamiento**, y crece con cada aporte hablado. A 1 KB por segundo, un millón de
aportes de un minuto son unos 60 GB. No es un problema hoy y sí es una línea en el presupuesto
de un piloto nacional.

**Aparece un derecho nuevo que no estaba**: si alguien pide que borren su aporte, ahora hay un
archivo de su voz. `V11` —borrado lógico— se decidió sobre texto. **No cubre esto**, y queda
como pregunta abierta.
