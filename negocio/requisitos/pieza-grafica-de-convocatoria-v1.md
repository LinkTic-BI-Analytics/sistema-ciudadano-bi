# Pieza gráfica de convocatoria

15 de septiembre de 2026. Ampliación decidida por Miguel Gómez durante la construcción de
`T048`. Complementa `QR-01` … `QR-04` y `RF10` de `M06`. **No declara una implementación
existente.**

> *«No solo agregar el QR sino también hacer el diseño de la convocatoria: algo estándar que nos
> ayude a poner una imagen o elementos importantes estándar como fecha y demás, y poner generar
> pieza gráfica, y algunos formatos.»*

## Propósito

Hoy el sistema genera el enlace y su QR, y ahí se acaba. La pieza —el afiche, el volante, la
publicación— la arma alguien aparte, a mano, copiando los datos.

Eso rompe por donde siempre: **la pieza y el registro se separan**. Alguien copia la fecha vieja,
o el nombre del lugar con una errata, o se olvida de decir que hay transporte. Y un afiche con la
fecha equivocada no se corrige: ya está pegado.

La pieza se genera **desde el mismo registro** que alimenta la agenda pública. Si el encuentro
cambia, lo que cambia es el registro, y la pieza siguiente sale bien.

## PIE-01 · Generar la pieza de un encuentro

**Quién:** Comunicaciones o persona autorizada para preparar materiales.

**Con qué llega:** un encuentro publicado con sus datos vigentes, la convocatoria a la que
pertenece, el enlace de esa pieza con su QR, y el formato elegido.

**Qué queda:** un archivo descargable con **los datos del registro en el momento de generarlo**,
la marca institucional, el QR de esa pieza y su dirección corta legible. Y un asiento de qué se
generó, para qué pieza, cuándo y por quién.

**Formatos de la primera entrega:**

| Formato | Para qué | Proporción |
|---|---|---|
| `afiche` | imprimir y pegar | vertical, carta |
| `volante` | repartir en mano | vertical, media carta |
| `publicacion` | redes, mensajería | cuadrado |
| `historia` | historias de redes | vertical alargado |

Cada formato es **una pieza del enlace**, no un evento distinto: sigue valiendo lo que dice
`QR-01` —*«no hace falta crear un evento duplicado»*—.

**Qué NO hace:** inventar datos que falten; prometer obra, aprobación o representatividad;
generar una pieza que invite a asistir a un encuentro cancelado; depender de un servicio externo
de diseño para producirla.

**Aceptación:** la pieza de un encuentro reprogramado muestra **la fecha vigente**. La de uno
cancelado dice que se canceló y **no invita a ir**. Un encuentro presencial sin lugar no produce
pieza. Dos formatos del mismo encuentro no crean dos eventos.

## PIE-02 · Lo que toda pieza lleva, y lo que no se rellena

**Siempre, sin excepción:**

- nombre de la convocatoria y título del encuentro;
- fecha y hora **con su zona horaria** — «a las 9» no dice nada sin decir dónde son las 9;
- lugar, o la palabra «virtual» con su forma de entrar;
- el QR **y** la dirección corta legible al lado: quien no puede escanear, teclea;
- la marca institucional;
- una frase de límite: que registrar **no es un compromiso de obra**, y que **se puede aportar
  sin asistir**.

**Solo si existen:** tema, ayudas reales, cupos.

**La ausencia se omite, no se rellena.** Si no hay ayudas declaradas, la pieza no dice «sin
ayudas»: no dice nada. Escribir «sin transporte» donde nadie decidió que no lo hubiera convierte
un dato que falta en una negativa, y alguien deja de ir por eso.

**Qué NO hace:** usar abreviaturas de fecha que dependan del país de quien lee; poner texto sobre
la imagen con un contraste que no pase la validación del sistema de diseño.

**Aceptación:** una pieza de un encuentro con transporte lo dice; una de uno que no declaró
ayudas no menciona el transporte de ninguna forma. Todos los pares de color de la pieza pasan la
misma validación de contraste que el resto del producto.

## PIE-03 · Imagen de fondo

**Quién:** Comunicaciones, si quiere.

**Con qué llega:** una imagen propia.

**Qué queda:** la pieza con esa imagen detrás, con una capa que **garantiza el contraste del
texto** por encima.

**Qué NO hace:** usar fotografías de personas identificables sin autorización escrita —una
convocatoria pública no autoriza a usar la cara de quien fue a la anterior—; usar imágenes que
sugieran obra ya ejecutada o beneficio prometido; dejar que la imagen tape el QR o la dirección.

**Aceptación:** sin imagen, la pieza se genera igual y se lee igual. Con una imagen que impida el
contraste mínimo, **la pieza se genera con la capa que lo restituye**, no sin ella.

## PIE-04 · La pieza no sustituye al registro

Una pieza descargada es **una foto de un momento**. Si el encuentro cambia después, el papel ya
repartido no cambia — y no se promete que cambie.

Lo que sí sigue vigente es el QR: lleva a la ficha, y la ficha muestra el estado real. Eso ya lo
resuelve `QR-04`, y esta ampliación no lo toca.

**Qué NO hace:** prometer que las piezas ya distribuidas se actualizan solas; borrar el asiento
de una pieza generada cuando el encuentro cambia —es lo que permite saber qué se repartió—.

## Lo que esta ampliación NO cubre

- **Plantillas por entidad o por territorio.** Hay una sola familia visual, la del sistema de
  diseño.
- **Edición libre del diseño.** Si hiciera falta mover cosas, es otra conversación: el valor de
  esto es justamente que todas las piezas se parezcan y digan lo mismo.
- **Impresión, distribución y presupuesto.** No es software.
- **Medición de qué pieza funcionó.** Eso es `QR-05`, y sigue sin construirse.
