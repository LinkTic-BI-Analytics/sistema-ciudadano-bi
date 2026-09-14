# Registro — T035 · Prioridad de examen, y la pantalla para probarla

**Contrato:** `construccion/tareas/T035-prioridad-de-examen.md`

| Fecha | Qué pasó | Evidencia |
|---|---|---|
| 2026-09-14 | 9 pruebas de prioridad contra la base | `python3 producto/pruebas/prioridad.py` |
| 2026-09-14 | La consola `/consola`, y 4 recorridos en navegador sobre ella | `playwright test consola.spec.ts` |
| 2026-09-14 | **Vista fallar**: la tabla con una columna de puntaje añadida a mano | ver abajo |
| 2026-09-14 | **Vista fallar**: `globals.css` sin el `@import` de la hoja interna | `hojas_importadas.py`, `consola.spec.ts` |

## Lo que el esquema hace imposible

**No hay columna de puntaje, de peso ni de posición.** No es que la interfaz no los muestre: no
existen. Una prueba recorre `information_schema.columns` y falla si aparece una que se llame
así. `RF12` lo pide en negativo —*«no inventa pesos»*— y una columna vacía hoy es una fórmula
inventada mañana, porque alguien la va a llenar.

Los cinco factores —urgencia, afectación, recurrencia, competencia, incertidumbre— se guardan
**separados y se muestran separados**. Juntarlos en un número es precisamente la decisión que
nadie tomó, y el número escondería quién la tomó.

**Un caso aislado se prioriza igual que uno masivo.** La bandeja ordena por antigüedad, no por
cantidad. Es el caso sintético de la §4 del módulo: la necesidad rural con un aporte contra la
urbana con miles.

## El defecto que encontró la pantalla

Construir `/consola` no era solo poder probar: **destapó tres cosas que ninguna revisión de
código había visto**, y las tres eran la misma.

`backoffice.css` se copia a `producto/src/producto/tokens/` con `scripts/tokens.sh`, pero
**nadie la importaba desde `globals.css`**. La consola se construyó entera sin estilos.

Lo grave no es el olvido: es *por qué no falló nada*. **Una pantalla sin CSS muestra de más, no
de menos.** El sistema de diseño alterna dos formas de cada lista —tarjetas bajo 36rem, tabla
por encima— y sin la hoja se veían las dos. Las pruebas que buscaban «el primer enlace» lo
encontraban, y la única señal era un clic ambiguo que yo leí como una prueba mal escrita.
Estuve arreglando el selector cuando lo roto era la página.

Con la hoja puesta salió el segundo defecto: la sección «Expedientes abiertos» usaba solo
`.bo-card-list`, que es `display:none` por encima de 36rem. **Era invisible en un escritorio.**
De ahí la regla que queda escrita en la página: en esta consola, toda lista necesita sus dos
formas.

Y una corrección a lo que yo mismo había anotado antes: dije que el proyecto `telefono` de
Playwright había detectado un defecto responsivo. No es cierto. Detectó una hoja ausente.

**Los dos chequeos nuevos se vieron fallar**: `hojas_importadas.py` con el `@import` quitado, y
en navegador `.bo-shell` devolviendo `block` donde la hoja dice `grid` — que no depende de que
haya datos, así que sirve con la bandeja vacía.

## Una prueba que a veces pasa

Una corrida de 34 dio `1 failed` y las cinco siguientes —incluida una en frío, sin `.next` y con
la base recién vaciada— dieron todo verde. **No lo reproduje.** Encaja con que esa corrida salió
justo después de restaurar el `@import`, con el servidor de desarrollo recompilando la CSS en
caliente, pero eso es una explicación, no una comprobación. Queda anotado sin cerrarse.

También hubo que separar la limpieza: `limpiar-pruebas.sh` solo alcanza los procesos marcados
como escenario, y los recorridos de navegador escriben en el **proceso sembrado**. Se acumulaban
ahí. Ahora `limpiar-desarrollo.sh` vacía todo lo que no sea catálogo — menos la auditoría, que
es `append-only` por regla y por eso los procesos se retiran en vez de borrarse.

## Lo que queda esperando

**La consola no tiene autorización.** Lo dice ella misma en la barra lateral y lo dice el
tablero: `T032`, bloqueada por `P4` y `Q18`. **No se despliega.** Cualquiera que abra la
dirección ve la bandeja entera.

**`T036`** —la bandeja de lo poco recurrente sin revisar— es lo que sigue, y es lo que convierte
`RF12` de *se puede priorizar* en *no se pierde lo que nadie miró*.
