# Registro — T044 · Un problema a la vez

**Autoridad:** el negocio — *«algunas personas podrían llegar con muchas cosas a la vez y esto
podría ser difícil de mapear»* · `N03` · `R1` · `IA-01`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 19 recorridos, 4 nuevos sobre varios problemas y el lugar no ubicable | `afinar.spec.ts` |
| 2026-09-14 | 3 pruebas de la separación, una con un problema inventado | `lectura-ia.test.ts` |
| 2026-09-14 | Proveedor de IA falso para los recorridos | `pruebas/e2e/ia-falsa.ts` |

## Tres necesidades en un aporte no son una

Alguien escribe *«no hay agua, la vía está muy mala y el puesto de salud abre dos días»*. Son
**tres necesidades**: cada una va a una entidad distinta, abre su propio expediente, se compara
con otras distintas y se prioriza aparte.

Mezcladas en un aporte **ninguna se puede atender**. No hay a quién remitirla —¿acueducto, obras
o salud?— ni con qué compararla, y la ubicación, la afectación y la prioridad que se capturan
después son de las tres a la vez, o sea de ninguna.

Ahora, si la lectura encuentra más de una, lo primero que se ve es *«Nos contaste 3 cosas… ¿por
cuál empezamos?»*. Se escoge una, y **lo primero que dice la pantalla es que no se pierde nada**:
si no, escoger se siente como que le estamos borrando lo demás. El relato original queda entero
—`N03`— y al final se le ofrece contar las otras, cada una como su propio aporte.

Y hay salida: *«en realidad es una sola cosa»*. La instrucción al modelo tira hacia ahí —*«no hay
agua y cuando llega sale turbia» es UNA; ante la duda, UNA*— porque partir de más crea dos
expedientes para lo mismo, que es justo lo que `R1` existe para evitar.

## Un proveedor falso, y por qué no es un atajo

**La mitad del producto no se podía probar.** Con la IA de verdad, cuántas vueltas ve la persona y
si contó una cosa o tres depende de lo que el modelo decida esa vez, y una prueba que depende de
eso no prueba nada. Con la IA apagada, esos caminos sencillamente no existen.

Ahora los recorridos levantan un proveedor propio que habla la misma API —*chat completions*— y
contesta siempre lo mismo. Se ejercita **el código real de punta a punta**: la llamada, el `JSON`,
el guardián de anclaje y la pantalla. Lo único fingido es qué contesta el modelo.

El cambio en producción es una línea: la URL del proveedor se puede apuntar a otro sitio, que
además es lo que hará falta el día que la entidad ponga su propia pasarela.

## Y destapó un agujero el primer día

Con el proveedor falso, un recorrido empezó a fallar: la lectura traía **«de la vereda está
intransitable»** como lugar. Es un lugar dentro de una frase y no lleva a ningún municipio — pero
como el campo venía lleno, la pregunta se daba por contestada y **no se volvía a preguntar**.

Es el mismo agujero que «en mi casa», por otro camino. Ahora el paso del municipio corre siempre:
si ya dijo dónde, va justo después de confirmar lo entendido; si no lo dijo, va detrás de la
vuelta que lo pregunta.

**No lo vio ninguna revisión de código.** Lo vio una prueba que hasta hoy no se podía escribir.

## Lo que queda abierto

**Los otros problemas no se registran solos.** Se le ofrece contarlos y la caja llega con el texto
puesto, pero es ella quien decide. Registrarlos automáticamente sería crear aportes que nadie
escribió, y `N03` dice que el original manda.

**No está medido** si escoger entre tres opciones hace abandonar. Va a la lista del piloto con lo
demás.
