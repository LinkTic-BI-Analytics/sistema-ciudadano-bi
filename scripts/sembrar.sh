#!/usr/bin/env bash
# Siembra la base local: un proceso de prueba y el catálogo territorial.
#
# El proceso se inventa a propósito y lo dice en su nombre — es la excepción de
# `AGENTS.md` §3: un escenario para poder mirar, no datos del negocio.
# El catálogo no se inventa: sale de producto/datos/divipola/.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Siembra"
exec python3 scripts/lib/sembrar.py
