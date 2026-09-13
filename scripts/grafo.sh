#!/usr/bin/env bash
# El grafo del negocio: extraerlo, consultarlo, o ver la telemetría.
#
#   ./scripts/grafo.sh                  telemetría: en qué vamos y qué falta
#   ./scripts/grafo.sh R3               todo lo que toca R3, y nada más
#   ./scripts/grafo.sh --frente 2       todo lo que hace falta para el frente 2
#   ./scripts/grafo.sh --json           el grafo entero, para quien lo consuma
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 scripts/lib/consultar_grafo.py "$@"
