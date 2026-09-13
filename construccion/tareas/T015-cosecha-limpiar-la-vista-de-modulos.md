# T015 — La vista de módulos vuelve a estar limpia de negocio

**Objetivo:** que `harness/vista-modulos/` no traiga adentro ningún negocio ni ninguna
marca, y que `scripts/base-limpia.sh` lo confirme en la línea base.
**Autoridad:** `metodo/cosecha.md` · `AGENTS.md` §1 (la partición) · `harness/interfaz.md` I5
**Propietario:** orquestador
**Depende de:** T001
**Puede ejecutarse en paralelo con:** T007, T009, T012 — toca solo `harness/vista-modulos/`,
que ninguna de las tres abre.

## Contexto suficiente

`harness/` es lo técnico reusable: viaja igual a todos los proyectos y es lo que hace que
alguien que llega de otro repositorio sepa leerlo sin que se lo expliquen.

Hoy no está limpio. `harness/vista-modulos/modulos.ts` trae adentro el contenido de un
negocio real —proyecto «Depósitos Judiciales», con siete fronteras concretas (COBIS, AS400,
SIUGJ de la Rama Judicial, WSO2, Central de Información, ACH-Neurona, PSE), sus roles y sus
módulos—. Y `harness/vista-modulos/linktic-negro.svg` y `linktic-blanco.svg` meten una marca
de empresa dentro del harness.

`metodo/cosecha.md` prohíbe exactamente esto con una frase: **«vuelve la forma, nunca el
contenido»**. Ya pasó una vez —la vista de módulos subió con los cuatro módulos de Product
Hunt adentro— y `scripts/base-limpia.sh` existe para atraparlo.

La forma del archivo **no se toca**: es del harness y es lo que hace que todos los proyectos
se vean igual. Lo que se va es el contenido.

## Dentro del alcance

- Vaciar `modulos.ts` dejando los tipos, la forma y un ejemplo mínimo de este negocio.
- Resolver qué pasa con los dos SVG de marca.
- Dejar `base-limpia.sh` devolviendo 0 sobre la línea base.
- Subir la corrección a `HarnesEstandar/` como cosecha, que es donde de verdad hace falta.

## Fuera del alcance

- Cambiar los tipos `Estado`, `Rol`, `Frontera` o `Modulo`. Son la forma, y la forma viaja.
- Tocar `VistaModulos.tsx`, `ListaModulos.tsx` ni `VistaTelemetria.tsx`.
- Inventar módulos de este negocio. Los módulos salen de `/frente`, no de aquí.

## Superficie asignada

- Modificar: `harness/vista-modulos/modulos.ts`
- Modificar: `harness/vista-modulos/alcance.ts`
- Leer: `metodo/cosecha.md`
- Leer: `scripts/base-limpia.sh`
- Leer: `harness/interfaz.md`
- No modificar: `harness/vista-modulos/VistaModulos.tsx`
- No modificar: `harness/vista-modulos/ListaModulos.tsx`
- No modificar: `harness/vista-modulos/VistaTelemetria.tsx`

## Interfaces

**Consume:**
- `Modulo`, `Rol`, `Frontera`, `Estado` — los tipos exportados hoy por `modulos.ts`. No cambian.

**Produce:**
- `proyecto`, `roles`, `modulos` — las mismas tres exportaciones, con contenido de este
  negocio o vacías. Cualquier consumidor sigue compilando.

## Invariantes aplicables

- Ninguna del negocio. Esta tarea no toca datos ni reglas: es higiene de la línea base.

## Casos de verificación

- [ ] `grep -ri "dep[óo]sitos judiciales\|COBIS\|AS400\|SIUGJ\|WSO2\|Neurona" harness/` → sin resultados
- [ ] `grep -ril "linktic" harness/` → sin resultados
- [ ] `./scripts/base-limpia.sh` en `HarnesEstandar/` → devuelve 0
- [ ] `npx tsc --noEmit` sobre `harness/vista-modulos/` → sin errores de tipo

## Pasos de ejecución

- [ ] Correr `base-limpia.sh` en la línea base y **registrar que hoy falla**, con su salida.
- [ ] Quitar el contenido del negocio ajeno de `modulos.ts`, conservando los tipos.
- [ ] Resolver los dos SVG de marca.
- [ ] Volver a correr `base-limpia.sh` y registrar que ahora pasa.
- [ ] Comprobar que los tipos siguen cuadrando.
- [ ] Llevar la corrección a `HarnesEstandar/` como cosecha, con su commit `Cosecha:`.

## Terminado cuando

- [ ] Los cuatro casos de verificación pasan.
- [ ] No se modificó ninguno de los tres `.tsx`.
- [ ] `HarnesEstandar/` tiene el commit de cosecha y su `base-limpia.sh` devuelve 0.

## Entrega esperada

- Archivos cambiados aquí y en la línea base.
- La salida de `base-limpia.sh` antes y después.
- Qué se decidió con los SVG de marca, y por qué.
