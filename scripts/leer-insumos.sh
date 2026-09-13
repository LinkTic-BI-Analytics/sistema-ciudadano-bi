#!/usr/bin/env bash
# Prepara los documentos de negocio/insumos/ para que /leer pueda trabajarlos.
#
#   ./scripts/leer-insumos.sh                  → todo local, no sale nada de la máquina
#   ./scripts/leer-insumos.sh --motor mistral  → usa la API de Mistral, con autorización
#
# Se puede correr las veces que haga falta: solo prepara lo que falte.
set -euo pipefail
cd "$(dirname "$0")/.."

VENV=".venv-insumos"
BIN="scripts/lib/.bin"

# 1 · Las librerías para leer PDF. Van en un entorno propio para no tocar el
#     Python del sistema.
if [ ! -d "$VENV" ]; then
  echo "Preparando el entorno (una sola vez)…"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q --upgrade pip
  "$VENV/bin/pip" install -q pypdf pillow
fi

# 2 · El OCR local. Usa el framework Vision de macOS: no manda nada a ninguna
#     parte y no cuesta. Se compila una vez.
mkdir -p "$BIN"
if [ ! -x "$BIN/ocr-local" ] || [ scripts/lib/ocr-local.swift -nt "$BIN/ocr-local" ]; then
  if command -v swiftc >/dev/null 2>&1; then
    echo "Compilando el OCR local…"
    swiftc -O -o "$BIN/ocr-local" scripts/lib/ocr-local.swift
  else
    echo "AVISO: no hay swiftc. Sin él no se pueden leer los documentos escaneados."
    echo "       Se instala con las Command Line Tools: xcode-select --install"
  fi
fi

# 3 · La llave de Mistral, si la hay. El .env está fuera de git.
if [ -f .env ]; then set -a; . ./.env; set +a; fi

exec "$VENV/bin/python" scripts/lib/leer_insumos.py "$@"
