#!/usr/bin/env bash
# Los archivos de marca que el producto sirve al navegador.
#
# Misma relación que `tokens.sh`: la fuente es lo que entregó el equipo de UX en
# `negocio/linea-grafica/`, y `producto/public/marca/` es una **copia derivada**.
# Next solo sirve lo que está bajo `public/`, y la entrega cruda no puede vivir
# ahí: son 10 MB de documentación y capturas que no tiene por qué descargar
# nadie que abra el producto.
#
# **Se copia solo lo que alguna pantalla usa.** Es la misma regla que gobierna
# los tokens —«un token que nadie usa no existe», `interfaz.md` I5— aplicada a
# los archivos: una carpeta con los once logos del ecosistema se lee como que el
# producto los usa todos, y usa uno.
#
# Lo que NO se copia, y por qué está escrito aquí y no en la cabeza de nadie:
#
#   · `escudo-colombia.png` y `logo-gobierno-blanco.png` — son el escudo
#     nacional y la marca del Gobierno. `direccion-visual.md` del sistema 0.5 lo
#     dice con todas las letras: «No se inventa un escudo, un sello, una entidad
#     receptora real ni una campaña de gobierno… La integración del encabezado,
#     pie y activos institucionales deberá seguir la versión del manual que
#     confirme el cliente». Nadie ha confirmado ese manual todavía: es la `Q34`
#     de `negocio/vacios.md`. El día que se confirme, se añaden aquí.
#
#   · `logo-defensores-*`, `logo-banco-talentos-*`, `icono-*` — son marcas de
#     **otras** campañas del mismo ecosistema. Ponerlas en esta plataforma le
#     atribuiría a un programa de participación del Plan Nacional de Desarrollo
#     una autoría que no tiene.
#
# La bandera sí: es un símbolo nacional, no un sello institucional, y es de
# donde sale la paleta entera del sistema.
#
# ## Por qué esto convierte en vez de copiar
#
# El PNG entregado pesa **1,5 MB**. `AGENTS.md` §2 dice que aquí no se optimiza
# rendimiento, y es cierto — pero esto no es rendimiento: es el recibo de datos
# de quien va a contar que lleva dos meses sin agua. La propia portada tiene
# escrito el caso: *«la persona entra una vez, con datos caros, y puede no
# volver nunca»*. En JPEG al 70 % son **144 KB**, y va debajo de un degradado
# navy que se come cualquier artefacto de compresión.
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGEN=negocio/linea-grafica/tokens/patria-milagro-v1/assets
DESTINO=producto/public/marca

if [ ! -d "$ORIGEN" ]; then
  echo "No está la entrega de marca en $ORIGEN."
  exit 1
fi

mkdir -p "$DESTINO"
echo "Marca"

# Una línea por archivo que alguna pantalla consume: origen → destino servido.
# Si añades uno, di dónde se usa: un archivo servido que nadie pide es peso que
# paga quien tiene datos caros.
#
#   fondo-bandera-dark.png → fondo-bandera.jpg   el hero de la portada (.pc-hero)
FUENTE="$ORIGEN/fondo-bandera-dark.png"
SERVIDO="$DESTINO/fondo-bandera.jpg"

if [ ! -f "$FUENTE" ]; then
  echo "  FALTA        $(basename "$FUENTE") — no está en la entrega"
  exit 1
fi

if [ "$FUENTE" -nt "$SERVIDO" ] || [ ! -f "$SERVIDO" ]; then
  if command -v sips >/dev/null 2>&1; then
    sips -s format jpeg -s formatOptions 70 --resampleWidth 1920 \
      "$FUENTE" --out "$SERVIDO" >/dev/null
    echo "  convertido   $(basename "$SERVIDO") · $(du -h "$SERVIDO" | cut -f1) (del PNG de $(du -h "$FUENTE" | cut -f1))"
  elif [ -f "$SERVIDO" ]; then
    echo "  sin sips     $(basename "$SERVIDO") se queda como está; no se pudo regenerar"
  else
    echo "  FALTA        sips no está y no hay $(basename "$SERVIDO") que servir."
    echo "               Convierte a mano el PNG de $ORIGEN a JPEG 1920 px de ancho."
    exit 1
  fi
else
  echo "  ya al día    $(basename "$SERVIDO")"
fi

# Lo que sobre en el destino se dice, no se borra: puede ser algo que alguien
# puso a propósito y hay que preguntarle, no algo que este guion deba limpiar.
for f in "$DESTINO"/*; do
  [ -e "$f" ] || continue
  [ "$f" = "$SERVIDO" ] && continue
  echo "  sobra        $(basename "$f") — está servido y este guion no lo puso"
done
