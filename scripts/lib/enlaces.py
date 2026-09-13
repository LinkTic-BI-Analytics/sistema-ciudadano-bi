"""
Enlaces internos que no resuelven.

`AGENTS.md` §7 lo pone entre los criterios de terminado de un documento, y la
razón es concreta: un enlace roto se descubre cuando alguien lo sigue, que es
justo el momento en que necesitaba lo que había al otro lado.

**Qué NO se mira, y por qué cada uno.** La primera versión de este chequeo
excluía `node_modules/` comparando el principio de la ruta, así que atrapaba el
de la raíz y se metía entero en `producto/node_modules/`: seiscientos enlaces
rotos de los README de terceros, que no son nuestros ni los podemos arreglar.
Ahora se compara por segmento de ruta, que es lo que se quería decir.

  node_modules, .next, .agents   de terceros; sus enlaces no son nuestro problema
  ejemplo/                       es otro negocio, completo y terminado
  negocio/linea-grafica/         es el paquete del cliente, llega como llega

Los enlaces con `<marcador>` tampoco cuentan: son de una plantilla sin llenar, y
eso lo atrapa `sin_terminar.py`, que es el chequeo al que le toca.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FUERA_SEGMENTO = {"node_modules", ".next", ".agents", ".git", ".superpowers"}
FUERA_PREFIJO = ("ejemplo", "negocio/linea-grafica")
ENLACE = re.compile(r"\]\(([^)#]+?)(?:#[^)]*)?\)")


def se_mira(f):
    partes = f.relative_to(RAIZ).parts
    if FUERA_SEGMENTO & set(partes):
        return False
    rel = "/".join(partes)
    return not rel.startswith(FUERA_PREFIJO)


def main():
    rotos = []
    for f in sorted(RAIZ.rglob("*.md")):
        if not se_mira(f):
            continue
        for destino in ENLACE.findall(f.read_text(encoding="utf-8")):
            if destino.startswith(("http", "mailto:", "<")):
                continue
            if not (f.parent / destino).exists():
                rotos.append(f"{f.relative_to(RAIZ)}: {destino}")
    for r in rotos:
        print(r)
    return 1 if rotos else 0


if __name__ == "__main__":
    sys.exit(main())
