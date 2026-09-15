"""Un dato que se guarda y nadie lee es un dato que nadie va a poder usar.

Salió de una pantalla: la persona llenaba el formulario, se guardaban diez
cosas, y la ficha de revisión mostraba cinco. El resto estaba en la base sin que
nadie —ni el revisor ni ella misma— pudiera verlo.

**No falla nada cuando pasa.** La columna existe, el `insert` funciona, las
pruebas pasan. Solo que el trabajo de quien contestó se queda en un sitio donde
nadie mira, y eso es peor que no haberlo preguntado: le pedimos su tiempo para
nada.

Esto compara las columnas de las tablas del producto contra lo que el código
menciona. No prueba que se muestren bien; prueba que alguien las lee.
"""

import re
import subprocess
import sys
from pathlib import Path

# Columnas que existen para la base, no para nadie más. Se nombran una por una:
# una lista de prefijos dejaría pasar cualquier cosa que empiece igual.
INTERNAS = {
    "id", "proceso_id", "creado_en", "creada_en",
    # El identificador de la fila padre en tablas de detalle.
    "aporte_id", "expediente_id", "grabacion_id", "encuentro_id", "convocatoria_id",
    "territorio_version", "padre", "version",
}

# Modeladas por adelantado y todavía sin usar, **cada una con su razón**.
#
# No es una lista para acallar el chequeo: es donde queda escrito qué se modeló
# antes de tiempo y por qué. Si algo entra aquí sin razón, el que lo lea después
# no puede saber si es deuda o descuido.
#
# Una columna que sale de aquí y sigue sin leerse **falla**.
MODELADAS = {
    "aporte.retirado_motivo":
        "V11 · borrado lógico. Se escribe al retirar y no hay pantalla de retirados todavía",
    "expediente.retirado_motivo": "lo mismo, para expedientes",
    "expediente.problema_desde":
        "P2 · el expediente puede fechar el problema; hoy eso se captura en el aporte (desde_cuando)",
    "expediente.duracion_declarada": "igual que problema_desde: se decidirá cuál de los dos manda",
    "expediente.poblacion_declarada":
        "se solapa con aporte.afectados; falta decidir si la población la declara la persona o la estima el revisor",
    "expediente.fusionado_en_id":
        "R1 · fusionar expedientes está modelado y no construido; sin pantalla no se escribe",
    "alerta.levantada_en": "la ficha muestra la alerta; cuánto lleva abierta hace falta cuando haya turnos (V13)",
    "grabacion.recibida_en": "redundante con aporte.recibido_en mientras haya una grabación por aporte",
}


def columnas(tabla: str) -> list[str]:
    sql = ("select column_name from information_schema.columns "
           f"where table_schema='participacion' and table_name='{tabla}';")
    r = subprocess.run(
        ["docker", "exec", "-i", "supabase_db_participacion",
         "psql", "-U", "postgres", "-d", "postgres", "-qAt", "-c", sql],
        capture_output=True, text=True)
    return [c for c in r.stdout.split() if c]


TABLAS = [
    "aporte", "ubicacion", "sintesis", "expediente", "alerta", "prioridad_examen",
    "grabacion", "transcripcion", "convocatoria", "encuentro", "enlace",
]

avisos: list[str] = []


def revisar(raiz: Path) -> list[str]:
    fuente = raiz / "producto/src"
    if not fuente.is_dir():
        return [f"no encontré {fuente}"]

    codigo = "\n".join(
        f.read_text(encoding="utf-8")
        for f in [*fuente.rglob("*.ts"), *fuente.rglob("*.tsx")]
        if "node_modules" not in f.parts
    )
    # `relato_original` en el SQL se lee en el código como `relato_original` o,
    # tras mapearlo, como `relatoOriginal`. Se buscan las dos formas.
    def camello(c: str) -> str:
        partes = c.split("_")
        return partes[0] + "".join(p.capitalize() for p in partes[1:])

    fallos: list[str] = []
    avisos.clear()
    for tabla in TABLAS:
        for col in columnas(tabla):
            if col in INTERNAS:
                continue
            if re.search(rf"\b{re.escape(col)}\b", codigo) or re.search(rf"\b{re.escape(camello(col))}\b", codigo):
                continue
            clave = f"{tabla}.{col}"
            if clave in MODELADAS:
                avisos.append(f"`participacion.{clave}` — {MODELADAS[clave]}")
                continue
            fallos.append(
                f"`participacion.{clave}` se guarda y **nadie la lee**: el trabajo de quien "
                f"la contestó no lo ve ni el revisor ni ella misma. O se muestra, o se anota "
                f"en MODELADAS con su razón"
            )
    return fallos


def main() -> int:
    raiz = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    fallos = revisar(raiz)
    for a in avisos:
        print(f"  aviso {a}")
    for f in fallos:
        print(f"  FALLA {f}")
    if fallos:
        print(f"\n{len(fallos)} columnas guardadas que nadie lee. O se muestran, o no se piden.")
        return 1
    print(f"  ok    todo lo que tiene datos se lee en alguna parte"
          + (f" ({len(avisos)} columnas modeladas y sin usar)" if avisos else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
