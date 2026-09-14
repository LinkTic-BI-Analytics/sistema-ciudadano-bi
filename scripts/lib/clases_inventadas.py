"""Ninguna clase del producto se inventa: o está en el sistema de diseño, o no existe.

Tres veces en un día: `.pc-quote`, `.pc-read` y `.pc-options` se escribieron en
pantallas que se dieron por terminadas. Ninguna falló. Una clase inventada **no
rompe nada**: el navegador la ignora y el elemento sale sin estilo, así que la
pantalla se ve pobre pero funciona, y las pruebas —que buscan texto y botones—
pasan.

Lo delató una captura de pantalla de una persona usando el producto. Eso es
demasiado tarde.

El sistema de diseño es la autoridad (`harness/interfaz.md` I5) y sus hojas se
copian a `producto/src/producto/tokens/`. Si una clase con sus prefijos no está
ahí, o es un error de dedo o es una clase que hay que pedirle al diseño.
"""

import re
import sys
from pathlib import Path

PREFIJOS = ("pc-", "bo-")


def declaradas(tokens: Path) -> set[str]:
    css = "\n".join(f.read_text(encoding="utf-8") for f in tokens.glob("*.css"))
    return set(re.findall(r"\.((?:pc|bo)-[A-Za-z0-9_-]+)", css))


def usadas(raiz: Path) -> dict[str, set[str]]:
    encontradas: dict[str, set[str]] = {}
    for f in [*raiz.rglob("*.tsx"), *raiz.rglob("*.ts")]:
        if "node_modules" in f.parts:
            continue
        texto = f.read_text(encoding="utf-8")
        # `className="a b"` y `className={`a ${x}`}`. Lo interpolado se ignora:
        # no se puede saber sin ejecutar, y adivinarlo daría falsas alarmas.
        for bloque in re.findall(r'className=(?:"([^"]*)"|\{`([^`]*)`\})', texto):
            for clase in " ".join(bloque).split():
                if clase.startswith(PREFIJOS) and "${" not in clase:
                    encontradas.setdefault(clase, set()).add(str(f))
    return encontradas


def revisar(raiz: Path) -> list[str]:
    tokens = raiz / "producto/src/producto/tokens"
    fuente = raiz / "producto/src"
    if not tokens.is_dir() or not fuente.is_dir():
        return [f"no encontré {tokens} o {fuente}"]

    hay = declaradas(tokens)
    return [
        f"`{c}` se usa en {', '.join(sorted(d.split('producto/src/')[-1] for d in donde))} "
        f"y **no existe en el sistema de diseño**: el navegador la ignora y el elemento "
        f"sale sin estilo, sin que nada falle"
        for c, donde in sorted(usadas(fuente).items())
        if c not in hay
    ]


def main() -> int:
    raiz = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    fallos = revisar(raiz)
    for f in fallos:
        print(f"  FALLA {f}")
    if fallos:
        print(f"\n{len(fallos)} clases inventadas. O se corrigen, o se le piden al sistema de diseño.")
        return 1
    print("  ok    todas las clases del producto existen en el sistema de diseño")
    return 0


if __name__ == "__main__":
    sys.exit(main())
