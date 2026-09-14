# T034 — La ruta de alerta urgente

**Objetivo:** que un aporte que señale una posible emergencia salga de la cola normal, oriente
a la persona de inmediato, y deje rastro de qué se hizo con el aviso.
**Autoridad:** `V13` de `negocio/vacios.md` · `RF1`, `I1`, `I2`
**Propietario:** orquestador · **Depende de:** T023, T024 · **Bloqueada por:** ninguna

## Contexto suficiente

`V13` decidió el protocolo entero el 2026-09-13. Lo que esta tarea construye es lo que no
depende de una decisión pendiente.

**La plataforma no despacha recursos ni garantiza atención.** Orienta y traslada, con
seguimiento humano. Decirlo en la pantalla es parte del requisito, no una advertencia legal.

**Se abre desde un aporte, sin esperar a que exista un expediente.** Un formulario a medio
llenar ya puede tener alerta — por eso la alerta es una entidad propia y no un estado del
aporte ni del expediente.

**No exige corroboración, fotos, identidad ni un mínimo de reportes.** Y la IA puede detectar,
pero **no puede impedir que alguien la active ni desactivarla por sí sola**.

**Tres cosas que la tentación junta en una:** `orientación mostrada`, `contacto intentado`,
`recepción confirmada`. Mostrar un teléfono no es haber contactado, y contactar no es que
alguien haya recibido.

### La asimetría que decide el diseño de la detección

Sin IA, la detección se apoya en que la persona la marque y en señales de texto. **Una señal de
texto se equivoca en las dos direcciones, y las dos equivocaciones no cuestan lo mismo:**

- Falso positivo: alguien ve un número de emergencia que no necesitaba.
- Falso negativo: alguien en peligro no lo ve.

Por eso la señal **muestra la orientación de más**, nunca de menos. Y nunca bloquea el envío:
`N02` pide aceptar relato libre, y una pantalla que retiene a alguien que está reportando un
derrumbe es peor que inútil.

## Dentro del alcance

- La entidad `alerta`, ligada a un aporte, con sus tres momentos separados.
- Que la persona pueda marcarla, y que una señal de texto también la levante.
- La orientación en pantalla, con el texto acordado y «Llamar al 123» como acción principal.
- Devolver al flujo ordinario **con justificación**, conservando la necesidad y el relato.
- Que un reintento no abra dos alertas (`I1` otra vez).

## Fuera del alcance

- **El directorio de canales por territorio** (`Q13`). No existe, y sin él *«trasladar al canal
  competente»* no tiene a dónde. Se registra el intento y el destino como texto libre.
- **Los plazos y el escalamiento automático.** `V13` los propone —5, 10, 5 minutos— pero
  dependen de que exista un responsable de turno, y eso es condición de piloto, no de código.
  Se guarda cuándo pasó cada cosa; no se alerta a nadie todavía.
- Cualquier notificación. No hay canal de avisos decidido.

## Superficie asignada

- Crear: `producto/supabase/schemas/12_alerta.sql`
- Crear: `producto/src/alerta/urgencia.ts`
- Crear: `producto/pruebas/alerta.test.ts`
- Modificar: `producto/src/app/participar/formulario.tsx`
- Modificar: `producto/src/app/participar/acciones.ts`
- Modificar: `producto/pruebas/e2e/participar.spec.ts`
- No modificar: `producto/src/revision/`, `producto/src/gestion/`

## Invariantes aplicables

- `I1`: la alerta cuelga del aporte, y un reintento con la misma clave no crea otro aporte —
  luego tampoco otra alerta.
- `I2`: la alerta **no infiere** que hay emergencia. Registra que hay un indicio, y quién o qué
  lo levantó.

## Casos de verificación

- [ ] Marcarla a mano crea la alerta, ligada al aporte
- [ ] Una señal de texto la levanta, y **queda dicho que la levantó una señal, no una persona**
- [ ] La alerta existe **sin** que haya expediente
- [ ] Un reintento del mismo envío no crea una segunda alerta
- [ ] Los tres momentos se registran por separado, con responsable y fecha
- [ ] Contacto intentado **no** es recepción confirmada
- [ ] Devolver al flujo ordinario exige justificación y conserva el aporte
- [ ] La IA no puede desactivarla: no hay función que lo permita
- [ ] En pantalla: si hay indicio, sale la orientación con el 123 **antes de terminar el formulario**
- [ ] La orientación **nunca** pide acercarse al peligro ni tomar fotos

## Terminado cuando

- [ ] Los diez casos pasan, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
- [ ] Queda escrito que **sin responsable de turno esto no se abre a ciudadanía** (`V13`).

## Entrega esperada

- Archivos, salidas antes y después, y qué queda esperando `Q13`.
