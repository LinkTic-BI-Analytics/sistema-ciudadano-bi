#!/usr/bin/env bash
# ¿Se pisan dos tareas activas? Sale de la superficie que declara cada contrato.
#
#   ./scripts/paralelismo.sh          la matriz de la guía §7
#   ./scripts/paralelismo.sh --duro   devuelve 1 si hay solapamiento
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 scripts/lib/paralelismo.py "$@"
