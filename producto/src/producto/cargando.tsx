"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * «Cargando…» sobre el área de trabajo mientras se va a otra pantalla interna.
 *
 * **Por qué hace falta, si ya hay `loading.tsx`.** Las vistas del menú —«Falta
 * el lugar», «Sin expediente», «Con alerta»— y el botón «Filtrar» son la misma
 * `/consola` con otro filtro en la dirección. Para Next eso no es cambiar de
 * pantalla: deja la vieja quieta hasta que el servidor contesta y el
 * `loading.tsx` no aparece. Todo lo que tarde el servidor es tiempo sin una
 * sola señal, y la queja fue literal: «se queda congelado sin saber qué pasó».
 * «Filtrar» es peor: es un formulario GET, una navegación entera del
 * navegador, y ahí Next no interviene.
 *
 * Así que esto no le pregunta a Next: escucha el clic en un enlace interno y el
 * envío de un formulario GET, y se quita cuando la dirección cambia.
 *
 * Cuatro decisiones:
 *
 *   · **Espera 150 ms antes de aparecer.** Una navegación que llega antes no
 *     necesita aviso, y un velo que parpadea en cada clic es peor que ninguno.
 *   · **Cubre el área de trabajo, no la barra lateral.** Quien se equivocó de
 *     vista puede pulsar otra sin esperar a que llegue la primera.
 *   · **Se quita solo a los 30 s.** Si algo falla sin cambiar la dirección, un
 *     velo que no se va deja la pantalla inservible, y eso es peor que el
 *     congelamiento que venía a arreglar.
 *   · **El texto va siempre**, no solo el círculo. Con movimiento reducido el
 *     círculo no gira, y lo que queda dice igual qué está pasando.
 */
export function Cargando() {
  const ruta = usePathname();
  const consulta = useSearchParams();
  const [pendiente, setPendiente] = useState(false);
  const [visible, setVisible] = useState(false);

  // La dirección cambió: llegó.
  useEffect(() => { setPendiente(false); }, [ruta, consulta]);

  useEffect(() => {
    if (!pendiente) { setVisible(false); return; }
    const aparecer = setTimeout(() => setVisible(true), 150);
    const rendirse = setTimeout(() => setPendiente(false), 30_000);
    return () => { clearTimeout(aparecer); clearTimeout(rendirse); };
  }, [pendiente]);

  useEffect(() => {
    // Si una dirección es otra pantalla de este sitio. Ni otra pestaña, ni
    // otro dominio, ni un archivo: la pieza en PNG se descarga y la página no
    // cambia, así que el velo no se iría nunca.
    const esOtraPantalla = (destino: URL) =>
      destino.origin === location.origin
      && !/\.[a-z0-9]+$/i.test(destino.pathname)
      && (destino.pathname !== location.pathname || destino.search !== location.search);

    // En captura y no en burbuja: `<Link>` de Next llama `preventDefault` en
    // su propio manejador, y después de él ya no se distingue un enlace que
    // navega de uno que no.
    function alClic(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank" || a.hasAttribute("download")) return;
      if (esOtraPantalla(new URL(a.href))) setPendiente(true);
    }

    function alEnviar(e: SubmitEvent) {
      const f = e.target;
      // Solo los GET: los POST son acciones de servidor, y cada botón de esos
      // ya dice «Guardando…» por su cuenta.
      if (!(f instanceof HTMLFormElement) || f.method !== "get" || f.target === "_blank") return;
      if (new URL(f.action).origin === location.origin) setPendiente(true);
    }

    // Volver con «Atrás» puede restaurar la página tal como se dejó —con el
    // velo puesto— desde la caché del navegador.
    function alVolver(e: PageTransitionEvent) { if (e.persisted) setPendiente(false); }

    document.addEventListener("click", alClic, true);
    document.addEventListener("submit", alEnviar, true);
    window.addEventListener("pageshow", alVolver);
    return () => {
      document.removeEventListener("click", alClic, true);
      document.removeEventListener("submit", alEnviar, true);
      window.removeEventListener("pageshow", alVolver);
    };
  }, []);

  // La región que anuncia está **siempre** montada y cambia de texto: una que
  // aparece de golpe con su texto adentro muchos lectores de pantalla no la
  // leen, porque no existía cuando cambió. El velo es solo para los ojos.
  return (
    <>
      <p role="status" className="bo-visualmente-oculto">{visible ? "Cargando…" : ""}</p>
      {visible && (
        <div className="bo-cargando" aria-hidden>
          <div className="bo-cargando-tarjeta">
            <span className="bo-cargando-circulo" />
            <p>Cargando…</p>
          </div>
        </div>
      )}
    </>
  );
}
