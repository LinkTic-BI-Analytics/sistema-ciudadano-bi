#!/usr/bin/env bash
# Trae las vistas del harness adentro del producto.
#
# Viven en `harness/` porque son del harness: se ven igual en todos los
# proyectos y viajan tal cual (`interfaz.md` I1). Pero el CSS no puede salir de
# la raíz del proyecto de Next —Turbopack no lo deja— así que se copian.
#
# **Las copias no se editan.** Si una vista tiene que cambiar, cambia en
# `harness/` y eso es una cosecha (`metodo/cosecha.md`).
set -euo pipefail
cd "$(dirname "$0")/.."
DESTINO=producto/src/harness

mkdir -p "$DESTINO"
CAMBIOS=0

# La telemetría lee `negocio/.grafo.json`, que sale de `scripts/grafo.sh` sobre
# `negocio/especificacion.md`. Mientras la especificación no haya pasado por el
# método, ese archivo no existe y la vista no compila. No se copia, y se dice:
# una vista que falta por una razón se arregla; una que falta en silencio se
# reimplementa.
SALTAR=""
if [ ! -f negocio/.grafo.json ]; then
  SALTAR="VistaTelemetria.tsx telemetria.css"
fi
while IFS= read -r origen; do
  base=$(basename "$origen")
  case " $SALTAR " in *" $base "*) continue;; esac
  rel=${origen#harness/}
  dest="$DESTINO/$rel"
  mkdir -p "$(dirname "$dest")"
  if [ -f "$dest" ] && diff -q "$origen" "$dest" >/dev/null; then continue; fi
  cp "$origen" "$dest"
  echo "  copiado   $rel"
  CAMBIOS=$((CAMBIOS+1))
done < <(find harness/vista-modulos harness/vista-construccion \
           -type f \( -name '*.tsx' -o -name '*.ts' -o -name '*.css' -o -name '*.svg' \) \
           -not -path '*/prueba/*' | sort)

[ "$CAMBIOS" -eq 0 ] && echo "  ya al día"
if [ -n "$SALTAR" ]; then
  echo "  sin copiar: la telemetría espera negocio/.grafo.json, que sale de la"
  echo "              especificación cuando pase por el método (T020)"
fi
echo "  $(find "$DESTINO" -type f | wc -l | tr -d ' ') archivos en $DESTINO"
