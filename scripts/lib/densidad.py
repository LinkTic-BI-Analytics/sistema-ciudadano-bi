"""Cuánta información hay cargada, y sobre qué.

Existe porque "¿por dónde arrancamos?" se contesta con una opinión cuando no
hay con qué medirla. Esto no decide: cuenta. Quién arranca lo escoge la
persona, y para escoger necesita ver de qué hay más escrito.

Cuenta dos cosas por región de documento:

  palabras   cuánto se escribió sobre eso
  epígrafes  cuántas cosas distintas se nombran (pantallas, transacciones)

Las dos hacen falta y dicen cosas distintas. Mucha palabra y pocos epígrafes
es una explicación; muchos epígrafes y poca palabra es un índice sin contenido.
"""

import re
import sys
from pathlib import Path

EPIGRAFE = re.compile(r"^\s{0,6}\d+\.\d+\.?\s+[A-ZÁÉÍÓÚÑ]")
NIVEL1 = re.compile(r"^\s{0,6}(\d+)\.?\s+([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 \-/,.]{5,})\s*$")


def secciones(lineas, desde=0):
    """Los arranques de sección de primer nivel, en el cuerpo y no en el índice.

    El índice repite los mismos títulos con puntos suspensivos detrás. Se
    reconoce porque la línea trae relleno de puntos; el cuerpo no.
    """
    vistos = {}
    for n, l in enumerate(lineas[desde:], start=desde):
        if "...." in l:
            continue
        m = NIVEL1.match(l)
        if m:
            nombre = " ".join(m.group(2).split())
            vistos.setdefault(nombre, n)
    return sorted((n, k) for k, n in vistos.items())


def medir(ruta):
    lineas = Path(ruta).read_text(encoding="utf-8").split("\n")
    # El índice ocupa el principio. Se salta buscando dónde dejan de aparecer
    # líneas con relleno de puntos.
    ultimo_indice = max(
        (n for n, l in enumerate(lineas[: len(lineas) // 2]) if "...." in l),
        default=0,
    )
    marcas = secciones(lineas, desde=ultimo_indice + 1)
    if not marcas:
        return [(Path(ruta).stem[:40], len(" ".join(lineas).split()), 0)]

    filas = []
    for i, (ini, nombre) in enumerate(marcas):
        fin = marcas[i + 1][0] if i + 1 < len(marcas) else len(lineas)
        tramo = lineas[ini:fin]
        palabras = len(" ".join(tramo).split())
        epig = sum(1 for l in tramo if EPIGRAFE.match(l))
        if palabras >= 300:
            filas.append((nombre, palabras, epig))
    return filas


def barra(v, mx, ancho=24):
    return "█" * max(1, round(ancho * v / mx)) if v else ""


def main(rutas):
    todo = []
    for r in rutas:
        for nombre, pal, ep in medir(r):
            todo.append((Path(r).stem, nombre, pal, ep))
    if not todo:
        print("No hay nada extraído todavía. Corre ./scripts/leer-insumos.sh")
        return 1

    mx = max(f[2] for f in todo)
    doc_actual = None
    for doc, nombre, pal, ep in sorted(todo, key=lambda f: (f[0], -f[2])):
        if doc != doc_actual:
            print(f"\n  {doc[:64]}")
            print(f"  {'región':<34}{'palabras':>9}{'epígrafes':>11}")
            doc_actual = doc
        print(f"  {nombre[:33]:<34}{pal:>9}{ep:>11}  {barra(pal, mx)}")

    print(f"\n  Total: {sum(f[2] for f in todo):,} palabras en {len(todo)} regiones."
          .replace(",", "."))
    print("  Esto cuenta, no decide. Quién arranca lo escoge la persona.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
