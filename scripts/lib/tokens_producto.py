"""
Lo que este proyecto le agrega al sistema de diseño entregado.

**El paquete de `negocio/linea-grafica/tokens/` no se toca.** Es lo que entregó
el equipo de diseño, se cita a sí mismo entre archivos, y `AGENTS.md` §1 dice
dónde vive lo que llega de afuera. Su generador corre tal cual y escribe en su
propia carpeta.

Lo que falta para poder usar shadcn está aquí, en un archivo aparte, **para que
se vea de un vistazo qué es del diseño y qué es nuestro**. Es la misma regla que
gobierna los tokens uno por uno: cada valor dice de dónde salió.

## Lo que sí se puede derivar: la barra lateral

shadcn pide ocho variables `--sidebar-*` y el sistema v0.5 no las mapea, pero
**sí tiene los tokens**: el backoffice lleva barra lateral y para ella existen
`semantic.color.internal.sidebar`, `.navigationSelected`, `.navigationText`,
`.rowHover` y `.rowText`. El mapeo apunta a esos. No se inventa ningún color.

## Lo que NO se deriva: las sombras

El sistema **no tiene ni un token de sombra**, y es una decisión, no un olvido:
`referencia-institucional.md` §4 dice *«no usar sombra como única forma de
reconocer campos… sin elevación decorativa»*.

shadcn las necesita para Popover, Dialog y DropdownMenu. Aquí no se inventa un
valor: `AGENTS.md` §3 lo prohíbe, y una sombra plausible se lee como una decisión
que alguien tomó. Se emiten en `none` y **queda escrito que eso es un hueco con
dueño**, porque un panel flotante sin sombra y con borde sutil puede ser difícil
de distinguir del fondo — y `contraste.md` ya avisa que *«los bordes decorativos
sutiles no identifican controles»*.

La pregunta que hay que hacer antes de usar el primer componente flotante:
**¿cómo se distingue una capa que flota, sin usar sombra?** Va a `vacios.md`.
"""

import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
DESTINO = RAIZ / "producto/src/producto/tokens/shadcn-completar.css"

# Cada línea: variable de shadcn → token semántico que ya existe en v0.5.
BARRA_LATERAL = {
    "sidebar": "internal.sidebar",
    "sidebar-foreground": "internal.navigationText",
    "sidebar-primary": "internal.navigationSelected",
    "sidebar-primary-foreground": "internal.navigationText",
    "sidebar-accent": "internal.rowHover",
    "sidebar-accent-foreground": "internal.rowText",
    "sidebar-border": "border.subtle",
    "sidebar-ring": "focus.ring",
}


def main():
    lineas = [
        "/* Lo que este proyecto le agrega al tema shadcn de v0.5.",
        " *",
        " * GENERADO por scripts/tokens.sh. No editar a mano.",
        " * Se importa DESPUÉS de participacion.css y de shadcn-theme.css.",
        " *",
        " * Las ocho de barra lateral apuntan a tokens que el sistema YA tiene",
        " * para el backoffice. No se inventó ningún color.",
        " *",
        " * Las sombras van en `none` a propósito: el sistema de diseño no tiene",
        " * ninguna, y eso es una decisión —«sin elevación decorativa»—, no un",
        " * olvido. Antes de usar el primer Popover o Dialog hay que decidir cómo",
        " * se distingue una capa que flota sin usar sombra. Está en vacios.md.",
        " */",
        ":root {",
    ]
    for var, token in BARRA_LATERAL.items():
        lineas.append(f"  --{var}: var(--pc-semantic-color-{token.replace('.', '-')});")
    lineas.append("")
    lineas.append("  /* HUECO CON DUEÑO — ver vacios.md, no es un valor decidido */")
    for var in ("shadow-2xs", "shadow-xs", "shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"):
        lineas.append(f"  --{var}: none;")
    lineas.append("}")

    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(f"  {len(BARRA_LATERAL)} variables de barra lateral · 8 sombras en none (hueco con dueño)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
