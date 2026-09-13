"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Estado, Modulo, Rol } from "./modulos";
import { alcanza } from "./alcance";

// La lista de módulos, uno por fila y todos visibles.
//
// Antes eran fichas plegadas en columnas por estado, y el analista lo dijo
// claro: **así los módulos quedan escondidos.** Plegar resolvía el tamaño y
// creaba un problema peor — una pantalla que existe para saber qué hay no
// puede empezar tapando lo que hay.
//
// Una fila por módulo se recorre entera sin abrir nada, y el detalle se abre en
// ventana: no empuja el resto de la página ni obliga a volver a buscar dónde
// iba uno.
//
// **Pero lo que el módulo lleva adentro va en la fila, no en la ventana.** Se
// intentó al revés y el analista lo dijo dos veces: "los módulos no sé qué
// llevo". Los conteos dicen 4/4 y 2 esperan decisión, y eso no es qué hay.
//
// La razón es de qué sirve esta pantalla: *"podría tener una sesión varios días
// y después de tener varias cosas no recordar qué está o qué falta"*. Recordar
// no se resuelve con un clic por módulo — se resuelve viéndolo.

const etiqueta: Record<Estado, string> = {
  construido: "construido",
  "a medias": "a medias, a propósito",
  pendiente: "todavía no",
};

const claseEstado: Record<Estado, string> = {
  construido: "es--construido",
  "a medias": "es--medias",
  pendiente: "es--pendiente",
};

export function ListaModulos({
  modulos, roles, denso = false,
}: { modulos: Modulo[]; roles: Rol[]; denso?: boolean }) {
  const [abierto, setAbierto] = useState<Modulo | null>(null);
  const rolDe = (clave: string) => roles.find((r) => r.clave === clave);

  return (
    <>
      <ul className={`lista ${denso ? "lista--densa" : ""}`}>
        {modulos.map((m) => (
          <li key={m.nombre}>
            <button type="button" className="reng" onClick={() => setAbierto(m)}>
              <span className={`reng__estado ${claseEstado[m.estado]}`}>
                <span className="reng__punto" aria-hidden="true" />
                {etiqueta[m.estado]}
                {/* ¿Alcanza para construir la pantalla? Va pegado al estado
                    porque son la misma pregunta en dos tiempos: qué hay
                    construido, y qué se podría construir ya. */}
                <span className={`alcance alcance--${alcanza(m, roles).nivel.replace(/ /g, "-")}`}>
                  {alcanza(m, roles).nivel}
                </span>
              </span>

              <span className="reng__nombre">{m.nombre}</span>
              <span className="reng__que">{m.queHace}</span>

              {/* Lo que lleva adentro, a la vista. Dos columnas: lo que ya se
                  puede hacer y lo que todavía no, con lo que espera una
                  decisión marcado aparte porque tiene dueño. */}
              {(m.yaSePuede?.length || m.noEntra?.length) ? (
                <span className="reng__dentro">
                  {m.yaSePuede && m.yaSePuede.length > 0 && (
                    <span className="dentro">
                      <span className="dentro__rotulo dentro__rotulo--si">Ya se puede</span>
                      {m.yaSePuede.map((x) => <span key={x} className="dentro__it">{x}</span>)}
                    </span>
                  )}
                  {m.noEntra && m.noEntra.length > 0 && (
                    <span className="dentro">
                      <span className="dentro__rotulo">Todavía no</span>
                      {m.noEntra.map((x) => (
                        <span key={x.que} className={`dentro__it ${x.dato ? "dentro__it--dato" : ""}`}>
                          {x.que}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              ) : null}

              {/* Quién lo usa, en la fila. Es lo primero que alguien pregunta
                  de un módulo que no construyó. */}
              <span className="reng__roles">
                {(m.usan ?? []).map((u) => {
                  const r = rolDe(u.rol);
                  return r ? (
                    <span key={u.rol} className="rol"
                          data-marca={roles.indexOf(r) % 4}
                          data-deducido={r.deducido ? "" : undefined}>
                      {r.nombre}
                    </span>
                  ) : null;
                })}
              </span>

              <span className="reng__comova">
                {m.comprobado && (
                  <span><b>{m.comprobado.cerrados}</b>/<b>{m.comprobado.total}</b></span>
                )}
                {m.noEntra?.some((x) => x.dato) && (
                  <span className="reng__dato">
                    {m.noEntra.filter((x) => x.dato).length} esperan decisión
                  </span>
                )}
                {m.estado !== "pendiente" && !m.mirado && (
                  <span className="reng__sinmirar">sin revisar</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {abierto && (
        <Detalle modulo={abierto} roles={roles} cerrar={() => setAbierto(null)} />
      )}
    </>
  );
}

// La ventana. Se cierra con Escape, con el botón y haciendo clic afuera —las
// tres, porque quien no encuentra cómo salir de una ventana deja de abrirlas.
function Detalle({
  modulo: m, roles, cerrar,
}: { modulo: Modulo; roles: Rol[]; cerrar: () => void }) {
  const rolDe = (clave: string) => roles.find((r) => r.clave === clave);

  // Escape cierra. Quien no encuentra cómo salir de una ventana deja de
  // abrirlas, y entonces el detalle vuelve a estar escondido.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [cerrar]);

  return (
    <div className="telon" onClick={cerrar} role="presentation">
      <div
        className="ventana"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ventana-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ventana__cabeza">
          <div>
            <span className={`reng__estado ${claseEstado[m.estado]}`}>
              <span className="reng__punto" aria-hidden="true" />
              {etiqueta[m.estado]}
            </span>
            <h2 id="ventana-titulo">{m.nombre}</h2>
          </div>
          <button type="button" className="ventana__cerrar" onClick={cerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="ventana__cuerpo">
          <p className="ventana__que">{m.queHace}</p>

          {/* De qué está hecho el nivel. Se enseñan las partes para que se
              pueda estar en desacuerdo con el resultado mirándolas: un número
              que no se puede desarmar es una opinión con formato de dato. */}
          {(() => {
            const a = alcanza(m, roles);
            return (
              <section className={`alcance__caja alcance__caja--${a.nivel.replace(/ /g, "-")}`}>
                <p className="alcance__cabeza">
                  <b>¿Alcanza para construir la pantalla?</b>
                  <span className={`alcance alcance--${a.nivel.replace(/ /g, "-")}`}>{a.nivel}</span>
                </p>
                <p className="alcance__porque">{a.porque}</p>
                <ul className="alcance__partes">
                  {a.partes.map((p) => (
                    <li key={p.que} className={`alcance__parte alcance__parte--${p.pesa}`}>
                      <span>{p.que}</span>
                      <span>{p.valor}</span>
                    </li>
                  ))}
                </ul>
                <p className="alcance__nota">
                  Esto no se declara: sale de contar. Si el resultado no cuadra, la discusión
                  es sobre una de las cuatro partes de arriba.
                </p>
              </section>
            );
          })()}

          {/* Quién lo usa va primero, antes de lo que hace y de lo que falta.
              La prioridad es el usuario: un módulo que no sabe decir quién lo
              usa se especificó desde la función y no desde la persona. */}
          {m.usan && m.usan.length > 0 && (
            <section className="ventana__bloque">
              <h3 className="ficha__rotulo">Quién lo usa</h3>
              <ul className="usos">
                {m.usan.map((u) => {
                  const r = rolDe(u.rol);
                  if (!r) return null;
                  return (
                    <li key={u.rol} className="uso">
                      <span className="rol" data-marca={roles.indexOf(r) % 4}
                            data-deducido={r.deducido ? "" : undefined}>{r.nombre}</span>
                      <span className="uso__para">{u.para}</span>
                      <span className="uso__quien">
                        {r.quienEs}
                        {r.deducido && <em className="uso__deducido"> · deducido, no sale de ningún documento</em>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {m.yaSePuede && m.yaSePuede.length > 0 && (
            <section className="ventana__bloque">
              <h3 className="ficha__rotulo ficha__rotulo--si">Ya se puede</h3>
              <ul className="ficha__lista">
                {m.yaSePuede.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </section>
          )}

          {m.noEntra && m.noEntra.length > 0 && (
            <section className="ventana__bloque">
              <h3 className="ficha__rotulo">Todavía no</h3>
              <ul className="ficha__lista ficha__lista--no">
                {m.noEntra.map((x) => (
                  <li key={x.que} className={x.dato ? "ficha__falta--dato" : undefined}>
                    <b>{x.que}</b> — {x.porque}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {m.espera && (
            <section className="ventana__bloque">
              <h3 className="ficha__rotulo">Espera</h3>
              <p className="ficha__lista">{m.espera}</p>
            </section>
          )}

          <p className="ficha__comova">
            {m.comprobado && (
              <span><b>{m.comprobado.cerrados}</b> de <b>{m.comprobado.total}</b> casos comprobados</span>
            )}
            {m.estado !== "pendiente" && (
              <span className={m.mirado ? undefined : "ficha__sinmirar"}>
                {m.mirado ? `revisado por ${m.mirado}` : "nadie que no lo construyó lo ha mirado"}
              </span>
            )}
          </p>

          {m.pantallas.length > 0 && (
            <ul className="ficha__pantallas">
              {m.pantallas.map((p) => (
                <li key={p.href}><Link href={p.href}>{p.nombre}</Link></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
