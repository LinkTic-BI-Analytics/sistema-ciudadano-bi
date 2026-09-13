# Los tokens del producto

**Nada de esta carpeta se edita a mano.** Todo sale de
`negocio/linea-grafica/tokens/` con `npm run tokens:build` (o `./scripts/tokens.sh` desde la
raíz), y lo que cambie se ve en el diff.

| Archivo | De dónde sale | Qué trae |
|---|---|---|
| `participacion.css` | copiado del paquete v0.5 | Los 319 tokens en `:root`, más el bloque de `prefers-reduced-motion` |
| `shadcn-theme.css` | copiado del paquete v0.5 | Las 22 variables de shadcn mapeadas a tokens semánticos |
| `shadcn-completar.css` | **generado aquí** | Lo que este proyecto le agrega: las ocho de barra lateral y las sombras |

La separación es a propósito: **se tiene que poder ver de un vistazo qué es del sistema de
diseño y qué es nuestro.** Es la misma regla que gobierna los tokens uno por uno — cada valor
dice de dónde salió.

## Qué agregamos, y qué no

**Las ocho de barra lateral sí se derivan.** shadcn pide `--sidebar-*` y el sistema v0.5 no
las mapea, pero **sí tiene los tokens**: el backoffice lleva barra lateral, y para ella
existen `semantic.color.internal.sidebar`, `.navigationSelected`, `.navigationText`,
`.rowHover` y `.rowText`. El mapeo apunta a esos. No se inventó ningún color.

**Las sombras no se derivan, y salen en `none`.** El sistema no tiene ni un token de sombra,
y es una decisión escrita: *«no usar sombra como única forma de reconocer campos… sin
elevación decorativa»*. shadcn las necesita para Popover, Dialog y DropdownMenu.

Aquí no se inventa un valor — `AGENTS.md` §3 lo prohíbe, y una sombra plausible se lee como
una decisión que alguien tomó. **Está registrado como `Q1` en [`negocio/vacios.md`](../../../../negocio/vacios.md)**, con la
pregunta que hay que responder antes del primer componente flotante: *¿cómo se distingue una
capa que flota, sin usar sombra?*

## La compuerta de contraste

El generador comprueba **41 pares** con un `assert`: 4.5:1 para texto y 3:1 para bordes,
anillo de foco e indicador de voz. **Si alguno baja del umbral, el guion falla y no se copia
nada.** Está en `scripts/validar.sh`, así que no hay que acordarse de correrlo.

La Resolución 1519 de 2020 de MinTIC obliga WCAG 2.1 AA a los sujetos obligados; el sistema
de diseño apunta a 2.2 AA. Y lo dice el propio `contraste.md`: esto **no equivale a una
auditoría de interfaz ni a una certificación**.
