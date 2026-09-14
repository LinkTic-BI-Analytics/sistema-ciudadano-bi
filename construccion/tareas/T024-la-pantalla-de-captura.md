# T024 — «Cuéntanos qué pasa»: la primera pantalla que ve una persona

**Objetivo:** que alguien sin cuenta, sin experiencia y sin saber la entidad competente cuente
lo que le pasa y salga con un comprobante.
**Autoridad:** `RF1`, `RF2`, `RF5` · `N02`, `N03` · `DAT-01`
**Propietario:** orquestador · **Depende de:** T023, T026 · **Bloqueada por:** ninguna

## Contexto suficiente

Es la única superficie que una persona sin cuenta va a usar, y la que decide si el sistema
sirve. `N02` fija el listón: *«una persona registra agua intermitente en una vereda **sin saber
la entidad ni adjuntar estudios** y recibe comprobante»*.

**Lo que hay ya hecho y no se rehace:** la acción de servidor (T023) con su idempotencia, el
comprobante (T026), los 319 tokens y las 77 clases del sistema de diseño. Esto es traducir, no
inventar — y el sistema de diseño trae el detalle: botón principal de 48 px, etiqueta
persistente porque *el placeholder no la sustituye*, movimiento limitado a 120 ms de color.

Cuatro reglas que vienen del negocio, no del diseño:

**La clave de envío se genera en el navegador**, al abrir el formulario, y se reusa en cada
reintento. Es lo que hace que `I1` funcione de verdad: si la generara el servidor, un corte de
red produciría dos aportes.

**El comprobante se muestra después de persistir.** *«Pendiente, falló y recibido no son
intercambiables»*, y quien ve un código y luego descubre que no quedó nada no vuelve.

**Nunca se pide correo.** `RF4` lo dice; y no es comodidad — exigirlo excluye a quien no tiene,
y quien habla de algo que lo expone puede no querer dejar rastro.

**El selector escribir/hablar conserva el relato al cambiar de modo.** `direccion-visual.md` lo
pide explícitamente. Perder lo escrito al tocar un botón es la forma más rápida de que alguien
abandone.

## Dentro del alcance

- La ruta `/participar` con el formulario: relato, lugar tal como la persona lo diga.
- El selector escribir/hablar como **modo**, conservando el texto al cambiar.
- Resumen de errores accesible, con foco, y el error **nunca solo por color**.
- La pantalla de comprobante, con el código y qué sigue.
- La ruta `/mis-aportes` para canjear un código.

## Fuera del alcance

- **Transcripción de voz de verdad.** `IA-01` la marca P1, y `especificacion.md` la deja como
  ampliación. El selector existe y el modo «hablar» explica que todavía no está — **decirlo es
  mejor que un botón que no hace nada**.
- La síntesis corregible. Es T025.
- La convocatoria, la agenda y la portada. Son M06.
- Cualquier cuenta o inicio de sesión. `P4` sigue abierta y **esta pantalla no la necesita**.

## Superficie asignada

- Crear: `producto/src/app/participar/page.tsx`
- Crear: `producto/src/app/participar/formulario.tsx`
- Crear: `producto/src/app/participar/acciones.ts`
- Crear: `producto/src/app/mis-aportes/page.tsx`
- Crear: `producto/pruebas/e2e/participar.spec.ts`
- Crear: `producto/playwright.config.ts`
- Modificar: `producto/src/app/globals.css`
- No modificar: `producto/src/captura/`, `producto/src/comprobante/`

## Invariantes aplicables

- `I1`: la clave vive en el navegador mientras dure el formulario, y se olvida al recibir el
  comprobante — el siguiente relato es otro aporte.
- `I2`: el formulario **no normaliza** el lugar. Lo manda como la persona lo escribió.

## Casos de verificación

Se corren en un navegador de verdad, que es lo que `AGENTS.md` §12 pide para una pantalla.

- [ ] La página carga y el campo de relato tiene etiqueta visible, no solo placeholder
- [ ] Enviar vacío → resumen de errores, con foco puesto ahí, y el error dicho en palabras
- [ ] Enviar un relato → aparece el comprobante con un código legible
- [ ] Cambiar de escribir a hablar **conserva lo escrito**
- [ ] En ninguna parte se pide correo
- [ ] Con el código, `/mis-aportes` muestra ese aporte
- [ ] Con un código inventado, `/mis-aportes` dice que no encontró nada, sin error
- [ ] El foco se ve en todo lo que se puede tocar con el teclado

## Terminado cuando

- [ ] Los ocho casos pasan en Chromium, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
- [ ] **Queda dicho que esto no está validado con personas**: `/validar` es otra cosa y no se
      ha corrido.

## Entrega esperada

- Archivos, salida de Playwright, y qué quedó sin probar.
