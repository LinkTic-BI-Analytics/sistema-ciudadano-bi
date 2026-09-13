import Link from "next/link";
import g from "./grafo.json";
import { proyecto } from "./modulos";
import "./telemetria.css";

type Etapa = { n: string; etapa: string; corrida: boolean; detalle: string };
type Fila = { id: string; cuando: string; que: string; toco: string[] };
type Falta = { que_falta: string; sin_esto_se_puede: string; va_primero: boolean };

function plural(t: string, n: number) {
  return n === 1 ? t : t.split(" ").map((p) => (/[aeiouáéíóú]$/.test(p) ? p + "s" : p + "es")).join(" ");
}

// El ciclo, dibujado. Es la firma de esta pantalla porque es el icono del
// método: seis etapas y **dos flechas que suben**. La 4 devuelve lo que
// construir obligó a decidir; la 5 devuelve lo que mirar destapó. Sin esas dos
// flechas esto sería una cascada con más pasos.
function Ciclo({ etapas }: { etapas: Etapa[] }) {
  // El margen es el ancho de la etiqueta más larga, no un número redondo:
  // "Especificar" y "Entregar" se salían del lienzo y se cortaban.
  // El margen es el ancho de la etiqueta más larga, no un número redondo:
  // "Especificar" y "Entregar" se salían del lienzo y se cortaban.
  const w = 900, alto = 186, x0 = 58, paso = (w - x0 * 2) / (etapas.length - 1);
  const bajaA = (i: number) => x0 + paso * i;
  return (
    <svg className="ciclo" viewBox={`0 0 ${w} ${alto}`} role="img"
         aria-label={`${etapas.filter((e) => e.corrida).length} de ${etapas.length} etapas corridas`}>
      <defs>
        <marker id="punta" viewBox="0 0 8 8" refX="6" refY="4"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 6 4 L 0 7 z" fill="var(--corrido)" />
        </marker>
      </defs>
      <line className="flecha" x1={x0} y1={64} x2={w - x0} y2={64} />

      {/* Las dos flechas de vuelta, las dos hacia Especificar. La 4 devuelve lo
          que construir obligó a decidir; la 5, lo que mirar destapó. Cada
          etiqueta va centrada dentro de su propio arco: al costado no se sabía
          de cuál era, y debajo del primero la segunda flecha lo tachaba. */}
      <path className="flecha flecha--vuelta" markerEnd="url(#punta)"
            d={`M ${bajaA(5)} 76 C ${bajaA(5)} 132, ${bajaA(3)} 132, ${bajaA(3)} 78`} />
      <text x={bajaA(4)} y={99} className="et-detalle" textAnchor="middle">
        lo que construir obligó a decidir
      </text>
      <path className="flecha flecha--vuelta" markerEnd="url(#punta)"
            d={`M ${bajaA(6)} 76 C ${bajaA(6)} 180, ${bajaA(3)} 180, ${bajaA(3)} 78`} />
      <text x={bajaA(4.5)} y={152} className="et-detalle" textAnchor="middle">
        lo que mirar destapó
      </text>

      {etapas.map((e, i) => {
        const x = x0 + paso * i;
        return (
          <g key={e.n}>
            <circle className={`punto ${e.corrida ? "punto--corrida" : ""}`} cx={x} cy={64} r={e.corrida ? 6 : 4} />
            <text x={x} y={40} className="et-nombre" textAnchor="middle"
                  style={{ fontWeight: e.corrida ? 600 : 400, opacity: e.corrida ? 1 : 0.5 }}>
              {e.etapa}
            </text>
            <text x={x} y={24} className="et-detalle" textAnchor="middle">{e.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function VistaTelemetria() {
  const etapas = g.etapas as Etapa[];
  const bitacora = g.bitacora as Fila[];
  const faltan = g.faltan as Falta[];
  const t = g.telemetria as Record<string, number>;
  const corridas = etapas.filter((e) => e.corrida).length;
  const noPuedenEsperar = faltan.filter((f) => f.va_primero);

  return (
    <div className="harness plano">
      <div className="harness__hoja">
        {/* El logo va aquí y no dentro del cartucho: marca de quién es el
            harness, no del proyecto. El cartucho es del negocio que se está
            descubriendo, y mezclar las dos cosas es justo lo que I1 prohíbe. */}
        <div className="membrete">
          <img src="/linktic-blanco.svg" alt="LinkTIC" width={165} height={24} className="membrete__logo" />
          <Link href="/modulos">← los módulos</Link>
        </div>

        <header className="cartucho">
          <div className="cartucho__titulo">
            <p className="cartucho__eyebrow">Plano de obra · vista interna</p>
            {/* El nombre sale de donde el proyecto se declara, no quemado
                aquí: esta vista es del harness y no puede saber de qué negocio
                es. Estaba quemado y se coló hasta la línea base. */}
            <h1>{proyecto.nombre}</h1>
            <p className="cartucho__sub">
              Dónde va el descubrimiento, qué se sabe, qué falta y qué de lo que falta
              no puede esperar. Nada de esto se escribe a mano: sale de leer lo que ya
              está en los documentos del negocio.
            </p>
          </div>
          <div className="cartucho__datos">
            <div className="cartucho__dato">
              <b>Etapas corridas</b><span>{corridas} de {etapas.length}</span>
            </div>
            <div className="cartucho__dato">
              <b>Interacciones</b><span>{bitacora.length}</span>
            </div>
            <div className="cartucho__dato">
              <b>Grafo</b><span>{Object.keys(g.nodos).length} nodos · {(g.aristas as unknown[]).length} flechas</span>
            </div>
          </div>
        </header>

        <section className="seccion">
          <h2 className="seccion__titulo"><span>El ciclo</span><span>{corridas}/{etapas.length}</span></h2>
          <Ciclo etapas={etapas} />
          <ol style={{ marginTop: ".75rem" }}>
            {etapas.map((e) => (
              <li key={e.n} className={`etapa ${e.corrida ? "" : "etapa--pendiente"}`}>
                <span aria-hidden="true" style={{ color: e.corrida ? "var(--corrido)" : "var(--tinta-2)" }}>
                  {e.corrida ? "●" : "○"}
                </span>
                <span>
                  {e.etapa}
                  <span className="sr-only">{e.corrida ? " — corrida" : " — sin correr"}</span>
                </span>
                <span className="etapa__detalle">{e.detalle.replace(/\*\*/g, "")}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="seccion">
          <h2 className="seccion__titulo"><span>Lo que sabemos y lo que falta</span></h2>
          <div className="rejilla">
            <div className="panel">
              <h3>Lo que sabemos</h3>
              {Object.entries(g.telemetria.por_tipo as Record<string, number>)
                .filter(([k]) => k !== "pregunta abierta")
                .map(([k, v]) => (
                  <p className="cifra" key={k}><span>{plural(k, v)}</span><b>{v}</b></p>
                ))}
            </div>
            <div className="panel">
              <h3>Lo que falta</h3>
              <p className="cifra"><span>preguntas abiertas</span><b>{t.preguntas_abiertas}</b></p>
              <p className="cifra"><span>datos que faltan</span><b>{t.datos_que_faltan}</b></p>
              <p className="cifra"><span style={{ color: "var(--urgente)" }}>no pueden esperar</span>
                 <b style={{ color: "var(--urgente)" }}>{t.datos_que_no_pueden_esperar}</b></p>
            </div>
            <div className="panel">
              <h3>El grafo</h3>
              <p className="cifra"><span>huérfanos arriba</span><b>{(t.huerfanos_arriba as unknown as string[]).length || "0"}</b></p>
              <p className="cifra"><span>huérfanos abajo</span><b>{(t.huerfanos_abajo as unknown as string[]).length || "0"}</b></p>
              <p style={{ color: "var(--tinta-2)", marginTop: ".4rem", fontSize: "11px" }}>
                Un código citado que no existe, o definido que nadie cita.
              </p>
            </div>
          </div>

          {noPuedenEsperar.length > 0 && (
            <div className="aviso">
              <strong>No pueden esperar</strong> — se pierde información cada día que pasa,
              porque son columnas que no se pueden rellenar hacia atrás.
              <ul>
                {noPuedenEsperar.map((f) => <li key={f.que_falta}>· {f.que_falta}</li>)}
              </ul>
            </div>
          )}
        </section>

        {/* El registro. Se lee por lo último que pasó, como un libro de obra. */}
        <section className="seccion">
          <h2 className="seccion__titulo">
            <span>Registro de la construcción</span>
            <span>{bitacora.length} interacciones</span>
          </h2>
          <div className="registro">
            {bitacora.map((f, i) => (
              <div className="registro__fila" key={f.id}>
                <span className="registro__n">{String(bitacora.length - i).padStart(2, "0")}</span>
                <span className="registro__que">
                  {f.toco.map((x) => <span className="etiqueta" key={x}>{x}</span>)}
                  {f.que}
                </span>
                <span className="registro__cuando">{f.cuando}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="pie">
          Generado el {String(g.generado).slice(0, 16).replace("T", " ")} desde{" "}
          <code>scripts/grafo.sh</code>. Si un dato no está escrito en los documentos del
          negocio, aquí tampoco aparece.
        </p>
      </div>
    </div>
  );
}
