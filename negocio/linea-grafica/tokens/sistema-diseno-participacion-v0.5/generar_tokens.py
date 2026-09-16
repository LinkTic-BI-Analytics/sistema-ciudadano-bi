import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
tokens = json.loads(OUT.joinpath('participacion.tokens.json').read_text())

flat = {}
def walk(obj, path=''):
    if '$value' in obj: flat[path] = obj; return
    for k,v in obj.items():
        if not k.startswith('$'): walk(v, f'{path}.{k}' if path else k)
walk(tokens)
def resolve(key, seen=()):
    if key in seen: raise ValueError('Alias cycle: '+key)
    v=flat[key]['$value']
    return resolve(v[1:-1],seen+(key,)) if isinstance(v,str) and v.startswith('{') else v
def css_value(v,kind):
    if isinstance(v,str) and v.startswith('{'): return 'var(--pc-'+v[1:-1].replace('.','-')+')'
    if kind == 'color': return '#'+''.join(f'{round(x*255):02X}' for x in v['components'])
    if kind in ['dimension','duration']: return str(v['value']).removesuffix('.0')+v['unit']
    if kind == 'fontFamily': return ', '.join('"'+s+'"' if ' ' in s else s for s in v)
    return str(v)
for k in flat: resolve(k)
OUT.joinpath('participacion.tokens.json').write_text(json.dumps(tokens,ensure_ascii=False,indent=2)+'\n')
css = '/* Generado desde participacion.tokens.json. Propuesta 0.5.0, modo claro. */\n:root {\n'
css += '\n'.join('  --pc-'+k.replace('.','-')+': '+css_value(v['$value'],v['$type'])+';' for k,v in flat.items())
css += '\n}\n@media (prefers-reduced-motion: reduce) {\n  :root { --pc-primitive-duration-fast: 0ms; --pc-primitive-duration-normal: 0ms; }\n}\n'
OUT.joinpath('participacion.css').write_text(css)

mapping = {'background':'surface.canvas','foreground':'text.default','card':'surface.base','card-foreground':'text.default','popover':'surface.base','popover-foreground':'text.default','primary':'action.primary.default','primary-foreground':'action.primary.foreground','secondary':'action.secondary.default','secondary-foreground':'action.secondary.foreground','muted':'surface.subtle','muted-foreground':'text.secondary','accent':'selection.background','accent-foreground':'selection.foreground','destructive':'feedback.error.foreground','destructive-foreground':'surface.base','border':'border.subtle','input':'border.control','ring':'focus.ring','chart-1':'data.high','chart-2':'feedback.success.foreground','chart-3':'assist.foreground','chart-4':'feedback.warning.foreground','chart-5':'text.secondary'}
bridge = '/* Importar después de participacion.css y del tema inicial shadcn. Sólo modo claro. */\n:root {\n'
bridge += '\n'.join(f'  --{k}: var(--pc-semantic-color-{v.replace(".","-")});' for k,v in mapping.items())
bridge += '\n  --radius: var(--pc-primitive-radius-md);\n  --font-sans: var(--pc-semantic-fontFamily-body);\n}\n'
OUT.joinpath('shadcn-theme.css').write_text(bridge)

def luminance(c):
    def f(x): return x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4
    return sum(w*f(x) for w,x in zip([.2126,.7152,.0722],c['components']))
pairs=[('Texto principal','text.default','surface.base',4.5),('Texto secundario','text.secondary','surface.canvas',4.5),('Enlace','text.link','surface.base',4.5),('Botón principal','action.primary.foreground','action.primary.default',4.5),('Botón hover','action.primary.foreground','action.primary.hover',4.5),('Botón pressed','action.primary.foreground','action.primary.pressed',4.5),('Información','feedback.info.foreground','feedback.info.background',4.5),('Éxito','feedback.success.foreground','feedback.success.background',4.5),('Advertencia','feedback.warning.foreground','feedback.warning.background',4.5),('Error','feedback.error.foreground','feedback.error.background',4.5),('Síntesis','assist.foreground','assist.background',4.5),('Acento','brand.accentText','brand.accentSurface',4.5),('Borde campo','border.control','surface.base',3),('Foco sobre blanco','focus.ring','surface.base',3),('Selección','selection.foreground','selection.background',4.5)]
pairs += [('Secundario','action.secondary.foreground','action.secondary.default',4.5),('Secundario hover','action.secondary.foreground','action.secondary.hover',4.5),('Secundario pressed','action.secondary.foreground','action.secondary.pressed',4.5),('Acción terciaria','action.tertiary.foreground','surface.base',4.5),('Botón deshabilitado','action.disabled.foreground','action.disabled.background',4.5),('Voz: indicador','voice.recording','voice.surface',3),('Voz: texto','voice.text','voice.surface',4.5),('Estado neutral','feedback.neutral.foreground','feedback.neutral.background',4.5)]
pairs += [('Texto de portada','text.default','feedback.info.background',4.5),('Aviso de borrador','text.default','surface.subtle',4.5)]
pairs += [('Bloque de cómo funciona','text.inverse','surface.inverse',4.5),('Apoyo en bloque oscuro','text.inverseSecondary','surface.inverse',4.5),('Número de paso','brand.ink','brand.accent',4.5)]
pairs += [('Titular editorial','brand.ink','surface.editorial',4.5),('Texto secundario sobre superficie editorial','text.secondary','surface.editorial',4.5),('Fecha de evento','event.dateForeground','event.dateBackground',4.5),('Cabecera institucional','text.inverse','brand.ink',4.5),('Navegación seleccionada','navigation.foreground','navigation.selected',4.5),('Borde de campo sobre arena','border.control','surface.editorial',3)]
pairs += [('Navegación interna', 'internal.navigationText', 'internal.navigationSelected', 4.5), ('Relato original', 'internal.originalText', 'internal.originalBackground', 4.5), ('Propuesta de IA', 'internal.proposalText', 'internal.proposalBackground', 4.5), ('Fila seleccionada', 'internal.rowText', 'internal.rowSelected', 4.5), ('Estado interno received', 'internal.receivedText', 'internal.receivedBackground', 4.5), ('Estado interno review', 'internal.reviewText', 'internal.reviewBackground', 4.5), ('Estado interno clarify', 'internal.clarifyText', 'internal.clarifyBackground', 4.5), ('Estado interno referred', 'internal.referredText', 'internal.referredBackground', 4.5), ('Estado interno draft', 'internal.draftText', 'internal.draftBackground', 4.5), ('Estado interno validated', 'internal.validatedText', 'internal.validatedBackground', 4.5)]
report = '# Contraste de pares de tokens\n\nCálculo sRGB según fórmula WCAG. No equivale a una auditoría de interfaz o certificación.\n\n| Par | Relación | Umbral | Resultado |\n|---|---:|---:|---|\n'
for label,fg,bg,threshold in pairs:
    ls = sorted([luminance(resolve('semantic.color.'+x)) for x in [fg,bg]])
    ratio=(ls[1]+.05)/(ls[0]+.05)
    assert ratio>=threshold,(label,ratio)
    report += f'| {label} | {ratio:.2f}:1 | {threshold}:1 | Pasa |\n'
report+='\nLos bordes decorativos sutiles no identifican controles. Los mapas requieren etiquetas/patrones y una tabla alternativa; la escala secuencial no se valida como texto. El amarillo no se emplea como texto sobre blanco.\n'
OUT.joinpath('contraste.md').write_text(report)
print(f'{len(flat)} tokens; aliases resueltos; {len(pairs)} pares de contraste pasan.')
