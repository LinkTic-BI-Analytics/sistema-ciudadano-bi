import QRCode from "qrcode";
import { clienteServidor } from "../datos/cliente.ts";

/**
 * Enlaces y QR por evento y por pieza (`QR-01` … `QR-04`).
 *
 * Lo que este módulo sostiene es una separación, no una funcionalidad:
 *
 *   · **de dónde vino el enlace** — el evento al que apuntaba el QR;
 *   · **en qué evento dice participar la persona** — que puede ser otro;
 *   · **dónde ocurre el problema** — que se pregunta aparte y puede ser un
 *     tercer sitio.
 *
 * El caso del requerimiento: alguien recibe reenviado el QR del evento A
 * mientras está en el evento B, y cuenta un problema de una vereda del
 * municipio C. **Un solo aporte, tres contextos, ninguna asistencia.**
 */

export type Pieza = "afiche" | "volante" | "publicacion" | "radio" | "otro";

export type Enlace = {
  id: string;
  encuentroId: string;
  pieza: Pieza;
  estado: "activo" | "retirado";
  utms: { source: string | null; medium: string | null; campaign: string | null; content: string | null };
};

// Sin O, I ni L: el código va impreso en un afiche y alguien lo va a teclear
// mirándolo de lejos. Es el mismo alfabeto del comprobante, por la misma razón.
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function nuevoId(largo = 8): string {
  const bytes = crypto.getRandomValues(new Uint8Array(largo));
  return Array.from(bytes, (b) => ALFABETO[b % ALFABETO.length]).join("");
}

/**
 * Crea un enlace para un encuentro y una pieza.
 *
 * **Dos piezas del mismo encuentro no crean dos eventos.** El requerimiento lo
 * dice así: *«si se necesita distinguir afiche, volante, radio o publicación
 * digital, se generan variantes por pieza; no hace falta crear un evento
 * duplicado»*.
 */
export async function crearEnlace(e: {
  procesoId: string;
  encuentroId: string;
  pieza: Pieza;
  creadoPor: string;
  utm?: { source?: string; medium?: string; campaign?: string; content?: string };
}): Promise<Enlace> {
  const p = clienteServidor().schema("participacion");

  // Reintenta si el identificador ya existía. Con 31^8 posibilidades no pasa,
  // pero «no pasa» no es lo mismo que «no puede pasar».
  for (let intento = 0; intento < 5; intento++) {
    const id = nuevoId();
    const { data, error } = await p.from("enlace").insert({
      id, proceso_id: e.procesoId, encuentro_id: e.encuentroId, pieza: e.pieza,
      creado_por: e.creadoPor,
      utm_source: e.utm?.source ?? null, utm_medium: e.utm?.medium ?? null,
      utm_campaign: e.utm?.campaign ?? null, utm_content: e.utm?.content ?? null,
    }).select("id, encuentro_id, pieza, estado, utm_source, utm_medium, utm_campaign, utm_content").single();

    if (!error && data) {
      return {
        id: data.id, encuentroId: data.encuentro_id, pieza: data.pieza as Pieza,
        estado: data.estado as Enlace["estado"],
        utms: {
          source: data.utm_source, medium: data.utm_medium,
          campaign: data.utm_campaign, content: data.utm_content,
        },
      };
    }
    if (error && !error.message.includes("duplicate")) {
      throw new Error(`no se pudo crear el enlace: ${error.message}`);
    }
  }
  throw new Error("no se pudo generar un identificador libre para el enlace");
}

/** La dirección corta que va impresa. Legible y tecleable, no solo escaneable. */
export function direccionDe(id: string, base: string): string {
  return `${base.replace(/\/$/, "")}/e/${id}`;
}

/**
 * El QR, en SVG.
 *
 * Se genera **aquí**, no con un servicio de fuera: `QR-01` prohíbe *«depender
 * de un proveedor externo de QR para recibir aportes»*, y con razón — un afiche
 * impreso dura años y el proveedor puede no durar tanto.
 */
export async function qrDe(direccion: string): Promise<string> {
  return QRCode.toString(direccion, {
    type: "svg",
    // Corrección alta: un afiche se moja, se dobla y se pega encima de otro.
    errorCorrectionLevel: "H",
    margin: 2,
  });
}

export type Resuelto =
  | { existe: false }
  | {
      existe: true;
      enlace: Enlace;
      encuentro: {
        id: string; titulo: string; comienzaEn: string; zonaHoraria: string;
        modalidad: string; lugar: string | null; estado: string; motivoCambio: string | null;
      };
      /** Si el enlace fue retirado, no sirve para entrar — pero sí para explicar. */
      utilizable: boolean;
    };

/**
 * Resuelve un enlace que llega en una dirección.
 *
 * **Un identificador que no existe no se inventa.** `QR-04`: *«ante ID
 * inexistente se muestra selector/agenda sin inventar evento ni asociación»*.
 */
export async function resolverEnlace(id: string): Promise<Resuelto> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("enlace")
    .select("id, encuentro_id, pieza, estado, utm_source, utm_medium, utm_campaign, utm_content")
    .eq("id", id).maybeSingle();
  if (error) throw new Error(`no se pudo resolver el enlace: ${error.message}`);
  if (!data) return { existe: false };

  const { data: e } = await p.from("encuentro")
    .select("id, titulo, comienza_en, zona_horaria, modalidad, lugar, estado, motivo_cambio")
    .eq("id", data.encuentro_id).maybeSingle();
  // Un enlace que apunta a un encuentro que ya no está es un enlace que no
  // resuelve. No se inventa nada en su lugar.
  if (!e) return { existe: false };

  return {
    existe: true,
    utilizable: data.estado === "activo",
    enlace: {
      id: data.id, encuentroId: data.encuentro_id, pieza: data.pieza as Pieza,
      estado: data.estado as Enlace["estado"],
      utms: {
        source: data.utm_source, medium: data.utm_medium,
        campaign: data.utm_campaign, content: data.utm_content,
      },
    },
    encuentro: {
      id: e.id, titulo: e.titulo, comienzaEn: e.comienza_en,
      zonaHoraria: e.zona_horaria, modalidad: e.modalidad,
      lugar: e.lugar, estado: e.estado, motivoCambio: e.motivo_cambio,
    },
  };
}

// Las únicas UTMs que se guardan. `QR-03`: los parámetros **se validan**, no se
// muestran como HTML y no sirven para redirigir a ningún sitio. Cualquier otra
// cosa que venga en la dirección se descarta sin más.
const UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

/**
 * Limpia lo que llegó en la dirección.
 *
 * Se recorta y se limita el juego de caracteres porque esto lo escribe
 * cualquiera: una UTM es texto de un desconocido, y va a acabar en una pantalla
 * interna. **Una UTM manipulada no cambia el evento registrado ni concede
 * permisos**; lo único que puede hacer es ensuciar un informe.
 */
export function utmsLimpias(parametros: URLSearchParams): Record<string, string> | null {
  const limpias: Record<string, string> = {};
  for (const clave of UTMS) {
    const crudo = parametros.get(clave);
    if (!crudo) continue;
    const valor = crudo.replace(/[^\w\s.\-]/g, "").trim().slice(0, 80);
    if (valor) limpias[clave] = valor;
  }
  return Object.keys(limpias).length ? limpias : null;
}
