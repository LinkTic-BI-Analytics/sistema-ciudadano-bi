#!/usr/bin/env bash
# Cuánta información hay cargada, y sobre qué.
#
# Se corre después de leer-insumos.sh y antes de decidir por dónde arrancar.
# No decide: cuenta. Ver metodo/el-ciclo.md, etapa 1a.
set -euo pipefail
cd "$(dirname "$0")/.."
E=negocio/insumos/.extraido
if [ ! -d "$E" ]; then
  echo "No hay nada extraído. Corre ./scripts/leer-insumos.sh primero."
  exit 1
fi
exec python3 scripts/lib/densidad.py "$E"/*.txt
