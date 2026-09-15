import { clienteServidor } from "../datos/cliente.ts";

/**
 * Lo que la portada necesita saber: qué convocatoria está abierta y qué
 * encuentros vienen (`M06`, `RF10`).
 *
 * La regla que ordena todo el módulo: **no prometer recepción en convocatoria
 * cerrada**. Por eso `recibeAportes` no es «está publicada»: una convocatoria
 * publicada cuya ventana ya cerró no recibe, y ofrecer participar ahí es
 * exactamente la promesa que `RF10` prohíbe.
 */

export type Convocatoria = {
  id: string;
  nombre: string;
  proposito: string;
  alcance: string;
  /** Qué pasa con lo que se aporta. Sin esto, la convocatoria promete por omisión. */
  efecto: string;
  abreEn: string;
  cierraEn: string | null;
  recibeAportes: boolean;
};

export type Encuentro = {
  id: string;
  titulo: string;
  tema: string | null;
  modalidad: "presencial" | "virtual" | "mixta";
  comienzaEn: string;
  zonaHoraria: string;
  lugar: string | null;
  sala: string | null;
  ayudas: string | null;
  cupos: number | null;
  estado: "programado" | "reprogramado" | "cancelado";
  /** Cuándo era antes. Solo si se reprogramó: es lo que hace visible el cambio. */
  comenzabaEn: string | null;
  motivoCambio: string | null;
};

const abierta = (c: { estado: string; abre_en: string; cierra_en: string | null }) => {
  const ahora = Date.now();
  return c.estado === "publicada"
    && new Date(c.abre_en).getTime() <= ahora
    && (c.cierra_en === null || new Date(c.cierra_en).getTime() > ahora);
};

/** La convocatoria publicada del proceso, esté abierta o ya cerrada. */
export async function convocatoriaVigente(procesoId: string): Promise<Convocatoria | null> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("convocatoria")
    .select("id, nombre, proposito, alcance, efecto, abre_en, cierra_en, estado")
    .eq("proceso_id", procesoId).neq("estado", "borrador")
    .order("abre_en", { ascending: false }).limit(1);
  if (error) throw new Error(`no se pudo leer la convocatoria: ${error.message}`);

  const c = data?.[0];
  if (!c) return null;
  return {
    id: c.id, nombre: c.nombre, proposito: c.proposito, alcance: c.alcance, efecto: c.efecto,
    abreEn: c.abre_en, cierraEn: c.cierra_en, recibeAportes: abierta(c),
  };
}

/**
 * Los encuentros que vienen, del más próximo al más lejano.
 *
 * **Los cancelados siguen saliendo.** El módulo lo pide: *«cancelación mantiene
 * ficha informativa y retira acceso a asistir»*. Quien se organizó para ir tiene
 * que enterarse de que no hay, y borrarlo de la lista es la forma más rápida de
 * que se presente en la puerta.
 */
export async function proximosEncuentros(procesoId: string, limite = 6): Promise<Encuentro[]> {
  const p = clienteServidor().schema("participacion");
  const { data, error } = await p.from("encuentro")
    .select("id, titulo, tema, modalidad, comienza_en, zona_horaria, lugar, sala, ayudas, cupos, estado, comenzaba_en, motivo_cambio")
    .eq("proceso_id", procesoId)
    .gte("comienza_en", new Date().toISOString())
    .order("comienza_en", { ascending: true })
    .limit(limite);
  if (error) throw new Error(`no se pudo leer la agenda: ${error.message}`);

  return (data ?? []).map((e) => ({
    id: e.id, titulo: e.titulo, tema: e.tema, modalidad: e.modalidad,
    comienzaEn: e.comienza_en, zonaHoraria: e.zona_horaria,
    lugar: e.lugar, sala: e.sala, ayudas: e.ayudas, cupos: e.cupos,
    estado: e.estado, comenzabaEn: e.comenzaba_en, motivoCambio: e.motivo_cambio,
  }));
}
