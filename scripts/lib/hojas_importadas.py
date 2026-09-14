"""Toda hoja copiada del sistema de diseño tiene que estar importada.

`scripts/tokens.sh` copia seis archivos CSS a `producto/src/producto/tokens/`.
Copiarlos no los aplica: hay que importarlos desde `globals.css`. **A
`backoffice.css` se le olvidó**, y la consola entera se renderizó sin estilos
durante toda su construcción sin que nada fallara.

Por qué nada falló: una pantalla sin CSS muestra de más, no de menos. El diseño
alterna tarjetas y tabla en 36rem; sin la hoja, los dos aparecían. Las pruebas
que buscaban «el primer enlace» lo encontraban.

Un archivo que se copia y no se usa es una hoja que alguien va a creer aplicada.
"""

import re
import sys
from pathlib import Path


def revisar(raiz: Path):
    tokens = raiz / "producto/src/producto/tokens"
    entrada = raiz / "producto/src/app/globals.css"
    if not tokens.is_dir() or not entrada.is_file():
        return [f"no encontré {tokens} o {entrada}"]

    importadas = set(re.findall(r'@import\s+"[^"]*?([\w.-]+\.css)"', entrada.read_text(encoding="utf-8")))
    faltan = sorted(f.name for f in tokens.glob("*.css") if f.name not in importadas)
    return [
        f"`{n}` está copiada en producto/src/producto/tokens/ y **nadie la importa**: "
        f"lo que estilice se renderiza sin estilos y ninguna prueba lo dice"
        for n in faltan
    ]


def main():
    raiz = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    fallos = revisar(raiz)
    for f in fallos:
        print(f"  FALLA {f}")
    if fallos:
        print(f"\n{len(fallos)} hojas copiadas sin importar. Se importan en globals.css.")
        return 1
    print("  ok    todas las hojas copiadas están importadas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
