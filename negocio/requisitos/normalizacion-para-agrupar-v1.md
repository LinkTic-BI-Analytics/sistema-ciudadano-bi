# Normalización para poder agrupar

15 de septiembre de 2026. Ampliación decidida por Miguel Gómez durante la construcción.
Complementa `CLA-01`..`CLA-05` y `GES-01`..`GES-04`. **No declara una implementación existente.**

> *«Podemos correr algo que estandarice estas respuestas para poder identificar elementos,
> agruparlos y ver por ejemplo cuáles son las comunidades que tienen más afectaciones del agua
> con más de 4 años… En el aporte es literal lo que escribe la persona, pero ahí puede llegar
> mucha información. Nuestro objetivo es optimizar lo que mostramos en ese aporte para poder
> verlo más rápido, y al lado poner lo que dice la persona en letras pequeñas, pero que medio se
> pueda ver.»*

## Propósito

El objetivo del sistema es **ser una línea de alimentación al sistema nacional de planeación**.
Una línea de alimentación no entrega relatos sueltos: entrega hechos con atributos comparables.

Hoy tenemos el tema (`CLA-01`) y el municipio (`GES-01`). Con eso se puede preguntar «cuántos
aportes de agua hay en Rionegro». No se puede preguntar **«cuáles llevan más de cuatro años»**,
que es la pregunta que distingue un problema crónico de uno de la semana pasada — y es
exactamente la que cambia a quién le compete y con qué urgencia.

El dato existe: la persona escribió «desde hace cuatro años» o «desde que tengo memoria». Lo que
falta es poder **agruparlo sin perderlo**.

## La regla que ordena todo lo demás

**Lo derivado nunca sustituye lo dicho, y siempre se puede ver de dónde salió.**

`I2` prohíbe inferir la ubicación; ADR 0012 prohíbe convertir «hace tres meses» en una fecha,
porque nadie sabe si son noventa días o el año pasado; `N03` dice que la síntesis nunca
reemplaza al relato. Nada de eso cambia aquí. Lo que se agrega es una **lectura declarada** al
lado del texto: un rango, no una cifra; con el texto original visible; y **vacía cuando no se
puede decir**, que va a ser muy a menudo.

Un rango vacío es información: dice que la persona no lo precisó o que no supimos leerlo. Un
rango inventado es una mentira que después alguien usa para decidir presupuesto.

## NOR-01 · Hace cuánto: un rango, nunca una fecha

**Quién:** nadie. Se deriva del texto que la persona ya escribió.

**Con qué llega:** `desde_cuando`, tal como ella lo dijo.

**Qué queda:** uno de cuatro rangos, **y el texto intacto**:

| Rango | Qué lo dispara |
|---|---|
| `menos_de_un_ano` | días, semanas, meses; un mes nombrado del año en curso |
| `entre_uno_y_cuatro` | «un año», «dos años», «hace tres años» |
| `mas_de_cuatro` | «cinco años», «más de cuatro años», «siempre», «desde que tengo memoria», «toda la vida» |
| `sin_decir` | no lo dijo, o lo dijo de una forma que no sabemos leer |

**Qué NO hace:** calcular una fecha; convertir el rango en meses; tratar `sin_decir` como cero;
mover un aporte de rango porque pasó el tiempo — el rango dice qué declaró ella **el día que lo
contó**, y eso no cambia después.

**Aceptación:** «el agua nos falta desde hace cinco años» cae en `mas_de_cuatro` y la pantalla
sigue mostrando «desde hace cinco años». «Desde que llegaron las lluvias» cae en `sin_decir` y
lo dice: *no se puede saber*, no *cero*.

## NOR-02 · A cuántos: un rango, nunca un número

**Con qué llega:** `afectados`, tal como ella lo dijo.

**Qué queda:** uno de cuatro rangos y el texto intacto:

| Rango | Qué lo dispara |
|---|---|
| `una_familia` | «mi familia», «nosotros», «en mi casa», «una familia» |
| `varias_familias` | un número hasta 20, «unas cuantas familias», «la cuadra» |
| `una_comunidad` | «la vereda», «el barrio», «la escuela», números mayores |
| `sin_decir` | no lo dijo, o no sabemos leerlo |

**Qué NO hace:** publicar el número declarado como si fuera un censo. `Q11` está abierto
precisamente ahí: *«doce familias de la vereda X»* identifica, y choca con `C2`. El rango es
menos preciso **a propósito**, y por eso puede mostrarse donde el número no.

## NOR-03 · El aporte se lee en dos líneas, con sus palabras al lado

**Quién:** quien revisa.

**Qué queda:** en la bandeja, cada fila muestra **el problema y lo que se espera**, tal como la
persona los confirmó (`V14`), y **debajo, en letra pequeña, el relato literal**.

Hoy la fila muestra los primeros 70 caracteres del relato crudo. Eso obliga a leer redacción
para saber de qué se trata, y con relatos largos —el único aporte humano de la base mide 226
caracteres, cinco veces la mediana— el corte deja fuera justo lo que importa.

**Qué NO hace:** esconder el relato. `N03` no admite que la síntesis lo sustituya, ni en la
ficha ni en una lista: si la síntesis va arriba, el original va debajo y **se puede leer**, no
insinuar. Un aporte que todavía no tiene síntesis confirmada muestra su relato como hasta ahora.

## NOR-04 · Preguntar por un cruce, sin inventar un ranking

**Quién:** quien revisa.

**Qué queda:** la bandeja se puede filtrar por **tema + territorio + hace cuánto + a cuántos**, y
dice **cuántos hay de cuántos**.

Esa es la pregunta del negocio: *«cuáles son las comunidades que tienen más afectaciones del agua
con más de cuatro años»*. Se contesta filtrando y leyendo el total, no con una tabla ordenada de
mayor a menor.

**Qué NO hace:** ordenar por cantidad, pintar un mapa de calor, ni poner un municipio antes que
otro porque tiene más aportes. `BI-02` lo prohíbe como pantalla por defecto, y la razón no es
estética: el municipio con dieciocho aportes tiene más gente con teléfono, no necesariamente más
necesidad. **La inteligencia de negocio la construye otro equipo**; lo que sale de aquí son los
atributos con los que podrá hacerlo.

**Aceptación:** con un filtro de tema `agua`, rango `mas_de_cuatro` y departamento, la bandeja
lista los aportes que cumplen las tres cosas y dice cuántos son. Ninguna pantalla ordena por ese
número.

## NOR-05 · Lo derivado se puede corregir, y se ve que se corrigió

**Quién:** quien revisa.

**Qué queda:** el rango puede cambiarse a mano, con motivo y firma, y queda en auditoría con el
valor anterior.

Es lo mismo que `GES-02` dice del municipio y del tema: son etiquetas nuestras para enrutar y
agrupar, no afirmaciones de la persona. Corregir un rango no toca el texto que ella escribió.

**Qué NO hace:** dejar que una corrección cambie el texto declarado; borrar el valor derivado
automáticamente cuando alguien lo corrigió a mano.

## Lo que hace falta antes de creerle a esto

La base tiene **un solo aporte humano**. Las frases con las que se prueba la normalización salen
de la ayuda del propio formulario y de lo que escribió un agente, no de cómo habla la gente. El
reparto real de rangos —y si «sin_decir» se come el 80 %— solo se sabrá con diez o veinte
personas contando de verdad.

Hasta entonces, la regla de diseño es **fallar hacia `sin_decir`**: es mejor una bandeja que
admite que no sabe que una que agrupa mal y nadie lo nota.
