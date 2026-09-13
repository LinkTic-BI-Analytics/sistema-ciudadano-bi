# <Módulo> — requerimiento

> ➤ **Este es el entregable.** Lo recibe un equipo de desarrollo que no habló con nadie, no
> vio el MVP y no va a poder preguntar. Todo lo que necesite tiene que estar aquí adentro.
>
> El nombre del módulo va en las palabras del negocio, no en las del código: "Reservas de
> espacios comunes", no "módulo de booking".
>
> Borra las líneas ➤ al llenar.

| | |
|---|---|
| **Código** | M0N |
| **Versión y fecha** |  |
| **Salió de** | El MVP `<repositorio>`, commit `<sha>`, `<fecha>` |
| **Depende de** | <módulos que tienen que existir antes> |
| **Lo usan** | <módulos que consumen lo que este entrega> |
| **Estado en el MVP** | construido y visto con gente · construido y no mostrado · diseñado y no construido |

> ➤ La última fila es la más importante de la ficha: es lo que le dice al equipo cuánto
> creerle a este documento. Un módulo "diseñado y no construido" es una hipótesis bien
> escrita, y hay que decirlo.

---

## 1 · Qué resuelve

**Este módulo responde N preguntas:**

1.
2.

> ➤ El ancla, igual que en la especificación. Lo que no conteste ninguna de estas, sobra.

**Lo que NO resuelve.** <Cada cosa con dónde sí vive.>

---

## 2 · A quién sirve y con qué ritmo

- **Quién lo usa:**
- **El recorrido mínimo dentro del módulo:** <numerado>
- **Con qué frecuencia y por cuánto tiempo:**

> ➤ La tercera viñeta condiciona la implementación más que cualquier requerimiento, y casi
> nunca se escribe. "Se abre treinta veces al día y dura segundos" y "una vez al mes, veinte
> minutos" producen dos sistemas distintos: uno necesita que anotar sea instantáneo, el otro
> necesita que todo se pueda auditar.

---

## 3 · Vocabulario

| Palabra del negocio | Qué es | Palabra que NUNCA va en pantalla |
|---|---|---|
|  |  |  |

**Una palabra de la tercera columna que aparezca en una pantalla es un defecto.**

**Definiciones.** <Todo lo ambiguo, en una o dos frases.>

**Estados.** <Las taxonomías cerradas: los estados que puede tener cada cosa, completos. Una
lista a medias produce el estado que nadie previó.>

---

## 4 · `RF` — lo que el módulo hace

| ID | Requerimiento | Regla que lo gobierna | Prioridad |
|---|---|---|---|
| RF_ |  | R_ | imprescindible · esperado · puede esperar |

> ➤ La tercera columna es lo que impide un requerimiento huérfano. Un `RF` sin regla detrás
> casi siempre sobra, o esconde una regla que nadie escribió.

---

## 5 · `C` — cómo tiene que comportarse

| ID | Cualidad | Cómo se comprueba |
|---|---|---|
| C_ |  |  |

> ➤ Una cualidad que nadie puede comprobar es un deseo. Si la tercera columna queda vacía,
> bórrala de la lista o escribe cómo se sabría.

---

## 6 · `P` — la postura de diseño

| ID | Principio | Consecuencia práctica |
|---|---|---|
| P_ |  |  |

---

## 7 · `R` — las reglas

> ➤ Una subsección por regla, con: qué decide · la fórmula · los términos definidos · tabla
> de casos borde · de qué `P` y `C` se deriva · **qué pasa cuando falta un dato**.
>
> Esa última parte es la que más se olvida y la que el equipo más va a necesitar: en
> producción los datos faltan.

### R_ — <título>

---

## 8 · `I` — lo que debe ser imposible

> ➤ Antes de la tabla, un párrafo: **cuál manda sobre todas y por qué su incumplimiento no
> se repara.** De eso depende el orden de construcción del equipo.

| # | Invariante | De dónde sale | Qué costó |
|---|---|---|---|
| I_ |  |  |  |

> ➤ La cuarta columna lleva el costo real cuando lo hay. Un número concreto sobrevive a tres
> reuniones de priorización; una advertencia genérica no llega a la segunda.

---

## 9 · Contrato con el resto del sistema

**Qué recibe**

| Dato | De qué módulo | Qué pasa si no llega |
|---|---|---|

**Qué entrega**

| Dato | Quién lo consume | Con qué frecuencia cambia |
|---|---|---|

**Qué asume garantizado por otro**

| Afirmación | Quién la garantiza | Qué se rompe si es falsa |
|---|---|---|

> ➤ Esta sección es la que hace que un módulo sea autocontenido **sin ser autista**. Sin
> ella, cada equipo asume que el otro valida y nadie valida.

---

## 10 · Cómo se verifica

Las fórmulas se comparan contra números calculados a mano, nunca contra lo que el sistema
devolvió la primera vez.

| Caso | Resultado |
|---|---|

> ➤ Toda regla de la §7 necesita al menos un caso aquí.

**Fallas que ya ocurrieron.** <Cada una con el código que ahora la previene.>

> ➤ Esta lista es lo que hace que el equipo respete reglas que parecen exageradas. Sin ella,
> alguien va a "simplificar" justo la que costó dos sábados.

---

## 11 · Los datos que este módulo necesita

Esto no dice tablas ni motor de base de datos: dice qué tiene que poder existir, de quién
es, y cuánto tiene que durar. Es lo que hace este documento implementable en cualquier
tecnología.

| Cosa | Qué representa | Pertenece a | Ciclo de vida | ¿Se borra? |
|---|---|---|---|---|

---

## 12 · Lo que el MVP probó y lo que no

**Visto con gente de verdad** — <con quién, cuándo, y qué se aprendió.>

**Asumido y nunca visto** — <lo que se construyó pero nadie usó, y lo que ni se construyó.>

> ➤ La segunda lista es la que hace honesto al documento. Un módulo que dice haber probado
> todo miente, y el equipo lo descubre tarde y deja de creerle al resto.

---

## 13 · Lo que queda abierto

| La pregunta | Qué bloquea | Recomendación | Cuándo se vuelve urgente |
|---|---|---|---|

---

## 14 · Orden de construcción sugerido

| Orden | Parte | Códigos | Por qué va aquí |
|---|---|---|---|

**Lo que no es negociable:** <cuál punto del orden, y por qué.>

---

## 15 · Anexo — cómo se veía en el MVP

> ➤ Capturas, una línea cada una con qué se aprendió mirándola. Declarado explícitamente:
> **no es un diseño obligatorio, es evidencia.** Si no se dice, el equipo lo copia píxel a
> píxel y hereda decisiones que se tomaron en veinte minutos.

---

## La prueba del sobre cerrado

Este documento está terminado cuando un equipo que nunca habló con nadie puede
implementarlo. Concretamente:

- [ ] Cada código que se cita se resuelve adentro de este archivo.
- [ ] Cada `R` tiene al menos un caso en la §10.
- [ ] Cada `I` dice qué se rompe cuando falla.
- [ ] No queda una sola referencia a un archivo que el equipo no recibió.
- [ ] Nadie tiene que preguntar qué significa una palabra.
