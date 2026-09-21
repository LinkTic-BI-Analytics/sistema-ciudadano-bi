# Plan de trabajo — sábado 19 y domingo 20 de septiembre de 2026

**De dónde arranca.** La rama es `feature/tellamamos`. T066 «Te llamamos» está en `en revisión`
y el árbol tiene 12 archivos modificados sin commit. El producto son 66 archivos de TypeScript,
10.535 líneas en `producto/src/`, y la deuda está concentrada: **cuatro archivos se llevan 2.444
de esas líneas**, casi la cuarta parte.

**Qué se busca.** Bajar la interfaz de «funciona» a «se puede tocar sin miedo», arreglar lo que
la pantalla hace mal mientras la persona espera, y cerrar la única parte de `Q35` que es
construcción y no negocio.

**Regla que gobierna las dos jornadas.** Un refactor no cambia comportamiento. La red son las
pruebas que ya existen: 6.432 líneas en `producto/pruebas/`, con `afinar.spec.ts` (864) y
`consola.spec.ts` (688) cubriendo justo lo que se va a mover. **Se corren antes de tocar nada y
después de cada bloque.** Si un recorrido cambia de resultado, el refactor está mal y se
devuelve — no se ajusta la prueba.

---

## Lo que no se toca este fin de semana

| Qué | Por qué |
|---|---|
| T032 · permisos de servidor | Bloqueada por `P4`: no hay nada escrito sobre identidad en los 24 documentos fuente. No se desbloquea escribiendo código |
| T033 · aporte colectivo | Bloqueada por `Q23` y `Q24`: «colectivo» no existe como entidad en ningún documento |
| **Encender «Te llamamos» con gente real** | `Q35`. Construir y probar en local sí; publicar prometiendo una llamada que nadie se comprometió a hacer, no |
| El escudo y el logo del Gobierno | `Q34`. Siguen en `negocio/`, sin servirse |
| `negocio/`, `metodo/`, `plantillas/`, `decisiones/` | Solo lectura. Si la construcción revela una decisión que la especificación no responde, va a `negocio/vacios.md` como `Q` con qué bloquea — **no se decide callado** (AGENTS.md §6) |

---

# Sábado 19 — cerrar lo abierto y partir la interfaz

## S1 · Cerrar T066 · ~2 h

Está en `en revisión` desde el 18-sep y su propio registro dice que sigue **«sin revisar por
nadie que no lo construyera»**. AGENTS.md §12 es explícito: *el constructor no aprueba su propio
trabajo*.

1. Revisar el diff de `src/llamada/aviso.ts` (+57/-18) y `pruebas/llamada.test.ts` (+71): son
   los dos archivos con cambios sin cerrar de esa tarea.
2. Correr `/revisar-tarea T066` — cumplimiento primero, calidad después, en ese orden.
3. `scripts/validar.sh` → 0. Son 19 chequeos y cada uno trae su línea de «cómo hacerlo fallar».
4. Commit de los 12 archivos, separando lo que es de T066 de lo que es de scripts.
5. Mover T066 a `terminado` en `construccion/hoja-de-ruta.md` **con la evidencia**, o dejarlo en
   `en revisión` con la causa. Un estado se cambia con algo que se corrió.

**Cierra cuando:** `git status` limpio y `validar.sh` en verde.

## S2 · Refactor de `afinado.tsx` · ~3,5 h · el grande

`producto/src/app/participar/afinado.tsx` son **1.033 líneas, 30 `useState` y 9 `useEffect`**.
Es el archivo más grande del producto y el que más veces se ha tocado: T037, T039, T040, T041,
T042, T043, T044, T045, T052, T055 y T056 pasaron todas por aquí.

**El defecto, y está escrito en el propio archivo.** Hay una máquina de estados real —ocho pasos:
`escoger`, `entendimos`, `heredado`, `falta`, `municipio`, `confirmar-residencia`, `voceria`,
`listo`— pero las transiciones viven repartidas entre treinta variables sueltas. El síntoma más
claro es la bandera `rutear`, que existe según su propio comentario porque *«decidir el paso
dentro del clic leía la lectura vieja y volvía a preguntar lo que se acababa de aplicar»*. Eso no
es una solución: es un parche a que la transición se calcula en el sitio equivocado.

El costo ya se pagó dos veces. T052 registra **«tres defectos que se vieron en pantalla y no en
el código»** y T056 corrige que *«el lugar se preguntaba dos veces»*. Los dos son el mismo
defecto de fondo: nadie puede leer las treinta variables a la vez y saber en qué paso está.

**Los cuatro movimientos, en este orden:**

1. **Sacar la máquina de pasos a `src/captura/pasos.ts`**, sin React adentro: una función
   `siguientePaso(estado) → Paso` y nada más. Prueba en `pruebas/pasos.test.ts` con los casos que
   ya se rompieron: el de T052 (tres defectos de pantalla), el de T056 (el lugar dos veces) y el
   de T045 (el contexto que se ofrece en el segundo problema). **Se escriben primero y se ven
   fallar**, con el mensaje exacto en el registro.
2. **Un `useReducer` en lugar de los 30 `useState`.** Un solo objeto de estado, transiciones con
   nombre. Es lo que hace posible el punto 3.
3. **Matar `rutear` y su `useEffect`.** Con el reducer, la transición se calcula sobre el estado
   nuevo dentro de la misma acción. El parche deja de hacer falta.
4. **Partir la vista** en `src/app/participar/pasos/`: `PasoEntendimos`, `PasoFalta`,
   `PasoMunicipio`, `PasoVoceria`, `PasoEscoger`. Cada uno recibe lo que necesita y devuelve
   una acción — sin estado propio.

**Cierra cuando:** `afinar.spec.ts` da exactamente el mismo resultado que a las 9 de la mañana, y
`afinado.tsx` baja de 400 líneas.

## S3 · Partir `acciones.ts` · ~1,5 h

`producto/src/app/participar/acciones.ts` son **655 líneas con 14 acciones de servidor** y cuatro
dominios mezclados: captura, territorio, voz y llamada. El archivo importa de 15 módulos
distintos.

Por qué importa y no es cosmético: AGENTS.md §8 dice que la acción de servidor **orquesta** —
valida una forma, llama al nivel 2, compone una respuesta. Un archivo donde conviven catorce es
exactamente donde se cuela la regla que debería estar en Postgres, y §8 lo prohíbe: *nunca la
misma regla en dos niveles*.

- `acciones/captura.ts` — `enviarAporte`, `confirmarLectura`, `guardarPrecisiones`,
  `prepararLectura`
- `acciones/territorio.ts` — `ubicarTexto`, `buscarMunicipio`, `anotarLugar`,
  `confirmarMunicipio`, `listarDepartamentos`, `listarMunicipios`
- `acciones/voz.ts` — `subirGrabacion`
- `acciones/llamada.ts` — `pedirLlamada`
- `acciones/contexto.ts` — `declararGrupo`, `aplicarContexto`

`acciones.ts` se queda reexportando, para no tocar los imports de las pantallas en el mismo
commit que mueve los archivos. **Dos cambios en un commit es no poder devolver ninguno de los dos.**

**Mientras se parte, una pregunta por acción:** *¿qué pasa si alguien llama esto por otra puerta?*
Si la respuesta es «se rompe», la regla está muy arriba y baja a nivel 2. Lo que aparezca se
anota; no se arregla hoy.

## S4 · Cierre del sábado · ~30 min

`npm run tipos`, `npm run lint`, `npm test`, `npm run test:e2e`. Registro de progreso escrito
mientras está fresco, no el domingo por la noche.

---

# Domingo 20 — interactividad y backend

## D1 · La interactividad de la captura · ~2,5 h

Aquí está lo que la persona sufre y no aparece en ninguna prueba.

**Cuatro banderas de «guardando».** Hoy conviven `guardando1`, `guardando2`, `guardandoVoz` y
`guardandoMun`, cada una tapando un botón distinto. Una sola, derivada del reducer del sábado.

**Lo que se arregla, con su porqué:**

| Qué | Por qué |
|---|---|
| El botón ocupado **cambia de texto**, no solo de color ni de spinner | AGENTS.md §10: *el estado nunca se comunica solo por color*. Con datos móviles lentos —que es el escenario de este producto— el spinner es lo único que se ve y no dice qué está pasando |
| Doble clic no abre dos vueltas | `I1` cubre el duplicado en la base con la restricción única sobre la clave de envío, y ahí se queda. Pero la pantalla tampoco debería dejar intentarlo: hoy el rechazo del servidor se le muestra a alguien que no hizo nada mal |
| Al cambiar de paso, el foco va al encabezado nuevo | Hoy se queda donde estaba: un lector de pantalla no anuncia que la pantalla cambió. WCAG 2.2 AA, obligatorio por la Resolución 1519 de 2020 de MinTIC |
| El buscador de municipios se navega con flechas y Enter | T043 ya encontró que *«125 en una lista no se recorren»* y le puso buscador. Falta que se pueda usar sin tocar la pantalla |
| Una confirmación no es un aviso que se va solo | AGENTS.md §10, con esas palabras. Revisar cada uso de `sonner`: lo que confirma que algo quedó guardado tiene que quedarse en pantalla |

**Cómo se comprueba, y no con una afirmación:** un recorrido nuevo en `producto/pruebas/e2e/`
por cada uno de los cinco, **visto fallar primero** contra el código de hoy, con el mensaje
exacto en el registro. Más la skill `accessibility` sobre `/participar` y `/consola`.

## D2 · Backend · la bandeja de llamadas pendientes · ~2,5 h

`grep -rn "llamada" producto/src/app/consola/` **no devuelve nada**. Eso significa que hoy una
fila que entra a `identidad.llamadas` no la ve nadie: si el aviso al flujo de n8n se pierde —y
`aviso.ts` espera 6 segundos y sigue— la persona se queda esperando una llamada que nadie sabe
que tiene que hacer. La auditoría lo registra, pero nadie mira la auditoría.

`Q35` lo dice y lo separa del resto: **«una que sí es de construcción y no de negocio: una
bandeja de llamadas pendientes en `/consola`»**. Es lo único de esa pregunta que se puede cerrar
sin que responda el negocio.

**Cómo se modela, y no es un campo `estado`.** V13 ya separó tres cosas para la alerta urgente:
`orientación mostrada`, `contacto intentado`, `recepción confirmada` — porque *mostrar un
teléfono no es haber contactado, y contactar no es que alguien haya recibido*. La llamada es lo
mismo: **pedida**, **intento registrado** (con responsable, canal y fecha), **contacto
confirmado**. Cada intento fallido deja fila; la petición sigue pendiente hasta que se confirme.
Un campo `estado` que se sobrescribe borra los intentos, que es justo lo que hay que poder ver.

**Tres cosas que no se negocian en esta tabla:**

- **El SQL se entrega, no se corre.** Se escribe en `producto/supabase/schemas/17_llamada.sql`,
  se genera la migración con `scripts/esquema.sh` y se entrega. La base la corre John a mano.
- **RLS antes que la pantalla.** `identidad` es la partición separada del dato analítico (§9), y
  eso es lo que hace cumplible que Comunicaciones no pueda descargar contactos. La bandeja no
  puede servir el teléfono a un rol que no lo necesita: `I6`, y **también por URL directa** —
  ocultar la columna no es un permiso.
- **Ninguna tabla nace abierta.** `validar.sh` ya tiene el chequeo y se ve fallar con
  `alter table ... disable row level security`.

**La vista `/consola/llamadas`** dice **cuántas hay pendientes**, en número. T053 ya enseñó la
lección con las mismas palabras: *«diez aportes eran invisibles y nada lo decía»*.

## D3 · Backend · partir `src/revision/bandeja.ts` · ~1 h

394 líneas, el archivo de dominio más grande. Alimenta `/consola` y ahora también la bandeja de
llamadas, así que se parte **antes** de colgarle un consumidor más, no después.

Separar la consulta de la composición: qué se lee de la base por un lado, qué se le muestra a
quien revisa por el otro. Las cuentas de `R1` y `R2` **no se mueven de Postgres** — §8: *lo que
JavaScript hace es formatear, no calcular*, y si la bandeja hace su propia cuenta, `I6` se rompe
sola.

## D4 · Cierre del fin de semana · ~1 h

- `scripts/validar.sh` → 0, los 19 chequeos.
- `npm run tipos`, `npm run lint`, `npm test`, `npm run test:e2e`.
- Tres registros en `construccion/progreso/`: T067, T068, T069.
- Tres filas nuevas en `construccion/hoja-de-ruta.md`, con códigos, dependencias y evidencia.
  Los códigos son corridos y no se reciclan (§5): el último usado es T066.

| ID | Resultado | Depende de |
|---|---|---|
| T067 | La captura con su máquina de pasos afuera y comprobable, sin cambiar una pantalla | T066 |
| T068 | La interactividad de la captura: ocupado, foco, teclado y doble envío | T067 |
| T069 | La bandeja de llamadas pendientes, con sus tres estados separados | T066 |

---

## Definición de terminado — AGENTS.md §12

Ninguna casilla se marca con una afirmación. Cada una se marca con algo que se corrió.

- [ ] Cada comportamiento nuevo tiene una prueba **que se vio fallar**, con el mensaje exacto en
      el registro.
- [ ] Esas pruebas pasan ahora, y el resultado está en el registro.
- [ ] Ninguna pantalla cambió de comportamiento por el refactor: `afinar.spec.ts` y
      `consola.spec.ts` dan lo mismo que el sábado a las 9.
- [ ] Las invariantes que toca la bandeja de llamadas —`I1` y `I6`— están en el nivel que las
      hace imposibles, no en uno que solo las valida.
- [ ] No se agregó alcance: T032 y T033 siguen bloqueadas y sin tocar.
- [ ] `scripts/validar.sh` devuelve 0.
- [ ] La hoja de ruta y los registros de progreso quedaron con la evidencia.

**Y una que no es casilla.** Si aparece una decisión que la especificación no responde, va a
`negocio/vacios.md` como `Q` con qué bloquea y cuándo se vuelve urgente. Es la mitad del valor
del método, y se pierde entera si se decide callado.

---

## Lo que se aplaza, y por qué

- **T036** —la bandeja de lo poco recurrente sin revisar— sigue en `candidato`. Depende de T035,
  que está terminada, así que puede empezar; pero mete una vista más a `/consola` en el mismo fin
  de semana en que se parte `bandeja.ts`, y eso son dos manos en el mismo archivo.
- **Dividir `consola/[aporte]/page.tsx`** (756 líneas). Es un componente de servidor sin estado
  —cero `useState`—, así que es render largo, no lógica enredada. Duele menos que los otros tres
  y espera.
- **Reescribir la frase de la portada** que dice *«No pedimos tu nombre, tu cédula ni tu correo»*
  y que «Te llamamos» volvió falsa para ese camino. Es `Q35`, primer punto, y **es texto público**:
  lo decide el negocio, no el equipo técnico.
