"""Consultar el grafo desde la terminal. La lógica vive en grafo.py."""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from grafo import construir, rebanada, rebanada_frente, RAIZ

g = construir()
(RAIZ / "negocio" / ".grafo.json").write_text(json.dumps(g, ensure_ascii=False, indent=1), encoding="utf-8")
args = sys.argv[1:]

if args and args[0] == "--json":
    print(json.dumps(g, ensure_ascii=False, indent=1)); sys.exit()

if args and args[0] == "--frente":
    r = rebanada_frente(g, int(args[1]))
    if not r: sys.exit(f"no hay frente {args[1]}")
    f = r["frente"]
    print(f"\nFRENTE {f['orden']} · {f['nombre']}  [{f['estado']}]\n")
    print(f"  Implementa: {' '.join(f['codigos'])}\n")
    for c, n in r["nodos"].items():
        print(f"  {c:<4} {n['tipo']:<16} {n.get('titulo') or n['resumen'][:74]}")
    if r["faltan"]:
        print("\n  LO QUE ESPERA UN DATO:")
        for x in r["faltan"]:
            print(f"    · {x['que_falta'][:78]}")
            if x["sin_esto_se_puede"]:
                print(f"      sin eso se puede: {x['sin_esto_se_puede'][:70]}")
    print(f"\n  ({len(r['nodos'])} nodos — en vez de leer la especificación entera)\n")
    sys.exit()

if args:
    r = rebanada(g, args[0].upper())
    if not r: sys.exit(f"{args[0]} no existe en el grafo")
    c0 = r["centro"]; n0 = r["nodos"][c0]
    print(f"\n{c0} · {n0['tipo']} · {n0.get('titulo','')}\n")
    print(f"  {n0['resumen'][:200]}\n")
    if n0.get("falta"): print(f"  ESPERA UN DATO: {n0['falta'][:160]}\n")
    for c, n in r["nodos"].items():
        if c == c0: continue
        rel = "→" if any(a["de"]==c0 and a["a"]==c for a in g["aristas"]) else "←"
        print(f"  {rel} {c:<4} {n['tipo']:<16} {(n.get('titulo') or n['resumen'])[:66]}")
    if r["frentes"]:
        print("\n  " + ", ".join(f"frente {f['orden']} ({f['estado']})" for f in r["frentes"]))
    print(f"\n  ({len(r['nodos'])} nodos)\n")
    sys.exit()

t = g["telemetria"]
print("\n════ ETAPAS ════")
for e in g["etapas"]:
    print(f"  {'✓' if e['corrida'] else '·'} {e['n']:<3} {e['etapa']:<12} {e['detalle']}")
print("\n════ LO QUE TENEMOS ════")
for k, v in t["por_tipo"].items(): print(f"  {v:>3}  {k}")
print("\n════ LO QUE FALTA ════")
print(f"  {t['preguntas_abiertas']:>3}  preguntas abiertas")
print(f"  {t['datos_que_faltan']:>3}  datos que faltan"
      f"  ({t['datos_que_no_pueden_esperar']} no pueden esperar: se pierden si no se construyen hoy)")
print("\n════ EL GRAFO ════")
print(f"  {len(g['nodos'])} nodos · {len(g['aristas'])} flechas")
print(f"  huérfanos arriba (citados y no definidos): {' '.join(t['huerfanos_arriba']) or 'ninguno'}")
print(f"  huérfanos abajo (definidos y sin citar):   {' '.join(t['huerfanos_abajo']) or 'ninguno'}")
print()
