/**
 * El aviso al flujo que llama (`INT-02`).
 *
 * Corre **después** de que la petición está guardada, y nunca antes. El orden no
 * es un detalle: si el webhook fuera primero, una caída de la red dejaría a
 * alguien esperando una llamada sin fila en ninguna tabla — nadie sabría
 * siquiera que la pidió. Guardado primero, el peor caso es que el aviso se
 * pierda y la fila siga ahí para llamar a mano.
 *
 * Es la misma regla que `IA-01` le impone a la lectura y que `DAT-01` le impone
 * al comprobante: *lo que la persona hizo queda registrado antes de que nada que
 * dependa de un tercero pueda fallar*.
 *
 * **Y no lanza nunca.** Todos los caminos de error —sin red, tarde, 4xx, 5xx—
 * terminan devolviendo `false` y dejando el motivo en el registro del servidor.
 * Un webhook caído no puede convertirse en un «no pudimos guardar tu petición»
 * en la cara de alguien cuya petición sí se guardó.
 */

/**
 * El destino, con la dirección acordada como suelo.
 *
 * Se puede apuntar a otro sitio por variable de entorno: los recorridos no
 * pueden salir a internet, y el día que el flujo cambie de servidor esto no
 * debería ser un despliegue de código.
 *
 * **Sin prefijo `NEXT_PUBLIC_` a propósito** (`AGENTS.md` §11): esto corre en el
 * servidor y la dirección no tiene por qué llegar al navegador.
 */
const DESTINO = "https://n8n.srv891132.hstgr.cloud/webhook/dnp";

/** Apagado explícito, para los recorridos. Mismo interruptor que `SIN_IA`. */
const apagado = () => process.env.SIN_WEBHOOK === "1";

function destino(): string {
  return process.env.LLAMADA_WEBHOOK_URL?.trim() || DESTINO;
}

// Corto a propósito. Esto corre con la persona esperando en pantalla y la
// petición **ya guardada**: tardar es peor que no avisar.
const ESPERA_MS = 6_000;

export type AvisoLlamada = {
  llamadaId: string;
  nombre: string;
  codigoPais: string;
  telefono: string;
};

/**
 * Lo que se le manda, y por qué exactamente eso.
 *
 * Lo mínimo para poder llamar: quién es, a qué número y con qué indicativo. Va
 * también el identificador de la fila, para que quien reciba la llamada pueda
 * volver al registro sin buscar por teléfono — buscar personas por su número es
 * cómo se acaba cruzando a dos que lo comparten.
 *
 * **No va ningún relato**, ni códigos de comprobante, ni nada de otro aporte: el
 * flujo que llama no necesita saber qué contó nadie, y `I6` dice que no se
 * divulga lo que no hace falta divulgar.
 *
 * **Y no va el número armado para marcar** (decisión del negocio, 2026-09-18).
 * Llegó a ir un `telefono_e164` —`+57` más los dígitos pelados— y se quitó: el
 * indicativo y el número van por separado, y **quien marca los junta**. La razón
 * para no hacerlo aquí es que armarlo es una interpretación, y este lado no es
 * el que sabe cómo marca el proveedor de telefonía: si un día hace falta un `00`
 * delante, o quitar un `0` de tránsito, eso se cambia en el flujo sin desplegar
 * el producto.
 *
 * Quien lo necesite lo arma así, y es una línea:
 *
 *     "+" + codigo_pais + telefono.replace(/[^0-9]/g, "")
 */
function cuerpo(l: AvisoLlamada) {
  return {
    evento: "llamada.solicitada",
    llamada_id: l.llamadaId,
    nombre: l.nombre,
    codigo_pais: l.codigoPais,
    telefono: l.telefono,
    solicitada_en: new Date().toISOString(),
  };
}

/**
 * El teléfono **tapado**, para poder escribirlo en un registro.
 *
 * Deja el indicativo y los cuatro últimos: alcanza para reconocer si se mandó el
 * número correcto y no alcanza para llamar a nadie.
 *
 * **Un registro de servidor es un sitio público.** En Vercel lo lee cualquiera
 * del equipo, se queda guardado y nadie lo audita. Volcar ahí un teléfono
 * completo es la misma fuga que la partición de `identidad` existe para impedir
 * (`SEG-01`, `I6`) — solo que por la puerta de atrás, y sin que nada falle.
 */
function tapado(codigoPais: string, telefono: string): string {
  const d = telefono.replace(/[^0-9]/g, "");
  return `+${codigoPais}${"*".repeat(Math.max(0, d.length - 4))}${d.slice(-4)}`;
}

/**
 * `true` si el flujo lo recibió. Nunca lanza.
 *
 * **Escribe en el registro del servidor en los cuatro casos**, y no solo cuando
 * falla. Registrar únicamente los errores deja «funcionó» y «ni siquiera lo
 * intentó» con el mismo aspecto: ninguno imprime nada, así que mirar el log no
 * contesta la pregunta que uno va a hacerle.
 *
 * Todo lo que sale lleva el prefijo `[llamada]`, para poder filtrarlo de un
 * `grep` entre el ruido de Next.
 */
export async function avisarLlamada(l: AvisoLlamada): Promise<boolean> {
  const quien = `id=${l.llamadaId} tel=${tapado(l.codigoPais, l.telefono)}`;

  if (apagado()) {
    console.info(`[llamada] APAGADO por SIN_WEBHOOK=1, no se avisa · ${quien}`);
    return false;
  }

  const url = destino();
  const desde = Date.now();
  console.info(`[llamada] → POST ${url} · ${quien}`);

  const corte = AbortSignal.timeout(ESPERA_MS);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo(l)),
      signal: corte,
    });
    const ms = Date.now() - desde;
    // El cuerpo se lee siempre, no solo al fallar: cuando n8n contesta 200 lo
    // que dice es «Workflow was started», y esa frase es la única prueba de que
    // el flujo arrancó de verdad. Recortado, porque un flujo puede devolver un
    // volcado entero y eso no cabe en un registro.
    const dice = (await r.text().catch(() => "")).slice(0, 300).replace(/\s+/g, " ").trim();

    if (!r.ok) {
      console.error(`[llamada] ← ${r.status} en ${ms} ms · ${quien} · ${dice}`);
      return false;
    }
    console.info(`[llamada] ← ${r.status} en ${ms} ms · ${quien} · ${dice}`);
    return true;
  } catch (e) {
    const ms = Date.now() - desde;
    // **Se distingue el plantón del rechazo.** Un `timeout` a los 6 s y un
    // «conexión rehusada» inmediato se arreglan en sitios distintos: el primero
    // es el flujo tardando, el segundo es que no hay nadie escuchando.
    const causa = e instanceof Error && e.name === "TimeoutError"
      ? `no contestó en ${ESPERA_MS} ms`
      : `${(e as Error)?.name ?? "error"}: ${(e as Error)?.message ?? e}`;
    console.error(`[llamada] ← sin respuesta tras ${ms} ms · ${quien} · ${causa}`);
    return false;
  }
}
