# T026 — El comprobante: canjearlo y ver qué pasó, sin correo

**Objetivo:** que una persona con su código pueda ver **lo suyo** —y solo lo suyo— sin dar
correo, sin cuenta y sin identificarse.
**Autoridad:** `RF4`, `RF5` · `RES-01` y `N16` de las fuentes
**Propietario:** orquestador
**Depende de:** T023
**Puede ejecutarse en paralelo con:** T027, T031 — no tocan `src/comprobante/`.
**Bloqueada por:** ninguna

## Contexto suficiente

T023 ya emite el código y guarda su hash. **Nadie puede canjearlo todavía**, y ese es el único
cabo suelto del ciclo: es la mitad de la promesa del producto — *«podrás revisar lo que
entendimos y conocer qué pasó con tu aporte»*.

Tres cosas que no son detalles:

**Sin correo.** `RF4` lo dice con esas palabras: *«consultar el estado del aporte con código o
vía asistida, sin exigir correo»*. No es una comodidad: exigir correo excluye a quien no tiene,
y quien participa sobre un tema que lo expone puede no querer dejar rastro.

**Solo lo suyo.** `N16`: *«consulta por comprobante no expone expedientes ajenos»*. Un código
abre un aporte, no una bandeja.

**Un código que no existe y uno equivocado se responden igual.** Si el sistema dijera «ese
código no existe» y «ese código no es tuyo» de formas distintas, se podría averiguar qué
códigos existen probando. La respuesta es una sola: no encontramos nada con ese código.

## Dentro del alcance

- Canjear un código: devuelve el aporte, su relato, su lugar declarado y el estado de su
  ubicación.
- Normalizar el código antes de comparar: la persona lo va a escribir con espacios, en
  minúscula, o dictado por teléfono.
- Un asiento de auditoría por cada consulta, con y sin acierto.
- Un intento fallido tarda lo mismo que uno bueno.

## Fuera del alcance

- La pantalla. Es parte de T024.
- La síntesis y su confirmación. Es T025.
- Las actuaciones institucionales —recepción, remisión, respuesta—. Es T030, y hasta entonces
  la consulta devuelve el estado que hay, no uno inventado.
- Revocar o reemitir un comprobante.
- Límite de intentos por origen. **Se anota como riesgo**, no se inventa el número: `vacios.md`
  no tiene ningún umbral acordado y `N17` advierte que un centro comunitario comparte conexión.

## Superficie asignada

- Crear: `producto/src/comprobante/canjear.ts`
- Crear: `producto/pruebas/comprobante.test.ts`
- Modificar: `producto/supabase/schemas/08_comprobante.sql`
- Leer: `producto/src/captura/recibir.ts`
- No modificar: `producto/src/captura/`

## Interfaces

**Consume:**
- `recibirAporte` de T023, para las pruebas.
- `identidad.comprobante`, a través de una función — el esquema no se expone por la API.

**Produce:**
- `canjearComprobante(codigo: string, procesoId: string): Promise<Consulta | null>` donde
  `Consulta = { aporteId, relato, lugarDeclarado, estadoUbicacion, recibidoEn }`.
- Devuelve `null` cuando no hay nada. **Nunca lanza** por código inexistente: un error
  distinguible es una forma de averiguar qué existe.

## Invariantes aplicables

- `I6`: no divulgar identidad ni ubicación sensible a un rol no autorizado. Aquí no hay rol:
  hay un código. **Lo que devuelve es exactamente un aporte**, y nunca la lista.
- `C2`: la consulta no revela nada de otras personas ni de otros aportes.

## Casos de verificación

- [ ] Con el código bueno → devuelve **ese** aporte, con su relato y su lugar declarado
- [ ] Con un código inventado → `null`, sin error
- [ ] Con el código de otro aporte → devuelve **el otro**, nunca los dos
- [ ] Escrito con espacios y en minúscula → funciona igual
- [ ] Un código bueno de otro proceso → `null`. El código no cruza procesos
- [ ] La consulta queda en la auditoría, acierte o no
- [ ] El código en claro **no está en la base**: buscarlo no lo encuentra

## Pasos de ejecución

- [ ] Escribir la prueba con los siete casos y **verla fallar**.
- [ ] Registrar la falla con su mensaje.
- [ ] Implementar el cambio mínimo.
- [ ] Correr la prueba y registrar el resultado.
- [ ] `./scripts/validar.sh`.

## Terminado cuando

- [ ] Los siete casos pasan y se vieron fallar antes.
- [ ] `validar.sh` devuelve 0.
- [ ] El riesgo de fuerza bruta queda anotado en `negocio/vacios.md`, no resuelto a ojo.

## Entrega esperada

- Archivos, salida antes y después, y cómo se evitó que un fallo se distinga de un acierto.
