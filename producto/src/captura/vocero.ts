import { clienteServidor } from "../datos/cliente.ts";

/**
 * Quién habla en este aporte: la persona por sí misma, o por un grupo.
 *
 * **Declarado, nunca verificado.** La especificación dice que *«vocero exige
 * verificar representación y destinatario autorizado»*, y aquí no hay con qué
 * verificar: `Q23` sigue abierta y el colectivo **no existe como entidad** en
 * ninguno de los documentos del negocio. Guardar el nombre que la persona dio,
 * marcado como dicho por ella, es lo único honesto que se puede hacer hoy — y
 * es lo que permitirá enganchar el colectivo real el día que se defina.
 *
 * El aporte es del colectivo, no del vocero (`V19`). Por eso lo que se guarda es
 * **el nombre del grupo**, no el de quien escribe: si mañana cambia el vocero,
 * el aporte no se mueve.
 */
export async function declararVoceria(e: {
  aporteId: string;
  /** Tal como lo dijo: «la junta de acción comunal de la vereda El Salado». */
  colectivo: string;
}): Promise<void> {
  const nombre = e.colectivo.trim();
  if (!nombre) throw new Error("decir que se habla por un grupo exige decir cuál");

  const p = clienteServidor().schema("participacion");
  const { error } = await p.from("aporte")
    .update({ es_colectivo: true, colectivo_declarado: nombre })
    .eq("id", e.aporteId);
  if (error) throw new Error(`no se pudo guardar la vocería: ${error.message}`);
}
