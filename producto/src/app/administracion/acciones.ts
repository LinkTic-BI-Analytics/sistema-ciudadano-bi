"use server";

import { revalidatePath } from "next/cache";
import { clienteServidor } from "../../datos/cliente.ts";
import { procesoVigente } from "../../datos/proceso.ts";
import { crearEnlace, type Pieza } from "../../convocatoria/enlaces.ts";

export type Hecho = { ok: true; mensaje: string } | { ok: false; error: string };

/**
 * Crea un encuentro (`M06`, `RF10`).
 *
 * **Quien lo crea queda escrito**, aunque hoy sea un nombre que nadie verifica:
 * el módulo exige actor autorizado, y `T032` —los permisos— sigue bloqueada por
 * `P4`. Guardar el nombre desde ya es lo que permitirá exigirlo después sin
 * perder lo que se hizo antes.
 */
export async function crearEncuentro(_previo: Hecho | null, datos: FormData): Promise<Hecho> {
  const p = clienteServidor().schema("participacion");
  const campo = (k: string) => String(datos.get(k) ?? "").trim();

  const titulo = campo("titulo");
  const modalidad = campo("modalidad");
  const fecha = campo("comienza_en");
  const lugar = campo("lugar") || null;
  const sala = campo("sala") || null;

  if (!titulo) return { ok: false, error: "El encuentro necesita un título." };
  if (!fecha) return { ok: false, error: "El encuentro necesita fecha y hora." };
  // Las mismas reglas que la base, comprobadas antes para poder explicarlas.
  // Un encuentro presencial sin lugar y uno virtual sin sala son fichas que no
  // sirven para ir.
  if (modalidad !== "virtual" && !lugar) return { ok: false, error: "Un encuentro presencial necesita un lugar." };
  if (modalidad !== "presencial" && !sala) return { ok: false, error: "Un encuentro virtual necesita una sala." };

  try {
    const procesoId = await procesoVigente();
    const { data: c } = await p.from("convocatoria")
      .select("id").eq("proceso_id", procesoId).eq("estado", "publicada")
      .order("abre_en", { ascending: false }).limit(1).maybeSingle();
    if (!c) return { ok: false, error: "No hay convocatoria publicada a la que colgar el encuentro." };

    const { error } = await p.from("encuentro").insert({
      proceso_id: procesoId, convocatoria_id: c.id,
      titulo, tema: campo("tema") || null, modalidad,
      comienza_en: new Date(fecha).toISOString(),
      zona_horaria: campo("zona_horaria") || "America/Bogota",
      lugar, sala,
      ayudas: campo("ayudas") || null,
      cupos: campo("cupos") ? Number(campo("cupos")) : null,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/administracion");
    revalidatePath("/");
    return { ok: true, mensaje: `Encuentro «${titulo}» creado.` };
  } catch (e) {
    console.error("crearEncuentro", e);
    return { ok: false, error: "No se pudo crear el encuentro." };
  }
}

/**
 * Genera un enlace con su QR para una pieza de difusión.
 *
 * **No duplica el evento.** Afiche, volante y publicación del mismo encuentro
 * son piezas distintas del mismo evento (`QR-01`).
 */
export async function generarEnlace(_previo: Hecho | null, datos: FormData): Promise<Hecho> {
  const campo = (k: string) => String(datos.get(k) ?? "").trim();
  const encuentroId = campo("encuentro");
  const pieza = campo("pieza") as Pieza;
  if (!encuentroId) return { ok: false, error: "Falta el encuentro." };

  try {
    const e = await crearEnlace({
      procesoId: await procesoVigente(), encuentroId, pieza,
      creadoPor: campo("autor") || "comunicaciones",
      utm: {
        source: campo("utm_source") || undefined,
        medium: campo("utm_medium") || undefined,
        campaign: campo("utm_campaign") || undefined,
        content: campo("utm_content") || undefined,
      },
    });
    revalidatePath("/administracion");
    return { ok: true, mensaje: `Enlace ${e.id} generado para la pieza «${pieza}».` };
  } catch (err) {
    console.error("generarEnlace", err);
    return { ok: false, error: "No se pudo generar el enlace." };
  }
}

/** Retirar un enlace le quita el acceso; **no borra los aportes que entraron por él**. */
export async function retirarEnlace(id: string): Promise<Hecho> {
  try {
    const p = clienteServidor().schema("participacion");
    const { error } = await p.from("enlace").update({ estado: "retirado" }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/administracion");
    return { ok: true, mensaje: `Enlace ${id} retirado. Lo que entró por él sigue ahí.` };
  } catch {
    return { ok: false, error: "No se pudo retirar el enlace." };
  }
}
