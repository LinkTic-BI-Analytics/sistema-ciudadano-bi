#!/usr/bin/env bash
# ¿La línea base sigue limpia?
#
# Se corre antes de subir una cosecha. La regla es "vuelve la forma, nunca el
# contenido", y lo que se cuela no se ve leyendo: se ve buscando.
#
# Un chequeo que hay que acordarse de correr no es un chequeo, así que este
# no pregunta nada y devuelve 1 si encuentra algo.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 2
malo=0
decir() { printf '  %s\n' "$1"; malo=1; }

echo "Archivos que solo existen en un negocio corrido"
for f in negocio/dominio.md negocio/especificacion.md negocio/vacios.md \
         negocio/bitacora.md negocio/lectura-documental.md negocio/.grafo.json \
         negocio/autorizacion-de-salida.md .env; do
  [ -e "$f" ] && decir "existe $f — es de un negocio, no de la base"
done
[ -d mvp ] && decir "existe mvp/ — el instrumento se construye en la arena"

echo "Insumos y respuestas del cliente"
while read -r f; do decir "quedó $f"; done < <(
  find negocio/insumos negocio/preguntas negocio/linea-grafica -type f 2>/dev/null \
    | grep -v -e 'README\.md$' -e '\.gitkeep$')

# Una línea sin terminar EMPIEZA por "> ➤". Los comandos hablan de esas líneas
# entre comillas invertidas y eso no es lo mismo — por eso se ancla al margen.
echo "Secciones sin terminar fuera de las plantillas"
while read -r f; do decir "$f tiene líneas sin terminar"; done < <(
  grep -rlE '^[[:space:]]*> ➤' --include='*.md' . 2>/dev/null \
    | grep -v -e '^\./plantillas/' -e '^\./ejemplo/' -e '^\./negocio/')

echo "Contradicciones: una regla definida dos veces"
while read -r r; do decir "$r está definida más de una vez"; done < <(
  grep -rh '^## I[0-9]' harness/*.md 2>/dev/null | sed 's/^\(## I[0-9]*\) .*/\1/' \
    | sort | uniq -d)

echo
if [ "$malo" -eq 0 ]; then
  echo "La base está limpia."
else
  echo "La base NO está limpia. Lo de arriba es de un negocio, no de la plantilla."
fi
exit "$malo"
