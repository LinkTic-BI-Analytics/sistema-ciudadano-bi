# T028 — Crear un expediente y vincular aportes, con motivo

**Objetivo:** que un revisor convierta aportes en una necesidad situada, y que la separación
sea el estado por defecto.
**Autoridad:** `RF7` · `NEC-01` · `I4` · `V12` de `negocio/vacios.md`
**Propietario:** orquestador · **Depende de:** T027 · **Bloqueada por:** ninguna

## Contexto suficiente

Es el corazón del sistema y donde el aporte se vuelve expediente. `V12` ya lo definió entero, y
lo que hay que implementar sin torcerlo:

**La separación es el estado por defecto.** Compartir tema, municipio, entidad o palabras
parecidas **no basta**. La prueba para decidir es una sola pregunta, y va a los casos:

> ¿Podríamos dar por atendida una de estas situaciones mientras la otra sigue pendiente?
> Si la respuesta es sí, tienen que poder gestionarse por separado.

**Un aporte puede alimentar varios expedientes.** Quien menciona contaminación del agua y falta
de transporte escolar produce dos necesidades desde un mismo relato.

**Un expediente puede abarcar varios territorios y conserva el seguimiento de cada uno.** No es
uno con un territorio promedio.

**Y abrir un expediente no aprueba nada.** No asigna recursos ni declara resuelto nada.

## Dentro del alcance

- Crear un expediente desde un aporte, con su descripción y cambio esperado.
- Vincular aportes a un expediente **con motivo obligatorio**.
- Vincular un expediente a varios territorios, con estado de atención por territorio.
- Listar los aportes de un expediente y los expedientes de un aporte.

## Fuera del alcance

- Desagrupar. Es T029.
- Fusionar dos expedientes. La columna existe; el flujo no está en esta tanda.
- Sugerencias de agrupación por IA. `NEC-01` las permite como propuesta, y eso necesita el par
  valor sugerido/aceptado que no existe.
- El aporte colectivo. Es T033 y está bloqueada.

## Superficie asignada

- Crear: `producto/src/revision/expediente.ts`
- Modificar: `producto/pruebas/revision.test.ts`
- No modificar: `producto/src/revision/ubicacion.ts`

## Interfaces

**Produce:**
- `crearExpediente({ procesoId, descripcion, cambioEsperado?, desdeAporte, autor, motivo })`
- `vincular({ aporteId, expedienteId, autor, motivo })`
- `aportesDe(expedienteId)` · `expedientesDe(aporteId)`

## Invariantes aplicables

- `I4`: el vínculo lleva autor, fecha y motivo. Sin motivo, la base lo rechaza — ya está probado
  en T021.

## Casos de verificación

- [ ] Crear un expediente desde un aporte lo deja vinculado, con motivo
- [ ] Vincular sin motivo → se rechaza
- [ ] **Un aporte en dos expedientes**: el relato de agua y transporte produce dos necesidades
- [ ] **Dos barrios del mismo municipio son dos expedientes por defecto**
- [ ] **Baja presión y contaminación son dos**, aunque compartan territorio
- [ ] Un expediente con dos territorios cuenta como **una** necesidad (`R1`)
- [ ] Cada territorio del expediente lleva su propio estado de atención

## Terminado cuando

- [ ] Los siete casos pasan, vistos fallar antes.
- [ ] `validar.sh` devuelve 0.
