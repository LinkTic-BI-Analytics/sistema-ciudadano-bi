#!/usr/bin/env bash
# Trae el sistema de diseño del cliente adentro del MVP.
#
# La fuente es `negocio/linea-grafica/tokens/`, que es donde el cliente entrega.
# Pero el CSS no puede salir de `mvp/` —Turbopack no lo deja— así que se copia.
#
# **La copia no se edita.** Se corre esto cada vez que el cliente entregue una
# versión nueva, y lo que cambie se ve en el diff.
set -euo pipefail
cd "$(dirname "$0")/.."
origen=$(find negocio/linea-grafica/tokens -name "tokens.css" -not -path "*/node_modules/*" | head -1)
if [ -z "$origen" ]; then
  echo "No hay ningún tokens.css en negocio/linea-grafica/tokens/."
  echo "Ahí es donde el cliente entrega el sistema de diseño."
  exit 1
fi
destino=mvp/src/producto/banco/tokens.css
mkdir -p "$(dirname "$destino")"
if [ -f "$destino" ] && diff -q "$origen" "$destino" >/dev/null; then
  echo "  Ya está al día: $origen"
else
  cp "$origen" "$destino"
  echo "  Copiado  $origen"
  echo "        → $destino"
fi
echo "  $(grep -c '^\s*--' "$destino") tokens · $(grep -c '^\[data-' "$destino") modos"
