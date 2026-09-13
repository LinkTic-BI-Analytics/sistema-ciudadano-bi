# ADR 0010 — Las fronteras de integración son una etapa, no un detalle técnico

**Alcance:** método
**Estado:** aceptada
**Fecha:** 2026-08-29

## Contexto

El analista trajo un framework de refinamiento de requerimientos con prototipado asistido,
armado en otra conversación, para ver qué se podía aprovechar en las ambigüedades de los
primeros pasos.

Se contrastó contra el método. **Buena parte ya está, con otro nombre** —el descubrimiento
incremental, los supuestos visibles, las marcas de origen, los agentes-persona que recorren
flujos concretos, el grafo—. Y en dos puntos el método de aquí es más estricto y no debería
ceder, que quedan escritos abajo.

**Pero hay un hueco entero, y es grande: de integraciones no hay una sola línea.**

Se buscó en `metodo/`, `plantillas/`, `harness/` y los comandos. Aparece dos menciones
sueltas y ninguna regla. Y el negocio que está cargado hoy —depósitos judiciales del Banco
Agrario— es **siete integraciones**: CORE COBIS, el aplicativo IBMi/AS400, el bus WSO2, el
SIUGJ de la Rama Judicial, la Central de Información, ACH-Neurona y PSE. El modelo conceptual
del cliente es literalmente un dibujo de cajas conectadas.

Un método que no dice nada de fronteras, aplicado a un proyecto que es casi todo frontera,
descubre la mitad del problema.

## Decisión

**Las fronteras de integración se inventarían en la etapa 0a, con `plantillas/fronteras.md`,
y cada una responde tres preguntas antes de construir nada.**

| | |
|---|---|
| **¿De quién es el dato?** | Del sistema o del externo. Decide quién puede corregirlo |
| **¿Con qué disponibilidad se cuenta de verdad?** | La real, no la del contrato |
| **¿Qué pasa cuando no responde?** | El modo degradado. **Es el hueco grande: nadie lo piensa** |

Y dos marcas más:

**Gobernabilidad.** Una frontera **controlable** —del mismo cliente— se negocia: hay contrato,
ambientes, ventanas de cambio. Una **no controlable** —del Estado, de un tercero— se aguanta
como venga. Para esa segunda, **el plan B no es recomendable: es obligatorio**.

**Fidelidad del mock**, con la misma escala de tres que ya usan los tokens de la línea
gráfica, y por la misma razón:

| Nivel | Lo que hay | Lo que hace el mock |
|---|---|---|
| 1 | Solo el nombre de la integración | Se inventa la respuesta |
| 2 | Tipos de dato y rangos | Datos sintéticos coherentes |
| 3 | Contrato o ejemplo de respuesta real | Réplica de la estructura exacta |

**El nivel se muestra en la pantalla.** Alguien valida distinto un dato inventado que un dato
contractual, y si no se le dice, los valida igual.

**Y hay una pregunta que se hace temprano o no se hace:** ¿existe ambiente de pruebas de esa
integración, y quién lo garantiza? Si la respuesta es no, el MVP simula y **eso queda escrito
como no validado**, no como construido.

## Lo demás que se toma del framework

**Un estado de suficiencia por entidad**, con dos valores y no un porcentaje:
`suficiente-para-prototipar` o `necesita-definición`. La frase que lo sostiene es la que
faltaba: **el umbral no es la completitud, es «¿alcanza para construir la pantalla?»**.

Un nivel de confianza en porcentaje no se toma porque no se puede verificar. Estos dos sí:
o se puede dibujar la pantalla o no.

**La pregunta de reutilización.** Cuando un módulo nuevo toca una entidad que ya existe, se
pregunta **si aplica igual o cambia**, en vez de redefinirla. *"Esa pregunta es donde aparecen
las inconsistencias de negocio que hoy nadie detecta"* — y encaja con lo que ya hace el grafo,
que es no repetir lo que ya está escrito.

**Las tres capas de la cuenta demo.** Ya se pedía "rastro en la cuenta demo"; ahora se dice de
qué está hecho: coherencia estructural, coherencia relacional, y **casos borde deliberados**.
La tercera es la que produce el *"¿y eso qué hace el sistema cuando pasa?"* — y es la que ya
se había hecho sin nombrarla, cuando en Product Hunt se sembró una ráfaga de votos a propósito
para poder mirar lo que la invariante iba a tener que descartar.

**La limitación dicha en voz alta.** Un MVP navegable valida el flujo, **no los cálculos ni
las validaciones internas**, y ahí puede quedar la ambigüedad más cara. En depósitos judiciales
eso es enorme: la liquidación de rendimientos, el DTF, el plazo de prescripción. Nada de eso se
ve en una pantalla, y por lo tanto **nada de eso lo valida este método**. Decirlo es la
diferencia entre una limitación y una mentira.

**Y la pregunta del primer piloto.** No es *"¿fue más rápido?"* sino **"¿se pudo?"**. Comparar
velocidad con dos casos da ruido, no señal.

## Lo que NO se toma, y por qué

**El framework no tiene invariante suprema ni orden de construcción.** Construye desde el
grafo, y eso deja el orden al azar. Aquí el orden lo decide qué no se puede agregar después:
una restricción sobre datos que ya existen es como se producen las fugas que debía impedir.
Se queda como está.

**«Los supuestos son visibles, no bloqueantes» tiene una excepción que aquí no se negocia.**
La unidad de pertenencia y la invariante suprema **sí bloquean**. Construir la mitad de una
invariante es construir un dominio falso, y las conclusiones que salgan de usarlo van a ser
falsas. El resto sí: se anota, se sigue, y queda con dueño.

**«Todo local y versionable, el repo es la fuente de verdad» choca con la confidencialidad, y
gana la confidencialidad.** `negocio/` está en el `.gitignore` a propósito: lleva documentos
marcados `Información Reservada` y este repositorio se sube. Lo versionable es el método, el
harness y el MVP. **El trabajo del negocio se respalda archivándolo, no commiteándolo** — y
eso hay que decirlo, porque ya se dijo lo contrario una vez en esta arena y era falso.

## Consecuencias

**Lo bueno.** El proyecto que está cargado deja de tener un hueco donde tiene su mayor riesgo.
Siete integraciones sin modo degradado escrito son siete formas de que el sistema se caiga sin
que nadie lo haya pensado.

**Lo malo, y es real.** Es una etapa más antes de construir, y el método ya tiene nueve. La
tentación va a ser saltársela cuando la integración "es sencilla" — y las sencillas son las
que no tienen ambiente de pruebas.

**Lo que queda sin resolver.** La lógica no visible en interfaz. El framework lo deja como
pendiente abierto y aquí queda igual: **no se sabe cómo validar un cálculo con un prototipo
navegable.** No se inventa una solución; se deja escrito que es el punto ciego del método.
