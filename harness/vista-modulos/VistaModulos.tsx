import Link from "next/link";
import {
  proyecto as declarado, modulos as declarados, roles as rolesDeclarados,
  type Estado, type Modulo, type Proyecto, type Rol,
} from "./modulos";
import { ListaModulos } from "./ListaModulos";
import "./modulos.css";

// La vista de módulos. **Es del harness y se ve igual en todos los proyectos.**
//
// No es una pantalla del producto: es la vista de la construcción. Quien la abre
// no está usando el producto, está mirando qué se ha construido de él.
//
// Existen las dos por separado a propósito. Si la información de la construcción
// vive pegada al producto, quien viene a validar mira un producto con nuestras
// notas internas encima, y ya no puede decir si algo se entiende o no.
//
// Va en claro y la telemetría en oscuro. No es capricho: son dos preguntas de
// distinta naturaleza. La telemetría es un diagnóstico que se lee de un vistazo;
// esto es un mapa que alguien recorre buscando algo.

// Arriba, lo que hay. Agrupado por estado, porque la pregunta que esta
// pantalla contesta —"¿qué hay construido y qué falta?"— tiene dos mitades, y
// una lista obliga a leerla entera para contestar la segunda.
const grupos: { estado: Estado; titulo: string; clase: string; salvedad?: string }[] = [
  { estado: "construido", titulo: "Construido", clase: "columna--construido" },
  { estado: "a medias", titulo: "A medias, a propósito", clase: "columna--medias" },
  {
    estado: "pendiente", titulo: "Todavía no", clase: "columna--pendiente",
    // Sin esta línea la lista se lee como un compromiso de entrega.
    salvedad: "Una hipótesis, no un plan. Se revisa al cerrar cada frente, y puede reordenarse, crecer o perder alguno.",
  },
];

// Recibe sus datos en vez de leerlos. Por defecto usa lo que el proyecto
// declara; que se puedan pasar sirve para probar la vista bajo carga sin
// contaminar la declaración de verdad.
export function VistaModulos({
  proyecto = declarado,
  modulos = declarados,
  roles = rolesDeclarados,
}: { proyecto?: Proyecto; modulos?: Modulo[]; roles?: Rol[] } = {}) {
  const porEstado = (e: Estado) => modulos.filter((m) => m.estado === e);
  const hechos = porEstado("construido").length;
  const medias = porEstado("a medias").length;

  // Lo pendiente se agrupa por **qué lo detiene**, y eso no se declara: se
  // deduce de si el módulo dice esperar algo. Son dos cosas que no se
  // confunden, y distinguirlas es la mitad del valor de esta vista.
  // Un tramo por módulo mientras se distingan; con muchos, tres proporcionales.
  const denso = modulos.length > 12;

  // Al plegar las fichas, lo que espera una decisión deja de verse — y es lo
  // único de esta pantalla sobre lo que alguien tiene que hacer algo. Así que
  // cuando se pliega, sube aquí. La banda existe porque el plegado la escondió.
  //
  // Y se agrupan **por decisión, no por módulo**. Ese fue el hallazgo al
  // probarla con cincuenta: la misma cifra que falta aparece en muchos
  // módulos, así que la lista plana traía treinta y siete renglones que eran
  // cuatro decisiones. Agrupada dice lo único que sirve para escoger cuál
  // pedir primero: **cuántos módulos destraba cada una.**
  const decisiones = [
    ...modulos
      .flatMap((m) => (m.noEntra ?? []).filter((x) => x.dato).map((x) => ({ modulo: m.nombre, ...x })))
      .reduce((acc, d) => {
        const previo = acc.get(d.que);
        if (previo) previo.modulos.push(d.modulo);
        else acc.set(d.que, { que: d.que, porque: d.porque, modulos: [d.modulo] });
        return acc;
      }, new Map<string, { que: string; porque: string; modulos: string[] }>())
      .values(),
  ].sort((a, b) => b.modulos.length - a.modulos.length);

  return (
    <div className="harness harness--claro">
      <div className="harness__hoja tablero__hoja">
        <div className="membrete">
          <img src="/linktic-negro.svg" alt="LinkTIC" width={165} height={24} className="membrete__logo" />
          <Link href="/">ver el proyecto →</Link>
        </div>

        <header className="cinta">
          <div>
            <p className="cinta__eyebrow">Vista de módulos · vista interna</p>
            <h1>{proyecto.nombre}</h1>
            <p className="cinta__frase">{proyecto.frase}</p>
          </div>

          {/* El avance en barra y no en frase: "1 de 4" se lee, pero no se
              siente. Cada tramo es un módulo, en el orden de los estados. */}
          <div className="avance">
            <p className="avance__cifra">
              {hechos}<span> de {modulos.length} construidos</span>
            </p>
            {/* Un tramo por módulo mientras se puedan distinguir. Con
                cincuenta se volvió un peine de rayitas que no dice nada, así
                que pasa a tres tramos proporcionales. */}
            <div className="avance__barra" role="img"
                 aria-label={`${hechos} construidos, ${medias} a medias, ${modulos.length - hechos - medias} todavía no`}>
              {denso ? (
                <>
                  <span className="avance__tramo avance__tramo--construido" style={{ flexGrow: hechos }} />
                  <span className="avance__tramo avance__tramo--medias" style={{ flexGrow: medias }} />
                  <span className="avance__tramo" style={{ flexGrow: modulos.length - hechos - medias }} />
                </>
              ) : (
                modulos.map((m, i) => (
                  <span key={i} className={
                    m.estado === "construido" ? "avance__tramo avance__tramo--construido"
                    : m.estado === "a medias" ? "avance__tramo avance__tramo--medias"
                    : "avance__tramo"
                  } />
                ))
              )}
            </div>
          </div>
        </header>

        <p className="advertencia">{proyecto.advertencia}</p>

        {/* Sin un solo módulo, esta pantalla es un tablero en blanco y no dice
            qué hacer. Salió bajando la línea base a la arena: arrancó bien,
            pero quien llega de cero se queda mirándola. */}
        {modulos.length === 0 && (
          <p className="arranque">
            Todavía no hay módulos declarados. Se llenan en{" "}
            <code>src/harness/modulos.ts</code> al cerrar cada paso — y el primero sale
            después de <code>/leer</code>, <code>/descubrir</code> y <code>/especificar</code>.
          </p>
        )}

        {decisiones.length > 0 && (
          <section className="decisiones">
            <h2 className="decisiones__titulo">
              <span>Esperan que alguien decida</span>
              <span className="columna__cuenta">{decisiones.length}</span>
            </h2>
            <p className="decisiones__porque">
              No es orden y no se destraba construyendo: falta un número o un criterio.
              Van de la que más destraba a la que menos.
            </p>
            <ul className="decisiones__lista">
              {decisiones.map((d) => (
                <li key={d.que}>
                  <b>{d.que}</b>
                  <span className="decisiones__cuantos">
                    destraba <b>{d.modulos.length}</b>{" "}
                    {d.modulos.length === 1 ? "módulo" : "módulos"}
                  </span>
                  <span className="decisiones__porque2">{d.porque}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Los roles, definidos una vez y arriba. Un módulo que dice
            "lo usa el curador" no sirve si nadie sabe quién es el curador —
            y el que no sale de ningún documento se marca deducido. */}
        <section className="seccion">
          <h2 className="seccion__titulo">
            <span>Quiénes lo usan</span>
            <span className="columna__cuenta">{roles.length}</span>
          </h2>
          <ul className="roles">
            {roles.map((r) => (
              <li key={r.clave} className="rolDef">
                <span className="rol" data-marca={roles.indexOf(r) % 4}
                      data-deducido={r.deducido ? "" : undefined}>{r.nombre}</span>
                <span className="rolDef__quien">
                  {r.quienEs}
                  {r.deducido && <em className="uso__deducido"> · deducido, no sale de ningún documento</em>}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Los módulos, uno por fila y todos visibles. Agrupados por estado
            para que "qué llevo" y "qué falta" se sigan contestando de un
            vistazo, pero sin esconder ninguno detrás de un plegado. */}
        {grupos.map((g) => (
          <section key={g.estado} className="seccion">
            <h2 className={`seccion__titulo ${g.clase}`}>
              <span>{g.titulo}</span>
              <span className="columna__cuenta">{porEstado(g.estado).length}</span>
            </h2>
            {g.salvedad && <p className="grupo__salvedad">{g.salvedad}</p>}
            {porEstado(g.estado).length === 0
              ? <p className="columna__vacia">Ninguno todavía.</p>
              : <ListaModulos modulos={porEstado(g.estado)} roles={roles} denso={denso} />}
          </section>
        ))}

        <p className="salida">
          <Link href="/telemetria">Dónde va el descubrimiento →</Link>
          <span>las etapas corridas, qué falta, y el registro de la construcción</span>
        </p>
      </div>
    </div>
  );
}
