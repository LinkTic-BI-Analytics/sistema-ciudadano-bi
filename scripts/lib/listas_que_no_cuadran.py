#!/usr/bin/env python3
"""Las listas cerradas del código y las del esquema tienen que ser la misma.

Salió de un fallo silencioso: los temas pasaron de once a dieciocho en
`lectura.ts` y la restricción `tema_de_la_lista` del esquema se quedó con once.
La base rechazaba el `update`, **nadie miraba el error**, y el aporte quedaba
sin tema mientras la ficha decía «la lectura propuso Empleo e ingresos».

Ninguna prueba lo atrapó: las de nodo usan los temas viejos y las de navegador
no confirman un tema nuevo. Lo vio una persona mirando una ficha.

No comprueba que las listas sean correctas —eso lo decide el negocio— sino que
sean **la misma en los dos sitios**, que es lo que se rompe al ampliar una.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PRODUCTO = RAIZ / "producto"

# (nombre, archivo del código, patrón del código, archivo del esquema, restricción)
LISTAS = [
    ("temas",
     "src/captura/lectura.ts", r"export const TEMAS = \[(.*?)\] as const;",
     "supabase/schemas/03_aporte.sql", "tema_de_la_lista"),
]


def del_codigo(archivo: str, patron: str) -> set[str]:
    texto = (PRODUCTO / archivo).read_text(encoding="utf-8")
    bloque = re.search(patron, texto, re.S)
    if not bloque:
        return set()
    return set(re.findall(r'"([a-z_]+)"', bloque.group(1)))


def del_esquema(archivo: str, restriccion: str) -> set[str]:
    texto = (PRODUCTO / archivo).read_text(encoding="utf-8")
    i = texto.find(f"constraint {restriccion}")
    if i < 0:
        return set()
    # Hasta el paréntesis que cierra la restricción.
    bloque = texto[i:texto.find("),", i)]
    return set(re.findall(r"'([a-z_]+)'", bloque))


def main() -> int:
    fallos = 0
    for nombre, arch_cod, patron, arch_esq, restriccion in LISTAS:
        codigo = del_codigo(arch_cod, patron)
        esquema = del_esquema(arch_esq, restriccion)
        if not codigo or not esquema:
            print(f"  FALLA no pude leer la lista de {nombre} en {arch_cod} o {arch_esq}")
            fallos += 1
            continue
        solo_codigo = sorted(codigo - esquema)
        solo_esquema = sorted(esquema - codigo)
        if solo_codigo:
            print(f"  FALLA {nombre}: en el código y NO en el esquema → {', '.join(solo_codigo)}")
            print(f"        la base los va a rechazar; corre ./scripts/esquema.sh")
            fallos += 1
        if solo_esquema:
            print(f"  FALLA {nombre}: en el esquema y NO en el código → {', '.join(solo_esquema)}")
            fallos += 1
        if not solo_codigo and not solo_esquema:
            print(f"  ok    los {len(codigo)} {nombre} del código y del esquema son los mismos")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
