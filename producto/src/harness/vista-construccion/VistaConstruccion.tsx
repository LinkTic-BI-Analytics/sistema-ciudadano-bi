import type { EstadoConstruccion, Estado, Tarea } from "./estado";
import "../vista-modulos/harness.css";
import "./construccion.css";

// La vista de la construcción. **Es del harness y se ve igual en todos los
// proyectos.** Es la tercera hermana de `/modulos` y `/telemetria`, y contesta
// una pregunta que ninguna de las dos contesta: *¿quién está haciendo qué ahora
// mismo, y qué se puede empezar sin esperar a nadie?*
//
// La diferencia con las otras dos:
//
//   /modulos      qué hay construido del producto — se lee recorriendo
//   /telemetria   cuánto se sabe del negocio — se lee de un vistazo
//   /construccion quién trabaja en qué — se lee buscando una decisión
//
// **No declara nada.** Todo lo que muestra sale de `construccion/.estado.json`,
// que `scripts/construccion.sh` deriva de los archivos. Es la regla I2 de
// `harness/interfaz.md`: la telemetría sale del grafo, no se escribe a mano.
//
// Y no corrige nada. Si el tablero dice que una tarea está lista y los archivos
// dicen que le falta el contrato, aquí salen **las dos cosas**. Un tablero que
// se corrige solo dice que todo está bien porque él mismo lo escribió.

const ORDEN: Estado[] = [
  "en construcción", "en revisión", "en integración",
  "bloqueado", "listo", "candidato", "terminado", "caído",
];

const CLASE: Record<Estado, string> = {
  "en construcción": "e--curso",
  "en revisión": "e--curso",
  "en integración": "e--curso",
  bloqueado: "e--urgente",
  listo: "e--listo",
  candidato: "e--tenue",
  terminado: "e--hecho",
  caído: "e--tenue",
};

// Las celdas del tablero vienen de markdown y traen comillas invertidas. Sin
// esto salen literales en pantalla, que es como se ve un documento a medio
// convertir. No se procesa markdown entero a propósito: solo lo que de verdad
// aparece en una celda de tabla.
function Texto({ children }: { children: string }) {
  const trozos = children.split("`");
  return (
    <>
      {trozos.map((trozo, i) =>
        i % 2 === 1 ? <code key={i}>{trozo}</code> : <span key={i}>{trozo}</span>,
      )}
    </>
  );
}

function Cifra({ n, de, que }: { n: number; de?: number; que: string }) {
  return (
    <div className="cifra">
      <div className="cifra__n">
        {n}
        {de !== undefined && <span className="cifra__de">/{de}</span>}
      </div>
      <div className="cifra__que">{que}</div>
    </div>
  );
}

function Fila({ t, señal }: { t: Tarea; señal?: string }) {
  return (
    <li className="fila">
      <span className={`fila__id ${CLASE[t.estado]}`}>{t.id}</span>
      <span className="fila__cuerpo">
        <span className="fila__resultado"><Texto>{t.resultado}</Texto></span>
        <span className="fila__meta">
          <span className={`marca ${CLASE[t.estado]}`}>{t.estado}</span>
          {t.linea && t.linea !== "—" && <span className="marca marca--linea">línea {t.linea}</span>}
          {t.propietario && t.propietario !== "—" && <span>{t.propietario}</span>}
          {t.codigos.length > 0 && <span className="marca marca--codigo">{t.codigos.join(" · ")}</span>}
        </span>
        {señal && <span className="fila__señal"><Texto>{señal}</Texto></span>}
      </span>
    </li>
  );
}

export function VistaConstruccion({
  estado,
  objetivo,
}: {
  estado: EstadoConstruccion;
  objetivo: string;
}) {
  const porId = new Map(estado.tareas.map((t) => [t.id, t]));
  const cerradas = estado.por_estado.terminado.length;
  const activas = ORDEN.slice(0, 3).flatMap((e) => estado.por_estado[e]);
  const faltaContrato = new Map(estado.listas_sin_contrato.map((c) => [c.id, c.falta.join("; ")]));
  const contradicciones = estado.dice_listo_pero_no;
  const enParalelo = estado.paralelismo.pares.filter((p) => p.decision === "paralelo");

  const generado = new Date(estado.generado).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="harness construccion">
      <div className="harness__hoja">
        <header className="cabecera">
          <h1 className="cabecera__titulo">La construcción</h1>
          <p className="cabecera__objetivo"><Texto>{objetivo}</Texto></p>
          {/* Sin esta línea alguien va a leer la pantalla como si fuera en vivo. */}
          <p className="cabecera__sello">
            Derivado de los archivos el {generado}. Se actualiza corriendo{" "}
            <code>./scripts/construccion.sh</code>.
          </p>
        </header>

        <section className="cifras" aria-label="Resumen">
          <Cifra n={cerradas} de={estado.tareas.length} que="terminadas" />
          <Cifra n={activas.length} que="en manos de alguien" />
          <Cifra n={estado.por_estado.listo.length} que="pueden empezar" />
          <Cifra n={estado.por_estado.bloqueado.length} que="bloqueadas" />
          <Cifra n={estado.agentes.length} que="agentes andando" />
        </section>

        <section className="bloque">
          <h2 className="bloque__titulo">Ruta crítica</h2>
          {estado.ruta_critica.length === 0 ? (
            <p className="vacio">No queda ninguna tarea abierta.</p>
          ) : (
            <>
              <ol className="ruta">
                {estado.ruta_critica.map((id) => {
                  const t = porId.get(id);
                  return (
                    <li key={id} className={`ruta__paso ${t ? CLASE[t.estado] : ""}`}>
                      <span className="ruta__id">{id}</span>
                      <span className="ruta__que"><Texto>{t?.resultado ?? "—"}</Texto></span>
                    </li>
                  );
                })}
              </ol>
              {/* Lo importante de una ruta crítica no es cuál es: es que no se
                  acorta poniendo más gente. Si no se dice, alguien lo intenta. */}
              <p className="nota">
                {estado.ruta_critica.length} tareas. Es el tiempo mínimo restante, y{" "}
                <strong>ninguna cantidad de agentes en paralelo lo acorta.</strong>
              </p>
            </>
          )}
        </section>

        <section className="bloque">
          <h2 className="bloque__titulo">Quién está andando</h2>
          {activas.length === 0 && estado.agentes.length === 0 ? (
            <p className="vacio">
              Nada en manos de nadie, y ningún worktree aparte del principal.
            </p>
          ) : (
            <>
              {activas.length > 0 && (
                <ul className="lista">
                  {activas.map((id) => {
                    const t = porId.get(id);
                    return t ? <Fila key={id} t={t} /> : null;
                  })}
                </ul>
              )}
              {estado.agentes.length > 0 && (
                <ul className="agentes">
                  {estado.agentes.map((a) => (
                    <li key={a.ruta} className="agente">
                      <span className="agente__rama">{a.rama ?? "sin rama"}</span>
                      <span className="agente__cuando">
                        {a.dias_sin_commit === null
                          ? "sin commits todavía"
                          : `último commit hace ${a.dias_sin_commit} d`}
                      </span>
                      <span className="agente__ruta">{a.ruta}</span>
                    </li>
                  ))}
                </ul>
              )}
              {Object.entries(estado.planes_de_superpowers).map(([nombre, p]) => (
                <p key={nombre} className="nota">
                  Plan «{nombre}»: {p.tareas_completas.length} tareas completas en el ledger
                  {p.ultima_ronda_de_arreglo && `, ronda de arreglo ${p.ultima_ronda_de_arreglo}`}.
                </p>
              ))}
            </>
          )}
        </section>

        <section className="bloque">
          <h2 className="bloque__titulo">Qué puede empezar ahora</h2>
          {estado.por_estado.listo.length === 0 && estado.deberia_estar_listo.length === 0 ? (
            <p className="vacio">Ninguna tarea está lista.</p>
          ) : (
            <ul className="lista">
              {estado.por_estado.listo.map((id) => {
                const t = porId.get(id);
                return t ? <Fila key={id} t={t} señal={faltaContrato.get(id)} /> : null;
              })}
              {estado.deberia_estar_listo.map((id) => {
                const t = porId.get(id);
                return t ? (
                  <Fila
                    key={id}
                    t={t}
                    señal="Dice «candidato» y ya cumple todo: se puede empezar hoy."
                  />
                ) : null;
              })}
            </ul>
          )}
          {enParalelo.length > 0 && (
            <p className="nota">
              Pares que sí pueden ir a la vez:{" "}
              {enParalelo.slice(0, 8).map((p) => p.par.join("+")).join(", ")}.
            </p>
          )}
          {estado.paralelismo.sin_superficie_declarada.length > 0 && (
            <p className="nota nota--ojo">
              Sin superficie declarada, así que <strong>no se sabe</strong> si se pisan con
              alguien: {estado.paralelismo.sin_superficie_declarada.join(", ")}.
            </p>
          )}
        </section>

        {estado.bloqueos.length > 0 && (
          <section className="bloque">
            <h2 className="bloque__titulo">Bloqueos</h2>
            <ul className="lista">
              {estado.bloqueos.map((b) => {
                const t = porId.get(b.id);
                return t ? <Fila key={b.id} t={t} /> : null;
              })}
            </ul>
          </section>
        )}

        <section className="bloque">
          <h2 className="bloque__titulo">Se está deteriorando</h2>
          {estado.deterioro.length === 0 &&
          contradicciones.length === 0 &&
          estado.defectos_del_tablero.length === 0 &&
          estado.ciclos.length === 0 ? (
            <p className="vacio">
              Nada. Ninguna tarea lleva más tiempo del debido en su estado, y el tablero no se
              contradice.
            </p>
          ) : (
            <ul className="lista lista--ojo">
              {estado.ciclos.map((c, i) => (
                <li key={`c${i}`} className="aviso">
                  Hay un ciclo en el grafo: {c.join(" → ")}. Mientras exista, no hay ruta
                  crítica de verdad.
                </li>
              ))}
              {estado.defectos_del_tablero.map((d, i) => (
                <li key={`d${i}`} className="aviso"><Texto>{d}</Texto></li>
              ))}
              {estado.deterioro.map((d) => (
                <li key={d.id} className="aviso">
                  <strong>{d.id}</strong> · <Texto>{d.por_que}</Texto>
                </li>
              ))}
              {contradicciones.map((c) => (
                <li key={c.id} className="aviso">
                  <strong>{c.id}</strong> dice «{c.estado}» y <Texto>{c.falta.join("; ")}</Texto>. Alguien la
                  va a tomar creyendo que está lista.
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="pie">
          {/* Mientras `entregable/modulos/` esté vacío esto es lo más importante
              de la pantalla, y por eso no va en gris ni al final de una lista. */}
          {Object.keys(estado.modulos).length === 0 ? (
            <p className="pie__autoridad">
              Ningún módulo ha pasado la prueba del sobre cerrado, así que{" "}
              <strong>ninguna de estas tareas tiene autoridad todavía</strong>. Lo que decide
              qué se construye es un módulo entregable, no este tablero.
            </p>
          ) : (
            <p className="pie__autoridad">
              {Object.entries(estado.modulos)
                .map(([k, m]) => `${k}: sobre cerrado ${m.sobre_cerrado.marcadas}/${m.sobre_cerrado.totales}`)
                .join(" · ")}
            </p>
          )}
          {estado.vacios.archivo && estado.vacios.abiertas > 0 && (
            <p className="pie__vacios">
              {estado.vacios.abiertas} preguntas abiertas en <code>{estado.vacios.archivo}</code>.
              Una tarea que dependa de una de ellas no pasa de candidato, por muy lista que se
              vea.
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
