# Registro — T048 · Encuentros, QR por pieza y contexto

**Autoridad:** `negocio/fuentes-2026-09-11/requisitos_qr_atribucion_y_contexto_evento_v1.md`
(`QR-01` … `QR-05`) · `M06` `RF10` · `M01` captura

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | 9 pruebas de enlaces y contexto | `pruebas/enlaces.test.ts` |
| 2026-09-15 | 5 recorridos: crear, generar, escanear, cambiar, contar | `pruebas/e2e/qr.spec.ts` |
| 2026-09-15 | Tabla `enlace` y cuatro columnas de contexto en `aporte` | `16_enlace.sql`, `03_aporte.sql` |

## Lo que estaba escrito y no estaba construido

Tenía razón el negocio: **nada de esto existía**. Ni el creador de encuentros ni los QR. El
requerimiento sí: 114 líneas, de `QR-01` a `QR-05`, con su ejemplo completo.

## La separación que sostiene todo

La primera página del requerimiento lo dice y es toda la arquitectura:

> separar **de dónde vino el enlace**, **en qué evento dice participar la persona** y **dónde
> ocurre el problema que está reportando**. Estos datos pueden ser distintos y los tres son
> útiles.

Así que son tres columnas separadas en `aporte`, y el ejemplo del requerimiento se recorre
entero en una prueba: alguien recibe reenviado el QR del evento **A** mientras está en el evento
**B**, y cuenta un problema de una vereda del municipio **C**. **Un solo aporte, tres contextos,
ninguna asistencia.**

Lo de «ninguna asistencia» se comprueba contra el esquema y no contra una fila: mientras no
exista una tabla de asistencia no hay dónde inventarla, y el día que exista esa prueba falla y
obliga a decidir qué la crea. Porque abrir un QR, no.

## Lo que la pantalla no dice

**No dice «estás aquí» ni «asististe».** Pregunta: *«¿Es este el encuentro en el que quieres
participar?»*, con las tres salidas que pide `QR-02` — sí, cambiar, o aportar sin evento. Y lo
explica: *«abrirlo no te inscribe ni registra que hayas asistido — puede que te lo haya reenviado
alguien»*.

**Un identificador que no existe no se inventa.** Se muestra la agenda y se ofrece contar sin
evento, sin asociarlo a nada por parecido.

**Un QR cancelado no invita a asistir**, aunque el afiche siga pegado en la pared. Y uno
reprogramado muestra la fecha vigente diciendo que *el afiche impreso no cambia solo*.

**Corregir el evento no reescribe el enlace inicial.** Saber por dónde circuló el material es
justo lo que permite arreglar la difusión; borrarlo al corregir dejaría al equipo sin saber qué
afiche se repartió mal.

## El QR se genera aquí

`QR-01` prohíbe *«depender de un proveedor externo de QR para recibir aportes»*, y con razón: un
afiche impreso dura años y el proveedor puede no durar tanto. Se dibuja en el servidor, en SVG,
con corrección de errores alta — un afiche se moja, se dobla y se pega encima de otro.

Al lado va **la dirección corta y legible**, que el requerimiento pide: quien no puede escanear,
teclea. Por eso el identificador usa el alfabeto sin O, I ni L, igual que el comprobante.

**Afiche y publicación del mismo encuentro son piezas, no eventos distintos.** No hace falta
duplicar el evento para distinguir qué material circuló.

## Un defecto que encontró una prueba

La dirección impresa salía de una variable de entorno, y el material decía `:3100` mientras el
recorrido corría en `:3101`. En un afiche eso no se nota **hasta que está impreso y pegado**.
Ahora sale de la propia petición: el QR apunta siempre al sitio donde se está generando.

## Lo que queda abierto

**No hay borrador de encuentro.** Lo que se crea sale en la portada al instante. El módulo pide
*«bandeja, editor, previsualización e historial; borrador no altera versión pública»*, y eso
falta entero. Está dicho en la propia pantalla en vez de disimulado.

**No hay permisos**, como en la consola: `T032`, bloqueada por `P4`. El nombre de quien crea se
guarda desde ya para poder exigirlo después sin perder lo hecho antes.

**`QR-05` no se tocó**: filtros por campaña y pieza, conteos separados de accesos y aportes, tasa
de corrección con su denominador. Es analítica y va con el equipo de BI.

**Reprogramar y cancelar se hacen por SQL**, no por pantalla. El modelo lo soporta y lo prueba;
la interfaz no existe.
