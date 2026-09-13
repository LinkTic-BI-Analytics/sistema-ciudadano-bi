"""
Prepara los documentos del cliente para que /leer pueda trabajarlos.

Tres cosas que la lectura de un PDF pierde y aquí no se pierden:

  1. Las tablas, si se extrae en modo corrido. Se extrae en modo `layout`.
  2. Las figuras. Se separan de los membretes por repetición: una imagen que
     aparece igual en todas las páginas es un logo, no un diagrama.
  3. Las páginas escaneadas, que no tienen una sola letra extraíble. Se les
     pasa OCR.

El motor por defecto es `local` y no manda nada a ninguna parte. El motor
`mistral` existe porque lee tablas mejor, y está detrás de una compuerta:
ver `puede_salir()`.
"""

import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.request
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
INSUMOS = RAIZ / "negocio" / "insumos"
SALIDA = INSUMOS / ".extraido"
AUTORIZACION = RAIZ / "negocio" / "autorizacion-de-salida.md"
OCR_LOCAL = Path(__file__).parent / ".bin" / "ocr-local"

# Lo que un documento dice de sí mismo sobre quién puede verlo. Se busca en el
# texto ya extraído: casi siempre va en el pie de cada página.
MARCAS = re.compile(
    r"informaci[oó]n\s+(reservada|clasificada|confidencial|p[uú]blica)", re.I
)
RESTRINGIDAS = {"reservada", "clasificada", "confidencial"}

# Una imagen más pequeña que esto es un icono, no una figura.
AREA_MINIMA = 90_000


# ---------------------------------------------------------------- clasificación

def clasificar(texto, paginas=1):
    """
    Devuelve la marca que el documento se puso a sí mismo.

    Un sello va en el pie de **cada** página; una mención de "información
    confidencial" en el cuerpo de un contrato aparece dos o tres veces. Se
    distinguen por repetición: si algo aparece en la mitad de las páginas o
    más, es el sello. Sin esta regla, el pliego del Banco —estampado
    "Información Publica" en sus 37 páginas— salía marcado confidencial
    porque su cláusula de confidencialidad usa esas dos palabras.
    """
    cuenta = Counter()
    for m in MARCAS.finditer(texto):
        n = m.group(1).lower()
        cuenta["publica" if n.startswith("p") else n] += 1

    umbral = max(2, paginas // 2)
    sellos = [n for n, c in cuenta.items() if c >= umbral]
    candidatos = sellos or list(cuenta)

    for nivel in ("reservada", "confidencial", "clasificada", "publica"):
        if nivel in candidatos:
            return nivel
    return "sin marca"


def puede_salir(nombre, marca):
    """
    La compuerta. Un documento restringido solo sale si está autorizado por
    nombre y por escrito. No basta con que alguien lo haya dicho: si no está
    en el archivo, no existe.
    """
    # Sin el archivo no sale nada, ni siquiera lo marcado público. Escribirlo es
    # el acto de aprobación: si un repositorio recién copiado pudiera mandar
    # documentos afuera solo porque nadie los marcó, la aprobación no existiría
    # como paso — existiría como suerte.
    if not AUTORIZACION.exists():
        return False, f"falta {AUTORIZACION.relative_to(RAIZ)}"
    if marca not in RESTRINGIDAS and marca != "sin marca":
        return True, "marcado público"

    # macOS guarda los nombres de archivo descompuestos —`Técnico` es `e`+´— y un
    # editor de texto los guarda compuestos. Sin normalizar los dos lados, ningún
    # documento con tilde en el nombre se puede autorizar nunca, y en español eso
    # es casi todos. Falla del lado seguro, que es peor de encontrar: la compuerta
    # parece funcionar y en realidad no deja pasar nada.
    def igual(s):
        return unicodedata.normalize("NFC", s)

    texto = igual(AUTORIZACION.read_text(encoding="utf-8"))
    objetivo = igual(nombre)
    nombrado = False
    for linea in texto.splitlines():
        if objetivo not in linea:
            continue
        nombrado = True
        if re.match(r"\s*[-*]\s*\[[xX]\]", linea):
            return True, "autorizado por escrito"
    if nombrado:
        return False, "aparece en la lista, sin marcar"
    return False, "no aparece en la lista"


# ---------------------------------------------------------------- extracción

def extraer(pdf):
    """Texto por página en modo layout, y las imágenes de cada página."""
    from pypdf import PdfReader

    r = PdfReader(str(pdf))
    paginas, imagenes = [], []
    for i, p in enumerate(r.pages, 1):
        try:
            t = p.extract_text(extraction_mode="layout") or ""
        except Exception:
            t = p.extract_text() or ""
        paginas.append(t)
        try:
            for im in p.images:
                imagenes.append((i, im.data, im.image.size))
        except Exception:
            pass
    return paginas, imagenes


def separar_figuras(imagenes):
    """
    Membrete o figura. Una imagen que se repite en tres o más páginas es el
    membrete; las que aparecen una o dos veces son contenido.
    """
    veces = Counter(hashlib.md5(d).hexdigest() for _, d, _ in imagenes)
    figuras, fondos = [], []
    for pag, datos, tam in imagenes:
        h = hashlib.md5(datos).hexdigest()
        destino = figuras if veces[h] <= 2 and tam[0] * tam[1] > AREA_MINIMA else fondos
        destino.append((pag, datos, tam, h))
    vistas, unicas = set(), []
    for pag, datos, tam, h in figuras:
        if h in vistas:
            continue
        vistas.add(h)
        unicas.append((pag, datos, tam))
    return unicas, fondos


# ---------------------------------------------------------------- OCR

def ocr_local(rutas):
    if not OCR_LOCAL.exists():
        raise RuntimeError(f"falta compilar {OCR_LOCAL}; corre scripts/leer-insumos.sh")
    r = subprocess.run([str(OCR_LOCAL), *map(str, rutas)],
                       capture_output=True, text=True)
    return r.stdout


# Por encima de esto el envío se rechaza. El base64 infla un tercio, así que el
# límite real es más bajo que el que uno tiene en la cabeza.
PESO_MAXIMO = 30 * 1024 * 1024


def comprimir(ruta_pdf):
    """
    Un PDF de fotos pesa por la calidad de las fotos, no por lo que dice. Se
    rearma con las mismas páginas a 1500 px de ancho: se lee igual y pasa.
    Devuelve la ruta a usar, y si hubo que comprimir.
    """
    if ruta_pdf.stat().st_size <= PESO_MAXIMO:
        return ruta_pdf, False

    import io
    from PIL import Image
    from pypdf import PdfReader

    hojas = []
    for p in PdfReader(str(ruta_pdf)).pages:
        for im in p.images:
            img = Image.open(io.BytesIO(im.data)).convert("RGB")
            if img.width > 1500:
                img = img.resize((1500, round(img.height * 1500 / img.width)))
            hojas.append(img)
            break  # una página, una imagen: es un escaneo
    if not hojas:
        return ruta_pdf, False

    destino = SALIDA / f".comprimido_{ruta_pdf.stem[:40]}.pdf"
    hojas[0].save(destino, save_all=True, append_images=hojas[1:],
                  format="PDF", quality=70)
    return destino, True


def ocr_mistral(ruta_pdf, api_key):
    """
    Manda el documento a la API de Mistral. Solo se llama cuando puede_salir()
    dijo que sí. Modelo y endpoint van explícitos para que se vea qué se manda.
    """
    import base64

    ruta_pdf, _ = comprimir(ruta_pdf)
    b64 = base64.b64encode(ruta_pdf.read_bytes()).decode()
    cuerpo = json.dumps({
        "model": "mistral-ocr-latest",
        "document": {"type": "document_url",
                     "document_url": f"data:application/pdf;base64,{b64}"},
        "include_image_base64": False,
    }).encode()
    req = urllib.request.Request(
        "https://api.mistral.ai/v1/ocr", data=cuerpo,
        headers={"Authorization": f"Bearer {api_key}",
                 "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as resp:
        datos = json.load(resp)
    return "\n\n".join(
        f"===== pág {p.get('index', i) + 1} =====\n{p.get('markdown', '')}"
        for i, p in enumerate(datos.get("pages", []))
    )


# ---------------------------------------------------------------- corrida

def main():
    motor = "local"
    if "--motor" in sys.argv:
        motor = sys.argv[sys.argv.index("--motor") + 1]
    if motor not in ("local", "mistral"):
        sys.exit(f"motor desconocido: {motor}. Es `local` o `mistral`.")

    api_key = os.environ.get("MISTRAL_API_KEY", "").strip()
    if motor == "mistral" and not api_key:
        sys.exit("falta MISTRAL_API_KEY en .env")

    if not INSUMOS.exists() or not list(INSUMOS.glob("*.pdf")):
        print(f"No hay documentos en {INSUMOS.relative_to(RAIZ)}/.")
        print("No hace falta tenerlos para arrancar: corre /descubrir.")
        return

    SALIDA.mkdir(parents=True, exist_ok=True)
    (SALIDA / "figuras").mkdir(exist_ok=True)
    informe = []

    for pdf in sorted(INSUMOS.glob("*.pdf")):
        nombre = pdf.name
        base = re.sub(r"[^A-Za-z0-9]+", "_", pdf.stem)[:55]
        paginas, imagenes = extraer(pdf)
        texto = "\n".join(paginas)
        sin_texto = [i for i, t in enumerate(paginas, 1) if len(t.strip()) < 200]
        marca = clasificar(texto, len(paginas))

        # En un documento enteramente escaneado cada página *es* una imagen:
        # extraerlas como figuras sería guardar el documento dos veces.
        escaneado = len(sin_texto) == len(paginas)
        figuras = [] if escaneado else separar_figuras(imagenes)[0]
        rutas_figuras = []
        for pag, datos, tam in figuras:
            r = SALIDA / "figuras" / f"{base}_pag{pag:03d}_{tam[0]}x{tam[1]}.png"
            r.write_bytes(datos)
            rutas_figuras.append((pag, r))

        # El texto de adentro de un diagrama no está en la capa de texto del PDF:
        # está dibujado. Un mapa de módulos con quince cajas es de las páginas más
        # informativas de un documento funcional, y sin esto se pierde entera.
        texto_figuras = ""
        if rutas_figuras and OCR_LOCAL.exists():
            trozos = []
            for pag, r in rutas_figuras:
                leido = ocr_local([r]).strip()
                if leido:
                    trozos.append(f"===== figura de la pág {pag} · {r.name} =====\n{leido}")
            if trozos:
                texto_figuras = ("\n\n----- TEXTO DE LAS FIGURAS -----\n"
                                 "Leído con OCR de la imagen. El orden de las cajas se pierde:\n"
                                 "para entender la estructura hay que abrir la figura.\n\n"
                                 + "\n\n".join(trozos))

        # ── Siempre se lee local primero, y no es por ahorrar.
        #
        # La marca de clasificación vive DENTRO del documento. En uno escaneado
        # no hay una sola letra que leer sin OCR, así que preguntarle a un
        # servicio de afuera qué dice el documento obligaría a mandárselo — es
        # decir, a sacarlo de la máquina para averiguar si se podía sacar de la
        # máquina. El orden es la salvaguarda.
        origen = "capa de texto"
        if sin_texto:
            paginas_img = {}
            for pag, datos, tam in imagenes:
                if pag in sin_texto and tam[0] * tam[1] > AREA_MINIMA:
                    p = SALIDA / f".pag_{base}_{pag:03d}.jpg"
                    p.write_bytes(datos)
                    paginas_img[pag] = p
            trozos = [f"===== pág {pag} =====\n" + ocr_local([paginas_img[pag]])
                      for pag in sorted(paginas_img)]
            texto_ocr = "\n\n".join(trozos)
            for p in paginas_img.values():
                p.unlink(missing_ok=True)
            texto = texto_ocr if escaneado else texto + "\n\n" + texto_ocr
            origen = "OCR local (Vision)"
            marca = clasificar(texto, len(paginas))
        else:
            texto = "".join(f"\n\n===== pág {i} =====\n{t}"
                            for i, t in enumerate(paginas, 1))

        # ── Y solo ahora, sabiendo qué es el documento, se decide si sale.
        if motor == "mistral":
            puede, razon = puede_salir(nombre, marca)
            if not puede:
                informe.append((nombre, len(paginas), marca, len(texto.split()),
                                len(figuras), f"{origen} · NO SALIÓ: {razon}"))
                texto = re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]{3,}", "  ", texto))
                (SALIDA / f"{base}.txt").write_text(texto, encoding="utf-8")
                continue
            # Si el servicio de afuera falla, se conserva lo que ya se leyó
            # local. Perder una corrida entera por un documento es peor que
            # quedarse con una lectura menos buena de uno.
            try:
                texto = ocr_mistral(pdf, api_key)
                origen = "Mistral OCR"
            except Exception as e:
                detalle = getattr(e, "code", None) or type(e).__name__
                informe.append((nombre, len(paginas), marca, len(texto.split()),
                                len(figuras), f"{origen} · Mistral falló ({detalle})"))
                texto = re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]{3,}", "  ", texto))
                (SALIDA / f"{base}.txt").write_text(texto + texto_figuras, encoding="utf-8")
                continue

        texto = re.sub(r"[ \t]{3,}", "  ", texto)
        texto = re.sub(r"\n{3,}", "\n\n", texto)
        # El motor de afuera escribe en su propio archivo. Así queda al lado del
        # local y se pueden comparar en vez de creerle a uno de los dos.
        sufijo = ".mistral" if origen == "Mistral OCR" else ""
        if not sufijo:
            texto += texto_figuras
        (SALIDA / f"{base}{sufijo}.txt").write_text(texto, encoding="utf-8")
        informe.append((nombre, len(paginas), marca, len(texto.split()),
                        len(figuras), f"{origen}, {len(sin_texto)} pág sin texto"))

    print(f"\nMotor: {motor}\n")
    print(f"{'Documento':<46} {'Pág':>4} {'Marca':<12} {'Palabras':>9} {'Fig':>4}  Cómo se leyó")
    print("─" * 118)
    for n, pags, marca, palabras, figs, nota in informe:
        print(f"{n[:45]:<46} {pags:>4} {marca:<12} {palabras:>9} {figs:>4}  {nota}")
    total = sum(f[3] for f in informe)
    print("─" * 118)
    print(f"{'TOTAL':<46} {sum(f[1] for f in informe):>4} {'':<12} {total:>9} {sum(f[4] for f in informe):>4}")
    print(f"\nQuedó en {SALIDA.relative_to(RAIZ)}/ — fuera de git.")

    # "Sin marca" cuenta como restringido: un documento que no dice qué es no
    # autoriza nada. La compuerta ya lo trata así; el informe tiene que decir
    # lo mismo, o enseña a confiar en un número que no es el que manda.
    retenidos = [f[0] for f in informe if f[2] in RESTRINGIDAS or f[2] == "sin marca"]
    if retenidos and motor == "local":
        print(f"\n{len(retenidos)} de {len(informe)} documentos necesitan autorización "
              "escrita para salir de esta máquina. Hoy no salió ninguno.")
        for n in retenidos:
            print(f"   · {n}")


if __name__ == "__main__":
    main()
