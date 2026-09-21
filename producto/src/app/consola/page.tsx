import Link from "next/link";
import { bandeja, type Filtro } from "../../revision/bandeja.ts";
import { Filtros, Señales, DeQue, Donde, Gestion, ElAporte, Rangos } from "./bandeja.tsx";
import { Resumen } from "./resumen.tsx";
import { FiltrosActivos } from "./filtros-activos.tsx";
import { Armazon, type VistaInterna } from "../../producto/armazon.tsx";
import { IconoBandeja, IconoBuscar, IconoSiguiente } from "../../producto/iconos.tsx";
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

  // En cuál de las vistas de trabajo estamos. No son secciones distintas: son la
  // misma bandeja con un filtro puesto, y por eso se deducen de la dirección en
  // vez de declararse. El orden importa — con alerta y sin expediente a la vez,
  // manda la alerta.
  const vista: VistaInterna =
    soloAlerta ? "urgentes"
    : gestion === "sin_expediente" ? "sin-expediente"
    : ubicacion === "por_aclarar" ? "por-aclarar"
    : "bandeja";

  // Si hay algo puesto además de la vista. Cambia el acento del resumen: sin
  // filtro, «en esta vista» y «recibidos» son el mismo número.
  const filtrada =
    vista !== "bandeja" || Boolean(texto || departamento || municipio || tema || antiguedad || alcance);

  return (
    <Armazon
      seccion="Consola"
      vista={vista}
      kicker="Bandeja de calidad"
      pie={
        <p className="bo-bottom-note">
          <strong>Abrir un expediente no aprueba, no asigna recursos ni resuelve nada.</strong>
        </p>
      }
    >
      {/* **La cabecera de página, que la hoja ya tenía y nadie usaba.**
          `.bo-page-head` pone el titular y la acción de la pantalla en la misma
          línea, y a ancho de teléfono baja el botón a ancho completo. */}
      <div className="bo-page-head">
        <div>
          <h1>Bandeja de revisión</h1>
          <p className="bo-muted">
            Los más antiguos primero. <strong>Sin orden por popularidad</strong>: un aporte de una
            vereda dispersa pesa lo mismo que uno de una avenida, y el orden no cambia al filtrar.
          </p>
        </div>
        {/* **Fuera del formulario de filtros.** Estaba dentro, en el último
            campo, al lado del botón de filtrar: un enlace metido en un `<form>`
            y dos acciones principales compitiendo en el mismo grupo. Aquí arriba
            es lo que es — la acción de la pantalla. */}
        {siguiente
          ? <Link className="bo-button" data-variant="primary" href={`/consola/${siguiente}`}>
              Abrir el siguiente<IconoSiguiente />
            </Link>
          : <button className="bo-button" data-variant="primary" disabled>
              Abrir el siguiente<IconoSiguiente />
            </button>}
      </div>

      {/* **Los conteos, que iban en 12 px en una esquina de la barra de
          arriba.** Son las tres cifras con las que alguien decide si hoy hay
          trabajo, y estaban escritas como una frase separada por puntos. */}
      <Resumen enLaLista={total} aportes={totalAportes ?? 0}
               expedientes={exps?.length ?? 0} filtrada={filtrada} />

      <Filtros texto={texto} ubicacion={ubicacion ?? "todos"}
               orden={orden ?? "antiguos"}
               opciones={opciones} departamento={departamento} municipio={municipio}
               tema={tema} gestion={gestion} soloAlerta={soloAlerta}
               antiguedad={antiguedad} alcance={alcance} />

      {/* **Qué filtros están puestos, en palabras.** Había diez controles y
          ninguna forma de saberlo sin recorrerlos uno por uno: la bandeja salía
          con nueve aportes de ciento veinte y la explicación estaba metida
          dentro de un `<select>` a media pantalla de distancia. */}
      <FiltrosActivos consulta={q} opciones={opciones} />

      {/* **Cuántos hay y cuántos se ven.** Cortar en 50 sin decirlo es cómo diez
          aportes recién registrados se volvieron invisibles: estaban en las
          posiciones 97 a 106 de 106 y la pantalla no daba ninguna señal.

          `.bo-results-line` vuelve a su sitio de diseño: la hoja la hizo para ir
          **entre los filtros y la tabla**, y estaba en la barra superior. */}
      {filas.length > 0 && (
        <div className="bo-results-line">
          <p data-prueba="cuantos">
            Mostrando {filas.length} de {total}
            {orden === "recientes"
              ? " · los últimos que llegaron"
              : " · los que llevan más esperando"}
          </p>
        </div>
      )}

      {filas.length === 0 ? (
        // Sin resultados: explicación y una acción para salir de ahí. Una lista
        // vacía sin decir por qué parece un error del sistema.
        //
        // **El vacío estrena la forma que la hoja ya tenía escrita.** Era un
        // `<p>` gris suelto, y `.bo-empty` trae icono en dorado, titular y
        // acción (`backoffice.css:277-280`): tres reglas que no alcanzaban a
        // nada porque el marcado era un párrafo.
        <div className="bo-empty" data-prueba="sin-resultados">
          {/* **Vacío no es lo mismo que sin coincidencias.** Con la base en
              blanco decía «ninguno coincide con lo que estás buscando», que
              manda a alguien a revisar un filtro cuando lo que pasa es que no ha
              llegado nada. Solo se ve probando en blanco, y probar en blanco
              casi nunca se hace. Los dos mensajes son excluyentes y hay una
              prueba que lo exige: nunca los dos, nunca ninguno. */}
          {(totalAportes ?? 0) === 0 ? (
            <>
              <IconoBandeja />
              <h2>No ha llegado ningún aporte todavía</h2>
              <p>
                Cuando alguien cuente algo, aparece aquí. Puedes mandar uno tú mismo para ver cómo
                se ve la bandeja llena.
              </p>
              <Link className="bo-button" data-variant="primary" href="/participar">
                Contar algo de prueba
              </Link>
            </>
          ) : (
            <>
              <IconoBuscar />
              <h2>Ningún aporte coincide con lo que estás buscando</h2>
              <p>
                Hay {totalAportes} en total. Prueba con menos filtros, o con otra palabra: la
                búsqueda mira el relato, el lugar, el municipio y el tema.
              </p>
              <Link className="bo-button" data-variant="primary" href="/consola">
                Ver todos
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          {/* **Las dos estructuras, con los mismos datos.** No es duplicación:
              es el contrato del sistema de diseño, que oculta `.bo-table-desktop`
              bajo 36rem y enciende `.bo-card-list`. Exactamente una se ve. */}
          <ul className="bo-card-list">
            {filas.map((f) => (
              <li key={f.aporteId} className="bo-record-card">
                <Link className="bo-record-link" href={`/consola/${f.aporteId}`}>
                  <ElAporte fila={f} />
                </Link>
                <div className="bo-card-meta"><Señales fila={f} /></div>
                {/* **Los mismos datos que la tabla.** El sistema de diseño lo
                    pide literal: «no se ocultan datos esenciales» al pasar a
                    lista. Lo que falta y quién lo tiene son la razón de mirar
                    la bandeja. */}
                <p><DeQue tema={f.tema} /> · {fecha(f.recibidoEn)}</p>
                <p><Donde fila={f} /></p>
                <p><Rangos fila={f} /></p>
                {/* **Dos renglones, no uno.** «Qué le falta» y «en manos de
                    quién está» son dos preguntas distintas y viajaban pegadas
                    por un punto medio. Es la cuarta columna que no se
                    entendía. */}
                <p>Falta: {f.falta.length === 0 ? "nada" : f.falta.join(", ")}</p>
                <p><Gestion fila={f} /></p>
              </li>
            ))}
          </ul>

          <table className="bo-table bo-table-desktop" data-columnas="5">
            <thead>
              <tr>
                {/* **Cinco, y el ancho de las cinco está declarado.** La hoja del
                    paquete reparte 43·15·22·20 contando desde los dos extremos,
                    así que una tabla con otro número de columnas hereda el ancho
                    de una que no existe: eso era «el último cuadro está
                    descuadrado» en la de tres. Por eso va `data-columnas`, y por
                    eso hay una prueba que lo exige.

                    La quinta sale de partir la cuarta. «Qué falta y gestión»
                    eran dos preguntas en una celda —qué le falta al aporte y en
                    manos de quién está— separadas por un punto. */}
                <th>Aporte</th><th>De qué</th><th>Dónde y desde cuándo</th>
                <th>Qué falta</th><th>Gestión</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.aporteId}>
                  <td>
                    {/* Lo confirmado arriba y sus palabras debajo, en pequeño: se
                        lee de qué va sin tener que descifrar la redacción, y el
                        original sigue a la vista (`N03`). */}
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
                  </td>
                  <td className="bo-small"><Gestion fila={f} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {hayMas && (
        // Un enlace de texto de 12 px para traer cincuenta filas más no se lee
        // como una acción, y es la única que hay en esta parte de la pantalla.
        <div className="bo-actions">
          <Link className="bo-button" href={{ pathname: "/consola", query: { ...q, ver: limite + 50 } }}>
            Ver {Math.min(50, total - filas.length)} más
          </Link>
          <p className="bo-muted">quedan {total - filas.length} sin mostrar</p>
        </div>
      )}

      {/* **Los expedientes, plegados.** Ocupaban media pantalla debajo de la
          bandeja, con su propia tabla, compitiendo con lo único que esta
          pantalla existe para contestar: qué hay que revisar hoy. No se esconden
          —el conteo va en el rótulo y se abren de un clic— pero dejan de pedir
          el mismo espacio que el trabajo del día. */}
      <section className="bo-history-section">
        <details className="bo-plegable">
          <summary>
            Expedientes abiertos <span className="bo-muted">· {exps?.length ?? 0}</span>
          </summary>
          <div className="bo-plegado">
            {(exps?.length ?? 0) === 0 ? (
              <p className="bo-muted">Todavía ninguno.</p>
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
          </div>
        </details>
      </section>
    </Armazon>
  );
}
