"use server";

import { revalidatePath } from "next/cache";
import { resolverUbicacion, devolverAPorAclarar } from "../../revision/ubicacion.ts";
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
