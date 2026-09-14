# T030 — Los cinco eventos de gestión, separados

**Objetivo:** que recepción, remisión, decisión, respuesta y siguiente paso sean **cinco hechos
distintos**, y que ninguno se deduzca de otro.
**Autoridad:** `RF8` · `RES-01` · `N12`, `N13`, `N14`
**Propietario:** orquestador · **Depende de:** T021 · **Bloqueada por:** ninguna
**Puede ejecutarse en paralelo con:** T027, T028, T029 — no toca `src/revision/`.

## Contexto suficiente

La tentación es un campo `estado` con cinco valores. **Es el error que `RES-01` existe para
impedir**: *«recepción, respuesta, solución, financiación y ejecución son cinco eventos
distintos»*, y con un solo campo no se puede decir que algo fue recibido y remitido pero no
respondido.

Tres reglas que vienen con ello:

**Una remisión no aceptada sigue pendiente.** `N12` y `N13`: se registra el destino, el
responsable y el estado, y *«una remisión no aceptada sigue pendiente y no aparece como
resuelta»*.

**No se cierra por silencio.** Y no se inventa un vencimiento: el plazo no existe (`Q20`), así
que se muestra *«sin respuesta registrada»* y la antigüedad — nunca «vencido».

**No se atribuye causalidad.** `N14`: un proyecto preexistente relacionado es **antecedente**,
no resultado del aporte.

## Dentro del alcance

- Una tabla de actuaciones: un hecho por fila, con tipo, autor, fecha, motivo.
- Los cinco tipos, y ninguno más.
- Registrar una remisión con destino y estado de aceptación.
- Consultar la historia de un expediente en orden.
- Que la consulta del comprobante (T026) muestre la última actuación.

## Fuera del alcance

- El directorio de entidades. No existe (`Q13` y los datos que faltan).
- Cualquier plazo o alerta de vencimiento. `Q20` está abierta y **no se inventa el número**.
- La prioridad de examen. Es M08.

## Superficie asignada

- Crear: `producto/src/gestion/actuacion.ts`
- Crear: `producto/pruebas/gestion.test.ts`
- Crear: `producto/supabase/schemas/11_gestion.sql`
- Modificar: `producto/src/comprobante/canjear.ts`
- No modificar: `producto/src/revision/`

## Interfaces

**Produce:**
- `registrarActuacion({ expedienteId, tipo, autor, motivo?, destino?, siguientePaso? })`
- `historiaDe(expedienteId): Promise<Actuacion[]>`
- `estadoDeAtencion(expedienteId)` — **derivado de las actuaciones, nunca almacenado**

## Invariantes aplicables

- Ninguna nueva. Pero **`estadoDeAtencion` se deriva**: un campo almacenado se desincroniza de
  sus hechos, y entonces el tablero afirma algo que la historia contradice.

## Casos de verificación

- [ ] Un expediente sin actuaciones → «sin respuesta registrada», nunca «vencido»
- [ ] Recibido y remitido pero no respondido → los tres hechos se ven por separado
- [ ] Una remisión sin aceptar **sigue pendiente** y no cuenta como respondida
- [ ] Aceptar la remisión es **otra** actuación, con su fecha
- [ ] Un tipo que no sea uno de los cinco → se rechaza
- [ ] La historia sale en orden y conserva quién y por qué
- [ ] El comprobante de T026 muestra la última actuación, sin exponer nada del expediente ajeno

## Terminado cuando

- [ ] Los siete casos pasan, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
