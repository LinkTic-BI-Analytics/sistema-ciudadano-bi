"use client";

import { useActionState, useEffect, useRef } from "react";
import { consultar, type Consulta } from "./acciones.ts";
import { IconoBuscar, IconoCuando, IconoLugar, IconoRevisar } from "../../producto/iconos.tsx";

/**
 * Consultar un aporte con el código.
 *
 * Era la pantalla más pobre del producto: una caja de texto, y al encontrar, un
 * título de 16 px, el relato suelto, seis renglones de datos en una caja gris y
 * una píldora. Sin fecha, sin seguimiento y sin nada que hacer después.
 *
 * Cuatro cosas cambian, y las cuatro son datos que ya estaban:
 *
 * 1. **La fecha de recepción se pinta.** `recibidoEn` viajaba del servidor al
 *    navegador en cada consulta y no se dibujaba en ninguna parte. Es el único
 *    dato que contesta «¿cuándo fue esto?», que es media pregunta de quien
 *    vuelve meses después con un papelito.
 * 2. **El seguimiento estrena `.pc-history`**, que el sistema de diseño tiene
 *    rotulada literalmente «Seguimiento (mis aportes)» y **ninguna pantalla
 *    usaba**. Son dos hitos ciertos y uno pendiente; no se inventa un tercero
 *    —`I2` prohíbe inferir— y el último dice que todavía no hay respuesta, que
 *    es la verdad y no una promesa.
 * 3. **`.pc-summary-head` vuelve a ser lo que es.** Es un contenedor flex
 *    —título a un lado, estado al otro— y se estaba usando como estilo de
 *    texto sobre el `<h2>`, que por eso caía a 16 px y se volvía contenedor de
 *    sí mismo. Es el mismo error que la portada ya tiene vigilado con una
 *    prueba para `.pc-hero-help`.
 * 4. **El código en blanco deja de no hacer nada.** El estado `vacio` existía
 *    en el tipo, se devolvía del servidor y no se renderizaba: pulsar
 *    «Consultar» sin escribir nada no producía absolutamente ninguna señal.
 *
 * **El formulario no se esconde ni se mueve al encontrar.** El resultado va
 * debajo. Meterlo encima empujaría hacia abajo un control que la persona acaba
 * de tocar, que es justo lo que la dirección visual prohíbe. Lo que se hace es
 * llevarle el foco al resultado.
 */

const COMO_VA: Record<string, string> = {
  por_aclarar: "Estamos aclarando dónde ocurre lo que contaste.",
  confirmada: "Ya confirmamos dónde ocurre.",
  desconocida: "No pudimos ubicarlo todavía.",
};

/** Qué decir del lugar en la línea de tiempo, sin afirmar de más. */
const HITO_UBICACION: Record<string, string> = {
  por_aclarar: "Falta afinar dónde ocurre. Puede que lo revisemos con lo que escribiste.",
  confirmada: "Quedó ubicado en un municipio.",
  desconocida: "No se pudo ubicar todavía. Tu relato se conserva igual.",
};

const fecha = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", {
    timeZone: "America/Bogota", dateStyle: "long", timeStyle: "short",
  });

export function Consultar() {
  const [r, accion, consultando] = useActionState<Consulta | null, FormData>(consultar, null);
  const resultado = useRef<HTMLHeadingElement>(null);

  // El foco solo se mueve **después de que la persona pulsó**, nunca al cargar.
  // Es el mismo patrón que el resumen de errores de `/participar`.
  useEffect(() => {
    if (r?.estado === "encontrado") resultado.current?.focus();
  }, [r]);

  return (
    <>
      <form action={accion} noValidate>
        <div className="pc-field">
          <label className="pc-label" htmlFor="codigo">Tu código</label>
          {/* **En la tipografía de cifras y en mayúscula.** El alfabeto del
              código no tiene O, ni I, ni L —se confunden al dictarlo por
              teléfono— y esa precaución se perdía entera al pintarlo con la
              letra del cuerpo. `autoCapitalize` es para el teclado del
              teléfono: el servidor normaliza igual, pero quien escribe ve lo
              mismo que tiene en el papel.
              **Sin `maxLength` ni máscara**: la ayuda de abajo promete que se
              puede escribir con espacios, y una máscara reescribiría lo que se
              envía — eso ya sería lógica, no presentación. */}
          {/* **Sin `autoFocus`.** En un teléfono abre el teclado al entrar y
              tapa la mitad de la pantalla —incluido el párrafo que explica de
              dónde sale el código—, y a quien usa lector de pantalla le salta
              el titular. El foco de esta pantalla se mueve una sola vez: al
              resultado, y solo después de que la persona pulsó. */}
          <input id="codigo" name="codigo" className="pc-input" type="text" data-cifra
                 autoComplete="off" spellCheck={false}
                 autoCapitalize="characters" enterKeyHint="go"
                 aria-invalid={r?.estado === "vacio" ? true : undefined}
                 aria-describedby="codigo-ayuda" />
          <p className="pc-help" id="codigo-ayuda">
            El que te dimos cuando enviaste tu aporte. Puedes escribirlo con espacios o en
            minúscula: da igual. Son doce caracteres.
          </p>
        </div>

        {/* El estado que existía en el tipo y no se dibujaba. */}
        {r?.estado === "vacio" && (
          <p className="pc-error" role="alert">
            Escribe tu código para poder buscarlo.
          </p>
        )}

        <button type="submit" className="pc-action" disabled={consultando}>
          <IconoBuscar />
          {consultando ? "Buscando…" : "Consultar"}
        </button>
      </form>

      {r?.estado === "sin_resultado" && (
        // No es un error: es una respuesta. Y dice lo mismo para un código que
        // no existe y para uno mal escrito, a propósito.
        <p className="pc-empty" data-prueba="sin-resultado" aria-live="polite">
          No encontramos nada con ese código. Revisa que esté completo — son doce caracteres.
        </p>
      )}

      {r?.estado === "encontrado" && (
        <section className="pc-summary-item pc-entra" aria-live="polite">
          {/* Título y estado en la misma línea, que es para lo que existe esta
              clase. `tabIndex={-1}` para poder recibir el foco sin entrar en el
              recorrido del tabulador. */}
          <div className="pc-summary-head">
            <h2 tabIndex={-1} ref={resultado}>Esto fue lo que nos contaste</h2>
            <p className="pc-status">{COMO_VA[r.estadoUbicacion ?? ""] ?? "Está en revisión."}</p>
          </div>

          <p className="pc-summary-text" data-prueba="relato">{r.relato}</p>
          {r.canal === "voz_transcrita" && (
            // Que sepa que lo suyo entró hablando: el texto de arriba es lo que
            // entendió una máquina, y su grabación es el original (ADR 0013).
            <p className="pc-meta">
              Lo contaste hablando. <strong>Tu grabación es el original</strong>; lo de arriba es
              lo que entendimos de ella.
            </p>
          )}

          {/* **Todo lo que quedó registrado, devuelto.** Antes solo veía el
              relato y el lugar, y había contestado el doble. No poder ver lo
              que uno mismo contó es lo que hace dejar de creer que sirvió. */}
          <dl className="pc-detail-facts" data-prueba="lo-registrado">
            <dt>Cuándo lo recibimos</dt>
            <dd>{fecha(r.recibidoEn)}</dd>
            {r.municipio && (<><dt>Municipio</dt><dd>{r.municipio}</dd></>)}
            {r.lugarDeclarado && (<><dt>Dónde dijiste que ocurre</dt><dd>{r.lugarDeclarado}</dd></>)}
            {r.afectados && (<><dt>A quiénes les pasa</dt><dd>{r.afectados}</dd></>)}
            {r.desdeCuando && (<><dt>Desde cuándo</dt><dd>{r.desdeCuando}</dd></>)}
            {r.colectivo && (<><dt>Dijiste hablar por</dt><dd>{r.colectivo}</dd></>)}
            {r.sintesis && (<><dt>Lo que quedó escrito</dt><dd>{r.sintesis}</dd></>)}
          </dl>

          {/* ── El seguimiento ─────────────────────────────────────────────
              **Tres hitos, y el tercero dice que todavía no.** La tentación
              aquí es dibujar cinco pasos con palomitas y dejar el último en
              gris, que es como se ve un envío de paquetería. Pero eso
              prometería una secuencia que nadie acordó: no hay plazo escrito
              para responder, y el sistema **no puede cerrar por silencio**.
              Lo único que se puede afirmar es lo que pasó, con su fecha, y que
              lo que falta todavía no ha pasado. */}
          <h3>Cómo va</h3>
          <ul className="pc-history">
            <li>
              <strong>Recibido</strong>
              <p className="pc-meta">
                <IconoCuando /> {fecha(r.recibidoEn)}
              </p>
              <p className="pc-help">
                Quedó guardado con tus palabras. El código que tienes es lo que lo recupera.
              </p>
            </li>
            <li>
              <strong>Dónde ocurre</strong>
              <p className="pc-meta">
                <IconoLugar />{" "}
                {r.municipio ?? (r.lugarDeclarado ? `«${r.lugarDeclarado}»` : "sin registrar")}
              </p>
              <p className="pc-help">
                {HITO_UBICACION[r.estadoUbicacion ?? ""] ?? "Sin registrar todavía."}
              </p>
            </li>
            <li>
              <strong>Revisión</strong>
              <p className="pc-meta"><IconoRevisar /> todavía sin respuesta registrada</p>
              <p className="pc-help">
                Un equipo lo revisa junto con los demás aportes del territorio.{" "}
                <strong>No hay una fecha comprometida</strong>, y esta página no la va a inventar.
              </p>
            </li>
          </ul>

          <p className="pc-note">
            Que esté registrado no significa que se haya resuelto ni que haya un compromiso de
            obra.
          </p>

          {/* Antes no había nada que hacer después de consultar: la pantalla
              terminaba en un descargo. */}
          <div className="pc-actions">
            <a className="pc-action" data-variant="secondary" href="/participar">
              Contar otra cosa
            </a>
          </div>
        </section>
      )}
    </>
  );
}
