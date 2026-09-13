# Fronteras de integración — <negocio>

Cada punto donde este sistema depende de algo que no controla.

> ➤ Se llena en la etapa **0a**, junto con `que-podemos-construir.md`. Antes de construir,
> no después: una frontera que se descubre construyendo ya costó un rediseño.
>
> Borra las líneas ➤ al llenar.

**Fecha:**
**De dónde salen:** ➤ el diagrama de arquitectura del cliente suele traerlas todas. Es la
página más informativa de cualquier documento técnico y casi nadie la mira.

---

## El inventario

| # | Frontera | Qué le pide este sistema | Gobernabilidad | Mock |
|---|---|---|---|---|
|  |  |  |  |  |

> ➤ **Gobernabilidad** — `controlable` si es del mismo cliente: se negocia contrato,
> ambientes y ventanas de cambio. `no controlable` si es del Estado o de un tercero: te
> adaptas a lo que publiquen, con su documentación y sus tiempos.
>
> **Mock** — el nivel de fidelidad, de la tabla de más abajo.

---

## Las tres preguntas, una por frontera

> ➤ Estas tres casi nunca están en el documento, y las tres cambian lo que hay que construir.
> Se contestan una por una, por frontera. Si alguna queda sin respuesta, **eso es la
> respuesta** y va a `vacios.md` con dueño.

### ➤ <nombre de la frontera>

**¿De quién es el dato?**

> ➤ De este sistema o del externo. Decide quién lo puede corregir cuando está mal — y esa
> pregunta aparece el primer día de producción, no antes.

**¿Con qué disponibilidad y latencia se cuenta de verdad?**

> ➤ La real, no la del contrato. Si nadie la ha medido, se dice que nadie la ha medido: un
> número que no se puede verificar no se cree.

**¿Qué pasa cuando no responde?**

> ➤ **Este es el hueco grande y por eso va de último: es el que nadie piensa.** No vale "se
> muestra un error". ¿Se encola y se reintenta? ¿Se bloquea la operación? ¿Se deja seguir y
> se cuadra después? Cada respuesta es un sistema distinto.
>
> Y la pregunta que sigue, que es la que duele: **¿quién se entera?** Un modo degradado que
> nadie ve es una avería silenciosa.

**¿Existe ambiente de pruebas, y quién lo garantiza?**

> ➤ Se pregunta **temprano o no se pregunta**. Si la respuesta es no, el MVP simula y eso
> **queda escrito como no validado**, no como construido. Es la diferencia entre una
> limitación conocida y una sorpresa.

---

## Los niveles de fidelidad del mock

| Nivel | Lo que hay | Lo que hace el mock |
|---|---|---|
| **1** | Solo el nombre de la integración | Se inventa la respuesta |
| **2** | Tipos de dato y rangos | Datos sintéticos coherentes |
| **3** | Contrato o ejemplo de respuesta real | Réplica de la estructura exacta |

**El nivel se muestra en la pantalla del MVP.** Es la misma regla que gobierna los tokens de
la línea gráfica y existe por la misma razón: **alguien valida distinto un dato inventado que
un dato contractual**, y si no se le dice, los valida igual. Un dato de nivel 1 que se ve
como real produce una validación falsa, que es peor que no validar.

---

## Simular la falla

> ➤ El MVP lleva un control que **apaga cada integración** y muestra qué ve el usuario cuando
> el sistema externo no responde.
>
> No es un lujo: es de donde salen los requerimientos que jamás aparecen en un documento.
> Nadie escribe *"cuando el core no responde, el juzgado tiene que poder seguir ingresando la
> orden y se sincroniza después"* — pero en cuanto alguien ve la pantalla caída, lo dice.

---

## Lo que este método NO valida, y hay que decirlo

> ➤ Un MVP navegable valida **el flujo**: qué pantallas hay, en qué orden, qué se ve en cada
> una, qué pasa cuando algo falla.
>
> **No valida los cálculos ni las validaciones internas.** Una liquidación de intereses, una
> regla de prescripción, una distribución por porcentajes: nada de eso se ve en una pantalla,
> y por lo tanto nada de eso queda validado por haber mostrado el MVP.
>
> Ahí puede quedar la ambigüedad más cara del proyecto. **Se dice en voz alta al entregar**,
> con la lista de qué quedó sin validar. Es la diferencia entre una limitación y una mentira.
