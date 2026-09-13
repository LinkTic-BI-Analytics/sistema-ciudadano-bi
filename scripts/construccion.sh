#!/usr/bin/env bash
# El estado de la construcción, derivado de los archivos.
#
#   ./scripts/construccion.sh             el reporte en los ocho puntos de la guía §10
#   ./scripts/construccion.sh --agentes   solo qué está andando ahora mismo
#   ./scripts/construccion.sh --revisar   solo las contradicciones; devuelve 1 si hay
#   ./scripts/construccion.sh --json      el estado entero, para quien lo consuma
#
# Escribe `construccion/.estado.json` y el bloque derivado del encabezado de la
# hoja de ruta. No toca nada más: los estados de las tareas los cambia una
# persona, con evidencia.
set -euo pipefail
cd "$(dirname "$0")/.."
exec python3 scripts/lib/consultar_construccion.py "$@"
