"""Genera las variables CSS, el puente shadcn y el informe de contraste.

Dos modos. `semantic.*` es el OSCURO, que es el principal de la línea gráfica
Patria Milagro; `modo.claro.*` lleva solo las hojas que cambian y el generador
las escribe bajo `[data-tema="claro"]`. Todo lo que alias a un semántico —los
`component.*`, los `internal.*`— sigue al modo solo, porque CSS reevalúa las
variables: por eso el bloque del claro es corto y no hay dos sistemas.

**El contraste se comprueba en los dos modos.** Un par que pasa en oscuro y se
cae en claro es exactamente el defecto que aparece cuando alguien toca el botón
de tema, y la mitad de los valores de un modo no existen en el otro.
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
tokens = json.loads(OUT.joinpath('participacion.tokens.json').read_text())

flat, claro = {}, {}
def walk(obj, path='', destino=None):
    if '$value' in obj: (flat if destino is None else destino)[path] = obj; return
    for k,v in obj.items():
        if not k.startswith('$'): walk(v, f'{path}.{k}' if path else k, destino)
for k,v in tokens.items():
    if k.startswith('$'): continue
    if k == 'modo': walk(v['claro'], 'semantic', claro)
    else: walk(v, k)

def resolve(key, seen=(), modo=None):
    """Resuelve un alias. Con `modo='claro'`, cada salto mira primero si esa hoja
    está sobrescrita — si no, la cadena entera se resolvería con el valor oscuro."""
    if modo == 'claro' and key in claro: fuente = claro
    else: fuente = flat
    if key in seen: raise ValueError('Alias cycle: '+key)
    v = fuente[key]['$value']
    return resolve(v[1:-1],seen+(key,),modo) if isinstance(v,str) and v.startswith('{') else v

def css_value(v,kind):
    if isinstance(v,str) and v.startswith('{'): return 'var(--pc-'+v[1:-1].replace('.','-')+')'
    # Sombras y curvas de easing se guardan como el CSS que son: este generador
    # no las compone, y una sombra descompuesta en JSON se vuelve a componer mal.
    if isinstance(v,str): return v
    if kind == 'color': return '#'+''.join(f'{round(x*255):02X}' for x in v['components'])
    if kind in ['dimension','duration']: return str(v['value']).removesuffix('.0')+v['unit']
    # `var(--x, Y)` lleva espacio y NO se entrecomilla: entre comillas el navegador
    # lo lee como el nombre de una familia y no lo resuelve.
    if kind == 'fontFamily': return ', '.join(s if s.startswith('var(') or ' ' not in s else '"'+s+'"' for s in v)
    return str(v)

for k in flat: resolve(k)
for k in claro: resolve(k, modo='claro')
OUT.joinpath('participacion.tokens.json').write_text(json.dumps(tokens,ensure_ascii=False,indent=2)+'\n')

css  = '/* Generado desde participacion.tokens.json. Propuesta 0.5.0 sobre la línea\n'
css += '   gráfica Patria Milagro v1: modo oscuro por defecto, claro con [data-tema="claro"]. */\n:root {\n'
css += '\n'.join('  --pc-'+k.replace('.','-')+': '+css_value(v['$value'],v['$type'])+';' for k,v in flat.items())
css += '\n}\n[data-tema="claro"] {\n'
css += '\n'.join('  --pc-'+k.replace('.','-')+': '+css_value(v['$value'],v['$type'])+';' for k,v in claro.items())
css += '\n}\n@media (prefers-reduced-motion: reduce) {\n'
css += '  :root { --pc-primitive-duration-fast: 0ms; --pc-primitive-duration-normal: 0ms; --pc-primitive-duration-slow: 0ms; }\n}\n'
OUT.joinpath('participacion.css').write_text(css)

mapping = {'background':'surface.page','foreground':'text.default','card':'surface.base','card-foreground':'text.default','popover':'surface.floating','popover-foreground':'text.default','primary':'action.primary.default','primary-foreground':'action.primary.foreground','secondary':'action.secondary.default','secondary-foreground':'action.secondary.foreground','muted':'surface.subtle','muted-foreground':'text.secondary','accent':'selection.background','accent-foreground':'selection.foreground','destructive':'feedback.error.foreground','destructive-foreground':'surface.base','border':'border.subtle','input':'border.control','ring':'focus.ring','chart-1':'data.high','chart-2':'feedback.success.foreground','chart-3':'assist.foreground','chart-4':'feedback.warning.foreground','chart-5':'text.secondary'}
bridge = '/* Importar después de participacion.css y del tema inicial shadcn. Sigue al modo solo. */\n:root {\n'
bridge += '\n'.join(f'  --{k}: var(--pc-semantic-color-{v.replace(".","-")});' for k,v in mapping.items())
bridge += '\n  --radius: var(--pc-primitive-radius-md);\n  --font-sans: var(--pc-semantic-fontFamily-body);\n}\n'
OUT.joinpath('shadcn-theme.css').write_text(bridge)

def luminance(c):
    def f(x): return x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4
    return sum(w*f(x) for w,x in zip([.2126,.7152,.0722],c['components']))

# Texto 4,5:1. Borde, anillo de foco e indicador de voz 3:1 — no son texto.
pairs=[('Texto principal sobre tarjeta','text.default','surface.base',4.5),('Texto principal sobre la página','text.default','surface.page',4.5),('Texto principal sobre capa flotante','text.default','surface.floating',4.5),('Texto secundario','text.secondary','surface.canvas',4.5),('Texto secundario sobre la página','text.secondary','surface.page',4.5),('Texto secundario sobre superficie editorial','text.secondary','surface.editorial',4.5),('Enlace','text.link','surface.base',4.5),('Enlace sobre la página','text.link','surface.page',4.5)]
pairs += [('Botón principal','action.primary.foreground','action.primary.default',4.5),('Botón hover','action.primary.foreground','action.primary.hover',4.5),('Botón pressed','action.primary.foreground','action.primary.pressed',4.5),('Secundario','action.secondary.foreground','action.secondary.default',4.5),('Secundario hover','action.secondary.foreground','action.secondary.hover',4.5),('Secundario pressed','action.secondary.foreground','action.secondary.pressed',4.5),('Borde del secundario','action.secondary.border','action.secondary.default',3),('Acción terciaria','action.tertiary.foreground','surface.page',4.5),('Botón deshabilitado','action.disabled.foreground','action.disabled.background',4.5)]
pairs += [('Información','feedback.info.foreground','feedback.info.background',4.5),('Éxito','feedback.success.foreground','feedback.success.background',4.5),('Advertencia','feedback.warning.foreground','feedback.warning.background',4.5),('Error','feedback.error.foreground','feedback.error.background',4.5),('Estado neutral','feedback.neutral.foreground','feedback.neutral.background',4.5),('Error suelto sobre la página','feedback.error.foreground','surface.page',4.5),('Síntesis','assist.foreground','assist.background',4.5),('Acento','brand.accentText','brand.accentSurface',4.5)]
pairs += [('Borde de campo','border.control','surface.base',3),('Borde de campo sobre panel','border.control','surface.editorial',3),('Foco sobre la página','focus.ring','surface.page',3),('Foco sobre tarjeta','focus.ring','surface.base',3),('Selección','selection.foreground','selection.background',4.5)]
pairs += [('Voz: indicador','voice.recording','voice.surface',3),('Voz: texto','voice.text','voice.surface',4.5)]
pairs += [('Texto de portada','text.default','feedback.info.background',4.5),('Aviso de borrador','text.default','surface.subtle',4.5)]
pairs += [('Bloque navy','text.onNavy','surface.navy',4.5),('Apoyo en bloque navy','text.onNavySecondary','surface.navy',4.5),('Número de paso','action.primary.foreground','brand.accent',4.5)]
pairs += [('Titular editorial','brand.ink','surface.page',4.5),('Titular sobre panel','brand.ink','surface.editorial',4.5),('Fecha de evento','event.dateForeground','event.dateBackground',4.5),('Tema del evento','event.category','surface.base',4.5),('Navegación seleccionada','navigation.foreground','navigation.selected',4.5),('Modo elegido','text.default','mode.selected',4.5),('Modo no elegido','text.secondary','mode.track',4.5)]
pairs += [('Navegación interna', 'internal.navigationText', 'internal.navigationSelected', 4.5), ('Relato original', 'internal.originalText', 'internal.originalBackground', 4.5), ('Propuesta de IA', 'internal.proposalText', 'internal.proposalBackground', 4.5), ('Fila seleccionada', 'internal.rowText', 'internal.rowSelected', 4.5), ('Estado interno received', 'internal.receivedText', 'internal.receivedBackground', 4.5), ('Estado interno review', 'internal.reviewText', 'internal.reviewBackground', 4.5), ('Estado interno clarify', 'internal.clarifyText', 'internal.clarifyBackground', 4.5), ('Estado interno referred', 'internal.referredText', 'internal.referredBackground', 4.5), ('Estado interno draft', 'internal.draftText', 'internal.draftBackground', 4.5), ('Estado interno validated', 'internal.validatedText', 'internal.validatedBackground', 4.5)]

report  = '# Contraste de pares de tokens\n\nCálculo sRGB según fórmula WCAG. No equivale a una auditoría de interfaz o certificación.\n\n'
report += 'Los dos modos se comprueban enteros: un par que pasa en oscuro y se cae en claro\nes el defecto que aparece en cuanto alguien toca el botón de tema.\n'
fallos = []
for modo, titulo in [(None, 'Modo oscuro (por defecto)'), ('claro', 'Modo claro')]:
    report += f'\n## {titulo}\n\n| Par | Relación | Umbral | Resultado |\n|---|---:|---:|---|\n'
    for label,fg,bg,threshold in pairs:
        ls = sorted([luminance(resolve('semantic.color.'+x, modo=modo)) for x in [fg,bg]])
        ratio=(ls[1]+.05)/(ls[0]+.05)
        if ratio < threshold: fallos.append((titulo,label,round(ratio,2),threshold))
        report += f'| {label} | {ratio:.2f}:1 | {threshold}:1 | {"Pasa" if ratio>=threshold else "**NO PASA**"} |\n'
report+='\nLos bordes decorativos sutiles no identifican controles. Los mapas requieren etiquetas/patrones y una tabla alternativa; la escala secuencial no se valida como texto. El amarillo no se emplea como texto sobre blanco.\n'
OUT.joinpath('contraste.md').write_text(report)
assert not fallos, fallos
print(f'{len(flat)} tokens + {len(claro)} del modo claro; aliases resueltos; {len(pairs)*2} pares de contraste pasan.')
