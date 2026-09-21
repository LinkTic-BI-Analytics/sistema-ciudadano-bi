# Registro — T066 · El rediseño de la interfaz, en dos rondas

**De dónde sale:** el cliente. Primera ronda: *«mejorar drásticamente la UI y la UX»*, con
ejemplos —los filtros de `/consola` no se entienden, `/administracion` es monocromática, el
formulario no dice en qué punto va, «mis aportes» está muerta—. Segunda ronda, después de la
primera: *«en /consola no se diferencia muy bien la tabla y se ve muy saturado todo de azul y ni
siquiera hay paginación»*, *«en serio todo parece un póster de solo color azul en el tema
oscuro»*, *«el menú lateral se ve horrible»*, y un calendario de encuentros como el cronograma
de despliegue territorial del DNP.

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-20 | Ronda 1: hojas propias, progreso de la captura, pregunta destacada, comprobante, ficha ordenada | `V25` · `validar.sh` «Todo pasa» |
| 2026-09-21 | Ronda 2: paleta extendida, calendario, consola con paginación, ficha en paneles, administración con pestañas, barra lateral, ciudadano en tarjetas | `V26` · `paleta.test.ts` (9), `calendario.test.ts` (8) · 236 recorridos · `validar.sh` «Todo pasa» |

## Tenía razón, y estaba medido

En modo oscuro, **20 de los 24 tokens del perfil interno resolvían a la rampa azul**. Cinco
azules hacían de lienzo, panel, barra lateral, cabecera de tabla, hover y borde. Y tres
estados distintos de un aporte —recibido, remitido, borrador— eran **el mismo par exacto**
(`#10264F` / `#B5D4F4`). La ronda 1 había ordenado la casa; la casa entera seguía pintada de un
color, y ordenar no cambia eso.

El criterio cambió con la segunda ronda, y se dijo: **manda la claridad**. Del sistema de
diseño se conserva lo que es corrección —contraste WCAG, estado nunca solo por color, un solo
`<main>`, nada que rompa datos ni acciones de servidor— y se rompe lo que era gusto: «sin
entradas animadas en el interno», «lienzo navy», «cero literales».

## Lo que hay ahora

**Dos palancas sobre el color, sin tocar el paquete.** En `globals.css`, después de los
`@import`, un bloque redefine los semánticos oscuros: lienzo casi negro neutro en cuatro
escalones que sí se distinguen, y los seis estados con hue real —verde, ámbar, rojo, violeta,
azul, gris—. Todo lo que alias a un semántico cambia solo. Lo nuevo va con prefijo `--pc-x-*`:
ocho tonos de sector para los 24 temas (`indexOf % 8`), la barra lateral, la bandera. El hero
conserva su navy y por eso vuelve a destacar. `pruebas/paleta.test.ts` recalcula cada par en los
dos modos; **se vio fallar** bajando `--pc-x-sidebar-suave` a `#6B7280` (3.81:1).

**La portada es un calendario.** Semanas como filas con su rótulo —Reestructuración, Seguridad,
Productividad—, los cinco días, el festivo con su trama, y cada encuentro con uno de los tres
colores de la bandera. Los 12 encuentros oficiales de octubre de 2026 **están en la base**
(`scripts/sembrar-agenda.sh`), no en el código: lo que administración cree, cancele o reprograme
sale igual. El cronograma estático solo pone rótulos y festivo, cruzados por fecha
(`src/convocatoria/cronograma.ts`, `calendario.ts` con 8 pruebas). Debajo, del *Resumen del
encuentro regional*: los cinco pasos de un encuentro y los seis caminos. Sin escudo ni logo
(`Q34`).

**La consola se pagina y se diferencia.** `bandeja()` gana un `desde` sobre el mismo corte en
memoria; `?pagina=N`, 25 por página, «Mostrando 25 de 120 · página 2 de 5». Filtros en tres
niveles —buscar, vistas rápidas como control segmentado, afinar plegable—. La tabla con cabecera
propia, cebra, riel de 3 px del color del sector y chips con hue. Las filas entran en cascada.

**La ficha son tarjetas con cabecera, no un informe.** Tira de estado bajo el titular —sector,
ubicación, gestión, canal, alerta—; a la izquierda *De un vistazo* → el relato en dorado →
ubicación con borde ámbar mientras está por aclarar → lo que entendimos → audio → de dónde
llegó → la línea de tiempo con el color de cada hecho; a la derecha, la gestión como acordeón
—Expediente · Prioridad · Escalar— con su estado en cada cabecera. **Los tres van abiertos al
llegar**: los recorridos rellenan prioridad y escalar sin abrir nada, y un `<details>` cerrado no
es visible para Playwright.

**Administración se parte por propósito.** Dos pestañas por dirección —`?seccion=encuentros`,
`?seccion=materiales`—, cada una con la lista a la izquierda y el panel de crear a la derecha.
`qr.spec.ts` navega a la pestaña de materiales en tres sitios: cambio legítimo, mismo commit.

**La barra lateral tiene superficie propia**, píldoras con icono tintado, la activa en dorado, el
aviso «Sin permisos · No desplegar» como tarjeta ámbar; en teléfono, un botón «Menú».

**El ciudadano va en tarjetas.** El formulario de contar, cada paso del afinado —con un hilo de
pasos numerados junto a la barra— y «mis aportes» en dos columnas: *Lo que contaste* y *Cómo
va*, con la línea de tiempo coloreada por estado.

## Lo que cambió en las pruebas, y por qué es legítimo

- `microfono.spec.ts`: la fila de la bandeja lleva más de una píldora desde que la gestión es
  una; se mira `.bo-badge[data-state='voz']` en vez de «la píldora».
- `qr.spec.ts`: tres `goto` a `/administracion?seccion=materiales`.
- `afinar.spec.ts` no cambió: el aire entre el comprobante y «también nos contaste» tiene que
  ser mayor de 24 px, y la tarjeta lo dejaba en 24 exactos. Se subió a 32.

Ningún `data-prueba`, `id` ni nombre accesible cambió. Nada se marcó `.skip`.

## Lo que queda abierto

- **La hora y el sitio exacto de los 12 encuentros oficiales.** El cronograma trae ciudad y
  fecha; se siembran a las 9:00 a. m. con la ciudad como lugar. Está en `vacios.md` §3.
- **El armazón interno debería vivir en un `layout.tsx`** para que haya un solo `<main>`
  durante la carga. Se hereda de la ronda 1: exige reorganizar rutas.
- **El logo y el escudo del DNP** siguen esperando el manual institucional (`Q34`).
