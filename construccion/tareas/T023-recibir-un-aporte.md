# T023 — Recibir un aporte, con la idempotencia de verdad

**Objetivo:** que un relato enviado desde el navegador quede persistido con su lugar declarado,
y que reenviarlo por un corte de red **no cree un segundo aporte**.
**Autoridad:** `RF5`, `I1`, `I2` · `DAT-01` de `especificacion_datos_y_bi_v1.md` §5
**Propietario:** orquestador
**Depende de:** T021
**Puede ejecutarse en paralelo con:** T027, T030, T031 — ninguna toca `src/captura/`.
**Bloqueada por:** ninguna

## Contexto suficiente

La captura es la puerta del sistema y la única superficie que una persona sin cuenta va a
usar. El esquema ya existe y ya hace imposibles `I1` e `I2`; lo que falta es la acción de
servidor que escribe por esa puerta.

Dos cosas que parecen detalles y no lo son:

**La clave de envío la genera el cliente, no el servidor.** Si la generara el servidor, cada
reintento traería una distinta y habría dos aportes — que es justo lo que `I1` prohíbe. La
genera el navegador **antes del primer envío** y la reusa en cada reintento del mismo
formulario.

**El comprobante nunca se muestra antes de persistir.** `DAT-01` lo dice y `especificacion.md`
lo repite: *«pendiente, falló y recibido no son intercambiables»*. Una persona que ve un código
y luego descubre que no quedó nada no vuelve.

Y una que el esquema ya obliga pero conviene tener presente: **el lugar tal como la persona lo
dijo se guarda siempre**, aunque no se pueda normalizar. Es lo único que permitirá
re-normalizar al barrio cuando llegue su catálogo (`V21`, `Q26`).

## Dentro del alcance

- Una acción de servidor que recibe relato, canal, lugar declarado y clave de envío.
- `I1`: la misma clave devuelve **el mismo aporte**, no un error.
- `I2`: sin lugar normalizable, la ubicación se crea en `por_aclarar` **sin código**.
- El comprobante se emite después de persistir, y se devuelve **una sola vez**.
- Un asiento en la auditoría por cada aporte recibido.

## Fuera del alcance

- La pantalla. Es T024.
- La síntesis y su confirmación. Es T025.
- La consulta del comprobante. Es T026.
- Cualquier normalización automática de la ubicación. `I2` lo prohíbe: aquí solo se guarda lo
  declarado y se marca `por_aclarar`.
- Autenticación. La captura **no la necesita** y `P4` sigue abierta.

## Superficie asignada

- Crear: `producto/src/captura/recibir.ts`
- Crear: `producto/src/captura/clave-envio.ts`
- Crear: `producto/src/datos/cliente.ts`
- Crear: `producto/pruebas/captura.py`
- Leer: `producto/supabase/schemas/03_aporte.sql`
- Leer: `producto/supabase/schemas/06_identidad.sql`
- No modificar: `producto/supabase/schemas/`
- No modificar: `producto/src/harness/`

## Interfaces

**Consume:**
- `participacion.aporte`, `participacion.ubicacion`, `identidad.comprobante`, `participacion.auditoria`.

**Produce:**
- `recibirAporte(entrada: EntradaAporte): Promise<ResultadoAporte>` donde
  `EntradaAporte = { claveEnvio, relato, canal, lugarDeclarado?, procesoId }` y
  `ResultadoAporte = { aporteId, codigoComprobante, yaExistia }`.
- `yaExistia` distingue un aporte nuevo de un reintento. T024 lo usa para no volver a mostrar
  el código como si fuera otro.

## Invariantes aplicables

- `I1`: restricción única sobre `(proceso_id, clave_envio)`. La acción **no comprueba antes de
  insertar**: inserta y resuelve el conflicto, porque comprobar-y-luego-insertar deja una
  ventana donde dos peticiones simultáneas pasan las dos. Se prueba con dos envíos a la vez.
- `I2`: sin lugar normalizable, `estado = 'por_aclarar'` y `territorio_codigo = null`. La
  restricción del esquema ya lo hace imposible; la prueba comprueba que la acción no intente
  rellenarlo.

## Casos de verificación

Salen del paso 1 y 2 de la prueba de punta a punta, y de la aceptación de `DAT-01`.

- [ ] Un envío nuevo → un aporte, un comprobante, `yaExistia = false`
- [ ] El mismo envío repetido por interrupción → **el mismo aporte**, `yaExistia = true`
- [ ] Dos envíos con claves distintas desde el mismo equipo → **dos aportes legítimos**
- [ ] Un relato sin lugar que se pueda normalizar → ubicación `por_aclarar` y sin código
- [ ] Un relato con el lugar escrito → `lugar_declarado` guardado textual
- [ ] Dos envíos simultáneos con la misma clave → un solo aporte
- [ ] Cada aporte recibido deja un asiento en la auditoría

## Pasos de ejecución

- [ ] Escribir `producto/pruebas/captura.py` con los siete casos, y **verla fallar** por no
      existir `recibirAporte`.
- [ ] Registrar la falla con su mensaje exacto.
- [ ] Implementar el cambio mínimo.
- [ ] Correr la prueba y registrar el resultado.
- [ ] Correr `./scripts/validar.sh` completo.

## Terminado cuando

- [ ] Los siete casos pasan, y se vieron fallar antes.
- [ ] No se tocó ningún archivo de `supabase/schemas/`.
- [ ] `validar.sh` devuelve 0.

## Entrega esperada

- Archivos creados y la salida de la prueba antes y después.
- Cómo se resolvió el conflicto de `I1` sin comprobar-y-luego-insertar.
- Riesgos o supuestos residuales.
