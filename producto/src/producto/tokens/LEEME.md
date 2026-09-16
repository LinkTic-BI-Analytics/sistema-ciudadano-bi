# Los tokens del producto

**Nada de esta carpeta se edita a mano.** Todo sale de
`negocio/linea-grafica/tokens/` con `npm run tokens:build` (o `./scripts/tokens.sh` desde la
raíz), y lo que cambie se ve en el diff.

| Archivo | De dónde sale | Qué trae |
|---|---|---|
| `participacion.css` | copiado del paquete v0.5 | Los 374 tokens en `:root` —que es el **modo oscuro**— más los 67 del claro bajo `[data-tema="claro"]`, y el bloque de `prefers-reduced-motion` |
| `shadcn-theme.css` | copiado del paquete v0.5 | Las 22 variables de shadcn mapeadas a tokens semánticos. Siguen al modo solas: apuntan a un semántico y CSS reevalúa |
| `componentes.css`, `marco.css`, `estructura.css` | copiadas del paquete v0.5 | La cara ciudadana, bajo `.pc-ui` |
| `backoffice.css` | copiada del paquete v0.5 | El perfil interno, bajo `.pc-backoffice` |
| `shadcn-completar.css` | **generado aquí** | Lo que este proyecto le agrega: las ocho de barra lateral y las ocho sombras |

La separación es a propósito: **se tiene que poder ver de un vistazo qué es del sistema de
diseño y qué es nuestro.** Es la misma regla que gobierna los tokens uno por uno — cada valor
dice de dónde salió.

## Los dos modos

El oscuro es el principal de la línea gráfica Patria Milagro y es el que trae `:root`. El
claro se enciende con `data-tema="claro"` en el `<html>`, y lo pone
[`src/producto/tema.tsx`](../tema.tsx) antes de pintar.

**Solo se sobrescriben las hojas que cambian** —67 de 374—. Todo lo que alias a un semántico
—los `component.*`, los `internal.*`, el puente de shadcn— sigue al modo sin repetirse, porque
CSS reevalúa las variables. Por eso el bloque del claro es corto y no hay dos sistemas.

## Qué agregamos, y qué no

**Las ocho de barra lateral sí se derivan.** shadcn pide `--sidebar-*` y el sistema v0.5 no
las mapea, pero **sí tiene los tokens**: el backoffice lleva barra lateral, y para ella
existen `semantic.color.internal.sidebar`, `.navigationSelected`, `.navigationText`,
`.rowHover` y `.rowText`. El mapeo apunta a esos. No se inventó ningún color.

**Las sombras ya no salen en `none`, y eso cerró la `Q1`.** El sistema 0.5 no tenía ni un
token de sombra —era una decisión escrita, «sin elevación decorativa»— y las ocho variables de
shadcn salían vacías con la pregunta abierta: *¿cómo se distingue una capa que flota, sin usar
sombra?* La entrega Patria trae la escala de elevación y con ella la respuesta: se distingue
por elevación. Son **dos escalones para ocho nombres**, y el intermedio no se inventa
(`AGENTS.md` §3). Está registrado como `V22` en [`negocio/vacios.md`](../../../../negocio/vacios.md).

## La compuerta de contraste

El generador comprueba **108 pares** con un `assert`: 54 en cada modo, 4.5:1 para texto y 3:1
para bordes, anillo de foco e indicador de voz. **Si alguno baja del umbral, el guion falla y
no se copia nada.** Está en `scripts/validar.sh`, así que no hay que acordarse de correrlo.

Que corra **los dos modos** no es simetría: la mitad de los valores de un modo no existen en
el otro —el anillo de foco es dorado en oscuro y azul en claro, porque el dorado sobre papel
da 1,6:1— y un par que solo se comprueba en uno se cae en cuanto alguien toca el botón de tema.

La Resolución 1519 de 2020 de MinTIC obliga WCAG 2.1 AA a los sujetos obligados; el sistema
de diseño apunta a 2.2 AA. Y lo dice el propio `contraste.md`: esto **no equivale a una
auditoría de interfaz ni a una certificación**.
