# Registro — T051 · Lo que se guarda se ve

**Autoridad:** `QR-03` (los tres contextos distinguibles) · `ADR 0013` (el audio es el original) ·
`N16` (la consulta por comprobante no expone lo ajeno) · `RF2`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-15 | Comparación columna por columna de lo guardado contra lo mostrado | ver abajo |
| 2026-09-15 | Chequeo nuevo, visto fallar con 9 casos reales | `scripts/lib/datos_huerfanos.py` |
| 2026-09-15 | Recorrido: la persona ve todo lo suyo | `afinar.spec.ts` |

## Lo que faltaba

Lo dijo el negocio mirando una ficha: *«se guardaron varios datos que aquí no aparecen»*. Lo
comparé columna por columna y era peor de lo que parecía.

**En la ficha de revisión no se veía:**

- **la grabación** — el revisor no sabía que existía, y menos podía oírla. Guardamos el audio
  como original y era **imposible comprobar la transcripción contra lo que se dijo**;
- **las versiones de la transcripción** — el corazón del ADR 0013, invisible;
- **de dónde vino el enlace**, **en qué evento dice participar** y **el estado del contexto** —
  los tres que `QR-03` obliga a distinguir, y ninguno estaba.

**Y en «mis aportes», la persona veía cuatro cosas de las diez que había contestado.** Ni el
municipio que confirmó, ni a quiénes, ni desde cuándo, ni el grupo por el que dijo hablar, ni la
síntesis que ella misma corrigió.

Eso es lo más caro de todo: **le pedimos su tiempo y después no le devolvemos lo que dijo**. Es
la forma más rápida de que alguien no vuelva.

## Lo que hay ahora

**El revisor puede escuchar.** El audio se sirve por el servidor, nunca por una dirección del
depósito: la voz identifica a una persona aunque las palabras no lo hagan, y un enlace público
del depósito sería identidad al alcance de cualquiera que lo tenga. Al lado van las versiones de
la transcripción, diciendo cuál la hizo el modelo —con su nombre— y cuál corrigió la persona.

**Los tres contextos, separados.** De dónde vino el enlace, en qué evento dice participar, y el
lugar del problema. Con la frase que impide la confusión: *abrir un enlace no prueba que alguien
estuviera en ningún sitio*.

**La persona ve todo lo suyo.** Hubo que ampliar `canjear_comprobante`, que es la puerta: sigue
devolviendo **un aporte o nada**, y lo que devuelve es de quien tiene el código. El municipio
solo si alguien lo aceptó — devolverle el declarado como si fuera el aceptado sería la inferencia
que `I2` prohíbe, y encima dicha a ella como un hecho.

## El chequeo que faltaba

Esta familia de defectos **no falla nada**: la columna existe, el `insert` funciona, las pruebas
pasan. Solo que el trabajo de quien contestó se queda donde nadie mira.

`datos_huerfanos.py` compara las columnas de las once tablas contra lo que el código menciona.
**Se vio fallar con nueve casos reales**, y eso obligó a una distinción que no tenía pensada:

- una columna **con datos que nadie lee** es trabajo de una persona tirado;
- una columna **que nadie escribe ni lee** es deuda de modelo.

La primera versión del chequeo miraba si había datos en la base, y eso lo hacía depender de lo
que hubiera sembrado ese día — un chequeo inestable no sirve. Ahora hay una lista explícita de
lo modelado por adelantado, **cada entrada con su razón escrita**. Una columna que salga de esa
lista y siga sin leerse, falla.

De ahí salieron ocho deudas anotadas, entre ellas dos que se solapan con lo que ahora captura el
aporte: `expediente.problema_desde` con `aporte.desde_cuando`, y `expediente.poblacion_declarada`
con `aporte.afectados`. **Hay que decidir cuál de los dos manda**, y hasta hoy nadie lo había
notado porque ninguno se usaba.

## Lo que queda abierto

**Falta decidir esos dos solapamientos.** Están en la lista con su razón.

**Fusionar expedientes sigue modelado y sin construir** (`fusionado_en_id`), y `R1` lo necesita.

**No hay pantalla de retirados**, así que `retirado_motivo` se escribe y no se lee. Cuando alguien
pida retirar su aporte de verdad, hará falta.
