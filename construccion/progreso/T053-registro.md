# Registro — T053 · Diez aportes invisibles

**De dónde sale:** diez casos registrados a propósito por el negocio —de Leticia a San José del
Guaviare— y esta frase: *«no es tan fácil encontrar estos aportes… no es tan claro ver los más
recientes»*.

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | 2 recorridos nuevos sobre el conteo y el orden | `consola.spec.ts` |

## No era percepción: no estaban

Lo primero fue mirar la base en vez de la pantalla. Los diez estaban en las **posiciones 97 a 106
de 106**, y la bandeja corta en 50.

**No estaban en la página, y nada lo decía.** Es el mismo defecto que dejó 122 municipios fuera
del buscador: un corte callado. No falla, no avisa, y el dato simplemente no está — con la
diferencia de que aquí el revisor cree que ya lo vio todo.

## Lo que se arregló

**Se dice cuántos hay.** *«Mostrando 50 de 106»*, siempre, y un enlace para ver más con cuántos
quedan fuera. Un número que no cuadra se nota; una ausencia, no.

**Se puede ver lo recién llegado**, sin perder el orden de trabajo. Son dos preguntas distintas y
hasta hoy solo se podía hacer una:

| Pregunta | Orden |
|---|---|
| ¿Qué atiendo ahora? | el que lleva más esperando — **manda por defecto** |
| ¿Qué acaba de entrar? | los últimos que llegaron |

**Ninguno de los dos es una puntuación**, y eso no cambia: `BI-02` prohíbe ordenar por
popularidad, y el día que llegue un aporte con mil apoyos seguirá esperando su turno igual que el
de una vereda con uno. La razón está escrita en la pantalla, al lado del selector, para que no se
pierda cuando alguien se pregunte por qué no hay un «más urgentes».

## Lo que esto repite

Es la tercera vez en esta construcción que el defecto es **un corte silencioso**:

1. PostgREST devolviendo 1.000 de 1.122 municipios con un `200`;
2. la bandeja mostrando 50 de 106 sin decirlo;
3. y antes, una prueba que contaba campos sobre una página que aún no había cargado.

Los tres tienen la misma forma: **algo devuelve menos de lo que hay y nada lo indica**. El
antídoto que ha funcionado las tres veces es el mismo — decir siempre el total al lado de lo
mostrado, y comparar uno contra otro.

## Lo que queda abierto

**No hay paginación de verdad**, solo un «ver más» que sube el tope. Con miles de aportes hará
falta paginar en la base y no en memoria; hoy se leen hasta 2.000 filas para poder contar.

**No hay filtro por fecha ni por territorio**, que es lo que de verdad haría falta para trabajar
diez casos de diez departamentos distintos.
