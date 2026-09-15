import Link from "next/link";
import { Campo, Opciones } from "../campos.tsx";
import { clienteServidor } from "../../../datos/cliente.ts";
import { procesoVigente } from "../../../datos/proceso.ts";
import { expedientesDe } from "../../../revision/expediente.ts";
import { prioridadVigente, historiaDePrioridad } from "../../../priorizacion/prioridad.ts";
import { accionResolver, accionDevolver, accionCrearExpediente, accionPriorizar } from "../acciones.ts";

export const dynamic = "force-dynamic";

const FACTORES: [string, string, string[]][] = [
  ["afectacion", "Afectación", ["alta", "media", "baja", "sin_establecer"]],
  ["urgencia", "Urgencia reportada", ["alta", "media", "baja", "sin_declarar"]],
  ["recurrencia", "Recurrencia", ["alta", "media", "baja", "unica"]],
  ["competencia", "Competencia", ["clara", "en_disputa", "sin_establecer"]],
];

export default async function Ficha({ params }: { params: Promise<{ aporte: string }> }) {
  const { aporte: aporteId } = await params;
  const procesoId = await procesoVigente();
  const p = clienteServidor().schema("participacion");

  const { data: a } = await p.from("aporte")
    .select("id, relato_original, lugar_declarado, afectados, desde_cuando, es_colectivo, colectivo_declarado, canal, recibido_en, estado_clasificacion, estado_confirmacion, estado_revision")
    .eq("id", aporteId).single();
  if (!a) return <div className="pc-backoffice"><p className="bo-empty">No existe ese aporte.</p></div>;

  const { data: ubi } = await p.from("ubicacion")
    .select("estado, territorio_codigo, territorio_version, motivo, autor")
    .eq("aporte_id", aporteId).order("creada_en");
  const { data: sint } = await p.from("sintesis")
    .select("version, texto, clase, autor, confirmada_en").eq("aporte_id", aporteId).order("version");
  const { data: alerta } = await p.from("alerta")
    .select("origen, indicio, orientacion_mostrada_en, contacto_intentado_en, recepcion_confirmada_en, devuelta_en")
    .eq("aporte_id", aporteId).maybeSingle();
  const { data: mun } = await p.from("territorio")
    .select("codigo, version, nombre, departamento:padre")
    .eq("nivel", "municipio").order("nombre").limit(1200);

  const expIds = await expedientesDe(aporteId);
  const exp = expIds[0]
    ? (await p.from("expediente").select("id, descripcion, reabierto_en").eq("id", expIds[0]).single()).data
    : null;
  const prio = exp ? await prioridadVigente(exp.id) : null;
  const historia = exp ? await historiaDePrioridad(exp.id) : [];

  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <aside className="bo-sidebar">
          <div className="bo-brand">Consola</div>
          <Link className="bo-back" href="/consola">← Volver a la bandeja</Link>
          <div className="bo-sidebar-bottom">
            <p className="bo-small"><strong>Sin permisos.</strong> No desplegar.</p>
          </div>
        </aside>

        <div className="bo-workspace">
          <header className="bo-topbar">
            <span className="bo-record-code">{aporteId.slice(0, 8)}</span>
            <span className="bo-results-line">{a.canal} · {new Date(a.recibido_en).toLocaleString("es-CO")}</span>
          </header>

          <main className="bo-main">
            {alerta && !alerta.devuelta_en && (
              <section className="bo-error">
                <h2>Alerta urgente</h2>
                <p>
                  La levantó <strong>{alerta.origen === "senal" ? "una señal de texto" : alerta.origen}</strong>
                  {alerta.indicio && <> · indicio: «{alerta.indicio}»</>}
                </p>
                <p className="bo-small">
                  Orientación mostrada: {alerta.orientacion_mostrada_en ? "sí" : "no"} ·
                  Contacto intentado: {alerta.contacto_intentado_en ? "sí" : "no"} ·
                  Recepción confirmada: {alerta.recepcion_confirmada_en ? "sí" : "no"}
                </p>
                <p className="bo-small">
                  <strong>Mostrar un teléfono no es haber contactado, y contactar no es que
                  alguien haya recibido.</strong>
                </p>
              </section>
            )}

            <div className="bo-review-layout">
              <div>
                <section className="bo-source">
                  <h2>Lo que la persona contó</h2>
                  <blockquote>{a.relato_original}</blockquote>
                  <p className="bo-small">
                    <strong>El relato original no se edita.</strong> La síntesis nunca lo
                    sustituye (N03).
                  </p>
                  {/* Lo que la persona precisó al contar, **con sus palabras**
                      (ADR 0012). Lo que no dijo no aparece: un campo vacío es
                      información —nadie se lo preguntó o no lo sabía— y
                      rellenarlo con «sin dato» lo disfrazaría de omisión suya.

                      `desde_cuando` se muestra tal cual y no se convierte en
                      fecha: «hace tres meses» no es una fecha, y volverlo una
                      sería la inferencia que `I2` prohíbe. */}
                  {/* **Declarado, no verificado.** La especificación dice que
                      *«vocero exige verificar representación y destinatario
                      autorizado»*, y nadie verificó nada: lo dijo quien escribió.
                      Ponerlo sin ese aviso invitaría a tratarlo como probado, y
                      el colectivo ni siquiera existe como entidad todavía
                      (`Q23`). */}
                  {a.es_colectivo && (
                    <p className="bo-observation">
                      <strong>Dice hablar por un grupo:</strong>{" "}
                      <em>«{a.colectivo_declarado ?? "sin nombrarlo"}»</em>.{" "}
                      <span className="bo-muted">
                        Lo dice quien escribió; nadie verificó la representación.
                        El aporte es del grupo, no de quien lo mandó (V19).
                      </span>
                    </p>
                  )}
                  {([["Dónde dijo que ocurre", a.lugar_declarado],
                     ["A quiénes les pasa", a.afectados],
                     ["Desde cuándo", a.desde_cuando]] as const)
                    .filter(([, v]) => v)
                    .map(([etiqueta, v]) => (
                      <p className="bo-observation" key={etiqueta}>
                        {etiqueta}, con sus palabras: <em>«{v}»</em>
                      </p>
                    ))}
                </section>

                {(sint?.length ?? 0) > 0 && (
                  <section className="bo-synthesis">
                    <h2>Lo que entendimos</h2>
                    {sint!.map((s) => (
                      <div key={s.version} className="bo-check">
                        <span className="bo-badge" data-state={s.confirmada_en ? "validated" : "draft"}>
                          v{s.version} · {s.clase}{s.confirmada_en ? " · confirmada por la persona" : ""}
                        </span>
                        <p style={{ whiteSpace: "pre-wrap" }}>{s.texto}</p>
                      </div>
                    ))}
                    <p className="bo-small">
                      Que la persona confirme <strong>no significa que los hechos estén
                      verificados</strong>.
                    </p>
                  </section>
                )}

                <section className="bo-history-section">
                  <h2>Ubicación</h2>
                  {ubi?.map((u, i) => (
                    <p key={i}>
                      <span className="bo-badge" data-state={u.estado === "confirmada" ? "validated" : "clarify"}>
                        {u.estado}
                      </span>{" "}
                      {u.territorio_codigo ?? <span className="bo-muted">sin código — no se infiere</span>}
                      {u.motivo && <span className="bo-small"> · {u.motivo}</span>}
                    </p>
                  ))}

                  {ubi?.some((u) => u.estado === "confirmada") && (
                    <form action={accionDevolver}>
                      <input type="hidden" name="aporteId" value={aporteId} />
                      <Campo id="dev-motivo" name="motivo" etiqueta="Por qué vuelve a «por aclarar»"
                             ejemplo="la persona dijo otra cosa al llamarla" />
                      <Campo id="dev-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button">Devolver a por aclarar</button>
                      <p className="bo-small">
                        El código se borra, no se queda de adorno: un código bajo «por aclarar»
                        es el cuarto estado implícito que <strong>I2</strong> prohíbe.
                      </p>
                    </form>
                  )}

                  {ubi?.some((u) => u.estado === "por_aclarar") && (
                    <form action={accionResolver}>
                      <input type="hidden" name="aporteId" value={aporteId} />
                      <input type="hidden" name="version" value={mun?.[0]?.version ?? ""} />
                      <Opciones id="ubi-codigo" name="codigo" etiqueta="Municipio">
                        <option value="">Escoge uno…</option>
                        {mun?.map((m) => (
                          <option key={m.codigo} value={m.codigo}>{m.nombre} ({m.codigo})</option>
                        ))}
                      </Opciones>
                      <Campo id="ubi-motivo" name="motivo" etiqueta="Por qué este municipio"
                             ejemplo="la persona lo confirmó / la referencia solo existe ahí…" />
                      <Campo id="ubi-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button" data-variant="primary">Aceptar el municipio</button>
                      <p className="bo-small">
                        Una dirección residencial <strong>no es</strong> el lugar del problema sin
                        confirmación (GEO-01).
                      </p>
                    </form>
                  )}
                </section>
              </div>

              <aside className="bo-inspector">
                <h2>Gestión</h2>
                <p className="bo-small">
                  Clasificación: {a.estado_clasificacion} · Confirmación: {a.estado_confirmacion} ·
                  Revisión: {a.estado_revision}
                </p>
                <p className="bo-small"><strong>Los cuatro estados se mueven por separado</strong> (CAL-01).</p>

                {!exp ? (
                  <form action={accionCrearExpediente}>
                    <input type="hidden" name="aporteId" value={aporteId} />
                    <input type="hidden" name="procesoId" value={procesoId} />
                    <h3>Abrir expediente</h3>
                    <Campo id="exp-descripcion" name="descripcion" etiqueta="La afectación, en una frase"
                           ejemplo="sin agua en la parte alta desde hace tres meses" />
                    <Campo id="exp-cambio" name="cambioEsperado" etiqueta="Qué debería cambiar" opcional />
                    <Campo id="exp-motivo" name="motivo" etiqueta="Por qué este aporte lo origina" />
                    <Campo id="exp-autor" name="autor" etiqueta="Tu nombre" opcional />
                    <button className="bo-button" data-variant="primary">Abrir</button>
                    <p className="bo-small">
                      <strong>La separación es el estado por defecto.</strong> Compartir tema o
                      municipio no basta: ¿podrías dar por atendida una mientras la otra sigue
                      pendiente?
                    </p>
                  </form>
                ) : (
                  <>
                    <h3>Expediente</h3>
                    <p>{exp.descripcion}</p>
                    {exp.reabierto_en && (
                      <p className="bo-badge" data-state="clarify">
                        reabierto · la prioridad dejó de estar vigente
                      </p>
                    )}

                    <h3>Prioridad de examen</h3>
                    {prio ? (
                      <div className="bo-context-grid">
                        <p><strong>{prio.motivo}</strong></p>
                        <p className="bo-small">
                          afectación: {prio.afectacion ?? "—"} · urgencia: {prio.urgenciaReportada ?? "—"} ·
                          recurrencia: {prio.recurrencia ?? "—"} · competencia: {prio.competencia ?? "—"}
                        </p>
                        {prio.incertidumbre && <p className="bo-observation">Incertidumbre: {prio.incertidumbre}</p>}
                        <p className="bo-small">por {prio.autor}</p>
                      </div>
                    ) : (
                      <p className="bo-muted">Sin priorizar.</p>
                    )}

                    <form action={accionPriorizar}>
                      <input type="hidden" name="expedienteId" value={exp.id} />
                      <Campo id="pri-motivo" name="motivo" etiqueta="Por qué examinar esto primero"
                             ejemplo="afecta a menores y es una sola fuente de agua" />
                      {FACTORES.map(([n, etiqueta, ops]) => (
                        <Opciones key={n} id={`pri-${n}`} name={n} etiqueta={etiqueta} opcional>
                          <option value="">sin registrar</option>
                          {ops.map((o) => <option key={o} value={o}>{o}</option>)}
                        </Opciones>
                      ))}
                      <Campo id="pri-incertidumbre" name="incertidumbre" etiqueta="Qué no sabemos" opcional />
                      <Campo id="pri-autor" name="autor" etiqueta="Tu nombre" opcional />
                      <button className="bo-button">Registrar prioridad</button>
                      <p className="bo-small">
                        <strong>No hay puntaje ni ranking.</strong> Los cinco factores van por
                        separado porque los pesos no existen, y una fórmula inventada decidiría a
                        quién se atiende primero con una cuenta que nadie autorizó.
                      </p>
                    </form>

                    {historia.length > 1 && (
                      <section className="bo-history">
                        <h3>Historia de la prioridad</h3>
                        {historia.map((h) => (
                          <p key={h.id} className="bo-small">
                            {h.vigenteHasta ? "· " : "▸ "}{h.motivo} — {h.autor}
                          </p>
                        ))}
                      </section>
                    )}
                  </>
                )}
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
