#!/usr/bin/env bash
# Todos los chequeos, de una. Devuelve 1 si alguno falla.
#
# `AGENTS.md` §12 dice que ninguna casilla se marca con una afirmación: se marca
# con algo que se corrió. Esto es lo que se corre.
#
#   ./scripts/validar.sh          todos
#   ./scripts/validar.sh --lista  qué chequeos hay y qué cubre cada uno
#
# **Un chequeo que no se ha visto fallar no es un chequeo.** Cada uno de estos
# tiene abajo, en su comentario, cómo hacerlo fallar a propósito. Si al agregar
# uno nuevo no puedes escribir esa línea, todavía no es un chequeo.
set -uo pipefail
cd "$(dirname "$0")/.."

FALLOS=0
ok()   { printf '  \033[32mok\033[0m    %s\n' "$1"; }
mal()  { printf '  \033[31mfalla\033[0m %s\n' "$1"; FALLOS=$((FALLOS+1)); }
saltó(){ printf '  \033[33m—\033[0m     %s\n' "$1"; }

if [ "${1:-}" = "--lista" ]; then
  sed -n 's/^# *CHEQUEO: //p' "$0"
  exit 0
fi

echo "Chequeos"

# CHEQUEO: instrucciones de plantilla olvidadas dentro de un documento del negocio
# Se ve fallar: copia una línea que empiece con "> ➤" a negocio/vision.md
python3 scripts/lib/sin_terminar.py >/tmp/st.$$ 2>&1 \
  && ok "ningún documento del negocio quedó con instrucciones adentro" \
  || mal "documentos sin terminar"
sed 's/^/          /' /tmp/st.$$; rm -f /tmp/st.$$

# CHEQUEO: las plantillas sí conservan sus instrucciones
# Se ve fallar: borra las líneas "> ➤" de plantillas/tarea.md
VACIAS=$(for f in plantillas/*.md; do
           [ "$f" = "plantillas/README.md" ] && continue
           grep -q "^> ➤" "$f" || echo "$f"
         done)
if [ -z "$VACIAS" ]; then
  ok "todas las plantillas conservan sus instrucciones"
else
  mal "plantillas sin instrucciones (¿alguien las llenó aquí?):"
  echo "$VACIAS" | sed 's/^/          /'
fi

# CHEQUEO: enlaces internos que no resuelven
# Se ve fallar: cambia el DESTINO de un enlace de AGENTS.md a un archivo que no existe
#               (el destino, no el texto entre comillas invertidas)
python3 scripts/lib/enlaces.py >/tmp/en.$$ 2>&1 \
  && ok "todos los enlaces internos resuelven" \
  || { mal "hay enlaces rotos"; sed 's/^/          /' /tmp/en.$$; }
rm -f /tmp/en.$$

# CHEQUEO: el tablero de construcción no se contradice a sí mismo
# Se ve fallar: pon una tarea en "listo" con una dependencia sin terminar
if [ -f construccion/hoja-de-ruta.md ]; then
  ./scripts/construccion.sh --revisar >/tmp/val.$$ 2>&1 \
    && ok "el tablero no se contradice" \
    || { mal "el tablero se contradice"; sed 's/^/          /' /tmp/val.$$; }
  rm -f /tmp/val.$$
else
  saltó "no hay tablero de construcción todavía"
fi

# CHEQUEO: dos tareas activas que escriben el mismo archivo
# Se ve fallar: dale a dos contratos sin dependencia entre sí la misma ruta en "Modificar"
if [ -d construccion/tareas ]; then
  ./scripts/paralelismo.sh --duro >/tmp/par.$$ 2>&1 \
    && ok "ninguna pareja de tareas activas se pisa" \
    || { mal "dos tareas activas se pisan"; sed 's/^/          /' /tmp/par.$$; }
  rm -f /tmp/par.$$
else
  saltó "no hay contratos de tarea todavía"
fi

# CHEQUEO: el contraste de los tokens, que es una compuerta y no una recomendación
# Se ve fallar: bájale la luminosidad a un color de texto en participacion.tokens.json
GEN=negocio/linea-grafica/tokens/sistema-diseno-participacion-v0.5/generar_tokens.py
if [ -f "$GEN" ]; then
  (cd "$(dirname "$GEN")" && python3 generar_tokens.py) >/tmp/tok.$$ 2>&1 \
    && ok "$(sed -n '1p' /tmp/tok.$$)" \
    || { mal "el contraste de los tokens no pasa"; sed 's/^/          /' /tmp/tok.$$; }
  rm -f /tmp/tok.$$
else
  saltó "no hay sistema de tokens"
fi

# CHEQUEO: los tipos del producto
# Se ve fallar: indexa un arreglo sin comprobar, con noUncheckedIndexedAccess puesto
if [ -f producto/package.json ]; then
  (cd producto && npx --no-install tsc --noEmit) >/tmp/tsc.$$ 2>&1 \
    && ok "los tipos del producto cuadran" \
    || { mal "hay errores de tipo"; sed 's/^/          /' /tmp/tsc.$$; }
  rm -f /tmp/tsc.$$
else
  saltó "el producto todavía no existe (T012)"
fi

echo
if [ "$FALLOS" -eq 0 ]; then
  echo "Todo pasa."
else
  echo "$FALLOS chequeos fallan."
fi
exit $([ "$FALLOS" -eq 0 ] && echo 0 || echo 1)
