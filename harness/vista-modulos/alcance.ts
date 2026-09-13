// ¿Alcanza para construir la pantalla?
//
// El umbral de este método no es la completitud: es si se puede dibujar. Un
// módulo del que falta la mitad del detalle pero se puede poner en pantalla
// enseña más que uno perfectamente especificado que nadie ha visto.
//
// **Se deriva, no se declara.** Un nivel de confianza escrito a mano es una
// opinión con formato de dato: nadie lo puede discutir y nadie lo actualiza.
// Este sale de cuatro cosas que se pueden contar, y la pantalla enseña de
// cuáles — para que se pueda estar en desacuerdo con el resultado mirando
// sus partes.

import type { Modulo, Rol } from "./modulos";
import { fronteras } from "./modulos";

export type Alcance = {
  nivel: "alcanza" | "a medias" | "no alcanza";
  porque: string;
  partes: { que: string; valor: string; pesa: "bien" | "regular" | "mal" }[];
};

export function alcanza(m: Modulo, roles: Rol[]): Alcance {
  const decisiones = (m.noEntra ?? []).filter((x) => x.dato);
  // Una falta que se come el módulo entero no es una falta: es que no hay con qué.
  const bloqueaTodo = decisiones.some((x) => /^todo el m[óo]dulo/i.test(x.que));

  const suyos = (m.usan ?? []).map((u) => roles.find((r) => r.clave === u.rol));
  const deducidos = suyos.filter((r) => r?.deducido).length;

  const misFronteras = (m.fronteras ?? []).map((c) => fronteras.find((f) => f.clave === c));
  const enNivel1 = misFronteras.filter((f) => f && f.mock === 1).length;

  const palabras = m.escrito?.palabras ?? 0;

  const partes: Alcance["partes"] = [
    {
      que: "Qué tan escrito está",
      valor: palabras
        ? `${palabras.toLocaleString("es-CO")} palabras en ${m.escrito!.donde}`
        : "nada en los documentos del cliente",
      pesa: palabras >= 5000 ? "bien" : palabras > 0 ? "regular" : "mal",
    },
    {
      que: "Decisiones que espera",
      valor: decisiones.length
        ? `${decisiones.length}, y ${decisiones.length === 1 ? "tiene" : "tienen"} dueño`
        : "ninguna",
      pesa: bloqueaTodo ? "mal" : decisiones.length ? "regular" : "bien",
    },
    {
      que: "Quiénes lo usan",
      valor: !suyos.length
        ? "sin nombrar"
        : deducidos
          ? `${suyos.length}, de los cuales ${deducidos} ${deducidos === 1 ? "es deducido" : "son deducidos"}`
          : `${suyos.length}, todos de algún documento`,
      pesa: !suyos.length ? "mal" : deducidos ? "regular" : "bien",
    },
    {
      que: "Fronteras que toca",
      valor: !misFronteras.length
        ? "ninguna"
        : `${misFronteras.length}, ${enNivel1 ? `${enNivel1} en nivel 1 — solo sabemos el nombre` : "con contrato"}`,
      pesa: !misFronteras.length ? "bien" : enNivel1 ? "mal" : "regular",
    },
  ];

  // Las reglas se dicen, no se puntúan. Un puntaje esconde por qué; una regla
  // se puede discutir, que es lo que hace falta cuando alguien no está de
  // acuerdo con el resultado.
  if (bloqueaTodo)
    return { nivel: "no alcanza", porque: "lo que falta es el módulo entero, no una parte", partes };
  if (!palabras)
    return { nivel: "no alcanza", porque: "no hay nada escrito sobre esto en los documentos", partes };
  if (!suyos.length)
    return { nivel: "no alcanza", porque: "nadie sabe quién lo usa", partes };
  if (enNivel1)
    return {
      nivel: "a medias",
      porque: `toca ${enNivel1 === 1 ? "una frontera" : `${enNivel1} fronteras`} de las que solo sabemos el nombre: se puede dibujar, no conectar`,
      partes,
    };
  if (decisiones.length)
    return {
      nivel: "a medias",
      porque: "se puede dibujar; lo que espera un número queda sin criterio",
      partes,
    };
  return { nivel: "alcanza", porque: "se puede construir entero con lo que hay", partes };
}
