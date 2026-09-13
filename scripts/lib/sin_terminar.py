"""
Documentos que quedaron con instrucciones de plantilla adentro.

`AGENTS.md` §7 lo pone como primer criterio de terminado, y `plantillas/README.md`
explica por qué duele: un documento a medio llenar con las instrucciones todavía
puestas **se lee como si estuviera listo**, y alguien va a decidir con una sección
que en realidad nadie llenó.

Dos excepciones, y las dos son declaradas en vez de inventadas:

  · Un `README.md` que explica qué va en una carpeta vacía es andamio, no un
    documento del negocio. Sus instrucciones son su contenido.

  · Una carpeta con un `ESTADO.md` se declaró sin terminar **a propósito**, y ese
    archivo dice qué falta y qué la va a reemplazar. Sus huecos se cuentan y se
    muestran, pero no hacen fallar el chequeo.

La segunda excepción es la que mantiene útil a este chequeo. Un chequeo
permanentemente rojo se deja de mirar, y eso es peor que no tenerlo: en el
proyecto de origen hubo veintidós comprobaciones en verde durante meses sin poder
fallar ni una.
"""

import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
MARCA = "> ➤"
DONDE = ("negocio", "construccion", "entregable", "decisiones")


def declarada(f):
    """La carpeta más cercana que se declaró sin terminar, o None."""
    for d in f.parents:
        if (d / "ESTADO.md").exists():
            return d
        if d == RAIZ:
            break
    return None


def main():
    malos, declarados = [], {}
    for base in DONDE:
        d0 = RAIZ / base
        if not d0.is_dir():
            continue
        for f in sorted(d0.rglob("*.md")):
            if MARCA not in f.read_text(encoding="utf-8"):
                continue
            if f.name in ("README.md", "ESTADO.md"):
                continue
            d = declarada(f)
            if d:
                declarados.setdefault(d, []).append(f)
            else:
                malos.append(f)

    for d, fs in sorted(declarados.items()):
        rel = d.relative_to(RAIZ)
        print(f"{len(fs)} huecos declarados en {rel}/ — ver {rel}/ESTADO.md")
    for m in malos:
        print(f"SIN TERMINAR: {m.relative_to(RAIZ)}")
    return 1 if malos else 0


if __name__ == "__main__":
    raise SystemExit(main())
