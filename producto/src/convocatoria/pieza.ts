import { token } from "../producto/tokens/leer.ts";
import { direccionDe, qrDe } from "./enlaces.ts";

/**
 * La pieza gráfica de un encuentro (`PIE-01` … `PIE-04`).
 *
 * Se genera **desde el mismo registro** que alimenta la agenda pública. Esa es
 * toda la razón de que exista: hasta ahora la pieza la armaba alguien aparte
 * copiando los datos a mano, y ahí es por donde se rompe — alguien copia la
 * fecha vieja, o el lugar con una errata, o se olvida de decir que hay
 * transporte. **Un afiche con la fecha equivocada no se corrige: ya está
 * pegado.**
 */

export type Formato = "afiche" | "volante" | "publicacion" | "historia";

export const FORMATOS: Record<Formato, { ancho: number; alto: number; nombre: string }> = {
  // Carta a 96 ppp, que es lo que sale de una impresora de oficina.
  afiche: { ancho: 816, alto: 1056, nombre: "Afiche (carta)" },
  volante: { ancho: 816, alto: 528, nombre: "Volante (media carta)" },
  publicacion: { ancho: 1080, alto: 1080, nombre: "Publicación (cuadrada)" },
  historia: { ancho: 1080, alto: 1920, nombre: "Historia (vertical)" },
};

export type DatosPieza = {
  convocatoria: string;
  titulo: string;
  tema: string | null;
  comienzaEn: string;
  zonaHoraria: string;
  modalidad: string;
  lugar: string | null;
  ayudas: string | null;
  cupos: number | null;
  estado: string;
  enlaceId: string;
  base: string;
  /** Imagen de fondo en `data:`, si la hay (`PIE-03`). */
  imagen?: string | null;
};

/** El texto se mete en un SVG: los cinco caracteres que lo romperían se escapan. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Parte un texto en líneas de como mucho `ancho` caracteres, sin cortar palabras. */
function lineas(texto: string, ancho: number, maximo: number): string[] {
  const salida: string[] = [];
  let actual = "";
  for (const palabra of texto.split(/\s+/)) {
    if ((actual + " " + palabra).trim().length > ancho) {
      if (actual) salida.push(actual);
      actual = palabra;
    } else {
      actual = (actual + " " + palabra).trim();
    }
    if (salida.length === maximo) break;
  }
  if (actual && salida.length < maximo) salida.push(actual);
  return salida;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
               "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/**
 * La fecha, escrita entera.
 *
 * **Sin abreviar y con la zona horaria**, que es lo que pide `PIE-02`: «12/10»
 * es octubre o diciembre según quién lo lea, y «a las 9» no dice nada sin decir
 * dónde son las 9.
 */
function fechaLarga(iso: string, zona: string): { dia: string; hora: string } {
  const f = new Date(iso);
  const enZona = new Date(f.toLocaleString("en-US", { timeZone: zona }));
  const hora = f.toLocaleTimeString("es-CO", { timeZone: zona, hour: "2-digit", minute: "2-digit" });
  return {
    dia: `${enZona.getDate()} de ${MESES[enZona.getMonth()]} de ${enZona.getFullYear()}`,
    hora: `${hora} (hora de ${zona.split("/")[1]?.replace("_", " ") ?? zona})`,
  };
}

/**
 * Comprueba que la pieza se puede generar (`PIE-01`).
 *
 * Devuelve el motivo cuando no. **No se inventan datos que falten**, y una
 * pieza que invite a asistir a un encuentro cancelado es peor que ninguna
 * pieza.
 */
export function porQueNo(d: DatosPieza): string | null {
  if (d.estado === "cancelado") {
    return "El encuentro está cancelado: una pieza que invite a ir sería una mentira impresa.";
  }
  if (d.modalidad !== "virtual" && !d.lugar) {
    return "Falta el lugar. Un afiche sin dónde no sirve para ir.";
  }
  return null;
}

export async function piezaSVG(d: DatosPieza, formato: Formato): Promise<string> {
  const no = porQueNo(d);
  if (no) throw new Error(no);

  const { ancho, alto } = FORMATOS[formato];
  const url = direccionDe(d.enlaceId, d.base);
  const qr = await qrDe(url);
  // El QR llega como documento propio; se incrusta su contenido.
  const qrInterno = qr.replace(/<\?xml[^>]*\?>/, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");
  const qrCaja = qr.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 41 41";

  const tinta = token("--pc-semantic-color-brand-ink");
  const papel = token("--pc-semantic-color-surface-base");
  const texto = token("--pc-semantic-color-text-default");
  const suave = token("--pc-semantic-color-text-secondary");
  const inverso = token("--pc-semantic-color-text-inverse");
  const accion = token("--pc-semantic-color-action-primary-default");

  const margen = Math.round(ancho * 0.07);
  const util = ancho - margen * 2;
  const { dia, hora } = fechaLarga(d.comienzaEn, d.zonaHoraria);
  const conImagen = Boolean(d.imagen);

  const tituloLineas = lineas(d.titulo, formato === "volante" ? 40 : 26, 3);
  const tamTitulo = Math.round(ancho * (formato === "volante" ? 0.055 : 0.072));
  const tamCuerpo = Math.round(ancho * 0.027);

  let y = margen + Math.round(ancho * 0.09);
  const filas: string[] = [];
  const escribir = (t: string, tam: number, color: string, peso = 400, salto = 1.35) => {
    filas.push(`<text x="${margen}" y="${y}" font-size="${tam}" fill="${color}" font-weight="${peso}" font-family="Geist, system-ui, sans-serif">${esc(t)}</text>`);
    y += Math.round(tam * salto);
  };

  escribir(d.convocatoria.toUpperCase(), Math.round(tamCuerpo * 0.8), conImagen ? inverso : accion, 500, 2.2);
  for (const l of tituloLineas) escribir(l, tamTitulo, conImagen ? inverso : tinta, 500, 1.18);
  y += Math.round(tamCuerpo * 0.8);
  if (d.tema) escribir(d.tema, tamCuerpo, conImagen ? inverso : suave, 400, 1.8);

  escribir(dia, Math.round(tamCuerpo * 1.25), conImagen ? inverso : texto, 500, 1.4);
  escribir(hora, tamCuerpo, conImagen ? inverso : suave, 400, 1.9);
  escribir(d.modalidad === "virtual" ? "Encuentro virtual" : d.lugar!, tamCuerpo,
           conImagen ? inverso : texto, 400, 1.5);
  if (d.modalidad === "virtual" && d.lugar) escribir(d.lugar, tamCuerpo, conImagen ? inverso : suave);

  // **La ausencia se omite, no se rellena** (`PIE-02`). Escribir «sin
  // transporte» donde nadie decidió que no lo hubiera convierte un dato que
  // falta en una negativa, y alguien deja de ir por eso.
  if (d.ayudas) { y += Math.round(tamCuerpo * 0.5); escribir(d.ayudas, Math.round(tamCuerpo * 0.9), conImagen ? inverso : suave, 400, 1.5); }
  if (d.cupos) escribir(`${d.cupos} cupos`, Math.round(tamCuerpo * 0.9), conImagen ? inverso : suave);

  const qrLado = Math.round(ancho * 0.22);
  const qrY = alto - margen - qrLado - Math.round(tamCuerpo * 3.2);
  const limite = alto - margen - Math.round(tamCuerpo * 0.6);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${esc(d.titulo)}">
  <rect width="${ancho}" height="${alto}" fill="${papel}"/>
  ${d.imagen ? `<image href="${d.imagen}" width="${ancho}" height="${alto}" preserveAspectRatio="xMidYMid slice"/>
  <!-- La capa que restituye el contraste. Con una imagen que lo impida, la
       pieza se genera CON la capa, no sin ella (PIE-03). -->
  <rect width="${ancho}" height="${alto}" fill="${tinta}" opacity="0.72"/>` : ""}
  ${filas.join("\n  ")}

  <!-- El QR y su dirección legible, juntos: quien no puede escanear, teclea. -->
  <g transform="translate(${margen}, ${qrY})">
    <rect x="${-Math.round(qrLado * 0.06)}" y="${-Math.round(qrLado * 0.06)}" width="${qrLado + Math.round(qrLado * 0.12)}" height="${qrLado + Math.round(qrLado * 0.12)}" rx="8" fill="${papel}"/>
    <svg x="0" y="0" width="${qrLado}" height="${qrLado}" viewBox="${qrCaja}">${qrInterno}</svg>
  </g>
  <text x="${margen + qrLado + Math.round(margen * 0.5)}" y="${qrY + Math.round(qrLado * 0.42)}" font-size="${Math.round(tamCuerpo * 0.85)}" fill="${conImagen ? inverso : suave}" font-family="Geist, system-ui, sans-serif">Cuenta lo tuyo en</text>
  <text x="${margen + qrLado + Math.round(margen * 0.5)}" y="${qrY + Math.round(qrLado * 0.72)}" font-size="${Math.round(tamCuerpo * 0.95)}" fill="${conImagen ? inverso : texto}" font-weight="500" font-family="Geist, system-ui, sans-serif">${esc(url.replace(/^https?:\/\//, ""))}</text>

  <!-- La frase de límite, obligatoria (PIE-02). Una pieza que no la lleva
       promete por omisión. -->
  <text x="${margen}" y="${limite - Math.round(tamCuerpo * 1.2)}" font-size="${Math.round(tamCuerpo * 0.78)}" fill="${conImagen ? inverso : suave}" font-family="Geist, system-ui, sans-serif">Puedes contar lo tuyo sin asistir al encuentro.</text>
  <text x="${margen}" y="${limite}" font-size="${Math.round(tamCuerpo * 0.78)}" fill="${conImagen ? inverso : suave}" font-family="Geist, system-ui, sans-serif">Que quede registrado no es un compromiso de obra.</text>
</svg>`;
}

/** La misma pieza en PNG, para quien la va a subir a una red. */
export async function piezaPNG(d: DatosPieza, formato: Formato): Promise<Buffer> {
  const { default: sharp } = await import("sharp");
  const { ancho, alto } = FORMATOS[formato];
  return sharp(Buffer.from(await piezaSVG(d, formato))).resize(ancho, alto).png().toBuffer();
}
