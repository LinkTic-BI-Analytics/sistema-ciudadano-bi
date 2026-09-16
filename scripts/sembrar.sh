#!/usr/bin/env bash
# Siembra la base local: un proceso de prueba y el catálogo territorial.
#
# El proceso se inventa a propósito y lo dice en su nombre — es la excepción de
# `AGENTS.md` §3: un escenario para poder mirar, no datos del negocio.
# El catálogo no se inventa: sale de producto/datos/divipola/.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Siembra"

# El depósito de las grabaciones, si no está.
#
# Está declarado en `producto/supabase/config.toml`, que es donde va —§9: un
# cambio que no está en un archivo es un cambio que el siguiente entorno no
# tiene—. Pero el CLI solo aplica esa sección **al crear el volumen**, y este
# proyecto ya tiene uno: el depósito se había creado a mano y se perdió al
# recrear el contenedor. Seis pruebas se cayeron con «Bucket not found» y
# ninguna decía que faltara un depósito, porque el error llega del
# almacenamiento y no del esquema.
#
# Esto es idempotente: si ya está, el almacenamiento contesta 409 y seguimos.
if [ -f producto/.env.local ]; then
  URL=$(grep -m1 '^NEXT_PUBLIC_SUPABASE_URL=' producto/.env.local | cut -d= -f2-)
  LLAVE=$(grep -m1 '^SUPABASE_SECRET_KEY=' producto/.env.local | cut -d= -f2-)
  if [ -n "$URL" ] && [ -n "$LLAVE" ]; then
    # **El código va en el cuerpo, no en el estado.** Cuando el depósito ya
    # existe, el almacenamiento contesta HTTP 400 con `BucketAlreadyExists`
    # dentro; mirar solo el estado hacía que «ya estaba» se reportara como
    # «no se pudo crear», que es una alarma falsa en cada siembra.
    RESPUESTA=$(curl -s -X POST "$URL/storage/v1/bucket" \
      -H "apikey: $LLAVE" -H "Authorization: Bearer $LLAVE" -H 'Content-Type: application/json' \
      -d '{"id":"grabaciones","name":"grabaciones","public":false,"file_size_limit":26214400}' || echo '{}')
    case "$RESPUESTA" in
      *BucketAlreadyExists*) echo "  depósito     grabaciones — ya estaba" ;;
      *'"name":"grabaciones"'*) echo "  depósito     grabaciones — creado" ;;
      *) echo "  depósito     grabaciones — NO se pudo crear; la voz va a fallar: $RESPUESTA" ;;
    esac
  fi
fi

exec python3 scripts/lib/sembrar.py
