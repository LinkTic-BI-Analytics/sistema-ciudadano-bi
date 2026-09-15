import Link from "next/link";
import { bandeja, type Filtro } from "../../revision/bandeja.ts";
import { Filtros, Señales } from "./bandeja.tsx";
import { procesoVigente } from "../../datos/proceso.ts";
import { clienteServidor } from "../../datos/cliente.ts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Consola de revisión" };

// Hora de Bogotá siempre, y explícita. El servidor puede estar en otro huso, y
// una bandeja que ordena por antigüedad con horas corridas es una bandeja que
// miente sobre a quién le toca primero.
const fecha = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { timeZone: "America/Bogota" });

export default async function Consola({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const texto = typeof q.q === "string" ? q.q : "";
  // Por defecto, lo que hay que trabajar. El revisor entra a resolver, no a
  // mirar: `backoffice-especificacion.md` dice que «la pantalla inicial
  // prioriza el trabajo pendiente».
  const ubicacion = (typeof q.ubicacion === "string" ? q.ubicacion : "por_aclarar") as Filtro["ubicacion"];

  const procesoId = await procesoVigente();
  const filas = await bandeja(procesoId, { texto, ubicacion });

  const p = clienteServidor().schema("participacion");
  const { count: total } = await p.from("aporte")
    .select("id", { count: "exact", head: true })
    .eq("proceso_id", procesoId).is("retirado_en", null);
  const { data: exps } = await p.from("expediente")
    .select("id, descripcion, abierto_en, reabierto_en")
    .eq("proceso_id", procesoId).is("retirado_en", null)
    .order("abierto_en", { ascending: false }).limit(20);

  // «Abrir siguiente» abre **el primero visible por fecha de recepción**, no el
  // más grave ni el más votado: no hay puntuación de prioridad, y no haberla es
  // la decisión (`BI-02`).
  const siguiente = filas[0]?.aporteId ?? null;

  return (
    <div className="pc-backoffice">
      <div className="bo-shell">
        <aside className="bo-sidebar">
          <div className="bo-brand">Consola</div>
          <p className="bo-nav-label">Revisión</p>
          <Link className="bo-link" href="/consola">Por aclarar</Link>
          <div className="bo-sidebar-bottom">
            <p className="bo-small">
              <strong>Sin permisos.</strong> Cualquiera que abra esta dirección ve esto.
              La política la decide <code>T032</code>, bloqueada por <code>P4</code> y{" "}
              <code>Q18</code>. <strong>No desplegar.</strong>
            </p>
          </div>
        </aside>

        <div className="bo-workspace">
          <header className="bo-topbar">
            <span className="bo-kicker">Bandeja de calidad</span>
            <span className="bo-results-line">
              {filas.length} en la lista · {total ?? 0} aportes · {exps?.length ?? 0} expedientes
            </span>
          </header>

          <main className="bo-main">
            <section className="bo-section-head">
              <h1>Bandeja de revisión</h1>
              <p className="bo-muted">
                Los más antiguos primero. <strong>Sin orden por popularidad</strong>: un aporte
                de una vereda dispersa pesa lo mismo que uno de una avenida, y el orden no cambia
                al filtrar.
              </p>
            </section>

            <Filtros texto={texto} ubicacion={ubicacion ?? "por_aclarar"} siguiente={siguiente} />

            {filas.length === 0 ? (
              // Sin resultados: explicación y una acción para limpiar, que es
              // lo que pide la especificación. Una lista vacía sin decir por
              // qué parece un error del sistema.
              <p className="bo-empty" data-prueba="sin-resultados">
                {texto || ubicacion !== "todos" ? (
                  <>
                    Ningún aporte coincide con lo que estás buscando.{" "}
                    <Link className="bo-link" href="/consola?ubicacion=todos">Ver todos</Link>.
                  </>
                ) : (
                  <>
                    No ha llegado ningún aporte. Si acabas de sembrar la base, manda uno desde{" "}
                    <Link className="bo-link" href="/participar">/participar</Link>.
                  </>
                )}
              </p>
            ) : (
              <>
              {/* **Las dos estructuras, con los mismos datos.** No es
                  duplicación: es el contrato del sistema de diseño, que oculta
                  `.bo-table-desktop` bajo 36rem y enciende `.bo-card-list`.
                  Exactamente una de las dos se ve. */}
              <ul className="bo-card-list">
                {filas.map((f) => (
                  <li key={f.aporteId} className="bo-record-card">
                    <Link className="bo-record-link" href={`/consola/${f.aporteId}`}>
                      {f.relato.slice(0, 90)}{f.relato.length > 90 ? "…" : ""}
                    </Link>
                    <div className="bo-card-meta"><Señales fila={f} /></div>
                    {/* **Los mismos datos que la tabla.** El sistema de diseño
                        lo pide literal: «no se ocultan datos esenciales» al
                        pasar a lista. Lo que falta y quién lo tiene son la
                        razón de mirar la bandeja. */}
                    <p>{f.territorio ?? (f.lugarDeclarado ? `«${f.lugarDeclarado}»` : "sin lugar")} · {fecha(f.recibidoEn)}</p>
                    <p>Falta: {f.falta.length === 0 ? "nada" : f.falta.join(", ")} · Lo tiene: {f.responsable ?? "nadie"}</p>
                  </li>
                ))}
              </ul>

              <table className="bo-table bo-table-desktop">
                <thead>
                  <tr>
                    <th>Aporte</th><th>Territorio</th><th>Qué falta</th><th>Quién lo tiene</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.aporteId}>
                      <td>
                        <Link className="bo-record-link" href={`/consola/${f.aporteId}`}>
                          {f.relato.slice(0, 70)}{f.relato.length > 70 ? "…" : ""}
                        </Link>
                        <p className="bo-small">{fecha(f.recibidoEn)}</p>
                        <Señales fila={f} />
                      </td>
                      <td>
                        {f.territorio
                          ? <strong>{f.territorio}</strong>
                          : f.lugarDeclarado
                            ? <em className="bo-muted">«{f.lugarDeclarado}»</em>
                            : <span className="bo-muted">no lo dijo</span>}
                      </td>
                      <td className="bo-small">
                        {f.falta.length === 0
                          ? <span className="bo-muted">nada</span>
                          : f.falta.join(", ")}
                      </td>
                      <td className="bo-small">
                        {f.responsable ?? <span className="bo-muted">nadie</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}

            <section className="bo-history-section">
              <h2>Expedientes abiertos</h2>
              {(exps?.length ?? 0) === 0 ? (
                <p className="bo-empty">Todavía ninguno.</p>
              ) : (
                <>
                  <ul className="bo-card-list">
                    {exps!.map((e) => (
                      <li key={e.id} className="bo-record-card">
                        <strong>{e.descripcion}</strong>
                        <div className="bo-card-meta">
                          <span>{fecha(e.abierto_en)}</span>
                          {e.reabierto_en && (
                            <span className="bo-badge" data-state="clarify">
                              reabierto · su prioridad dejó de estar vigente
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <table className="bo-table bo-table-desktop">
                    <thead>
                      <tr>
                        <th>Expediente</th>
                        <th>Abierto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exps!.map((e) => (
                        <tr key={e.id}>
                          <td>{e.descripcion}</td>
                          <td className="bo-small">{fecha(e.abierto_en)}</td>
                          <td>
                            {e.reabierto_en ? (
                              <span className="bo-badge" data-state="clarify">
                                reabierto · su prioridad dejó de estar vigente
                              </span>
                            ) : (
                              <span className="bo-muted">abierto</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </section>
          </main>

          <footer className="bo-footer">
            <p className="bo-bottom-note">
              Abrir un expediente inicia una revisión. <strong>No aprueba nada, no asigna
              recursos y no declara resuelto nada.</strong>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
