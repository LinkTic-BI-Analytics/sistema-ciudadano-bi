#!/usr/bin/env bash
# El catálogo territorial del DANE, listo para sembrar.
#
#   ./scripts/divipola.sh --bajar   trae los .xlsx del geoportal del DANE
#   ./scripts/divipola.sh           los convierte a .csv y anota la versión
#
# La fuente es geoportal.dane.gov.co. **No datos.gov.co**: allí la copia de los
# municipios está atribuida a una gobernación departamental y tiene corte a
# diciembre de 2024; el DANE publica junio de 2026.
set -euo pipefail
cd "$(dirname "$0")/.."
D=producto/datos/divipola
mkdir -p "$D"

if [ "${1:-}" = "--bajar" ]; then
  for f in Departamentos Municipios CentrosPoblados; do
    curl -fsSL --max-time 120 -o "$D/DIVIPOLA_$f.xlsx" \
      "https://geoportal.dane.gov.co/descargas/divipola/DIVIPOLA_$f.xlsx"
    echo "  bajado  DIVIPOLA_$f.xlsx"
  done
fi

echo "DIVIPOLA"
exec python3 scripts/lib/divipola.py
