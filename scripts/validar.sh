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

# CHEQUEO: la copia de los tokens se desincronizó de su fuente
# Se ve fallar: cambia un color a mano en producto/src/producto/tokens/participacion.css
#
# Es la Q3 de vacios.md, cerrada. El generador reescribe su propio archivo de
# entrada y las copias se hacen con un guion; el día que alguien edite la copia,
# el JSON deja de ser la fuente y nadie se entera. Ahora sí se entera.
D=$(find negocio/linea-grafica/tokens -name "participacion.css" -not -path "*/producto/*" 2>/dev/null | head -1)
if [ -n "$D" ] && [ -d producto/src/producto/tokens ]; then
  DIFF=""
  for f in participacion.css shadcn-theme.css; do
    diff -q "$(dirname "$D")/$f" "producto/src/producto/tokens/$f" >/dev/null 2>&1 \
      || DIFF="$DIFF $f"
  done
  if [ -z "$DIFF" ]; then
    ok "la copia de los tokens está al día con su fuente"
  else
    mal "la copia de los tokens se editó a mano o quedó vieja:$DIFF"
    printf '          corre ./scripts/tokens.sh y mira el diff antes de aceptarlo\n'
  fi
else
  saltó "los tokens todavía no están en el producto"
fi

# CHEQUEO: la copia de las vistas del harness se desincronizó
# Se ve fallar: cambia una línea en producto/src/harness/vista-construccion/construccion.css
#
# Mismo defecto silencioso que el de los tokens: la copia se edita porque está
# más a mano, y la fuente —que es la que se cosecha a la línea base— se queda
# atrás sin que nadie se entere.
if [ -d producto/src/harness ]; then
  DIFF=""
  while IFS= read -r c; do
    o="harness/${c#producto/src/harness/}"
    [ -f "$o" ] || continue
    diff -q "$o" "$c" >/dev/null 2>&1 || DIFF="$DIFF $(basename "$c")"
  done < <(find producto/src/harness -type f 2>/dev/null)
  if [ -z "$DIFF" ]; then
    ok "la copia de las vistas del harness está al día"
  else
    mal "la copia de las vistas se editó a mano o quedó vieja:$DIFF"
    printf '          la fuente es harness/. Corre ./scripts/vistas-harness.sh\n'
  fi
else
  saltó "las vistas del harness todavía no están en el producto"
fi

# CHEQUEO: el catálogo territorial cuadra consigo mismo
# Se ve fallar: cámbiale el cod_departamento a una fila de municipios.csv
python3 scripts/lib/divipola_integro.py >/tmp/dv.$$ 2>&1 \
  && ok "$(head -1 /tmp/dv.$$)" \
  || { mal "el catálogo territorial no cuadra"; sed 's/^/          /' /tmp/dv.$$; }
rm -f /tmp/dv.$$

# CHEQUEO: las invariantes se cumplen en la BASE, no en los comentarios
# Se ve fallar: quítale a la base la restricción un_envio_un_aporte y vuelve a correr
#
# AGENTS.md §8: una invariante baja hasta donde se vuelve imposible, no hasta
# donde se valida. Esto no comprueba que el servidor las respete: comprueba que
# Postgres rechaza lo que debe rechazar.
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q supabase_db_participacion; then
  python3 producto/pruebas/invariantes.py >/tmp/inv.$$ 2>&1 \
    && ok "$(tail -1 /tmp/inv.$$)" \
    || { mal "hay invariantes que la base no hace imposibles"; sed 's/^/          /' /tmp/inv.$$; }
  rm -f /tmp/inv.$$

  # CHEQUEO: R1 y R2 contra los números que la especificación calculó a mano
  # Se ve fallar: quítale el `distinct` al numerador de participacion.indicadores
  #
  # Roto da 80% donde la especificación dice 70% — un número perfectamente
  # plausible. Por eso el caso se compara contra lo que alguien sacó con la
  # cabeza y no contra lo que devolvió la implementación (AGENTS.md §7).
  python3 producto/pruebas/conteo.py >/tmp/cnt.$$ 2>&1 \
    && ok "$(tail -1 /tmp/cnt.$$)" \
    || { mal "las cuentas no coinciden con la especificación"; sed 's/^/          /' /tmp/cnt.$$; }
  rm -f /tmp/cnt.$$
else
  saltó "la base local no está levantada (npm run db:arrancar)"
fi

# CHEQUEO: ninguna clase del producto se la inventó alguien
# Se ve fallar: poner className="pc-inventada" en cualquier pantalla
python3 scripts/lib/clases_inventadas.py . >/tmp/ci.$$ 2>&1 \
  && ok "todas las clases del producto existen en el sistema de diseño" \
  || { mal "hay clases que el navegador va a ignorar"; sed 's/^/          /' /tmp/ci.$$; }
rm -f /tmp/ci.$$

# CHEQUEO: ninguna hoja del sistema de diseño se queda sin importar
# Se ve fallar: quitar el `@import` de backoffice.css de producto/src/app/globals.css
python3 scripts/lib/hojas_importadas.py . >/tmp/hi.$$ 2>&1 \
  && ok "todas las hojas copiadas del sistema de diseño están importadas" \
  || { mal "hay hojas copiadas que nadie importa"; sed 's/^/          /' /tmp/hi.$$; }
rm -f /tmp/hi.$$

# CHEQUEO: ninguna tabla nace abierta
# Se ve fallar: `alter table participacion.aporte disable row level security`
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q supabase_db_participacion; then
  python3 scripts/lib/acceso_cerrado.py >/tmp/ac.$$ 2>&1 \
    && ok "$(cat /tmp/ac.$$)" \
    || { mal "hay tablas sin acceso a nivel de fila"; sed 's/^/          /' /tmp/ac.$$; }
  rm -f /tmp/ac.$$
fi

# CHEQUEO: las pruebas del producto contra la base local
# Se ve fallar: dale `select` a anon sobre una tabla de participacion
if [ -f producto/.env.local ] && docker ps --format '{{.Names}}' 2>/dev/null | grep -q supabase_db_participacion; then
  (cd producto && npm test) >/tmp/pr.$$ 2>&1 \
    && ok "$(grep -E '^. (pass|tests)' /tmp/pr.$$ | tr '\n' ' ' | sed 's/ℹ //g')" \
    || { mal "pruebas del producto en rojo"; grep -E '^✖|AssertionError|Error:' /tmp/pr.$$ | head -6 | sed 's/^/          /'; }
  rm -f /tmp/pr.$$
else
  saltó "no hay .env.local o la base no está levantada"
fi

# CHEQUEO: los recorridos en un navegador de verdad
# Se ve fallar: quítale la etiqueta al campo de relato en participar/formulario.tsx
#
# Es lo que AGENTS.md §12 pide para una pantalla: no se da por terminada con una
# afirmación. Lo que NO prueba es si se entiende — eso lo contesta una persona,
# y para eso existe /validar.
if [ -f producto/.env.local ] && [ -d "$HOME/Library/Caches/ms-playwright" ]; then
  (cd producto && npx playwright test --reporter=line) >/tmp/e2e.$$ 2>&1 \
    && ok "$(grep -oE '[0-9]+ passed.*' /tmp/e2e.$$ | tail -1) en navegador" \
    || { mal "recorridos en rojo"; grep -E '✘|Error:' /tmp/e2e.$$ | head -5 | sed 's/^/          /'; }
  rm -f /tmp/e2e.$$
else
  saltó "Playwright no está listo"
fi

# CHEQUEO: nada que se guarde se queda sin que alguien lo lea
# Se ve fallar: añadir una columna a `aporte` y no usarla en ninguna pantalla
#
# Salió de una ficha de revisión que mostraba cinco de las diez cosas que la
# persona había contestado. No falla nada cuando pasa: la columna existe, el
# `insert` funciona y las pruebas pasan. Solo que le pedimos su tiempo para nada.
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q supabase_db_participacion; then
  python3 scripts/lib/datos_huerfanos.py . >/tmp/dh.$$ 2>&1 \
    && ok "$(grep -o 'todo lo que.*' /tmp/dh.$$ | tail -1)" \
    || { mal "hay datos guardados que nadie lee"; grep FALLA /tmp/dh.$$ | head -4 | sed 's/^/          /'; }
  rm -f /tmp/dh.$$
fi

# CHEQUEO: el producto compila de verdad
# Se ve fallar: poner un <a href="/consola"> en vez de un <Link> en una pantalla
#
# `tsc` y los recorridos no lo atrapan: el servidor de desarrollo sirve páginas
# que la compilación rechaza. Dos veces seguidas el producto se dio por bueno y
# no compilaba —un `<a>` entre páginas y un `export` que Next no admite—, y se
# supo al ir a levantarlo.
if [ -d producto ]; then
  (cd producto && npm run build) >/tmp/bld.$$ 2>&1 \
    && ok "el producto compila" \
    || { mal "el producto no compila"; grep -A3 'Failed to compile' /tmp/bld.$$ | head -6 | sed 's/^/          /'; }
  rm -f /tmp/bld.$$
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
