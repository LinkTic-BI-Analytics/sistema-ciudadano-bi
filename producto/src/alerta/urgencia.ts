import { clienteServidor } from "../datos/cliente.ts";

export type OrigenAlerta = "persona" | "facilitador" | "revisor" | "senal";

/**
 * Señales de peligro inmediato en un texto.
 *
 * **Esta lista se equivoca en las dos direcciones, y las dos equivocaciones no
 * cuestan lo mismo.** Un falso positivo es alguien que ve un número de
 * emergencia que no necesitaba. Un falso negativo es alguien en peligro que no
 * lo ve.
 *
 * Por eso muestra de más, nunca de menos. Y por eso **nunca bloquea el envío**:
 * `N02` pide aceptar relato libre, y una pantalla que retiene a quien está
 * reportando un derrumbe es peor que inútil.
 *
 * No es detección de emergencias: es **un indicio para que alguien mire**. `I2`:
 * el sistema no infiere que hay una emergencia, registra que hay una señal.
 */
const SENALES = [
  "se está cayendo", "se va a caer", "a punto de caer", "colapso", "colapsar",
  "derrumbe", "deslizamiento", "se derrumbó", "atrapad", "sepultad",
  "grieta", "agrietad", "se hunde", "inundación", "creciente",
  "peligro de muerte", "se puede morir", "pueden morir", "riesgo de vida",
  "emergencia", "urgente", "auxilio", "socorro",
];

export function hayIndicio(texto: string): string | null {
  const t = texto.toLowerCase();
  for (const s of SENALES) {
    if (t.includes(s)) return s;
  }
  return null;
}

/** El texto acordado en `V13`. Va literal: fue revisado, no se reescribe. */
export const ORIENTACION =
  "Si hay personas en peligro, llama ahora al 123. No esperes una respuesta de esta " +
  "plataforma. Este formulario registra información y no activa por sí mismo un servicio " +
  "de emergencia.";

/**
 * Levanta una alerta sobre un aporte.
 *
 * Es idempotente por aporte: la restricción del esquema lo garantiza, y un
 * reintento del mismo envío no crea otro aporte — luego tampoco otra alerta.
 */
export async function levantarAlerta(e: {
  aporteId: string; origen: OrigenAlerta; indicio?: string;
}): Promise<{ alertaId: string; yaExistia: boolean }> {
  const p = clienteServidor().schema("participacion");
  const { data: a } = await p.from("aporte").select("proceso_id").eq("id", e.aporteId).single();
  if (!a) throw new Error(`no existe el aporte ${e.aporteId}`);

  const { data: creada } = await p.from("alerta").upsert({
    proceso_id: a.proceso_id, aporte_id: e.aporteId,
    origen: e.origen, indicio: e.indicio ?? null,
  }, { onConflict: "aporte_id", ignoreDuplicates: true }).select("id");

  if (creada?.[0]) {
    await p.from("auditoria").insert({
      proceso_id: a.proceso_id, actor: e.origen, accion: "levantar_alerta",
      entidad: "alerta", entidad_id: creada[0].id, motivo: e.indicio ?? null,
    });
    return { alertaId: creada[0].id, yaExistia: false };
  }
  const { data: ya } = await p.from("alerta").select("id").eq("aporte_id", e.aporteId).single();
  return { alertaId: ya!.id, yaExistia: true };
}

/** Se le mostró la orientación a la persona. Es lo primero y lo único inmediato. */
export async function marcarOrientacionMostrada(alertaId: string): Promise<void> {
  const p = clienteServidor().schema("participacion");
  const { error } = await p.from("alerta")
    .update({ orientacion_mostrada_en: new Date().toISOString() })
    .eq("id", alertaId).is("orientacion_mostrada_en", null);
  if (error) throw new Error(`no se pudo registrar la orientación: ${error.message}`);
}

/**
 * Se intentó avisar a alguien. **No significa que haya recibido.**
 *
 * El canal va como texto libre porque el directorio por territorio no existe
 * (`Q13`), y el 123 —aunque es nacional— lo contesta un centro distinto en cada
 * municipio. Inventar un directorio sería peor que no tenerlo.
 */
export async function registrarContactoIntentado(e: {
  alertaId: string; canal: string; responsable: string;
}): Promise<void> {
  const p = clienteServidor().schema("participacion");
  const { error } = await p.from("alerta").update({
    contacto_intentado_en: new Date().toISOString(),
    contacto_canal: e.canal, responsable: e.responsable,
  }).eq("id", e.alertaId);
  if (error) throw new Error(`no se pudo registrar el intento: ${error.message}`);
}

/**
 * Alguien confirmó que recibió el aviso.
 *
 * La restricción del esquema impide confirmarlo sin haberlo intentado: sin eso
 * un tablero podría decir «recibido» sin que nadie hubiera llamado.
 *
 * **Y una recepción confirmada tampoco significa emergencia resuelta** (`V13`).
 */
export async function confirmarRecepcion(e: {
  alertaId: string; constancia: string; responsable: string;
}): Promise<void> {
  const p = clienteServidor().schema("participacion");
  const { error } = await p.from("alerta").update({
    recepcion_confirmada_en: new Date().toISOString(),
    recepcion_constancia: e.constancia, responsable: e.responsable,
  }).eq("id", e.alertaId);
  if (error) throw new Error(`no se pudo confirmar la recepción: ${error.message}`);
}

/**
 * Devuelve el caso al flujo ordinario.
 *
 * **Es lo más parecido a desactivar una alerta que existe, y exige una persona
 * con un motivo.** `V13`: la IA puede detectar pero no puede desactivar por sí
 * sola — por eso no hay ninguna función que lo haga sin autor.
 *
 * La necesidad y el relato se conservan.
 */
export async function devolverAFlujoOrdinario(e: {
  alertaId: string; autor: string; motivo: string;
}): Promise<void> {
  if (!e.motivo?.trim()) {
    throw new Error("devolver al flujo ordinario exige justificación: V13 lo pide y sin ella nadie puede revisar la decisión");
  }
  const p = clienteServidor().schema("participacion");
  const { error } = await p.from("alerta").update({
    devuelta_en: new Date().toISOString(),
    devuelta_motivo: e.motivo, devuelta_autor: e.autor,
  }).eq("id", e.alertaId);
  if (error) throw new Error(`no se pudo devolver al flujo ordinario: ${error.message}`);
}
