# <Nombre del negocio> — Especificación

> ➤ Debajo del título va una frase que diga qué se mide, con qué reglas y qué tiene que ser
> imposible. Y esta declaración de alcance, que vale la pena conservar tal cual:

Qué se mide, con qué reglas y qué tiene que ser imposible. Este documento no dice cómo se
construye: se sostiene solo y sobrevive a cualquier decisión de implementación.

> ➤ **Borra toda línea que empiece con ➤ cuando llenes su sección.** Una sección con la
> instrucción todavía puesta es una sección sin terminar, y se lee como si estuviera lista.

---

## 1. Objetivo

> ➤ Dos o tres párrafos: qué logra alguien con esto que hoy no puede lograr. En las palabras
> del negocio, no en las de la tecnología.

### El sistema responde N preguntas

> ➤ **Esta lista es el ancla de todo el documento.** Todo lo demás existe para contestar
> alguna de estas preguntas; lo que no conteste ninguna, sobra. Escríbelas como las diría la
> persona, en primera persona si hace falta.
>
> Entre cinco y ocho. Menos de cinco casi siempre significa que faltó entrevista; más de
> ocho, que hay dos productos aquí adentro.

1.
2.
3.

### Granularidad

> ➤ Cuál es la unidad de **decisión** (aquello sobre lo que alguien decide algo) y cuál la
> de **captura** (lo que se anota una por una). Casi nunca son la misma, y confundirlas es
> el error de diseño más caro que hay: obliga a la gente a sumar de cabeza.

### Fuera de alcance

> ➤ Lo que deliberadamente no hace, cada cosa con su razón. Escribirlo evita tres reuniones.

---

## 2. Requerimientos

### Lo que el sistema hace

> ➤ Un `RF` por capacidad. Verbo en infinitivo, sin detalle: el detalle es una regla.
> **Estos se escriben de últimos**, cuando ya existen las reglas — ver `metodo/codigos.md`.
>
> ➤ La tercera columna es lo que impide un requerimiento huérfano, y es la misma que lleva
> la tabla del entregable (`plantillas/modulo.md` §4). Un `RF` sin regla detrás casi siempre
> sobra, o esconde una regla que nadie escribió. **Si queda vacía, déjala vacía y dilo**: un
> guion es una pregunta abierta, un código inventado para llenar la casilla es una mentira.

| ID | Requerimiento | Regla que lo gobierna | Estado |
|---|---|---|---|
| RF1 |  | R_ | pendiente |

### Cómo tiene que comportarse

> ➤ Las cualidades `C`. Nombre en negrita, definición, y entre paréntesis la regla o
> invariante con la que se conecta. Si nadie puede decir cómo se comprueba, no es una
> cualidad: es un deseo.

| ID | Cualidad |
|---|---|
| C1 | **<Nombre corto.>** <Qué significa y a quién sirve.> |

---

## 3. Principios

> ➤ De dónde salen las decisiones cuando aparece un caso que nadie previó. Prueba: si mañana
> sale algo que no está escrito, ¿este principio dice qué hacer? Si no, sobra.

| # | Principio | Consecuencia práctica |
|---|---|---|
| P1 | **<Enunciado corto.>** | <Qué se hace y qué no se hace por culpa de este principio.> |

---

## 4. Glosario

> ➤ Tres capas. La primera es la que más se salta y la más útil.

### Del dominio a la pantalla

El glosario es el idioma del dominio. **No es el idioma de la aplicación.**

> ➤ Una palabra de la columna izquierda que aparezca en una pantalla es un **defecto**, no
> una decisión. Ahí es donde se cuela el vocabulario que la gente no entiende.

| En el dominio | En la pantalla |
|---|---|
|  |  |

### Definiciones

> ➤ Todo término ambiguo, en una o dos frases. `- **Término**: definición.`

### Taxonomías

> ➤ Cuando algo tiene estados o variantes, la lista **completa** en una tabla, con qué
> cambia entre uno y otro. Una taxonomía a medias produce el estado que nadie previó.

---

## 5. Reglas de negocio

> ➤ Una subsección `### Rn — Título` por regla. Las partes, en orden: qué decide · la
> fórmula en bloque de código si la hay · los términos ambiguos definidos · tabla de casos
> borde · párrafos titulados en negrita con el porqué · qué pasa cuando falta un dato · de
> qué `P` sale y qué `I` sostiene. Ver `metodo/codigos.md` para un ejemplo completo.

### R1 — <Título>

---

## 6. Invariantes

> ➤ Lo que debe ser **imposible**. Si admite grados, no es invariante: es cualidad.
>
> La columna "Por qué" cita el principio del que sale y, cuando la falla ya ocurrió, **qué
> costó**. Un número concreto sobrevive a tres reuniones.

**La que manda sobre todas:** <cuál, y por qué su incumplimiento no se puede reparar.>

> ➤ Esta línea decide el orden de construcción: la invariante suprema se construye antes que
> la primera tabla de datos. Agregarla encima de algo que ya existe es como se producen las
> fugas que debía impedir.

| # | Invariante | Por qué |
|---|---|---|
| I1 | **<Lo que no puede pasar.>** | <De qué principio sale. Qué costó cuando pasó.> |

---

## 7. Módulos con datos de afuera

> ➤ Solo si el negocio depende de algo que otro sistema provee: una tasa, un precio, un
> catálogo. Necesita su propia cascada de resolución: qué se usa si el dato no llegó, y qué se
> recalcula cuando sí llega. Sus reglas son `R` normales, numeradas con el resto — no hay
> una familia aparte. Si no aplica, borra la sección entera.

---

## 8. Rituales

> ➤ Lo que alguien hace cada día, cada semana o cada mes. No son requerimientos: son el
> ritmo real del negocio, y es lo que decide qué pantalla tiene que ser rápida. Una acción
> que se hace treinta veces al día y una que se hace una vez al mes no se diseñan igual.

---

## 9. Cómo se verifica

Las fórmulas se comparan contra números calculados a mano, nunca contra lo que el sistema
devolvió la primera vez.

> ➤ Tabla de dos columnas. El caso es una situación en prosa **con cifras concretas**; el
> resultado es el número o el comportamiento esperado. No es Gherkin y no es código: es un
> oráculo en lenguaje natural, que sobrevive a cualquier tecnología.
>
> **Toda regla de la §5 necesita al menos un caso aquí.** Una regla sin caso es una regla que
> nadie va a poder comprobar.
>
> Escríbelos **antes** de que exista el sistema. Después, es preguntarle al sistema si está
> de acuerdo consigo mismo: siempre dice que sí.

| Caso | Resultado |
|---|---|
|  |  |

### Fallas que este dominio produce

> ➤ Los errores que ya ocurrieron —en la hoja de cálculo, en el proceso a mano, en el MVP—
> cada uno con el código que ahora lo previene. Esta lista es la que hace que alguien nuevo
> entienda por qué hay reglas que parecen exageradas.

---

## 10. Estado

> ➤ Di la verdad sobre qué está construido. Si no hay nada, dilo: *"Nada de esto está
> construido"*. Un documento que insinúa avance que no existe hace que se tomen decisiones
> con información falsa.

Los frentes, en el orden en que tienen que construirse:

| Orden | Frente | Reglas | Estado |
|---|---|---|---|
| 1 |  |  | pendiente · construido · validado · **caído** |

> ➤ **Esta lista es una hipótesis, no un plan**, y se escribe el día en que menos se sabe: no
> hay nada construido ni nada mostrado. Se revisa al cerrar cada frente y puede reordenarse,
> puede aparecer uno nuevo, y puede caerse alguno.
>
> **Un frente que se cae no se borra: se marca `caído` con la razón.** Alguien va a preguntar
> por él dentro de tres meses, y *"se nos olvidó"* y *"lo quitamos porque X"* son dos
> respuestas muy distintas. Lo mismo con el orden: si se reordena, se dice por qué debajo de
> la tabla — una lista que cambia en silencio es una lista en la que nadie puede confiar.
>
> ➤ Y debajo, la regla de secuenciación. Son dos puntos y no uno — ver `metodo/frentes.md`:
> la **unidad de pertenencia** va en el frente 1, y la **invariante suprema** se hace
> imposible desde el primer día del frente donde nacen los datos que podría violar, que no
> siempre es el 1. **Esos dos no se reordenan nunca**: no dependen de lo que se aprenda
> mirando. El resto del orden es una recomendación por dependencias.

---

## 11. Lo que falta cargar

> ➤ Datos, no decisiones. Las decisiones abiertas viven en `vacios.md`. Aquí van las cifras,
> los catálogos y los documentos que hacen falta para que una regla pueda correr.
>
> ➤ **La tercera columna es la que impide que esta lista se lea como una lista de bloqueos.**
> Un dato que falta casi nunca detiene un frente entero: detiene el criterio con que una regla
> decide, no lo que esa regla hace posible. Un tope necesita su número para rechazar, no para
> contar.
>
> Y si lo que se puede construir sin el dato **no se puede agregar después** —una columna que
> habría que rellenar hacia atrás, un origen que nadie anotó— entonces **va primero, con el
> número faltando**. Ver `metodo/frentes.md`.

| Qué falta | Qué desbloquea | Qué se puede construir sin esto |
|---|---|---|
|  |  |  |
