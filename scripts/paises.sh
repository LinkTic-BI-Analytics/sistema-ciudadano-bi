#!/usr/bin/env bash
# El catálogo de países, listo para sembrar.
#
#   ./scripts/paises.sh    regenera producto/datos/paises/paises.csv
#
# No baja nada: los códigos son ISO 3166-1 alpha-2 —escritos en el guion, que es
# un estándar publicado— y los nombres salen del CLDR que trae Node. Por eso la
# versión que se anota es la del CLDR y no la fecha en que alguien lo corrió.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Países"
exec node scripts/lib/paises.ts
