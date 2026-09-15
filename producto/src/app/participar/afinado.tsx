"use client";

import { useActionState, useEffect, useState } from "react";
import {
  confirmarLectura, guardarPrecisiones, prepararLectura, confirmarMunicipio,
  listarDepartamentos, listarMunicipios, declararGrupo, type PasoAfinado,
} from "./acciones.ts";
import type { Candidato, Departamento } from "../../territorio/emparejar.ts";
import { loQueFalta, COMO_SE_PREGUNTA, type Lectura, type Preguntable } from "../../captura/lectura.ts";

// La captura, después de la narrativa. **Sigue siendo capturar, no un trámite
// añadido** (ADR 0012).
//
// El negocio lo puso en una frase: *solo tendríamos una oportunidad de obtener
// la información*. Quien escribe aquí puede no volver nunca —no hay cuenta ni
// correo, `N05` lo prohíbe— y lo que no diga ahora no lo dice nadie después.
//
// De ahí las tres decisiones de esta pantalla:
//
//   1. No dice «enviado». Dice qué entendimos y sigue preguntando.
//   2. Pregunta **solo por lo que falta**. Si el relato ya lo dijo todo, esto
//      pasa casi en blanco; si contó poco, pide justo lo que su caso necesita
//      para poder revisarse.
//   3. Nunca retiene nada. El aporte se guardó en el primer clic y el código
//      está a la vista desde el primer momento: quien se vaya, se va con lo
//      suyo guardado.

const POR_VUELTA = 3;

function Error_({ paso }: { paso: PasoAfinado | null }) {
  if (!paso || paso.ok) return null;
  return <p className="pc-error" role="alert">{paso.error}</p>;
}

/** El código, discreto mientras se afina. No es un «ya terminaste». */
function Guardado({ codigo }: { codigo: string }) {
  return (
    <p className="pc-help" data-prueba="guardado">
      Lo que contaste <strong>ya quedó guardado</strong>. Si te vas ahora, tu código es{" "}
      <strong data-prueba="codigo">{codigo}</strong>.
    </p>
  );
}

export function Afinado({ codigo }: { codigo: string }) {
  const [lect, setLect] = useState<Lectura | null>(null);
  const [leyendo, setLeyendo] = useState(true);
  const [paso, setPaso] = useState<
    "entendimos" | "falta" | "municipio" | "confirmar-residencia" | "voceria" | "listo"
  >("entendimos");
  const [grupo, setGrupo] = useState("");
  const [porGrupo, setPorGrupo] = useState(false);
  const [guardandoVoz, setGuardandoVoz] = useState(false);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [guardandoMun, setGuardandoMun] = useState(false);
  const [deptos, setDeptos] = useState<Departamento[]>([]);
  const [depto, setDepto] = useState("");
  const [delDepto, setDelDepto] = useState<Candidato[]>([]);
  const [porResidencia, setPorResidencia] = useState(false);
  const [elegido, setElegido] = useState<Candidato | null>(null);
  // A qué vuelta se vuelve al salir del municipio. Se fija **al entrar**, porque
  // se puede llegar ahí desde dos sitios: desde «esto es lo que entendimos»
  // —cuando el municipio salió del relato y aún no se ha hecho ninguna vuelta— o
  // desde la vuelta que preguntó el lugar. Avanzar siempre `vuelta + 1` se
  // saltaba la primera vuelta entera en el primer caso.
  const [vueltaAlVolver, setVueltaAlVolver] = useState(0);
  const [vuelta, setVuelta] = useState(0);
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [problema, setProblema] = useState("");

  const [r1, accion1, guardando1] = useActionState<PasoAfinado | null, FormData>(confirmarLectura, null);
  const [r2, accion2, guardando2] = useActionState<PasoAfinado | null, FormData>(guardarPrecisiones, null);

  useEffect(() => {
    let vigente = true;
    prepararLectura(codigo)
      .then((r) => {
        if (!vigente || !r) return;
        setLect(r.lectura);
        setProblema(r.lectura.problema);
        setCandidatos(r.municipios);
      })
      .finally(() => { if (vigente) setLeyendo(false); });
    return () => { vigente = false; };
  }, [codigo]);

  // Lo que falta, repartido en vueltas de tres. Si no falta nada, no hay vueltas
  // y la persona pasa directo al final: preguntarle por lo que ya dijo sería
  // castigarla por haberlo contado bien.
  const faltan = (lect ? loQueFalta(lect) : [])
    .filter((k) => !(k === "lugar" && candidatos.length > 0));
  const vueltas: Preguntable[][] = [];
  for (let i = 0; i < faltan.length; i += POR_VUELTA) vueltas.push(faltan.slice(i, i + POR_VUELTA));

  // Los 33 departamentos, al entrar al paso del municipio. No antes: la mayoría
  // de la gente nombra su municipio al contar y nunca llega aquí.
  useEffect(() => {
    if (paso === "municipio" && deptos.length === 0) listarDepartamentos().then(setDeptos);
  }, [paso, deptos.length]);

  useEffect(() => {
    if (!r1?.ok) return;
    if (candidatos.length) { setVueltaAlVolver(0); setPaso("municipio"); return; }
    setPaso(vueltas.length ? "falta" : "voceria");
  }, [r1]);
  useEffect(() => {
    if (!r2?.ok) return;
    // Si nombró un sitio y DIVIPOLA encontró candidatos, se le enseñan antes de
    // seguir: es el único momento en que está la persona que de verdad lo sabe.
    // **El municipio se pregunta siempre que se haya preguntado el lugar**, haya
    // candidatos o no. Que la persona escriba «en mi casa» no es una respuesta:
    // es un sitio que solo ella puede encontrar, y un problema que no se puede
    // asociar a un territorio no se puede sumar a ningún lado.
    if (vueltas[vuelta]?.includes("lugar")) {
      setCandidatos(r2.municipios ?? []);
      setVueltaAlVolver(vuelta + 1);
      setPaso("municipio");
      return;
    }
    setVuelta((v) => {
      const siguiente = v + 1;
      if (siguiente >= vueltas.length) setPaso("voceria");
      return siguiente;
    });
  }, [r2]);

  async function escogerDepartamento(codigo: string) {
    setDepto(codigo);
    setDelDepto([]);
    if (codigo) setDelDepto(await listarMunicipios(codigo));
  }

  async function elegir(c: Candidato, origen: "lo_dijo" | "vive_ahi") {
    // Si viene de dónde vive, todavía falta lo que `GEO-01` exige: que confirme
    // que el problema ocurre ahí.
    if (origen === "vive_ahi") { setElegido(c); setPaso("confirmar-residencia"); return; }
    setGuardandoMun(true);
    await confirmarMunicipio(codigo, c.codigo, c.version, origen);
    setGuardandoMun(false);
    seguirDespuesDelMunicipio();
  }

  // Al salir del municipio se sigue donde iba, sin repetir la vuelta.
  function seguirDespuesDelMunicipio() {
    setCandidatos([]);
    setDepto(""); setDelDepto([]); setPorResidencia(false); setElegido(null);
    setVuelta(vueltaAlVolver);
    setPaso(vueltaAlVolver >= vueltas.length ? "voceria" : "falta");
  }

  if (leyendo) {
    return (
      <section className="pc-section" data-prueba="afinar">
        {/* **El código sale ya, antes de leer nada.** Lo tenía detrás de la
            lectura, y eso contradecía el ADR 0012: el aporte se guarda en el
            primer clic y el comprobante es lo único que la persona necesita de
            nosotros. Si el servidor tardaba, se quedaba esperando sin él.

            Lo encontró una prueba fallando de forma intermitente. Parecía un
            problema de tiempos y era de orden. */}
        <Guardado codigo={codigo} />
        <p className="pc-help" data-prueba="leyendo" aria-live="polite">Leyendo lo que contaste…</p>
      </section>
    );
  }

  if (!lect) {
    // La lectura no salió. No se pierde nada: el aporte está guardado y el
    // código es lo único que la persona necesita de nosotros.
    return (
      <section className="pc-success" data-prueba="afinar">
        <h2>Recibimos lo que nos contaste</h2>
        <p className="pc-status" data-prueba="codigo" style={{ fontSize: "1.5rem", letterSpacing: "0.1em" }}>
          {codigo}
        </p>
        <p className="pc-help">Guárdalo. Con él puedes volver a ver tu aporte, sin correo ni cuenta.</p>
        <a className="pc-action" href="/mis-aportes">Consultar mi aporte</a>
      </section>
    );
  }

  if (paso === "voceria") {
    return (
      <section className="pc-section" data-prueba="voceria">
        <p className="pc-help" aria-live="polite">Última pregunta</p>
        <Guardado codigo={codigo} />
        <h2>¿Hablas por ti o por un grupo?</h2>
        {!porGrupo ? (
          <>
            <p className="pc-help">
              Muchos aportes salen de una junta de acción comunal, un cabildo, una asociación o
              una mesa de trabajo. Saberlo cambia a quién hay que responderle.
            </p>
            <div className="pc-actions">
              <button type="button" className="pc-action" onClick={() => setPaso("listo")}>
                Hablo por mí
              </button>
              <button type="button" className="pc-text-action" onClick={() => setPorGrupo(true)}>
                Hablo por un grupo
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pc-field">
              <label className="pc-label" htmlFor="grupo">¿Qué grupo?</label>
              <input id="grupo" className="pc-input" type="text" value={grupo}
                     onChange={(e) => setGrupo(e.target.value)}
                     aria-describedby="grupo-ayuda" />
              <p className="pc-help" id="grupo-ayuda">
                Como se llame: «la junta de acción comunal de la vereda El Salado», «la mesa de
                mujeres del barrio». <strong>Quedará escrito que lo dices tú</strong>: no lo
                verificamos con nadie, y el aporte queda a nombre del grupo, no del tuyo.
              </p>
            </div>
            <div className="pc-actions">
              <button type="button" className="pc-action" disabled={guardandoVoz || !grupo.trim()}
                      onClick={async () => {
                        setGuardandoVoz(true);
                        await declararGrupo(codigo, grupo);
                        setGuardandoVoz(false);
                        setPaso("listo");
                      }}>
                {guardandoVoz ? "Guardando…" : "Listo"}
              </button>
              <button type="button" className="pc-text-action" onClick={() => setPaso("listo")}>
                Mejor no
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  if (paso === "listo") {
    return (
      <section className="pc-success" data-prueba="afinado-listo" aria-live="polite">
        <h2>Listo. Quedó registrado con tus palabras</h2>
        <p>Guarda este código. Con él vuelves a ver tu aporte y qué pasó con él,
          <strong> sin dar correo ni crear una cuenta</strong>.</p>
        <p className="pc-status" data-prueba="codigo" style={{ fontSize: "1.5rem", letterSpacing: "0.1em" }}>
          {codigo}
        </p>
        <p className="pc-help">
          Anótalo o tómale una foto. No te lo podemos volver a mostrar: en nuestro sistema solo
          queda una huella del código, no el código.
        </p>
        <p className="pc-help">
          Esto no significa que el problema esté resuelto ni que haya un compromiso de obra.
          Significa que quedó registrado y que alguien lo va a revisar.
        </p>
        <a className="pc-action" href="/mis-aportes">Consultar mi aporte</a>
      </section>
    );
  }

  // Se cuenta el del municipio solo cuando existe: prometer un paso que no va a
  // aparecer es peor que no decir cuántos hay.
  const total = 3 + vueltas.length + (candidatos.length ? 1 : 0);
  const actual = paso === "entendimos" ? 2 : paso === "municipio" ? 2 + vuelta + 2 : 2 + vuelta + 1;

  return (
    <section className="pc-section" data-prueba="afinar">
      {/* Decir cuánto falta es lo que impide que alguien abandone creyendo que
          esto no se acaba nunca. */}
      <p className="pc-help" aria-live="polite">Paso {actual} de {total}</p>
      <Guardado codigo={codigo} />

      {paso === "entendimos" && (
        <div data-prueba="vuelta-1">
          <h2>Esto es lo que entendimos</h2>

          {!corrigiendo ? (
            <>
              {/* Se le devuelve **lo que dijo**, no una interpretación. La
                  pantalla no dice «creemos entender»: dice esto es lo que nos
                  contaste, porque eso es exactamente lo que hay. */}
              <blockquote className="pc-context">{problema}</blockquote>
              <dl className="pc-detail-facts">
                {(["lugar", "afectados", "desdeCuando"] as const)
                  .filter((k) => lect[k])
                  .map((k) => (
                    <div key={k}>
                      <dt>{COMO_SE_PREGUNTA[k].etiqueta}</dt>
                      <dd>{lect[k]}</dd>
                    </div>
                  ))}
              </dl>
              <p className="pc-help">Si no es eso, corrígelo — mandas tú.</p>
              <Error_ paso={r1} />
              {/* Los dos en el mismo grupo. Estaban en cajas distintas —uno
                  dentro del formulario y otro fuera— y salían desalineados y de
                  tamaños distintos. `.pc-actions` es lo que el sistema de diseño
                  tiene para una decisión con dos salidas. */}
              <form action={accion1} className="pc-actions">
                <input type="hidden" name="codigo" value={codigo} readOnly />
                <input type="hidden" name="corrigio" value="no" readOnly />
                <input type="hidden" name="mostrado" value={problema} readOnly />
                <button type="submit" className="pc-action" disabled={guardando1}>
                  {guardando1 ? "Guardando…" : "Sí, es eso"}
                </button>
                <button type="button" className="pc-text-action" onClick={() => setCorrigiendo(true)}>
                  No es eso — déjame corregirlo
                </button>
              </form>
            </>
          ) : (
            <form action={accion1}>
              <input type="hidden" name="codigo" value={codigo} readOnly />
              <input type="hidden" name="corrigio" value="si" readOnly />
              <input type="hidden" name="mostrado" value={lect.problema} readOnly />
              <div className="pc-field">
                <label className="pc-label" htmlFor="problema-correccion">
                  Escríbelo con tus palabras
                </label>
                {/* **Llega con lo que ya había escrito, no en blanco.** La
                    especificación lo pide literal —«conservar texto ya
                    escrito»— y vaciarlo castiga justamente a quien se tomó el
                    trabajo de corregirnos. */}
                <textarea id="problema-correccion" name="problema" className="pc-input" rows={4}
                          defaultValue={problema}
                          onChange={(e) => setProblema(e.target.value)} />
              </div>
              <Error_ paso={r1} />
              <button type="submit" className="pc-action" disabled={guardando1}>
                {guardando1 ? "Guardando…" : "Guardar y seguir"}
              </button>
            </form>
          )}
        </div>
      )}

      {paso === "municipio" && (
        <div data-prueba="municipio">
          {candidatos.length > 0 ? (
            <>
              <h2>{candidatos.length === 1 ? "¿Es aquí?" : "¿Cuál de estos es?"}</h2>
              <p className="pc-help">
                Lo buscamos en el listado oficial de municipios del DANE por lo que escribiste.
                {candidatos.length > 1 && <> Hay más de uno con ese nombre, <strong>y solo tú sabes cuál es</strong>.</>}
              </p>
              <div className="pc-actions">
                {candidatos.map((c) => (
                  <button key={c.codigo} type="button" className="pc-action" disabled={guardandoMun}
                          onClick={() => elegir(c, "lo_dijo")}>
                    {c.nombre}, {c.departamento}
                  </button>
                ))}
              </div>
              <button type="button" className="pc-text-action" onClick={() => { setCandidatos([]); setDepto(""); }}>
                Ninguno de estos
              </button>
            </>
          ) : (
            <>
              {/* **Aquí está el arreglo.** Antes, si lo que escribió no llegaba a
                  un municipio, la pregunta se daba por contestada y seguíamos.
                  «En mi casa» pasaba de largo, y el aporte llegaba a la bandeja
                  sin territorio al que sumarlo — que es como no tenerlo.

                  Ahora se insiste, se le explica para qué sirve, y se le da una
                  segunda vía: dónde vive. Salir sigue siendo posible: `N02` pide
                  aceptar ubicación incompleta, y exigirla excluiría justo a quien
                  menos puede precisarla. */}
              <h2>{porResidencia ? "¿Dónde vives?" : "¿Dónde queda?"}</h2>
              <p className="pc-help">
                {porResidencia ? (
                  <>Sirve para acercarnos. Después te preguntamos si el problema ocurre ahí mismo.</>
                ) : (
                  <>
                    Sin municipio, tu aporte <strong>no se puede sumar al de tus vecinos</strong> ni
                    llegar a quien responde por ese territorio.
                  </>
                )}
              </p>

              {/* **De lo macro a lo micro.** Buscar el municipio por nombre
                  devolvía ocho «RÍO…» de ocho departamentos distintos, y quien
                  buscaba el suyo tenía que leerlos todos. Escogiendo primero el
                  departamento la lista baja de 1.122 a 125 como mucho, y dentro
                  de un departamento **no hay dos municipios con el mismo
                  nombre**: escoger vuelve a ser escoger.

                  Y es el orden en que la gente sabe dónde vive: nadie duda de su
                  departamento, y mucha gente sí del nombre exacto de su
                  municipio. */}
              <div className="pc-field">
                <label className="pc-label" htmlFor="departamento">Departamento</label>
                <select id="departamento" className="pc-input" value={depto}
                        onChange={(e) => escogerDepartamento(e.target.value)}>
                  <option value="">Escoge uno…</option>
                  {deptos.map((d) => <option key={d.codigo} value={d.codigo}>{d.nombre}</option>)}
                </select>
              </div>

              {depto && (
                <div className="pc-field">
                  <label className="pc-label" htmlFor="municipio">Municipio</label>
                  <select id="municipio" className="pc-input" defaultValue=""
                          onChange={(e) => {
                            const m = delDepto.find((x) => x.codigo === e.target.value);
                            if (m) elegir(m, porResidencia ? "vive_ahi" : "lo_dijo");
                          }}>
                    <option value="">
                      {delDepto.length ? `Escoge uno de los ${delDepto.length}…` : "Cargando…"}
                    </option>
                    {delDepto.map((m) => <option key={m.codigo} value={m.codigo}>{m.nombre}</option>)}
                  </select>
                </div>
              )}

              {!porResidencia ? (
                <button type="button" className="pc-text-action"
                        onClick={() => { setPorResidencia(true); setDepto(""); setDelDepto([]); }}>
                  No sé en qué municipio queda
                </button>
              ) : (
                <button type="button" className="pc-text-action" onClick={seguirDespuesDelMunicipio}>
                  Prefiero no decirlo
                </button>
              )}
              <p className="pc-help">
                Lo que escribiste se guarda igual, tal como lo escribiste. Si no llegamos al
                municipio, alguien lo revisa a mano — <strong>no lo vamos a suponer</strong>.
              </p>
            </>
          )}
        </div>
      )}

      {paso === "confirmar-residencia" && elegido && (
        <div data-prueba="confirmar-residencia">
          <h2>¿El problema ocurre en {elegido.nombre}?</h2>
          {/* `GEO-01`: **una dirección residencial no es el lugar del problema
              sin confirmación.** Preguntar dónde vive acerca, pero dar por hecho
              que el problema ocurre ahí es el error que esa regla nombra. */}
          <p className="pc-help">
            Nos dijiste que vives ahí. Lo que necesitamos saber es dónde <strong>ocurre el
            problema</strong>, que no siempre es lo mismo.
          </p>
          <div className="pc-actions">
            <button type="button" className="pc-action" disabled={guardandoMun}
                    onClick={async () => {
                      setGuardandoMun(true);
                      await confirmarMunicipio(codigo, elegido.codigo, elegido.version, "vive_ahi");
                      setGuardandoMun(false);
                      seguirDespuesDelMunicipio();
                    }}>
              Sí, ocurre ahí
            </button>
          </div>
          <button type="button" className="pc-mode" onClick={() => { setElegido(null); setPaso("municipio"); }}>
            No, ocurre en otra parte
          </button>
        </div>
      )}

      {paso === "falta" && vueltas[vuelta] && (
        <div data-prueba={`vuelta-${vuelta + 2}`}>
          <h2>{vuelta === 0 ? "Nos falta poco" : "Y lo último"}</h2>
          <p className="pc-help">
            Esto no lo encontramos en lo que contaste. <strong>Lo que no sepas, déjalo en
            blanco</strong> — no vamos a suponerlo.
          </p>
          <form action={accion2} key={vuelta}>
            <input type="hidden" name="codigo" value={codigo} readOnly />
            <input type="hidden" name="problema" value={problema} readOnly />
            {vueltas[vuelta].map((k) => (
              <div className="pc-field" key={k}>
                <label className="pc-label" htmlFor={k}>{COMO_SE_PREGUNTA[k].etiqueta}</label>
                <input id={k} name={k} className="pc-input" type="text" aria-describedby={`${k}-ayuda`} />
                <p className="pc-help" id={`${k}-ayuda`}>{COMO_SE_PREGUNTA[k].ayuda}</p>
              </div>
            ))}
            <Error_ paso={r2} />
            <button type="submit" className="pc-action" disabled={guardando2}>
              {guardando2 ? "Guardando…" : vuelta + 1 >= vueltas.length ? "Listo" : "Continuar"}
            </button>
            <button type="button" className="pc-text-action" onClick={() => setPaso("voceria")}>
              Terminar aquí
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
