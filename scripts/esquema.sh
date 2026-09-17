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
#
# **El orden lo manda `ORDEN`, no el nombre del archivo.** Concatenaba en orden
# alfabético, y `03_aporte.sql` tiene claves foráneas a `encuentro` y `enlace`,
# que se crean en `14_convocatoria.sql` y `16_enlace.sql`. La migración que
# salía no se podía aplicar sobre una base vacía —`relation
# "participacion.enlace" does not exist`— y nadie se enteró en dos semanas,
# porque la base local se fue construyendo archivo por archivo a medida que se
# escribían y nunca se rehizo desde cero. Lo vio el primer `supabase db reset`.
#
# Los nombres no se renumeraron a propósito: `construccion/progreso/` cita
# `14_convocatoria.sql` y `16_enlace.sql` con la fecha en que se escribieron, y
# un registro histórico que apunta a un archivo que ya no existe es una mentira
# barata. El orden de creación de las tablas no es el orden en que se pensaron.
set -euo pipefail
cd "$(dirname "$0")/.."
# El harness nació con el MVP en `mvp/`. Cuando lo que hay es el producto formal,
# vive en `producto/`. Se usa el que exista; si están los dos, manda el producto.
if [ -d producto/supabase/schemas ]; then cd producto
elif [ -d mvp/supabase/schemas ]; then cd mvp
else echo "No hay supabase/schemas ni en producto/ ni en mvp/"; exit 1; fi
S=supabase/schemas
M=supabase/migrations
[ -d "$S" ] || { echo "No hay $S"; exit 1; }
mkdir -p "$M"

# El orden en que se crean las tablas: primero las que otras referencian.
ORDEN="01_pertenencia.sql 02_territorio.sql 02b_grabacion.sql 14_convocatoria.sql
       16_enlace.sql 03_aporte.sql 04_expediente.sql 05_auditoria.sql
       06_identidad.sql 07_conteo.sql 08_comprobante.sql 10_estados.sql
       11_gestion.sql 12_alerta.sql 13_prioridad.sql 99_acceso.sql"
# En una línea: los saltos de arriba son para leerlo, y `case` compara contra
# espacios. Sin esto, el primero de cada línea no coincidía con nada.
# shellcheck disable=SC2086
ORDEN=$(echo $ORDEN)

# **Ningún archivo se queda fuera en silencio.** Un esquema nuevo que no esté en
# `ORDEN` no se puede concatenar al final y ya: si algo lo referencia, vuelve el
# mismo fallo. Así que esto para y obliga a decidir dónde va, que es la decisión
# que importa.
for f in "$S"/*.sql; do
  b=$(basename "$f")
  case " $ORDEN " in
    *" $b "*) ;;
    *) echo "  $b no está en ORDEN, dentro de scripts/esquema.sh."
       echo "  Ponlo donde le toque: después de las tablas que referencia."
       exit 1 ;;
  esac
done

rm -f "$M"/*_esquema.sql
salida="$M/$(date -u +%Y%m%d%H%M%S)_esquema.sql"
{
  echo "-- GENERADO por scripts/esquema.sh desde supabase/schemas/."
  echo "-- No se edita a mano: se edita el esquema y se vuelve a correr."
  echo "-- El orden es el de \`ORDEN\` en el guion, no el de los nombres: una"
  echo "-- tabla se crea después de las que referencia."
  echo
  for b in $ORDEN; do
    f="$S/$b"
    [ -f "$f" ] || { echo "  falta $b, que ORDEN espera en $S" >&2; exit 1; }
    echo "-- ═══ $b ═══"
    cat "$f"; echo
  done
} > "$salida"
echo "  $salida"
echo "  $(grep -c 'create ' "$salida") sentencias create"
