# Clasificación y recurrencia

15 de septiembre de 2026. Ampliación decidida por Miguel Gómez durante la construcción.
Complementa `RF2` (revisión), `RF12`/`PRI-01` (prioridad) y `M07` (gestión). **No declara una
implementación existente.**

> *«Esta información es la base para luego clasificar y priorizar, pero con esta información es
> muy difícil lograrlo realmente… La gestión podría hasta previamente estar medio llena por lo
> que entendimos y la persona confirma.»*

## Propósito

Hoy se captura un relato, un lugar, a quiénes afecta y desde cuándo. Con eso **no se puede
clasificar ni priorizar**: el revisor tiene que leer cada relato entero para saber siquiera si
habla de agua o de una vía.

Y lo que falta no es más texto. Falta **un eje**: el tema. Sin él no se puede agrupar lo que se
repite, ni saber a qué entidad compete, ni ver que veinte personas de un municipio están
contando lo mismo.

Cinco aportes reales lo muestran: agua en Montería, el techo de una escuela en Popayán, el
transporte en Tunja, un puesto de salud en Neiva y residuos en Armenia. **Cinco temas, cinco
municipios, y ninguna forma de decirlo sin leerlos.**

## CLA-01 · El tema lo propone la lectura y lo confirma la persona

**Quién:** la persona que cuenta. La lectura solo propone.

**Con qué llega:** su relato.

**Qué queda:** un tema de la lista, **dicho por ella**. O ninguno, si no se reconoce en ninguno.

La lista de la primera entrega es **provisional** y así se dice en pantalla. La especificación
dejó las taxonomías sin cerrar (`T018`), y una lista inventada en la construcción no es una
taxonomía acordada — es un punto de partida que hay que confirmar antes del piloto.

| Tema | Cubre |
|---|---|
| `agua` | acueducto, alcantarillado, pozos, agua que llega sucia o no llega |
| `vias` | vías, puentes, andenes, transporte público y escolar, cómo salir del pueblo |
| `salud` | puestos y centros de salud, citas, medicamentos, ambulancias, salud mental |
| `educacion` | colegios, profesores, alimentación escolar, cupos, internet para estudiar |
| `energia` | luz, cortes de energía, alumbrado público, gas |
| `residuos` | recolección de basuras, puntos críticos, reciclaje |
| `conectividad` | internet, señal de celular, telefonía |
| `vivienda` | vivienda, mejoramiento, titulación, parques y espacio público |
| `ambiente` | contaminación, deforestación, minería y su efecto, riesgo de derrumbe o inundación |
| `seguridad` | delitos, extorsión, grupos armados, convivencia, violencia en el barrio |
| `mujeres` | violencia contra la mujer, violencia intrafamiliar, cuidado de niños o enfermos, autonomía económica |
| `campo` | cultivos, tierra, crédito y asistencia técnica, precios, comprar y vender la cosecha |
| `empleo` | no hay trabajo, informalidad, emprender, capacitación para trabajar |
| `apoyo` | hambre, subsidios que no llegan, adulto mayor sin pensión, discapacidad, primera infancia |
| `justicia` | trámites que no avanzan, corrupción, no hay a quién reclamar, denuncias sin respuesta |
| `cultura` | cultura, deporte, recreación, casas de la cultura, canchas y escenarios |
| `animales` | animales callejeros, maltrato animal, esterilización |
| `otro` | lo que no encaja — **y sale en la bandeja como lo que es** |

**Los siete del medio se agregaron el 15 de septiembre de 2026**, leyendo un programa político
que Miguel trajo como insumo. Lo que se tomó de ahí fue **el inventario de en qué se va a
gobernar**, no los nombres: los temas se llaman como el sector, no como el capítulo de un
programa.

La razón no es de estilo. La lista es lo que le ponemos encima a lo que alguien contó, y el
encuadre de una campaña ahí convierte el relato de una persona en una posición política que ella
no tomó — justo lo que `N18` prohíbe cuando dice que no se usen *«preferencias políticas
inferidas»*. Y hay un costo práctico: **el PND lo escribe quien gane**, así que una taxonomía
amarrada a un programa obliga a reclasificar todo lo capturado el día que cambie el gobierno.

Cada uno de los siete es alguien que antes caía en `otro`: una mujer que reporta violencia
intrafamiliar, quien dice «aquí no hay trabajo», quien no tiene qué comer, quien lleva dos años
sin que le respondan un trámite, el que pide una cancha, el que denuncia maltrato animal.

**Lo que cubre cada tema va dentro del prompt**, no solo aquí. Con diecisiete etiquetas el
nombre no alcanza: «me toca caminar dos horas para cobrar el subsidio» puede ser `vias` o
`apoyo`, y una lista sin fronteras devuelve `otro` o devuelve cualquier cosa. Dos fronteras se
dicen explícitas porque se equivocan solas: la violencia dentro de la casa va en `mujeres` y no
en `seguridad` —llega a otra ruta de atención—, y `otro` no sirve para no decidir entre dos que
encajan.

**Qué NO hace:** asignar un tema en silencio; obligar a escoger uno para poder enviar; tratar
`otro` como un cajón que se ignora — un tema que se repite en `otro` es la señal de que a la
lista le falta algo.

**Aceptación:** una persona que cuenta lo del agua ve `agua` propuesto y lo confirma de un toque.
Otra que cuenta algo que no encaja puede dejarlo sin tema y su aporte entra igual. El tema
propuesto y el confirmado se distinguen en el registro.

## CLA-02 · Lo que la ficha deja ver de un vistazo

**Quién:** el revisor.

**Qué queda:** nada — es una pantalla.

Antes de leer el relato, tiene que ver: **dónde** (el municipio aceptado, no el texto declarado),
**de qué** (el tema), **a quiénes**, **desde cuándo**, **cuántos más** hay como este, y **qué
falta**.

**Qué NO hace:** enterrar el municipio dentro de un párrafo; mostrar el lugar declarado como si
fuera el aceptado; presentar el tema propuesto por la lectura como si lo hubiera dicho la persona.

**Aceptación:** con la ficha abierta y sin leer el relato, se puede decir de qué va, dónde, y si
es un caso aislado o uno de muchos.

## CLA-03 · La recurrencia se calcula, nunca se declara

**Qué queda:** un número derivado: **cuántos otros aportes del mismo tema hay en el mismo
municipio**.

Sale del grafo, como toda la telemetría de este proyecto (`interfaz.md` I2): nadie lo teclea y
nadie lo puede ajustar.

**Y dice su denominador.** Es *cuántos aportes*, no *cuánta gente*: dos aportes pueden ser de la
misma persona, y veinte personas de un barrio pueden no haber contado ninguno. Presentarlo como
población es exactamente lo que `BI-02` prohíbe.

**Qué NO hace:** ordenar la bandeja por recurrencia —eso sería la puntuación que `PRI-01` no
tiene—; sumar aportes de municipios distintos como si fueran el mismo problema; tratar un caso
único como menos grave.

**Aceptación:** un aporte de agua en un municipio donde hay otros cinco de agua muestra «5 más
como este». Uno único muestra que es el único, **sin que eso lo mande al final de la fila**.

## CLA-04 · La gestión llega medio llena

**Quién:** el revisor, que confirma o cambia.

**Con qué llega:** lo que la persona confirmó.

**Qué queda:** el expediente, abierto **por un acto suyo**, con su motivo.

El formulario de abrir expediente llega con la descripción y el cambio esperado ya escritos, a
partir de lo que la persona confirmó. Se puede cambiar todo.

**Qué NO hace:** abrir nada solo; guardar sin motivo; presentar lo propuesto como si ya estuviera
decidido. **Rellenar no es decidir**: el acto sigue siendo del revisor y queda a su nombre.

**Aceptación:** abrir un expediente sobre un aporte completo son dos clics y una razón escrita.
El expediente guarda quién lo abrió, no quién lo propuso.

## CLA-05 · Juntar lo que la lectura separó de más

**Quién:** la persona que cuenta.

**Con qué llega:** dos o más fragmentos que la lectura marcó como problemas distintos.

**Qué queda:** un solo problema, **con el texto de todos**.

Separar de más es tan malo como juntar de más. La lectura partió *«tenemos problemas con el agua
potable»* y *«esas aguas llegan con un color negro que parece petróleo»* en dos, y son lo mismo
dicho dos veces: dos expedientes para eso es justo lo que `R1` existe para evitar.

Y la pantalla no puede afirmar lo que no sabe: dice **«puede que cada una vaya a una entidad
distinta»**, no «cada una va». Afirmarlo empuja a partir algo que no había que partir.

**Qué NO hace:** quedarse con un fragmento y descartar los otros —el relato sigue guardado, pero
lo que el revisor va a leer ya no lo diría—; juntar por su cuenta; impedir separar después
corrigiendo la síntesis.

**Aceptación:** al juntar dos fragmentos, los dos textos aparecen en lo que se va a revisar. Un
aporte juntado no deja «pendientes» que ofrecer al final.

## Lo que esta ampliación NO cubre

- **Competencia** — a qué entidad le toca. Depende del tema **y** del municipio, y eso es un
  catálogo que nadie ha dado.
- **Agrupar aportes en un expediente automáticamente.** `R1` existe para que dos expedientes no
  digan lo mismo, y agrupar sin que alguien lo decida es la forma más rápida de perder un disenso.
- **La taxonomía definitiva.** Va con `T018`.
