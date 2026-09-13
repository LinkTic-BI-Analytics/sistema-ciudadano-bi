#!/usr/bin/env bash
# Genera la migración a partir de los esquemas declarativos.
#
# `supabase db diff` necesita una base sombra que en esta máquina no arranca con
# el stack recortado. Como el esquema declarativo es la fuente de verdad
# (ADR 0006), la migración se deriva de él concatenando: es lo mismo que el diff
# produciría contra una base vacía.
#
# **Se corre cada vez que cambie un archivo de schemas/.** Un chequeo que hay que
# acordarse de correr no es un chequeo, así que esto además lo reaplica.
set -euo pipefail
cd "$(dirname "$0")/../mvp"
S=supabase/schemas
M=supabase/migrations
[ -d "$S" ] || { echo "No hay $S"; exit 1; }
mkdir -p "$M"
rm -f "$M"/*_esquema.sql
salida="$M/$(date -u +%Y%m%d%H%M%S)_esquema.sql"
{
  echo "-- GENERADO por scripts/esquema.sh desde supabase/schemas/."
  echo "-- No se edita a mano: se edita el esquema y se vuelve a correr."
  echo
  for f in "$S"/*.sql; do
    echo "-- ═══ $(basename "$f") ═══"
    cat "$f"; echo
  done
} > "$salida"
echo "  $salida"
echo "  $(grep -c 'create ' "$salida") sentencias create"
