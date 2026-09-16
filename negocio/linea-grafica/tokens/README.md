# Los tokens que entregó el equipo

**Aquí se deja el sistema de diseño tal como venga.** No hay que convertirlo ni ordenarlo:
se copia el archivo y ya. De aquí se derivan los valores que el producto consume.

## Qué cabe aquí

Cualquiera de estos, y entre más crudo mejor:

| Formato | Cómo suele llamarse |
|---|---|
| **Design Tokens de Figma** | `tokens.json`, `design-tokens.json`, un export de Tokens Studio |
| **Variables de CSS** | `variables.css`, `theme.css`, `:root { --… }` |
| **Un tema de código** | `tailwind.config.js`, `theme.ts`, `colors.js`, un `_variables.scss` |
| **Una guía de marca** | El PDF o el enlace de Figma, si eso es todo lo que hay |
| **Una captura de la paleta** | Sirve. Peor que un archivo, mucho mejor que nada |

Si son varios archivos, van todos. Si hay versiones, **va la que está en uso**, y se dice
cuál es en el `README.md` de la carpeta de arriba.

## Qué pasa después

De estos archivos se derivan los valores de `mvp/src/producto/tokens.css`, que es lo que el
producto consume. **Es un paso de traducción y deja rastro:** cada valor allá dice de dónde
salió.

| Marca en el token | Significa |
|---|---|
| *sin marca* | Salió de un archivo de esta carpeta. **Es la marca y no se discute** |
| `DE REFERENCIA` | Salió de algo de `../referencias/`. Sirve para construir, **no está decidido** |
| `PROVISIONAL` | No salió de ninguna parte. Lo pusimos para que no se vea roto |

Al arrancar, todos los tokens del producto están en `PROVISIONAL`. En cuanto haya algo aquí, los que se
puedan derivar cambian de marca.

## Lo que no hace falta que hagas

- **No los traduzcas a CSS.** Si vienen en JSON de Figma, se dejan en JSON.
- **No escojas cuáles sirven.** Se cargan todos; lo que no se use queda anotado como no
  usado, que también es información.
- **No los renombres.** El nombre que le puso el equipo de diseño es parte del dato: si
  ellos dicen `brand/primary`, saberlo evita inventar `--pr-marca` sobre una suposición.

## Lo que hay hoy

| Carpeta | Qué es | Fecha |
|---|---|---|
| `sistema-diseno-participacion-v0.5/` | El sistema de tokens con su generador. **Es la fuente**: `scripts/tokens.sh` corre `generar_tokens.py` tal cual y copia el resultado a `producto/src/producto/tokens/`. El JSON manda sobre el CSS, y `scripts/validar.sh` falla si la copia se editó a mano | v0.4 → v0.5, ampliado el 16-sep-2026 con la línea gráfica Patria |
| `patria-milagro-v1/` | La línea gráfica del ecosistema, **tal como la entregó el equipo de UX y sin tocar**: tokens propios, activos, capturas y una documentación navegable que se abre con doble clic. No la consume el producto — sus valores se trasladaron al JSON de arriba, que es donde vive la compuerta de contraste | 16-sep-2026 |

**Por qué no se cargan las dos.** Dos archivos de tokens activos son dos fuentes, y el día
que una cambie nadie va a saber cuál se estaba aplicando. Es la misma regla que `AGENTS.md`
§8 aplica a la lógica: nunca la misma decisión en dos niveles.
