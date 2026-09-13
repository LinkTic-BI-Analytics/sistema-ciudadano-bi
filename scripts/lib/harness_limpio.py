"""
¿Se coló un negocio dentro del harness?

`metodo/cosecha.md` lo cuenta como algo que ya pasó: *«la vista de módulos subió
una vez con los cuatro módulos de Product Hunt adentro»*. La regla es **vuelve la
forma, nunca el contenido**.

El chequeo que se escribió después de aquel incidente miraba `negocio/` y no
miraba aquí, así que no lo habría vuelto a atrapar. Se descubrió al clonar la
línea base para un negocio nuevo y encontrar adentro un proyecto entero ajeno,
con siete fronteras de integración reales.

Lo que se comprueba es concreto: en la línea base, las tres listas de
`modulos.ts` van **vacías**, y el nombre del proyecto va con su marcador. Los
tipos y los comentarios sí viajan: son la forma.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
ARCHIVO = RAIZ / "harness/vista-modulos/modulos.ts"
LISTAS = ("roles", "fronteras", "modulos")


def main():
    if not ARCHIVO.exists():
        return 0
    t = ARCHIVO.read_text(encoding="utf-8")
    sucio = False

    for nombre in LISTAS:
        m = re.search(rf"export const {nombre}[^=]*= \[(.*?)\n\];", t, re.S)
        if m and re.search(r"^\s*\{", m.group(1), re.M):
            print(f"  `{nombre}` trae entradas adentro — eso es de un negocio, no de la base")
            sucio = True

    cabeza = t.split("export type Rol")[0]
    if re.search(r'nombre:\s*"(?!<)', cabeza):
        print("  `proyecto.nombre` tiene un nombre real; en la base va el marcador")
        sucio = True

    return 1 if sucio else 0


if __name__ == "__main__":
    sys.exit(main())
