# T066 — Quien no puede escribir ni grabar deja su teléfono, y lo llamamos

**Objetivo:** que alguien que llega a `/participar` pueda pedir que lo llamen dejando solo su
nombre y su teléfono, y que esa petición quede guardada y avisada al flujo que llama.
**Autoridad:** pedido directo del negocio el 2026-09-18. **No sale de ningún módulo
entregable** — `entregable/modulos/` sigue vacío, así que esto es capa MVP y se anota como tal.
**Propietario:** orquestador
**Depende de:** T024 (la pantalla de captura y su selector de modo), T047 (el tercer modo,
«Hablar», que es el patrón que este copia)
**Puede ejecutarse en paralelo con:** ninguna activa. Toca `participar/formulario.tsx` y
`participar/acciones.ts`, que son superficie de la línea A.
**Bloqueada por:** ninguna **para construir**. `Q35` la bloquea **para encenderla con gente
real**, y eso es otra cosa.

## Contexto suficiente

La captura tiene hoy dos modos: **Escribir** y **Hablar**. Los dos terminan en lo mismo —un
relato que la persona cuenta con sus palabras— y los dos exigen que pueda usar el teléfono
para contarlo: teclear o grabar.

Queda fuera quien no puede ninguna de las dos. El negocio pidió un tercer modo donde la
persona no cuenta nada: deja su nombre y su número, y **la llamamos nosotros**.

Eso trae algo que este producto no tenía: **pide un dato personal**. La portada dice con esas
palabras *«No pedimos tu nombre, tu cédula ni tu correo»*, y `identidad.contacto` existe
precisamente para que el contacto viva separado del dato analítico. Por eso la tabla nueva va
en `identidad` y no en `participacion`, y por eso la contradicción con la portada se anota
como `Q35` en vez de resolverse callado.

## Dentro del alcance

- Tabla `identidad.llamadas` con `nombre`, `codigo_pais` (por defecto `57`), `telefono`,
  `created_up` y `updated_up`. **Sin `proceso_id`**: decisión del negocio del 2026-09-18, y
  es una excepción declarada a `AGENTS.md` §9 — *pedir que te llamen no es participar en un
  proceso*. De qué proceso salió queda en `participacion.auditoria`, no en la fila.
- Función `participacion.registrar_llamada`, la única puerta de escritura, porque `identidad`
  no se expone por la API.
- Un tercer botón **«Te llamamos»** en el selector de modo de `/participar`, que abre el
  formulario cuando la persona lo pide y no antes.
- Nombre y teléfono obligatorios, **con la restricción en la base y no solo en el servidor**.
- Confirmación en pantalla: *«Te llamamos en breve»*, que **se queda** y no se va sola.
- Aviso al flujo de n8n (`INT-02`) **después** de guardar, que nunca puede tumbar el guardado.

## Fuera del alcance

- **La bandeja de llamadas pendientes en `/consola`.** Hace falta (`Q35`) y no se hace aquí:
  el pedido fue guardar y avisar.
- **Reescribir la frase de la portada.** Es texto público y la decisión es del negocio
  (`Q35`).
- **Autenticar el webhook.** El flujo de n8n está abierto hoy; encender una cabecera es una
  decisión de las dos partes (`INT-02`, `Q35`).
- Convertir la petición en un aporte. No lo es: no hay relato, no hay comprobante y `R1`
  cuenta necesidades, no contactos.

## Superficie asignada

- Crear: `producto/supabase/schemas/17_llamada.sql`
- Crear: `producto/src/llamada/registrar.ts`
- Crear: `producto/src/llamada/aviso.ts`
- Crear: `producto/src/app/participar/llamada.tsx`
- Crear: `producto/pruebas/llamada.test.ts`
- Crear: `producto/pruebas/e2e/llamada.spec.ts`
- Modificar: `producto/src/app/participar/formulario.tsx`
- Modificar: `producto/src/app/participar/acciones.ts`
- Modificar: `producto/playwright.config.ts`
- Modificar: `producto/.env.example`
- Modificar: `scripts/esquema.sh`
- Modificar: `scripts/recorridos-base.sh`
- Modificar: `scripts/limpiar-desarrollo.sh`
- Modificar: `scripts/limpiar-pruebas.sh`
- Modificar: `scripts/vaciar.sh`
- Modificar: `negocio/integraciones.md`
- Modificar: `negocio/vacios.md`
- No modificar: `producto/src/captura/`, `producto/src/app/participar/afinado.tsx`,
  `producto/src/app/participar/microfono.tsx`

## Interfaces

**Consume:**
- `procesoVigente(): Promise<string>` — **solo para el asiento de auditoría**, nunca para
  guardar la petición. La llamada no pertenece a ningún proceso; el asiento sí dice desde cuál
  se pidió.
- `clienteServidor(): SupabaseClient` — con la llave `secret`, nunca en el navegador.

**Produce:**
- `registrarLlamada({nombre, telefono, codigoPais?}): Promise<{llamadaId}>` —
  garantiza que la fila existe o lanza. No traga errores de guardado, y **no depende del
  proceso**.
- `avisarLlamada({llamadaId, nombre, codigoPais, telefono}): Promise<boolean>` —
  garantiza que **nunca lanza**. `false` significa «hay que llamar a mano».
- `pedirLlamada(previo, FormData): Promise<ResultadoLlamada>` — acción de servidor.

## Invariantes aplicables

- `I6` · **no divulgar identidad ni contacto.** Nivel 1 y nivel de partición: la tabla vive
  en `identidad`, que no está en `api.schemas` de `config.toml`. Se prueba yendo por la puerta
  de atrás con las dos llaves —la del servidor y la del navegador— y comprobando que ninguna
  la alcanza por REST. Y el asiento de auditoría guarda **solo el identificador**: si ahí
  quedaran el nombre y el teléfono, la partición no serviría de nada.
- `I2` · **no inferir datos que faltan.** El teléfono se guarda y se manda **tal como se
  escribió**, y el indicativo va aparte. Nunca se arma una versión «buena» para marcar: eso es
  una interpretación, y quien marca es el que sabe cómo se marca.
- `DAT-01` · **pendiente, falló y recibido no son intercambiables.** Se guarda primero y se
  avisa después; un aviso perdido deja asiento y no cambia lo que la persona vio.

## Casos de verificación

Resultados calculados a mano, no leídos de la implementación.

- [x] `nombre="Marleny Quintero"`, `telefono="3114567890"`, sin indicativo →
      fila con `codigo_pais = "57"`.
- [x] La fila guardada **no tiene** columna `proceso_id`, y guardar no depende de que haya
      un proceso vigente.
- [x] `telefono="311 456 7890"` → se guarda **`311 456 7890`**, con espacios. No `3114567890`.
- [x] `nombre="  Rosa  "` → se guarda `Rosa`. Los espacios de los extremos sí se quitan.
- [x] `nombre="   "` → la **base** lo rechaza. No el servidor.
- [x] `telefono="llámenme"` (0 dígitos) → la base lo rechaza.
- [x] `codigoPais="+57"` → la base lo rechaza: el `+` lo pone quien marca.
- [x] Recién creada: `created_up == updated_up`. Tras un `update`: `updated_up` cambia y
      `created_up` **no**.
- [x] `select` sobre `identidad.llamadas` con la llave `secret` → error, no filas.
- [x] `select` sobre `identidad.llamadas` con la llave del navegador → error o vacío.
- [x] El cuerpo del aviso lleva `codigo_pais="57"` y `telefono="311 456 7890"` por separado,
      y **no** lleva `relato`, ni `codigo`, ni `proceso_id`, ni `telefono_e164`.
- [x] El registro del servidor dice que lo intentó, qué le mandó y qué contestó, en los
      cuatro casos. El cuerpo sale **entero, con sus seis claves**, y con `nombre` reducido a
      iniciales y `telefono` en `*** *** 7890`. El número completo y el nombre **nunca**
      entran al log.
- [x] Con `LLAMADA_LOG_CRUDO=1` el cuerpo sale sin tapar, y solo así.
- [x] Lo escrito en el log y lo enviado por el `fetch` son **el mismo objeto**: misma
      `solicitada_en`, comparado con `deepEqual` contra lo que recibió el servidor.
- [x] Webhook que contesta `500` → `avisarLlamada` devuelve `false` y no lanza.
- [x] Webhook en un puerto cerrado → `false` y no lanza.
- [x] En pantalla: los tres modos visibles; el formulario **no existe** antes de tocar el botón.
- [x] Escribir un relato, tocar «Te llamamos», volver a «Escribir» → el relato **sigue ahí**.
- [x] Guardar vacío → los **dos** errores a la vez, con el foco en el resumen.
- [x] `telefono="311"` → error que dice «dígitos».
- [x] Guardar bien → «Te llamamos en breve», y **sigue en pantalla cinco segundos después**.
- [x] Relato con indicio de urgencia + cambiar a «Te llamamos» → el aviso del 123 **sigue ahí**.

## Pasos de ejecución

- [x] Escribir las pruebas antes de la implementación.
- [x] Verlas fallar por la ausencia del comportamiento, con el mensaje exacto registrado
      (`construccion/progreso/T066-registro.md`).
- [x] Implementar el cambio mínimo.
- [x] Ejecutarlas y registrar el resultado.
- [x] Ejecutar las verificaciones de la superficie afectada.

## Terminado cuando

- [x] Cumple lo pedido y no agrega alcance.
- [x] Las pruebas de la tarea pasan: 13 contra la base, 16 en navegador.
- [x] No modifica superficies ajenas.
- [ ] Pasó revisión de cumplimiento. **El constructor no aprueba su propio trabajo.**
- [ ] Pasó revisión técnica.
- [ ] Validado con una persona que no lo construyó (`/validar` no se ha corrido).

## Entrega esperada

- Archivos cambiados: los de «Superficie asignada».
- Pruebas ejecutadas y resultados: en el registro de progreso.
- Decisiones técnicas tomadas: la tabla en `identidad`, el orden guardar→avisar, el selector
  de modo fuera de los dos formularios.
- Riesgos residuales: `Q35`, y que el webhook no pide credencial.
