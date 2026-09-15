import Link from "next/link";
import { bandeja, type Filtro } from "../../revision/bandeja.ts";
import { Filtros, Señales, DeQue, Donde, Gestion, ElAporte, Rangos } from "./bandeja.tsx";
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
  // **Por defecto, todos.** Estaba en «por aclarar», y eso escondía justo los
  // que ya tienen municipio: 19 de 115 invisibles, que es la queja de que «el
  // departamento y el municipio están capturados y no se ven». Con la columna
  // «Qué falta» a la vista, el trabajo pendiente se sigue viendo sin esconder
  // la mitad de la bandeja.
  const ubicacion = (typeof q.ubicacion === "string" ? q.ubicacion : "todos") as Filtro["ubicacion"];
  const uno = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : "");
  const departamento = uno("departamento");
  const municipio = uno("municipio");
  const tema = uno("tema");
  const gestion = uno("gestion");
  const antiguedad = uno("antiguedad");
  const alcance = uno("alcance");
  const soloAlerta = uno("alerta") === "1";
  // El orden de trabajo manda por defecto: el que lleva más esperando primero.
  const orden = (typeof q.orden === "string" ? q.orden : "antiguos") as Filtro["orden"];
  const limite = Math.min(Number(q.ver) || 50, 500);

  const procesoId = await procesoVigente();
  const { filas, opciones, total, hayMas } = await bandeja(procesoId, {
    texto, ubicacion, orden, departamento, municipio, tema,
    gestion: (gestion || undefined) as Filtro["gestion"],
    antiguedad: (antiguedad || undefined) as Filtro["antiguedad"],
    alcance: (alcance || undefined) as Filtro["alcance"],
    soloAlerta,
  }, limite);

  const p = clienteServidor().schema("participacion");
  const { count: totalAportes } = await p.from("aporte")
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
              {total} en la lista · {totalAportes ?? 0} aportes · {exps?.length ?? 0} expedientes
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

            <Filtros texto={texto} ubicacion={ubicacion ?? "todos"}
                     orden={orden ?? "antiguos"} siguiente={siguiente}
                     opciones={opciones} departamento={departamento} municipio={municipio}
                     tema={tema} gestion={gestion} soloAlerta={soloAlerta}
                     antiguedad={antiguedad} alcance={alcance} />

            {/* **Cuántos hay y cuántos se ven.** Cortar en 50 sin decirlo es
                cómo diez aportes recién registrados se volvieron invisibles:
                estaban en las posiciones 97 a 106 de 106 y la pantalla no daba
                ninguna señal. */}
            {filas.length > 0 && (
              <p className="bo-small" data-prueba="cuantos">
                Mostrando {filas.length} de {total}
                {orden === "recientes"
                  ? " · los últimos que llegaron"
                  : " · los que llevan más esperando"}
              </p>
            )}

            {filas.length === 0 ? (
              // Sin resultados: explicación y una acción para limpiar, que es
              // lo que pide la especificación. Una lista vacía sin decir por
              // qué parece un error del sistema.
              <p className="bo-empty" data-prueba="sin-resultados">
                {/* **Vacío no es lo mismo que sin coincidencias.** Con la base
                    en blanco decía «ninguno coincide con lo que estás
                    buscando», que manda a alguien a revisar un filtro cuando lo
                    que pasa es que no ha llegado nada. Solo se ve probando en
                    blanco, y probar en blanco casi nunca se hace. */}
                {(totalAportes ?? 0) === 0 ? (
                  <>
                    No ha llegado ningún aporte todavía. Manda uno desde{" "}
                    <Link className="bo-link" href="/participar">/participar</Link> para ver cómo
                    se ve la bandeja.
                  </>
                ) : texto || ubicacion !== "todos" ? (
                  <>
                    Ningún aporte coincide con lo que estás buscando.{" "}
                    <Link className="bo-link" href="/consola?ubicacion=todos">Ver todos</Link>.
                  </>
                ) : (
                  <>Ningún aporte está por aclarar. Están todos ubicados.</>
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
                      <ElAporte fila={f} />
                    </Link>
                    <div className="bo-card-meta"><Señales fila={f} /></div>
                    {/* **Los mismos datos que la tabla.** El sistema de diseño
                        lo pide literal: «no se ocultan datos esenciales» al
                        pasar a lista. Lo que falta y quién lo tiene son la
                        razón de mirar la bandeja. */}
                    <p><DeQue tema={f.tema} /> · {fecha(f.recibidoEn)}</p>
                    <p><Donde fila={f} /></p>
                    <p><Rangos fila={f} /></p>
                    <p>
                      Falta: {f.falta.length === 0 ? "nada" : f.falta.join(", ")}
                      {" · "}<Gestion fila={f} />
                    </p>
                  </li>
                ))}
              </ul>

              <table className="bo-table bo-table-desktop">
                <thead>
                  <tr>
                    {/* **Cuatro, que es para lo que el sistema de diseño tiene
                        anchos** (43 · 15 · 22 · 20). Con seis columnas, las dos
                        últimas se quedaban sin ancho asignado y se aplastaban:
                        eso era «la primera tabla no se ve bien».

                        Y son las cuatro que pide `GES-04`: de qué habla, dónde,
                        qué le falta y si ya se escaló. «Quién lo tiene» se fue
                        porque no tenía de dónde salir — mostraba «ciudadano»,
                        que es quien confirmó el municipio, no un revisor. */}
                    <th>Aporte</th><th>De qué</th><th>Dónde y desde cuándo</th>
                    <th>Qué falta y gestión</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.aporteId}>
                      <td>
                        {/* Lo confirmado arriba y sus palabras debajo, en
                            pequeño: se lee de qué va sin tener que descifrar la
                            redacción, y el original sigue a la vista (`N03`). */}
                        <Link className="bo-record-link" href={`/consola/${f.aporteId}`}>
                          <ElAporte fila={f} />
                        </Link>
                        <p className="bo-small">{fecha(f.recibidoEn)}</p>
                        <Señales fila={f} />
                      </td>
                      <td className="bo-small"><DeQue tema={f.tema} /></td>
                      <td className="bo-small">
                        <Donde fila={f} />
                        <br />
                        <Rangos fila={f} />
                      </td>
                      <td className="bo-small">
                        {f.falta.length === 0
                          ? <span className="bo-muted">no le falta nada</span>
                          : f.falta.join(", ")}
                        <br /><Gestion fila={f} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}

            {hayMas && (
              <p className="bo-small">
                <Link className="bo-link" href={{ pathname: "/consola", query: { ...q, ver: limite + 50 } }}>
                  Ver {Math.min(50, total - filas.length)} más
                </Link>{" "}
                <span className="bo-muted">
                  · quedan {total - filas.length} sin mostrar
                </span>
              </p>
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

                  {/* Tres columnas, y hay que decirlo: sin esto heredaba los
                      anchos de la tabla de cuatro —el `last-child` a 20 %— y la
                      tercera quedaba con el ancho de una cuarta que no existe.
                      Eso era «el último cuadro está descuadrado». */}
                  <table className="bo-table bo-table-desktop" data-columnas="3">
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
