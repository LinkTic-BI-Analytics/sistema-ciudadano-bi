"use client";

import { useActionState, useEffect, useState } from "react";
import { confirmarLectura, guardarPrecisiones, prepararLectura, type PasoAfinado } from "./acciones.ts";
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
  const [paso, setPaso] = useState<"entendimos" | "falta" | "listo">("entendimos");
  const [vuelta, setVuelta] = useState(0);
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [problema, setProblema] = useState("");

  const [r1, accion1, guardando1] = useActionState<PasoAfinado | null, FormData>(confirmarLectura, null);
  const [r2, accion2, guardando2] = useActionState<PasoAfinado | null, FormData>(guardarPrecisiones, null);

  useEffect(() => {
    let vigente = true;
    prepararLectura(codigo)
      .then((l) => { if (vigente && l) { setLect(l); setProblema(l.problema); } })
      .finally(() => { if (vigente) setLeyendo(false); });
    return () => { vigente = false; };
  }, [codigo]);

  // Lo que falta, repartido en vueltas de tres. Si no falta nada, no hay vueltas
  // y la persona pasa directo al final: preguntarle por lo que ya dijo sería
  // castigarla por haberlo contado bien.
  const faltan = lect ? loQueFalta(lect) : [];
  const vueltas: Preguntable[][] = [];
  for (let i = 0; i < faltan.length; i += POR_VUELTA) vueltas.push(faltan.slice(i, i + POR_VUELTA));

  useEffect(() => { if (r1?.ok) setPaso(vueltas.length ? "falta" : "listo"); }, [r1]);
  useEffect(() => {
    if (!r2?.ok) return;
    setVuelta((v) => {
      const siguiente = v + 1;
      if (siguiente >= vueltas.length) setPaso("listo");
      return siguiente;
    });
  }, [r2]);

  if (leyendo) {
    return (
      <section className="pc-refine" data-prueba="afinar">
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

  const total = 1 + (vueltas.length ? vueltas.length : 0) + 1;
  const actual = paso === "entendimos" ? 2 : 2 + vuelta + 1;

  return (
    <section className="pc-refine" data-prueba="afinar">
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
              <blockquote className="pc-quote">{problema}</blockquote>
              <dl className="pc-read">
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
              <form action={accion1}>
                <input type="hidden" name="codigo" value={codigo} readOnly />
                <input type="hidden" name="corrigio" value="no" readOnly />
                <input type="hidden" name="mostrado" value={problema} readOnly />
                <button type="submit" className="pc-action" disabled={guardando1}>
                  {guardando1 ? "Guardando…" : "Sí, es eso"}
                </button>
              </form>
              <button type="button" className="pc-mode" onClick={() => setCorrigiendo(true)}>
                No es eso — déjame corregirlo
              </button>
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
            <button type="button" className="pc-mode" onClick={() => setPaso("listo")}>
              Terminar aquí
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
