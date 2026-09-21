"use client";

import { useEffect, useState } from "react";
import { IconoClaro, IconoOscuro } from "./iconos.tsx";

/**
 * El modo claro y el oscuro (`interfaz.md` I5).
 *
 * La línea gráfica Patria Milagro trae los dos y dice cuál manda: **oscuro**.
 * El claro existe por una razón concreta y no por completismo — este formulario
 * se llena en la calle. Quien cuenta que lleva un mes sin agua lo hace desde un
 * teléfono barato, a pleno sol, y ahí una pantalla navy no se ve.
 *
 * Tres decisiones que vale la pena tener escritas:
 *
 * **La elección se guarda, y no se adivina.** Nada de `prefers-color-scheme`:
 * eso diría el modo del teléfono, no el de la marca, y haría que la misma
 * dirección se viera distinta según quién la abra — que es justo lo que una
 * línea gráfica existe para impedir. Quien quiera el claro lo pide una vez.
 *
 * **Se aplica antes de pintar.** El guion de abajo corre antes que React. Sin
 * él, quien escogió el claro ve un destello navy en cada navegación, y ese
 * destello es más molesto que el modo que no quería.
 *
 * **El botón dice a dónde va, no dónde está.** «Modo claro» sobre fondo oscuro
 * es la acción; el estado ya lo dice la pantalla entera.
 */

const LLAVE = "pc-tema";

/** Corre antes de que React hidrate. Va en el `<head>`, sin `defer`. */
export const GUION_TEMA = `(function(){try{var t=localStorage.getItem(${JSON.stringify(LLAVE)});if(t==="claro"||t==="oscuro")document.documentElement.dataset.tema=t;}catch(e){}})();`;

export function BotonTema() {
  // Arranca en el valor del servidor —oscuro— y se corrige en cuanto monta.
  // `montado` evita que el rótulo del botón parpadee: hasta saber cuál es el
  // tema de verdad no se promete a dónde lleva.
  const [tema, setTema] = useState<"claro" | "oscuro">("oscuro");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setTema(document.documentElement.dataset.tema === "claro" ? "claro" : "oscuro");
    setMontado(true);
  }, []);

  function cambiar() {
    const nuevo = tema === "claro" ? "oscuro" : "claro";
    document.documentElement.dataset.tema = nuevo;
    setTema(nuevo);
    try {
      localStorage.setItem(LLAVE, nuevo);
    } catch {
      // Navegación privada o almacenamiento bloqueado: el tema cambia igual,
      // solo que no se recuerda. No hay nada que decirle a nadie por eso.
    }
  }

  const vaAlClaro = tema === "oscuro";
  return (
    <button type="button" className="pc-tema" onClick={cambiar} aria-pressed={!vaAlClaro}>
      {/* El icono dice a dónde va, igual que el rótulo: sol para ir al claro,
          luna para ir al oscuro. Era un carácter de texto (☀ / ☾) que en
          teléfonos baratos sale como un cuadrado. */}
      {montado && !vaAlClaro ? <IconoOscuro /> : <IconoClaro />}
      {montado ? (vaAlClaro ? "Modo claro" : "Modo oscuro") : "Cambiar el tema"}
    </button>
  );
}
