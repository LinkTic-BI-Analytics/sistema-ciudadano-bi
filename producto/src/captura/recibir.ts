import { createHash, randomBytes } from "node:crypto";
import { clienteServidor } from "../datos/cliente.ts";

export type Canal = "web" | "asistida" | "voz_transcrita";

export type EntradaAporte = {
  procesoId: string;
  /** La genera el navegador antes del primer envío y la reusa al reintentar. */
  claveEnvio: string;
  relato: string;
  canal: Canal;
  /** El lugar **tal como la persona lo dijo**. Se guarda aunque no se pueda normalizar. */
  lugarDeclarado?: string;
};

export type ResultadoAporte = {
  aporteId: string;
  /** Se devuelve UNA vez. En la base solo queda su hash. */
  codigoComprobante: string;
  /** `true` si esto era un reintento. La pantalla lo usa para no mostrarlo como otro. */
  yaExistia: boolean;
};

// Letras y números sin los que se confunden al dictar por teléfono: sin O/0,
// sin I/1, sin L. El comprobante se va a leer en voz alta en una mesa.
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function nuevoCodigo(): string {
  const bytes = randomBytes(12);
  return Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join("");
}

const hash = (codigo: string) => createHash("sha256").update(codigo).digest("hex");

/**
 * Recibe un aporte. Es idempotente por la clave de envío.
 *
 * **No comprueba y luego inserta.** Inserta y deja que la base resuelva el
 * conflicto, porque comprobar-primero deja una ventana donde dos peticiones
 * simultáneas pasan las dos — y `I1` no admite ventanas. La restricción
 * `un_envio_un_aporte` es la que de verdad lo hace imposible; esto solo se
 * apoya en ella.
 *
 * El comprobante se emite **después** de persistir. `DAT-01`: *pendiente, falló
 * y recibido no son intercambiables*, y una persona que ve un código y luego
 * descubre que no quedó nada no vuelve.
 */
export async function recibirAporte(entrada: EntradaAporte): Promise<ResultadoAporte> {
  const sb = clienteServidor();
  const participacion = sb.schema("participacion");

  const { data: creados, error } = await participacion
    .from("aporte")
    .upsert(
      {
        proceso_id: entrada.procesoId,
        clave_envio: entrada.claveEnvio,
        relato_original: entrada.relato,
        canal: entrada.canal,
        lugar_declarado: entrada.lugarDeclarado ?? null,
      },
      { onConflict: "proceso_id,clave_envio", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw new Error(`no se pudo recibir el aporte: ${error.message}`);

  const creado = creados?.[0]?.id as string | undefined;

  if (creado) {
    // I2 · la ubicación nace «por aclarar» y **sin código**. Normalizar es
    // trabajo de revisión (`GEO-01`), y aquí inventarlo sería la inferencia que
    // I2 prohíbe.
    const { error: eUbi } = await participacion.from("ubicacion").insert({
      proceso_id: entrada.procesoId,
      aporte_id: creado,
      estado: "por_aclarar",
    });
    if (eUbi) throw new Error(`no se pudo registrar la ubicación: ${eUbi.message}`);

    // El esquema `identidad` **no se expone por la API** a propósito: se escribe
    // a través de una función, no por REST. Si fuera alcanzable por URL directa,
    // `SEG-01` se rompería — los permisos aplican también por URL.
    //
    // Y va el hash, nunca el código: si el código viajara como argumento,
    // quedaría en el registro de sentencias de Postgres.
    const codigo = nuevoCodigo();
    const { error: eComp } = await participacion.rpc("emitir_comprobante", {
      p_proceso: entrada.procesoId,
      p_aporte: creado,
      p_hash: hash(codigo),
    });
    if (eComp) throw new Error(`no se pudo emitir el comprobante: ${eComp.message}`);

    await participacion.from("auditoria").insert({
      proceso_id: entrada.procesoId,
      actor: "ciudadano",
      accion: "recibir",
      entidad: "aporte",
      entidad_id: creado,
    });

    return { aporteId: creado, codigoComprobante: codigo, yaExistia: false };
  }

  // Era un reintento: la fila ya existe y la restricción garantiza que es una.
  const { data: existente, error: eBuscar } = await participacion
    .from("aporte")
    .select("id")
    .eq("proceso_id", entrada.procesoId)
    .eq("clave_envio", entrada.claveEnvio)
    .single();
  if (eBuscar || !existente) {
    throw new Error(`el envío se rechazó por duplicado pero no se encontró el original: ${eBuscar?.message}`);
  }

  // **El código no se puede volver a mostrar**: en la base solo está su hash, y
  // eso es a propósito. La pantalla usa `yaExistia` para decir «ya lo
  // recibimos» en vez de inventar otro.
  return { aporteId: existente.id as string, codigoComprobante: "", yaExistia: true };
}
