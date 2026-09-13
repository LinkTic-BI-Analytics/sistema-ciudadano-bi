# Las cinco familias

Todo lo que se descubre de un negocio cae en una de cinco cajas. Cada caja tiene una letra,
un número corrido y una forma de escribirse.

No es burocracia: es lo que permite que un documento de mil líneas se navegue. Cuando una
regla dice *"de aquí sale I4"*, quien la lee puede ir a I4 y volver. Sin códigos, un
documento largo se lee una vez y después nadie lo vuelve a abrir.

| Letra | Qué es | Pregunta que contesta |
|---|---|---|
| `RF` | Requerimiento funcional | ¿Qué **hace** el sistema? |
| `C` | Cualidad | ¿Cómo tiene que **comportarse**? |
| `P` | Principio | ¿Desde qué **postura** se decide? |
| `R` | Regla de negocio | ¿Con qué **aritmética** o con qué criterio? |
| `I` | Invariante | ¿Qué tiene que ser **imposible**? |

---

## El árbol de decisión

Esta es la parte que hay que tener a mano. La confusión no es entre cinco cosas: es entre
dos parejas que se parecen.

```
Alguien dijo una frase sobre el negocio.

¿Describe algo que NUNCA puede pasar, ni por error?
│
├── SÍ ──▶ ¿Si pasara, se podría arreglar después?
│           ├── NO se puede arreglar  ──▶  I  (y es candidata a invariante suprema)
│           └── Sí se puede arreglar   ──▶  I  (normal)
│
└── NO ──▶ ¿Es una cuenta, una fórmula o un criterio con umbral?
            │
            ├── SÍ ──▶ R
            │
            └── NO ──▶ ¿Es una acción que alguien va a poder hacer en una pantalla?
                        │
                        ├── SÍ ──▶ RF
                        │
                        └── NO ──▶ ¿Es una propiedad de todo el sistema
                                    (rapidez, claridad, aislamiento, una sola verdad)?
                                    │
                                    ├── SÍ ──▶ C
                                    └── NO ──▶ P
```

**La confusión de siempre — `I` contra `C`.** *"Ningún residente ve las reservas de otro
conjunto"* suena a cualidad y es invariante. La diferencia: una cualidad se puede cumplir
mejor o peor; una invariante se cumple o se rompe. Si admite grados, es `C`. Si es
binaria y su incumplimiento es un incidente, es `I`.

**La otra confusión — `R` contra `RF`.** *"El residente puede reservar el salón"* es `RF`.
*"Cada apartamento tiene tres reservas al mes y una cancelada después del jueves cuenta
igual"* es `R`. El `RF` dice que existe el botón; la `R` dice qué pasa cuando se aprieta.

---

## `RF` — lo que el sistema hace

Una fila de tabla. Verbo en infinitivo, una capacidad, sin detalle.

```
| ID | Requerimiento | Estado |
|---|---|---|
| RF7 | Reservar un espacio para una fecha y una franja | listo |
| RF8 | Cancelar una reserva propia y ver si el cupo se devuelve | listo |
```

**Bien:** `Ver quién tiene reservado cada espacio esta semana`
**Mal:** `Gestionar reservas` — "gestionar" no es nada. ¿Crear? ¿Borrar? ¿Aprobar?
**Mal:** `Reservar un espacio validando el cupo mensual del apartamento y descontando las canceladas después del corte` — eso es una regla disfrazada de requerimiento. El `RF` dice qué se puede hacer; la `R` dice con qué reglas.

Un `RF` que no se puede rastrear a una `R` casi siempre sobra. Es el modo de falla de las
historias de usuario: veinte funciones sueltas sin una regla detrás.

---

## `C` — cómo tiene que comportarse

Nombre en negrita, definición, y a quién sirve. Van con referencia cruzada.

```
| C4 | **Un apartamento, un solo dato.** Las reservas pertenecen al apartamento, no a quien
las sacó. Dos residentes del mismo apartamento ven y mueven exactamente lo mismo (R5). |
```

**Bien:** `**Una sola verdad.** Que dos pantallas muestren números distintos de lo mismo tiene que ser imposible, no improbable.`
**Mal:** `El sistema debe ser rápido y confiable.` — no dice nada que alguien pueda comprobar.

Prueba: **si nadie puede decir cómo se comprueba, no es una cualidad, es un deseo.**
Escribe al lado cómo se sabría que se cumple.

---

## `P` — la postura de diseño

Dos columnas: el enunciado corto y su consecuencia práctica. Los principios son de dónde
salen las reglas cuando aparece un caso que nadie previó.

```
| # | Principio | Consecuencia práctica |
|---|---|---|
| P6 | **Nada se inventa** | Si no se sabe a qué hora fue, no se registra la hora. Un dato inventado es peor que un espacio vacío. |
| P7 | **El sistema no decide, pero tampoco deja solo** | Quitarle el cupo a alguien es una decisión humana. Decir "no se puede" sin decir qué sí se puede no es acompañar a nadie. |
```

**Bien:** un principio se puede usar para resolver un caso que no está escrito.
**Mal:** `Priorizar la experiencia del usuario` — con eso no se resuelve nada.

Prueba: si mañana aparece un caso que la especificación no contempla, ¿este principio dice
qué hacer? Si no, no es un principio.

---

## `R` — las reglas de negocio

La unidad más rica. Va en subsección propia, no en tabla.

````markdown
### R3 — Cupo mensual del apartamento

```
disponible = tope_mensual − usadas − canceladas_despues_del_corte
```

El **corte** es el jueves a las 6:00 p.m. de la semana de la reserva. Cancelar antes del
corte devuelve el cupo; cancelar después, no.

| Caso | Disponible |
|---|---|
| Tope 3, ninguna usada | 3 |
| Tope 3, una usada, una cancelada el martes | 2 |
| Tope 3, una usada, una cancelada el viernes | 1 |

**Por qué hay corte.** Sin él, cancelar el sábado a las 8:00 a.m. sale gratis y el salón
queda vacío un sábado. El corte no castiga: le da a la lista de espera tiempo de reaccionar.

**Qué pasa si falta un dato.** Un apartamento sin tope configurado usa el tope del conjunto
(P6: no se inventa un tope por apartamento).

Se deriva de P7 y sostiene a I5.
````

Las partes, en orden: **qué decide** · **la fórmula en bloque de código** · **los términos
ambiguos definidos** · **tabla de casos borde** · **párrafos titulados en negrita con el
porqué** · **qué pasa cuando falta un dato** · **de qué `P` sale y qué `I` sostiene**.

No todas las reglas tienen fórmula. Una regla puede ser un criterio: *"una reserva de más
de cuatro horas necesita autorización de la administración"*. Lo que no puede faltar es el
porqué y los casos borde.

---

## `I` — lo que debe ser imposible

Tabla, con una columna que casi nadie escribe y es la más valiosa: **el porqué, y el costo
cuando ya ocurrió.**

```
| # | Invariante | Por qué |
|---|---|---|
| I1 | **Un espacio nunca queda reservado dos veces para el mismo instante.** | La suprema. Dos familias llegan el sábado con el grado del hijo y una se tiene que ir. No hay compensación posible. |
| I3 | **Cancelar y asignarle el cupo al primero de la lista son un solo acto.** | R4. Separados, el cupo queda libre unos segundos y se lo lleva alguien que no estaba esperando. Pasó dos veces en marzo. |
```

Un número concreto sobrevive a tres reuniones; una advertencia genérica no. Si la falla ya
ocurrió, escribe qué costó — plata, tiempo, o a quién le pasó qué.

**Una de las invariantes manda sobre todas.** Escoge la única cuyo incumplimiento **no se
puede reparar** y dilo en el README del negocio. Es la que decide el orden de construcción:
se construye antes que la primera tabla de datos, no después.

---

## `M` no es una sexta familia

`M02` es el **número de un módulo entregado**, no un código de regla. Los módulos se numeran
aparte porque son documentos, no afirmaciones sobre el negocio. Adentro de un módulo, los
códigos son los mismos cinco y con los mismos números que en la especificación.

## Cómo se numeran

- **`P` es solo para principios.** Las preguntas abiertas de `vacios.md` se numeran con
  `Q`. Es la colisión más fácil de cometer y la más cara: dos cosas distintas con el mismo
  código convierten en mentira todo lo que las citaba.
- **`D` es solo para el catálogo.** Los vacíos ya decididos se numeran con `V`, y las formas
  de pregunta que los produjeron van entre corchetes: `[D1]`. La familia `D` del catálogo
  —las cuentas— tiene sus propias `D1` a `D4`, y numerar las filas con `D` las hace
  indistinguibles. No es teórico: en el ejemplo se citó *"el vacío D3"* queriendo decir la
  fila 23, y la referencia apuntó a otra decisión durante meses.
- **Corridos y para siempre.** `R7` es `R7` aunque la regla cambie. No se reciclan: un
  código reusado convierte en mentira todo lo que lo citaba.
- **Una regla que se muere no se borra**: se marca *reemplazada por Rn* y se deja. Alguien
  va a leer un documento viejo que la cita.
- **No se renumera para "que quede ordenado".** Se pierden todas las referencias cruzadas.
- Los códigos de un módulo entregado son **los mismos** de la especificación. Si `R3` en el
  módulo no es `R3` en la especificación, el entregable dejó de ser rastreable.

---

## Las tres reglas de escritura

Estas tres son lo que separa un documento que se usa de uno que se archiva.

**1 · Cada afirmación trae su porqué.** No *"el corte es el jueves"* sino *"el corte es el
jueves porque sin él cancelar el sábado sale gratis y el salón queda vacío"*. Una regla sin
razón se racionaliza en la primera discusión: alguien dice "en este caso no aplica" y nadie
tiene con qué responderle.

**2 · Cada regla cita los códigos de los que se deriva.** El documento es un grafo, no una
lista. Es lo que permite preguntar "si cambio P7, ¿qué se rompe?" y tener respuesta.

**3 · El fracaso se documenta con su costo.** Lo que se rompió, cuándo, y cuánto costó. Es
la información que hace que una regla se respete: *"pasó dos veces en marzo"* convence a
quien *"es importante mantener la consistencia"* no convence.

Ver [como-se-escribe.md](como-se-escribe.md) para el estilo de la prosa.
