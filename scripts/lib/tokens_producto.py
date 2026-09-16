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

## Las sombras: la `Q1`, cerrada

Hasta la entrega Patria el sistema **no tenía ni un token de sombra**, y era una
decisión escrita —*«sin elevación decorativa»*—, así que las ocho de shadcn
salían en `none` con la pregunta abierta: *¿cómo se distingue una capa que flota,
sin usar sombra?*

La línea gráfica Patria Milagro v1 la contesta: trae la escala de elevación
—`--shadow-card`, `--shadow-deep`— y el patrón de superficie que la acompaña, la
capa flotante un escalón más clara que la tarjeta. De ahí salen
`semantic.elevation.card` y `.deep`, y de ahí salen estas ocho.

**Dos escalones, no ocho.** shadcn nombra un continuo que este sistema no tiene,
y aquí no se inventa el medio: los cinco nombres pequeños toman la sombra de
tarjeta y los tres grandes la profunda. Un valor intermedio plausible se leería
como una decisión que alguien tomó, y nadie la tomó.

En modo claro los dos tokens cambian solos a su versión azulada, porque apuntan a
un semántico y el semántico sigue al tema.
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


# shadcn nombra ocho escalones; el sistema tiene dos. Se doblan, no se rellenan.
SOMBRAS = {
    "shadow-2xs": "card", "shadow-xs": "card", "shadow-sm": "card",
    "shadow": "card", "shadow-md": "card",
    "shadow-lg": "deep", "shadow-xl": "deep", "shadow-2xl": "deep",
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
        " * Las sombras salen de la escala de elevación de la línea gráfica Patria",
        " * Milagro v1, que es lo que cerró la Q1. Son DOS escalones para ocho",
        " * nombres de shadcn: el medio no se inventa.",
        " */",
        ":root {",
    ]
    for var, token in BARRA_LATERAL.items():
        lineas.append(f"  --{var}: var(--pc-semantic-color-{token.replace('.', '-')});")
    lineas.append("")
    lineas.append("  /* Dos escalones de elevación para ocho nombres de shadcn. El medio no")
    lineas.append("     se inventa: el sistema tiene dos y son estos. */")
    for var, token in SOMBRAS.items():
        lineas.append(f"  --{var}: var(--pc-semantic-elevation-{token});")
    lineas.append("}")

    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(f"  {len(BARRA_LATERAL)} variables de barra lateral · {len(SOMBRAS)} sombras derivadas de la escala de elevación")
    return 0


if __name__ == "__main__":
    sys.exit(main())
