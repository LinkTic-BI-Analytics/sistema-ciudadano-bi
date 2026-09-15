"use server";

import { revalidatePath } from "next/cache";
import {
  resolverUbicacion, devolverAPorAclarar, corregirUbicacionDelCiudadano,
} from "../../revision/ubicacion.ts";
import { registrarActuacion, aceptarRemision } from "../../gestion/actuacion.ts";
import { clienteServidor } from "../../datos/cliente.ts";
import { esTema } from "../../captura/lectura.ts";
import { crearExpediente } from "../../revision/expediente.ts";
import { registrarPrioridad } from "../../priorizacion/prioridad.ts";

// **Sin permisos todavía.** `T032` decide quién puede hacer esto y está
// bloqueada por `P4` y `Q18`. Mientras tanto el autor se escribe a mano, y eso
// es exactamente lo que no puede llegar a producción.
//
// Se deja explícito aquí en vez de en un comentario suelto: quien lea este
// archivo tiene que tropezarse con ello.

export async function accionResolver(datos: FormData) {
  await resolverUbicacion({
    aporteId: String(datos.get("aporteId")),
    codigo: String(datos.get("codigo")),
    version: String(datos.get("version")),
    autor: String(datos.get("autor") || "revisor sin identificar"),
    motivo: String(datos.get("motivo") ?? ""),
  });
  revalidatePath("/consola");
}

export async function accionDevolver(datos: FormData) {
  await devolverAPorAclarar({
    aporteId: String(datos.get("aporteId")),
    autor: String(datos.get("autor") || "revisor sin identificar"),
    motivo: String(datos.get("motivo") ?? ""),
  });
  revalidatePath("/consola");
}

export async function accionCrearExpediente(datos: FormData) {
  await crearExpediente({
    procesoId: String(datos.get("procesoId")),
    descripcion: String(datos.get("descripcion") ?? ""),
    cambioEsperado: String(datos.get("cambioEsperado") ?? "") || undefined,
    desdeAporte: String(datos.get("aporteId")),
    autor: String(datos.get("autor") || "revisor sin identificar"),
    motivo: String(datos.get("motivo") ?? ""),
  });
  revalidatePath("/consola");
}

export async function accionPriorizar(datos: FormData) {
  const v = (k: string) => (String(datos.get(k) ?? "") || undefined) as never;
  await registrarPrioridad({
    expedienteId: String(datos.get("expedienteId")),
    autor: String(datos.get("autor") || "revisor sin identificar"),
    motivo: String(datos.get("motivo") ?? ""),
    afectacion: v("afectacion"),
    urgenciaReportada: v("urgencia"),
    recurrencia: v("recurrencia"),
    competencia: v("competencia"),
    incertidumbre: String(datos.get("incertidumbre") ?? "") || undefined,
  });
  revalidatePath("/consola");
}

/**
 * Corregir el municipio aceptado, en un paso.
 *
 * Antes había que devolverlo a «por aclarar» y aceptarlo otra vez: dos motivos
 * para arreglar una letra, y entre medias el aporte pasaba por un estado que no
 * era cierto.
 *
 * **Reemplaza, no agrega.** Un aporte con dos territorios dice que el problema
 * cruza dos municipios (`GEO-01`); un error de dedo no es eso, y dejarlo lo
 * contaría dos veces.
 */
export async function accionCorregirMunicipio(datos: FormData) {
  const motivo = String(datos.get("motivo") ?? "").trim();
  await corregirUbicacionDelCiudadano({
    aporteId: String(datos.get("aporteId")),
    codigo: String(datos.get("codigo")),
    version: String(datos.get("version")),
    motivo: motivo || "corregido en la consola",
  });
  revalidatePath("/consola");
}

/**
 * Escalar: el expediente sale hacia una mesa o un equipo.
 *
 * **Queda pendiente de aceptación, y eso no es un detalle de registro.** La
 * especificación es explícita: *«remisión no aceptada sigue pendiente»* y
 * *«entidad sin responder no cierra por silencio»*. Remitir no es haber
 * atendido, y esta acción no mueve ningún estado hacia «resuelto».
 *
 * El destinatario es **texto declarado**: el directorio real de entidades sigue
 * pendiente (`T016`), y hasta que exista, escribirlo como se llame es más
 * honesto que ofrecer una lista inventada.
 */
export async function accionRemitir(datos: FormData) {
  const destino = String(datos.get("destino") ?? "").trim();
  if (!destino) return;
  await registrarActuacion({
    expedienteId: String(datos.get("expedienteId")),
    tipo: "remision",
    autor: String(datos.get("autor") || "revisor sin identificar"),
    motivo: String(datos.get("motivo") ?? "") || undefined,
    destino,
  });
  revalidatePath("/consola");
}

/** La destinataria confirmó que lo recibió. Es un hecho aparte, con su fecha. */
export async function accionAceptarRemision(datos: FormData) {
  await aceptarRemision({
    actuacionId: String(datos.get("actuacionId")),
    autor: String(datos.get("autor") || "revisor sin identificar"),
    motivo: String(datos.get("motivo") ?? "") || "confirmó recepción",
  });
  revalidatePath("/consola");
}

/**
 * Corregir el tema.
 *
 * `GES-02` la lista entre las correcciones permitidas y no existía: 114 de 115
 * aportes están sin tema y no había ninguna forma de ponérselo. Sin esto, el
 * filtro por tema nace vacío y nada se puede enrutar a una mesa.
 *
 * **Es una etiqueta de enrutamiento nuestra, no una afirmación de la persona.**
 * Por eso se puede corregir aquí sin romper `V14`: cambiarla no cambia lo que
 * ella contó ni lo que confirmó. Lo que propuso la lectura (`tema_propuesto`) no
 * se toca, porque es lo único que permite medir cuánto se equivoca la máquina.
 */
export async function accionCambiarTema(datos: FormData) {
  const aporteId = String(datos.get("aporteId"));
  const tema = String(datos.get("tema") ?? "").trim();
  const motivo = String(datos.get("motivo") ?? "").trim();
  if (tema && !esTema(tema)) return;

  const p = clienteServidor().schema("participacion");
  const { data: antes } = await p.from("aporte")
    .select("tema, proceso_id").eq("id", aporteId).single();
  if (!antes) return;

  const { error } = await p.from("aporte").update({ tema: tema || null }).eq("id", aporteId);
  // Si la base lo rechaza, no se sigue como si nada: el asiento de auditoría
  // diría que alguien cambió el tema y el tema seguiría igual.
  if (error) throw new Error(`no se pudo guardar el tema: ${error.message}`);
  await p.from("auditoria").insert({
    proceso_id: antes.proceso_id,
    actor: String(datos.get("autor") || "revisor sin identificar"),
    accion: "corregir_tema", entidad: "aporte", entidad_id: aporteId,
    motivo: motivo || "corregido en la consola",
    antes: { tema: antes.tema }, despues: { tema: tema || null },
  });
  revalidatePath("/consola");
}
