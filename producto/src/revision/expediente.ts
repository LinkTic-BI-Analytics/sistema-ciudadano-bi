import { clienteServidor } from "../datos/cliente.ts";
import type { FilaVinculo } from "../datos/filas.ts";
import { invalidarPorReapertura } from "../priorizacion/prioridad.ts";

export type Territorio = { codigo: string; version: string };

export type CrearExpediente = {
  procesoId: string;
  descripcion: string;
  cambioEsperado?: string;
  desdeAporte: string;
  autor: string;
  motivo: string;
  territorios?: Territorio[];
};

export type Vinculo = { aporteId: string; motivo: string; autor: string; creadoEn: string };

/**
 * Crea un expediente desde un aporte.
 *
 * **La separación es el estado por defecto** (`V12`). Esta función no busca
 * expedientes parecidos ni propone vincular a uno existente, y eso es deliberado:
 * compartir tema, municipio, entidad o palabras parecidas **no basta**. Sugerir
 * sería trabajo de `NEC-01` —la IA propone, el equipo confirma— y necesita el par
 * valor sugerido/valor aceptado que todavía no existe.
 *
 * La prueba para decidir si son uno o dos, que va en los casos y no en el código:
 *
 *   ¿Podríamos dar por atendida una de estas situaciones mientras la otra sigue
 *   pendiente? Si la respuesta es sí, tienen que poder gestionarse por separado.
 *
 * **Abrir un expediente no aprueba nada.** No asigna recursos, no compromete una
 * intervención y no declara resuelto nada.
 */
export async function crearExpediente(e: CrearExpediente): Promise<{ expedienteId: string }> {
  if (!e.motivo?.trim()) throw new Error("crear un expediente exige motivo para su primer vínculo");
  const p = clienteServidor().schema("participacion");

  const { data: exp, error } = await p.from("expediente").insert({
    proceso_id: e.procesoId,
    descripcion: e.descripcion,
    cambio_esperado: e.cambioEsperado ?? null,
  }).select("id").single();
  if (error || !exp) throw new Error(`no se pudo crear el expediente: ${error?.message}`);

  await vincular({ aporteId: e.desdeAporte, expedienteId: exp.id, autor: e.autor, motivo: e.motivo });

  if (e.territorios?.length) {
    // Cada territorio lleva su propio estado de atención. Un expediente
    // intermunicipal no es uno con un territorio promedio: es uno con varios,
    // y `V12` pide que la gestión conjunta conserve el seguimiento de cada uno.
    const { error: eT } = await p.from("expediente_territorio").insert(
      e.territorios.map((t) => ({
        proceso_id: e.procesoId, expediente_id: exp.id,
        territorio_codigo: t.codigo, territorio_version: t.version,
      })),
    );
    if (eT) throw new Error(`no se pudieron vincular los territorios: ${eT.message}`);
  }

  await p.from("auditoria").insert({
    proceso_id: e.procesoId, actor: e.autor, accion: "crear_expediente",
    entidad: "expediente", entidad_id: exp.id, motivo: e.motivo,
  });

  return { expedienteId: exp.id };
}

/**
 * Vincula un aporte a un expediente.
 *
 * **Muchos a muchos.** Un aporte puede alimentar varios expedientes: quien
 * menciona contaminación del agua y falta de transporte escolar produce dos
 * necesidades desde un mismo relato (`V12`).
 *
 * El motivo es obligatorio en la base —`I4` lo exige— y se comprueba también
 * aquí para que el error diga qué falta, en vez de un mensaje de restricción.
 */
export async function vincular(
  v: { aporteId: string; expedienteId: string; autor: string; motivo: string },
): Promise<void> {
  if (!v.motivo?.trim()) {
    throw new Error("vincular exige motivo: I4 pide conservar el porqué para poder desagrupar");
  }
  const p = clienteServidor().schema("participacion");

  const { data: a } = await p.from("aporte").select("proceso_id").eq("id", v.aporteId).single();
  if (!a) throw new Error(`no existe el aporte ${v.aporteId}`);

  const { error } = await p.from("vinculo_aporte_expediente").insert({
    proceso_id: a.proceso_id, aporte_id: v.aporteId, expediente_id: v.expedienteId,
    autor: v.autor, motivo: v.motivo,
  });
  if (error) throw new Error(`no se pudo vincular: ${error.message}`);
}

/** Los aportes vigentes de un expediente. Los desvinculados no salen, pero siguen en la base. */
export async function aportesDe(expedienteId: string): Promise<Vinculo[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("vinculo_aporte_expediente")
    .select("aporte_id, motivo, autor, creado_en")
    .eq("expediente_id", expedienteId).is("desvinculado_en", null);
  if (error) throw new Error(`no se pudieron leer los aportes: ${error.message}`);
  return ((data ?? []) as FilaVinculo[]).map((v) => ({
    aporteId: v.aporte_id, motivo: v.motivo, autor: v.autor, creadoEn: v.creado_en,
  }));
}

/** Los expedientes que alimenta un aporte. Casi siempre uno; a veces varios. */
export async function expedientesDe(aporteId: string): Promise<string[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("vinculo_aporte_expediente")
    .select("expediente_id").eq("aporte_id", aporteId).is("desvinculado_en", null);
  if (error) throw new Error(`no se pudieron leer los expedientes: ${error.message}`);
  return ((data ?? []) as Pick<FilaVinculo, "expediente_id">[]).map((v) => v.expediente_id);
}

/**
 * Desvincula un aporte de un expediente.
 *
 * **Nada se borra.** La fila del vínculo se queda con su motivo original, y se le
 * agrega quién lo deshizo y por qué. `I4`: *«conservar originales, diferencias,
 * motivos y vínculos al desagrupar»*.
 *
 * Y hace la otra mitad, que es la que se olvida: **marca el expediente como
 * reabierto**. `NEC-01` lo pide con esas palabras — *«reabre examen de prioridad
 * y respuestas sin heredar aprobación»*. Si un aporte sale y la prioridad se
 * queda como estaba, el sistema afirma algo que ya no sustenta.
 *
 * Lo que NO toca es el corte: ya es inmutable por regla de Postgres, y `R2` lo
 * exige — *un corte nuevo no reescribe el anterior*.
 */
export async function desvincular(
  v: { aporteId: string; expedienteId: string; autor: string; motivo: string },
): Promise<void> {
  if (!v.motivo?.trim()) {
    throw new Error("desvincular exige motivo: I4 pide conservar el porqué, y un desagrupe sin razón no se puede explicar después");
  }
  const p = clienteServidor().schema("participacion");

  const { data: vinculo } = await p.from("vinculo_aporte_expediente")
    .select("id, proceso_id").eq("aporte_id", v.aporteId).eq("expediente_id", v.expedienteId)
    .is("desvinculado_en", null).limit(1).single();
  if (!vinculo) throw new Error("no hay un vínculo vigente entre ese aporte y ese expediente");

  const { error } = await p.from("vinculo_aporte_expediente").update({
    desvinculado_en: new Date().toISOString(),
    desvinculado_motivo: v.motivo,
    desvinculado_autor: v.autor,
  }).eq("id", vinculo.id);
  if (error) throw new Error(`no se pudo desvincular: ${error.message}`);

  const { error: eReabrir } = await p.from("expediente").update({
    reabierto_en: new Date().toISOString(),
    reabierto_motivo: `desagrupado: ${v.motivo}`,
  }).eq("id", v.expedienteId);
  if (eReabrir) throw new Error(`no se pudo reabrir el expediente: ${eReabrir.message}`);

  // La prioridad deja de estar vigente. `NEC-01`: reabrir es *sin heredar
  // aprobación* — si la prioridad se quedara, el sistema afirmaría algo que ya
  // no sustenta.
  await invalidarPorReapertura(v.expedienteId, v.motivo);

  await p.from("auditoria").insert({
    proceso_id: vinculo.proceso_id, actor: v.autor, accion: "desvincular",
    entidad: "vinculo_aporte_expediente", entidad_id: v.expedienteId, motivo: v.motivo,
  });
}
