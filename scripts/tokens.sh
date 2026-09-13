#!/usr/bin/env bash
# Los tokens del sistema de diseño, dentro del producto.
#
# Tres pasos, y el orden importa:
#
#   1. Corre el generador que entregó el equipo de diseño, TAL CUAL. Valida que
#      no haya ciclos de alias y comprueba los 41 pares de contraste con un
#      assert: si alguno baja del umbral, esto falla y no se copia nada.
#   2. Genera lo que este proyecto le agrega (scripts/lib/tokens_producto.py),
#      en un archivo aparte para que se vea qué es del diseño y qué es nuestro.
#   3. Copia al producto.
#
# **Las copias no se editan.** Se corre esto cuando llegue una versión nueva del
# sistema de diseño, y lo que cambie se ve en el diff.
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGEN=$(find negocio/linea-grafica/tokens -name "generar_tokens.py" -not -path "*/node_modules/*" | head -1)
if [ -z "$ORIGEN" ]; then
  echo "No hay ningún generar_tokens.py en negocio/linea-grafica/tokens/."
  echo "Ahí es donde se entrega el sistema de diseño."
  exit 1
fi
DIR=$(dirname "$ORIGEN")
DESTINO=producto/src/producto/tokens

echo "Tokens"
printf '  '; (cd "$DIR" && python3 generar_tokens.py)
python3 scripts/lib/tokens_producto.py

mkdir -p "$DESTINO"
for f in participacion.css shadcn-theme.css; do
  if [ -f "$DESTINO/$f" ] && diff -q "$DIR/$f" "$DESTINO/$f" >/dev/null; then
    echo "  ya al día    $f"
  else
    cp "$DIR/$f" "$DESTINO/$f"
    echo "  copiado      $f"
  fi
done

echo "  $(grep -c '^\s*--pc-' "$DESTINO/participacion.css") tokens en el producto"
