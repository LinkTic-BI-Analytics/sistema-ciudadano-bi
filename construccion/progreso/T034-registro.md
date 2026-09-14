# Registro — T034 · La ruta de alerta urgente

**Contrato:** `construccion/tareas/T034-la-ruta-de-alerta.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-13 | 10 pruebas contra la base, 2 recorridos en navegador | `npm test`, `playwright test` |
| 2026-09-13 | **Vistas fallar**: se le quitó a la base la secuencia y la unicidad | ver abajo |

## Una desviación de mi propio proceso, dicha en voz alta

**Escribí la implementación antes que la prueba.** El contrato pedía verla fallar primero, y en
esta tarea no lo hice. Lo compensé después quitándole a la base dos restricciones y comprobando
que las pruebas las atrapan:

- Sin `recepcion_despues_del_intento` → falla *«no se puede confirmar recepción sin haber
  intentado el contacto»*.
- Sin `un_aporte_una_alerta` → fallan tres, entre ellas la de que dos levantamientos no crean
  dos alertas.

Sirve, pero no es lo mismo: ver fallar **antes** obliga a escribir la prueba sin saber cómo
está hecho el código, y eso es la mitad de su valor. Queda anotado porque el registro no es
para acumular aciertos.

## La decisión que más se pensó

**Cómo detectar sin IA.** La lista de señales de texto se equivoca en las dos direcciones, y
**las dos equivocaciones no cuestan lo mismo**:

- Falso positivo: alguien ve un número de emergencia que no necesitaba.
- Falso negativo: alguien en peligro no lo ve.

Por eso muestra de más. Y por eso **nunca bloquea el envío**: `N02` pide aceptar relato libre, y
una pantalla que retiene a quien está reportando un derrumbe es peor que inútil.

La señal se distingue de una persona en el campo `origen`. Una lista de palabras no es alguien
diciendo *«esto es una emergencia»*, y confundirlas sería `I2` al revés: inferir.

## Lo que el esquema hace imposible

**No se puede confirmar una recepción sin haber intentado el contacto.** Sin esa restricción, un
tablero podría decir «recibido» sin que nadie hubiera llamado — y en una emergencia esa mentira
tiene nombre.

**No existe una función para desactivar una alerta.** `V13`: la IA puede detectar pero *«no
puede desactivarla por sí sola»*. Lo más parecido es devolverla al flujo ordinario, y eso exige
autor y motivo. Hay una prueba que recorre el módulo y falla si aparece una función que se
llame «desactivar» o «descartar»: una puerta así se abre sola con el tiempo.

## Lo que queda esperando

**El directorio de canales por territorio** (`Q13`). El 123 es nacional y está verificado, pero
**quién contesta varía por municipio**, y el protocolo necesita además las autoridades locales
de gestión del riesgo. Sin él, el canal del contacto se guarda como texto libre.

**Los plazos** —5, 10 y 5 minutos— se proponen en `V13` pero dependen de que exista un
responsable de turno. Se guarda cuándo pasó cada cosa; **no se alerta a nadie todavía**.

> **Y esto no se abre a ciudadanía sin responsable de turno, suplente y coordinador.** `V13` lo
> dice: *una bandeja compartida sin persona asignada no cumple esta función*, y *un aviso que
> diga «no atendemos emergencias» no sustituye esa capacidad operativa*.
